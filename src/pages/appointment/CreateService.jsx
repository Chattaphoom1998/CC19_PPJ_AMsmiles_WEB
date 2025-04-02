import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import useUserStore from "../../stores/userStore";
import { format, addMinutes, setHours, setMinutes } from "date-fns";

function CreateService() {
	const { token } = useUserStore();
	const { id: scheduleId } = useParams();
	const navigate = useNavigate();

	const [schedule, setSchedule] = useState(null);
	const [selectedDate, setSelectedDate] = useState(() => {
		const now = new Date();
		now.setHours(0, 0, 0, 0);
		return now;
	});
	const [selectedSlots, setSelectedSlots] = useState([]);
	const [bookedSlots, setBookedSlots] = useState({
		admin: [],
		user: [],
		room: [],
	});
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	const timeSlots = [];
	const start = setHours(setMinutes(new Date(), 0), 8);
	const end = setHours(setMinutes(new Date(), 30), 20);
	for (let time = start; time < end; time = addMinutes(time, 30)) {
		timeSlots.push(format(time, "HH:mm"));
	}

	const isSlotDisabled = (time) =>
		bookedSlots.admin.includes(time) ||
		bookedSlots.user.includes(time) ||
		bookedSlots.room.includes(time);

	useEffect(() => {
		const fetchSchedule = async () => {
			try {
				const res = await axios.get(
					`http://localhost:8000/schedule/${scheduleId}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setSchedule(res.data.schedule);
			} catch (err) {
				toast.error("Failed to load schedule info");
			}
		};
		fetchSchedule();
	}, [scheduleId, token]);

	useEffect(() => {
		if (!schedule) return;
		console.log(schedule);
		const fetchBookedSlots = async () => {
			try {
				const res = await axios.get(
					`http://localhost:8000/service/booked-temp?date=${selectedDate.toISOString()}&adminId=${
						schedule.admin.id
					}&userId=${schedule.user.id}&roomId=${schedule.room.id}`,
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				setBookedSlots(
					res.data.bookedTimes || { admin: [], user: [], room: [] }
				);
			} catch (err) {
				toast.error("Failed to load booked slots");
			}
		};
		fetchBookedSlots();
	}, [selectedDate, schedule, token]);

	const toggleSlot = (time) => {
		if (isSlotDisabled(time)) return;
		setSelectedSlots((prev) =>
			prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
		);
	};

	const handleSubmit = async () => {
		if (selectedSlots.length === 0 || !title) {
			toast.error("Please fill in required fields");
			return;
		}
		const sorted = [...selectedSlots].sort();
		const serviceStart = new Date(
			`${format(selectedDate, "yyyy-MM-dd")}T${sorted[0]}:00`
		);
		const lastSlot = new Date(
			`${format(selectedDate, "yyyy-MM-dd")}T${sorted[sorted.length - 1]}:00`
		);
		const serviceEnd = addMinutes(lastSlot, 30);

		try {
			await axios.post(
				"http://localhost:8000/service/create",
				{
					scheduleId: +scheduleId,
					title,
					description,
					serviceStart,
					serviceEnd,
				},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			toast.success("Service created successfully");
			navigate(`/schedule/${scheduleId}`);
		} catch (err) {
			toast.error(err.response?.data?.message || "Create service failed");
		}
	};

	return (
		<div className="min-h-screen p-6 bg-slate-50">
			<div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
				<h1 className="text-2xl font-bold mb-4">Create New Service</h1>
				<input
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className="input input-bordered w-full mb-4"
					placeholder="Service Title"
				/>
				<textarea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className="textarea textarea-bordered w-full mb-4"
					placeholder="Description"
				></textarea>
				<input
					type="date"
					value={format(selectedDate, "yyyy-MM-dd")}
					min={format(new Date(), "yyyy-MM-dd")}
					onChange={(e) => setSelectedDate(new Date(e.target.value))}
					className="input input-bordered mb-4"
				/>
				<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-4">
					{timeSlots.map((time) => {
						const isBooked = isSlotDisabled(time);
						const isSelected = selectedSlots.includes(time);
						return (
							<button
								key={time}
								disabled={isBooked}
								onClick={() => toggleSlot(time)}
								className={`px-3 py-2 rounded text-sm border text-center transition-colors duration-200 ${
									isBooked
										? "bg-slate-200 text-slate-400 cursor-not-allowed"
										: isSelected
										? "bg-green-700 text-white"
										: "bg-slate-100 hover:bg-green-100 cursor-pointer"
								}`}
							>
								{time}
							</button>
						);
					})}
				</div>
				<div className="text-right">
					<button
						onClick={handleSubmit}
						className="btn bg-green-700 text-white hover:bg-green-600"
					>
						Create Service
					</button>
				</div>
			</div>
		</div>
	);
}

export default CreateService;
