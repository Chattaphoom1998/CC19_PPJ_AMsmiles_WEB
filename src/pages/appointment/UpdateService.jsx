import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import useUserStore from "../../stores/userStore";
import { format, addMinutes, setHours, setMinutes } from "date-fns";

function UpdateService() {
	const { token, user } = useUserStore();
	const { id } = useParams();
	const navigate = useNavigate();

	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedSlots, setSelectedSlots] = useState([]);
	const [originalSlots, setOriginalSlots] = useState([]);
	const [bookedSlots, setBookedSlots] = useState({
		admin: [],
		user: [],
		room: [],
	});
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState("");
	const [scheduleId, setScheduleId] = useState(null);
	const [docId, setDocId] = useState();

	const timeSlots = [];
	const start = setHours(setMinutes(new Date(), 0), 8);
	const end = setHours(setMinutes(new Date(), 30), 20);

	for (let time = start; time < end; time = addMinutes(time, 30)) {
		timeSlots.push(format(time, "HH:mm"));
	}

	const isSlotDisabled = (time) => {
		return (
			!originalSlots.includes(time) &&
			(bookedSlots.admin.includes(time) ||
				bookedSlots.user.includes(time) ||
				bookedSlots.room.includes(time))
		);
	};

	useEffect(() => {
		const fetchService = async () => {
			try {
				const res = await axios.get(`http://localhost:8000/service/${id}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const svc = res.data.service;
				const start = new Date(svc.serviceStart);
				const end = new Date(svc.serviceEnd);
				setTitle(svc.title || "");
				setDescription(svc.description || "");
				setStatus(svc.status || "PENDING");
				setScheduleId(svc.schedule.id);
				setSelectedDate(start);

				const slots = [];
				for (let t = new Date(start); t < end; t = addMinutes(t, 30)) {
					slots.push(format(t, "HH:mm"));
				}
				setSelectedSlots(slots);
				setOriginalSlots(slots);
			} catch (err) {
				toast.error("Failed to load service details");
			}
		};
		fetchService();
	}, [id, token]);

	useEffect(() => {
		if (!scheduleId) return;
		const fetchScheduleAndBooked = async () => {
			try {
				const scheduleRes = await axios.get(
					`http://localhost:8000/schedule/${scheduleId}`,
					{ headers: { Authorization: `Bearer ${token}` } }
				);

				const { admin, user, room } = scheduleRes.data.schedule;

				const bookedRes = await axios.get(
					`http://localhost:8000/service/booked-temp?date=${selectedDate.toISOString()}&adminId=${
						admin.id
					}&userId=${user.id}&roomId=${room.id}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setBookedSlots(
					bookedRes.data.bookedTimes || { admin: [], user: [], room: [] }
				);
				setDocId(admin.id);
			} catch (err) {
				toast.error("Failed to load booked slots");
			}
		};
		fetchScheduleAndBooked();
	}, [selectedDate, scheduleId, token]);

	const toggleSlot = (time) => {
		if (isSlotDisabled(time)) return;
		setSelectedSlots((prev) =>
			prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
		);
	};

	const handleSubmit = async () => {
		if (selectedSlots.length === 0) {
			toast.error("Please select time slots");
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
			await axios.patch(
				`http://localhost:8000/service/update/${id}`,
				{
					title,
					description,
					status,
					serviceStart,
					serviceEnd,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			toast.success("Service updated successfully");
			navigate(`/schedule/${scheduleId}`);
		} catch (error) {
			toast.error(error.response?.data?.message || "Update failed");
		}
	};

	return (
		<div className="min-h-screen p-6 bg-slate-50">
			<div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
				<h1 className="text-2xl font-bold mb-4">Update Service</h1>

				<div className="mb-4">
					<label className="block mb-1 font-medium text-slate-700">Title</label>
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="input input-bordered w-full"
					/>
				</div>

				<div className="mb-4">
					<label className="block mb-1 font-medium text-slate-700">
						Description
					</label>
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="textarea textarea-bordered w-full"
					></textarea>
				</div>

				<div className="mb-4">
					<label className="block mb-1 font-medium text-slate-700">
						Status
					</label>
					<select
						value={status}
						onChange={(e) => setStatus(e.target.value)}
						className="select select-bordered w-full"
					>
						<option value="PENDING">PENDING</option>
						<option value="CONFIRM">CONFIRM</option>
						<option value="ARRIVED">ARRIVED</option>
						<option value="ABSENT">ABSENT</option>
						<option value="POSTPONE">POSTPONE</option>
						<option value="CANCEL">CANCEL</option>
						<option value="PAID">PAID</option>
					</select>
				</div>

				<div className="mb-4">
					<label className="block mb-1 font-medium text-slate-700">
						Select Date
					</label>
					<input
						type="date"
						value={format(selectedDate, "yyyy-MM-dd")}
						onChange={(e) => setSelectedDate(new Date(e.target.value))}
						className="input input-bordered"
						min={format(new Date(), "yyyy-MM-dd")}
					/>
				</div>

				<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-4">
					{timeSlots.map((time) => {
						const isBooked = isSlotDisabled(time);
						const isSelected = selectedSlots.includes(time);
						const isOriginal = originalSlots.includes(time);
						return (
							<button
								key={time}
								disabled={isBooked}
								onClick={() => toggleSlot(time)}
								className={`px-3 py-2 rounded text-sm border text-center transition-colors duration-200
                  ${
										isBooked
											? "bg-slate-200 text-slate-400 cursor-not-allowed"
											: "cursor-pointer"
									}
                  ${
										!isBooked && isSelected
											? "bg-green-700 text-white"
											: "bg-slate-100 hover:bg-green-100"
									}
                  ${isOriginal ? "border-dashed border-2" : ""}`}
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
						Update Service
					</button>
				</div>
			</div>
		</div>
	);
}

export default UpdateService;
