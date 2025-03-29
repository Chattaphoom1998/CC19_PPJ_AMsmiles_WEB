import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import axios from "axios";
import useUserStore from "../../stores/userStore";
import { Pencil, Trash2, PlusCircle, ChevronLeft } from "lucide-react";

function ClinicEdit() {
	const { token } = useUserStore();
	const { id } = useParams();
	const navigate = useNavigate();

	const [name, setName] = useState("");
	const [businessLicense, setBusinessLicense] = useState("");
	const [address, setAddress] = useState("");
	const [rooms, setRooms] = useState([]);
	const [newRoom, setNewRoom] = useState({ roomNumber: "", description: "" });
	const [confirmRoomId, setConfirmRoomId] = useState(null);
	const [editingRoom, setEditingRoom] = useState(null);

	useEffect(() => {
		const fetchClinic = async () => {
			try {
				const res = await axios.get(`http://localhost:8000/clinic`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const clinic = res.data.clinics.find((c) => c.id === +id);
				if (!clinic) return toast.error("Clinic not found");
				setName(clinic.name);
				setBusinessLicense(clinic.businessLicense || "");
				setAddress(clinic.address || "");
			} catch (err) {
				toast.error("Failed to load clinic data");
			}
		};

		const fetchRooms = async () => {
			try {
				const res = await axios.get(
					`http://localhost:8000/room?clinicId=${id}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setRooms(res.data.rooms);
			} catch (err) {
				toast.error("Failed to load rooms");
			}
		};

		fetchClinic();
		fetchRooms();
	}, [id, token]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!name.trim() || !businessLicense.trim() || !address.trim()) {
			return toast.error("All fields are required");
		}

		try {
			await axios.patch(
				`http://localhost:8000/clinic/${id}`,
				{ name, businessLicense, address },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			navigate("/clinics");
			toast.success("Clinic updated successfully");
		} catch (err) {
			toast.error(err.response?.data?.message || "Update failed");
		}
	};

	const handleAddRoom = async () => {
		if (!newRoom.roomNumber || !newRoom.description) {
			return toast.error("Please provide room number and description");
		}
		try {
			const res = await axios.post(
				`http://localhost:8000/room`,
				{ ...newRoom, clinicId: id },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setRooms((prev) => [...prev, res.data.room]);
			setNewRoom({ roomNumber: "", description: "" });
			toast.success("Room added");
		} catch (err) {
			toast.error("Failed to add room");
		}
	};

	const handleUpdateRoom = async () => {
		if (!editingRoom.roomNumber || !editingRoom.description) {
			return toast.error("Please provide room number and description");
		}
		try {
			await axios.patch(
				`http://localhost:8000/room/${editingRoom.id}`,
				{
					roomNumber: editingRoom.roomNumber,
					description: editingRoom.description,
				},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setRooms((prev) =>
				prev.map((room) => (room.id === editingRoom.id ? editingRoom : room))
			);
			setEditingRoom(null);
			toast.success("Room updated");
		} catch (err) {
			toast.error("Failed to update room");
		}
	};

	const handleDeleteRoom = async (roomId) => {
		try {
			await axios.delete(`http://localhost:8000/room/${roomId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setRooms((prev) => prev.filter((room) => room.id !== roomId));
			toast.success("Room deleted");
		} catch (err) {
			toast.error("Failed to delete room");
		}
	};

	return (
		<div className="min-h-screen p-8 bg-slate-50 mx-auto">
			<div className=" fixed left-75 top-25 z-30">
				<button
					type="button"
					onClick={() => navigate(-1)}
					className="flex items-center border-1 rounded-full w-auto aspect-square p-2 text-slate-400 hover:text-green-800 hover:cursor-pointer"
				>
					<ChevronLeft size={20} />
				</button>
			</div>
			<div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
				<div className="flex items-center justify-between mb-4">
					<h1 className="text-2xl font-bold">Edit Clinic</h1>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-slate-700 mb-1">Clinic Name</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full p-2 border border-slate-300 rounded bg-slate-50 text-slate-900"
						/>
					</div>
					<div>
						<label className="block text-slate-700 mb-1">
							Business License
						</label>
						<input
							type="text"
							value={businessLicense}
							onChange={(e) => setBusinessLicense(e.target.value)}
							className="w-full p-2 border border-slate-300 rounded bg-slate-50 text-slate-900"
						/>
					</div>
					<div>
						<label className="block text-slate-700 mb-1">Address</label>
						<textarea
							value={address}
							onChange={(e) => setAddress(e.target.value)}
							className="w-full p-2 border border-slate-300 rounded bg-slate-50 text-slate-900"
						></textarea>
					</div>

					<div className="mt-6">
						<h2 className="text-lg font-semibold mb-2">Rooms</h2>
						<div className="flex gap-2 mb-4">
							<input
								type="number"
								placeholder="Room Number"
								value={newRoom.roomNumber}
								onChange={(e) =>
									setNewRoom({ ...newRoom, roomNumber: e.target.value })
								}
								className="p-2 border border-slate-300 rounded bg-slate-50"
							/>
							<input
								type="text"
								placeholder="Room Description"
								value={newRoom.description}
								onChange={(e) =>
									setNewRoom({ ...newRoom, description: e.target.value })
								}
								className="p-2 border border-slate-300 rounded bg-slate-50"
							/>
							<button type="button" onClick={handleAddRoom}>
								<PlusCircle className="text-green-900 hover:text-green-700 hover:cursor-pointer rounded-full hover:shadow" />
							</button>
						</div>

						<table className="w-full table-auto text-sm">
							<thead>
								<tr className="bg-slate-200 text-slate-700">
									<th className="p-2 text-center">Room No.</th>
									<th className="p-2 text-center">Description</th>
									<th className="p-2 text-center">Actions</th>
								</tr>
							</thead>
							<tbody>
								{rooms.map((room) => (
									<tr key={room.id} className="hover:bg-slate-100">
										<td className="p-2 text-center">{room.roomNumber}</td>
										<td className="p-2 text-center">{room.description}</td>
										<td className="p-2 space-x-2 text-center">
											<button
												type="button"
												className="btn border-none bg-transparent shadow-none hover:shadow-none"
												onClick={() => setEditingRoom(room)}
											>
												<Pencil
													size={18}
													className="text-slate-400 hover:text-green-800"
												/>
											</button>
											<button
												type="button"
												className="btn border-none bg-transparent shadow-none hover:shadow-none text-slate-400 hover:text-red-800"
												onClick={() => setConfirmRoomId(room.id)}
											>
												<Trash2 size={20} />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="flex justify-end gap-2 mt-6">
						<button
							type="button"
							onClick={() => navigate("clinics")}
							className=" btn h-fit px-4 py-1 bg-slate-300 rounded hover:bg-slate-400 hover:text-white"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="btn h-fit px-4 py-1 bg-green-800 text-white rounded hover:bg-green-700"
						>
							Update
						</button>
					</div>
				</form>
			</div>

			{/* Confirm Delete Modal */}
			{confirmRoomId && (
				<div className="fixed inset-0 bg-black/[20%] bg-opacity-30 flex items-center justify-center z-50">
					<div className="flex flex-col items-center justify-center bg-white p-6 rounded shadow-lg w-[600px] h-[250px] text-center">
						<p className="text-slate-800 text-lg font-semibold mb-8">
							Delete this room?
						</p>
						<div className="flex justify-center gap-4">
							<button
								className=" btn h-fit px-4 py-1 bg-slate-300 rounded hover:bg-slate-400 hover:text-slate-100"
								onClick={() => setConfirmRoomId(null)}
							>
								Cancel
							</button>
							<button
								className="btn h-fit px-4 py-1 bg-red-800 text-white rounded hover:bg-red-700"
								onClick={() => {
									handleDeleteRoom(confirmRoomId);
									setConfirmRoomId(null);
								}}
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
			{editingRoom && (
				<div className="fixed inset-0 bg-black/[20%] flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded shadow-lg w-[350px] space-y-4">
						<h2 className="text-lg font-semibold text-slate-800 text-center">
							Edit Room
						</h2>
						<input
							type="number"
							value={editingRoom.roomNumber}
							onChange={(e) =>
								setEditingRoom((prev) => ({
									...prev,
									roomNumber: e.target.value,
								}))
							}
							className="w-full p-2 border border-slate-300 rounded bg-slate-50"
							placeholder="Room Number"
						/>
						<input
							type="text"
							value={editingRoom.description}
							onChange={(e) =>
								setEditingRoom((prev) => ({
									...prev,
									description: e.target.value,
								}))
							}
							className="w-full p-2 border border-slate-300 rounded bg-slate-50"
							placeholder="Description"
						/>
						<div className="flex justify-end gap-2">
							<button
								className="btn h-fit px-4 py-1 bg-slate-300 rounded hover:bg-slate-400 hover:text-slate-100"
								onClick={() => setEditingRoom(null)}
							>
								Cancel
							</button>
							<button
								className="btn h-fit px-4 py-1 bg-green-800 text-white rounded hover:bg-green-700"
								onClick={handleUpdateRoom}
							>
								Update
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default ClinicEdit;
