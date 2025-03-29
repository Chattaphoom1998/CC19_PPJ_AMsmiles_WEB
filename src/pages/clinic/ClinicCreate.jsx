import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import axios from "axios";
import useUserStore from "../../stores/userStore";
import { ChevronLeft, Pencil, PlusCircle, Trash2 } from "lucide-react";

function ClinicCreate() {
	const [name, setName] = useState("");
	const [businessLicense, setBusinessLicense] = useState("");
	const [address, setAddress] = useState("");
	const [rooms, setRooms] = useState([]);
	const [newRoom, setNewRoom] = useState({ roomNumber: "", description: "" });

	const navigate = useNavigate();
	const { token } = useUserStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!name.trim()) return toast.error("Clinic name is required");

		try {
			await axios.post(
				"http://localhost:8000/clinic",
				{ name, businessLicense, address, rooms },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			toast.success("Clinic created successfully");
			navigate("/clinics");
		} catch (err) {
			toast.error(err.response?.data?.message || "Create failed");
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
			<div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
				<div className="flex items-center justify-between mb-4">
					<h1 className="text-2xl font-bold">Add New Clinic</h1>
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
							<h2 className="text-lg font-semibold mt-6">Rooms</h2>
							<div className="flex gap-2 mb-4">
								<input
									type="number"
									placeholder="Room Number"
									value={newRoom.roomNumber}
									onChange={(e) =>
										setNewRoom({ ...newRoom, roomNumber: e.target.value })
									}
									className="p-2 border border-slate-300 rounded bg-slate-50 w-1/3"
								/>
								<input
									type="text"
									placeholder="Room Description"
									value={newRoom.description}
									onChange={(e) =>
										setNewRoom({ ...newRoom, description: e.target.value })
									}
									className="p-2 border border-slate-300 rounded bg-slate-50 w-2/3"
								/>
								<button
									type="button"
									onClick={() => {
										if (!newRoom.roomNumber || !newRoom.description)
											return toast.error("Fill all room fields");
										setRooms([...rooms, newRoom]);
										setNewRoom({ roomNumber: "", description: "" });
									}}
									className="text-green-900 hover:text-green-700 hover:cursor-pointer "
								>
									<PlusCircle className="rounded-full hover:shadow" />
								</button>
							</div>

							<table className="w-full table-auto text-sm mt-2">
								<thead>
									<tr className="bg-slate-200 text-slate-700">
										<th className="text-center p-2">Room No.</th>
										<th className="text-center p-2">Description</th>
										<th className="text-center p-2">Actions</th>
									</tr>
								</thead>
								<tbody>
									{rooms.map((room, idx) => (
										<tr key={idx} className="hover:bg-slate-100">
											<td className="text-center p-2">{room.roomNumber}</td>
											<td className="text-center p-2">{room.description}</td>
											<td className="text-center p-2 space-x-2">
												<button
													type="button"
													onClick={() => {
														setNewRoom(room);
														setRooms(rooms.filter((_, i) => i !== idx));
													}}
													className="btn border-none bg-transparent shadow-none hover:shadow-none text-slate-400 hover:text-green-800"
												>
													<Pencil size={18} />
												</button>
												<button
													type="button"
													onClick={() =>
														setRooms(rooms.filter((_, i) => i !== idx))
													}
													className="btn border-none bg-transparent shadow-none hover:shadow-none text-slate-400 hover:text-red-800"
												>
													<Trash2 size={20} />
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
					<div className="flex justify-end gap-2">
						<button
							type="button"
							onClick={() => navigate("/clinics")}
							className="btn h-fit px-4 py-1 bg-slate-300 rounded hover:bg-slate-400 hover:text-slate-100"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="btn h-fit px-4 py-1 bg-green-800 text-white rounded hover:bg-green-700"
						>
							Save
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default ClinicCreate;
