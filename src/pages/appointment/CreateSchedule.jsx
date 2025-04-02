import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import useUserStore from "../../stores/userStore";
import { format, addMinutes, setHours, setMinutes } from "date-fns";

function CreateSchedule() {
	const { token, user } = useUserStore();
	const navigate = useNavigate();

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [doctors, setDoctors] = useState([]);
	const [users, setUsers] = useState([]);
	const [rooms, setRooms] = useState([]);

	const [selectedDoctor, setSelectedDoctor] = useState("");
	const [selectedUser, setSelectedUser] = useState("");
	const [selectedRoom, setSelectedRoom] = useState("");

	const [serviceTitle, setServiceTitle] = useState("");
	const [serviceDescription, setServiceDescription] = useState("");
	const [selectedDate, setSelectedDate] = useState(() => {
		const now = new Date();
		now.setHours(0, 0, 0, 0);
		return now;
	});
	const [bookedSlots, setBookedSlots] = useState({
		admin: [],
		user: [],
		room: [],
	});

	const [selectedSlots, setSelectedSlots] = useState([]);
	const isSlotDisabled = (time) =>
		bookedSlots.admin.includes(time) ||
		bookedSlots.user.includes(time) ||
		bookedSlots.room.includes(time);

	const timeSlots = [];
	const start = setHours(setMinutes(new Date(), 0), 8);
	const end = setHours(setMinutes(new Date(), 30), 20);
	for (let time = start; time < end; time = addMinutes(time, 30)) {
		timeSlots.push(format(time, "HH:mm"));
	}

	useEffect(() => {
		const fetchDropdown = async () => {
			try {
				const [adminRes, userRes, roomRes] = await Promise.all([
					axios.get(`http://localhost:8000/admin/list`, {
						headers: { Authorization: `Bearer ${token}` },
					}),
					axios.get(`http://localhost:8000/user/list`, {
						headers: { Authorization: `Bearer ${token}` },
					}),
					axios.get(`http://localhost:8000/room`, {
						headers: { Authorization: `Bearer ${token}` },
					}),
				]);

				const filteredDoctors = adminRes.data.cleanedAdminList.filter(
					(admin) =>
						admin.clinic?.id === user.clinicId && admin.role.role === "DOCTOR"
				);
				const filteredUsers = userRes.data.userList.filter(
					(u) => u.clinic.id === user.clinicId
				);
				const filteredRooms = roomRes.data.rooms.filter(
					(room) => room.clinicId === user.clinicId
				);

				setDoctors(filteredDoctors);
				setUsers(filteredUsers);
				setRooms(filteredRooms);
			} catch (err) {
				toast.error("Failed to fetch dropdown data");
			}
		};
		fetchDropdown();
	}, [token, user.clinicId]);

	useEffect(() => {
		const fetchBookedSlots = async () => {
			if (!selectedDoctor || !selectedUser || !selectedRoom) return;
			try {
				const res = await axios.get(
					`http://localhost:8000/service/booked-temp?date=${selectedDate.toISOString()}&adminId=${selectedDoctor}&userId=${selectedUser}&roomId=${selectedRoom}`,
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				console.log("res.data =>", res.data);
				setBookedSlots(
					res.data.bookedTimes || { admin: [], user: [], room: [] }
				);
			} catch (err) {
				toast.error("Failed to load booked slots");
			}
		};
		fetchBookedSlots();
	}, [selectedDate, selectedDoctor, selectedUser, selectedRoom, token]);

	const toggleSlot = (time) => {
		if (
			bookedSlots.admin.includes(time) ||
			bookedSlots.user.includes(time) ||
			bookedSlots.room.includes(time)
		) {
			return;
		}

		setSelectedSlots((prev) =>
			prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
		);
	};

	const handleSubmit = async () => {
		if (
			!title ||
			!selectedDoctor ||
			!selectedUser ||
			!selectedRoom ||
			!serviceTitle ||
			selectedSlots.length === 0
		) {
			toast.error("Please fill in all required fields");
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
				"http://localhost:8000/schedule/create-with-service",
				{
					title,
					description,
					adminId: Number(selectedDoctor),
					userId: Number(selectedUser),
					roomId: Number(selectedRoom),
					serviceTitle,
					serviceDescription,
					serviceStart,
					serviceEnd,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			toast.success("Schedule created successfully");
			navigate("/schedule");
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to create schedule");
		}
	};

	return (
		<div className="min-h-screen p-6 bg-slate-50">
			<div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
				<h1 className="text-2xl font-bold mb-4">Create Schedule</h1>

				{/* schedule info */}
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
						Doctor
					</label>
					<select
						className="select select-bordered w-full"
						value={selectedDoctor}
						onChange={(e) => setSelectedDoctor(e.target.value)}
					>
						<option value="">Select Doctor</option>
						{doctors.map((doc) => (
							<option key={doc.id} value={doc.id}>
								{doc.firstNameTh} {doc.lastNameTh}
							</option>
						))}
					</select>
				</div>

				<div className="mb-4">
					<label className="block mb-1 font-medium text-slate-700">
						Patient
					</label>
					<select
						className="select select-bordered w-full"
						value={selectedUser}
						onChange={(e) => setSelectedUser(e.target.value)}
					>
						<option value="">Select Patient</option>
						{users.map((u) => (
							<option key={u.id} value={u.id}>
								{u.firstNameTh} {u.lastNameTh}
							</option>
						))}
					</select>
				</div>

				<div className="mb-4">
					<label className="block mb-1 font-medium text-slate-700">Room</label>
					<select
						className="select select-bordered w-full"
						value={selectedRoom}
						onChange={(e) => setSelectedRoom(e.target.value)}
					>
						<option value="">Select Room</option>
						{rooms.map((room) => (
							<option key={room.id} value={room.id}>
								Room {room.roomNumber} - {room.description}
							</option>
						))}
					</select>
				</div>

				{/* service info */}
				<div className="divider">First Service</div>

				<div className="mb-4">
					<label className="block mb-1 font-medium text-slate-700">
						Service Title
					</label>
					<input
						type="text"
						value={serviceTitle}
						onChange={(e) => setServiceTitle(e.target.value)}
						className="input input-bordered w-full"
					/>
				</div>

				<div className="mb-4">
					<label className="block mb-1 font-medium text-slate-700">
						Service Description
					</label>
					<textarea
						value={serviceDescription}
						onChange={(e) => setServiceDescription(e.target.value)}
						className="textarea textarea-bordered w-full"
					></textarea>
				</div>

				<div className="mb-4">
					<label className="block mb-1 font-medium text-slate-700">
						Select Date
					</label>
					<input
						type="date"
						value={format(selectedDate, "yyyy-MM-dd")}
						min={format(new Date(), "yyyy-MM-dd")}
						onChange={(e) => setSelectedDate(new Date(e.target.value))}
						className="input input-bordered"
					/>
				</div>

				<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-6">
					{timeSlots.map((time) => {
						const isBooked = isSlotDisabled(time);
						const isSelected = selectedSlots.includes(time);
						return (
							<button
								key={time}
								disabled={isBooked}
								onClick={() => toggleSlot(time)}
								className={`px-3 py-2 rounded text-sm border text-center transition-colors duration-200
        ${
					isBooked
						? "bg-slate-200 text-slate-600 cursor-not-allowed"
						: "cursor-pointer"
				}
        ${
					!isBooked && isSelected
						? "bg-green-700 text-white"
						: "bg-slate-100 hover:bg-green-100"
				}
      `}
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
						Create Schedule
					</button>
				</div>
			</div>
		</div>
	);
}

export default CreateSchedule;
