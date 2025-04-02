import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import useUserStore from "../../stores/userStore";

function UpdateSchedule() {
	const { token, user } = useUserStore();
	const { id: scheduleId } = useParams();
	const navigate = useNavigate();

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [selectedDoctor, setSelectedDoctor] = useState("");
	const [selectedUser, setSelectedUser] = useState("");
	const [selectedRoom, setSelectedRoom] = useState("");

	const [doctors, setDoctors] = useState([]);
	const [users, setUsers] = useState([]);
	const [rooms, setRooms] = useState([]);

	useEffect(() => {
		const fetchDropdowns = async () => {
			try {
				const [adminRes, userRes, roomRes] = await Promise.all([
					axios.get("http://localhost:8000/admin/list", {
						headers: { Authorization: `Bearer ${token}` },
					}),
					axios.get("http://localhost:8000/user/list", {
						headers: { Authorization: `Bearer ${token}` },
					}),
					axios.get("http://localhost:8000/room", {
						headers: { Authorization: `Bearer ${token}` },
					}),
				]);

				setDoctors(
					adminRes.data.cleanedAdminList.filter(
						(admin) =>
							admin.clinic?.id === user.clinicId && admin.role.role === "DOCTOR"
					)
				);
				setUsers(
					userRes.data.userList.filter((u) => u.clinic.id === user.clinicId)
				);
				setRooms(
					roomRes.data.rooms.filter((room) => room.clinicId === user.clinicId)
				);
			} catch (err) {
				{
					user.role === "ADMIN"
						? toast.error("Failed to load dropdown data")
						: "";
				}
			}
		};
		fetchDropdowns();
	}, [token, user.clinicId]);

	useEffect(() => {
		const fetchSchedule = async () => {
			try {
				const res = await axios.get(
					`http://localhost:8000/schedule/${scheduleId}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				const sch = res.data.schedule;
				setTitle(sch.title || "");
				setDescription(sch.description || "");
				setSelectedDoctor(sch.admin?.id || "");
				setSelectedUser(sch.user?.id || "");
				setSelectedRoom(sch.room?.id || "");
			} catch (err) {
				toast.error("Failed to load schedule data");
			}
		};
		fetchSchedule();
	}, [scheduleId, token]);

	const handleSubmit = async () => {
		if (!title || !selectedDoctor || !selectedUser || !selectedRoom) {
			toast.error("Please fill in all required fields");
			return;
		}
		try {
			await axios.patch(
				`http://localhost:8000/schedule/update/${scheduleId}`,
				{
					title,
					description,
					adminId: Number(selectedDoctor),
					userId: Number(selectedUser),
					roomId: Number(selectedRoom),
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			toast.success("Schedule updated successfully");
			navigate(`/schedule/${scheduleId}`);
		} catch (err) {
			toast.error(err.response?.data?.message || "Update failed");
		}
	};

	return (
		<div className="min-h-screen p-6 bg-slate-50">
			<div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
				<h1 className="text-2xl font-bold mb-4">Update Schedule</h1>

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
				{user.role === "ADMIN" ? (
					<>
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
							<label className="block mb-1 font-medium text-slate-700">
								Room
							</label>
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
					</>
				) : (
					""
				)}

				<div className="text-right">
					<button
						onClick={handleSubmit}
						className="btn bg-green-700 text-white hover:bg-green-600"
					>
						Update Schedule
					</button>
				</div>
			</div>
		</div>
	);
}

export default UpdateSchedule;
