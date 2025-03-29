// พร้อมแล้วสำหรับหน้า ClinicList

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import useUserStore from "../../stores/userStore";
import { Pencil, Trash2, Plus } from "lucide-react";

function ClinicList() {
	const { token } = useUserStore();
	const [clinics, setClinics] = useState([]);
	const [confirmDeleteId, setConfirmDeleteId] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchClinics = async () => {
			try {
				const res = await axios.get("http://localhost:8000/clinic", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setClinics(
					res.data.clinics.map((clinic) => ({
						...clinic,
						roomCount: clinic.room?.length || 0,
					}))
				);
			} catch (err) {
				toast.error("Failed to load clinics");
			}
		};
		fetchClinics();
	}, [token]);

	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this clinic?")) return;
		try {
			await axios.delete(`http://localhost:8000/clinic/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setClinics((prev) => prev.filter((clinic) => clinic.id !== id));
			toast.success("Clinic deleted successfully");
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to delete clinic");
		}
	};

	return (
		<div className="min-h-screen p-6 bg-slate-50 mx-auto">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Clinic List</h1>
				<button
					onClick={() => navigate("create")}
					className="btn flex items-center gap-2 bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700"
				>
					<Plus size={18} /> Add Clinic
				</button>
			</div>

			<div className="bg-white shadow rounded overflow-hidden">
				<table className="w-full table-auto hover:cursor-default">
					<thead className="bg-slate-200 text-slate-700">
						<tr>
							<th className="p-3 text-center">#</th>
							<th className="p-3 text-center">Clinic Name</th>
							<th className="p-3 text-center">License</th>
							<th className="p-3 text-center">Address</th>
							<th className="p-3 text-center">Rooms</th>
							<th className="p-3 text-center">Last Updated</th>
							<th className="p-3 text-center">Actions</th>
						</tr>
					</thead>
					<tbody>
						{clinics.map((clinic, index) => (
							<tr key={clinic.id} className="hover:bg-slate-100">
								<td className="p-3">{index + 1}</td>
								<td className="p-3">{clinic.name}</td>
								<td className="p-3">{clinic.businessLicense}</td>
								<td className="p-3">{clinic.address}</td>
								<td className="p-3 text-center">{clinic.roomCount}</td>
								<td className="p-3  text-center">
									{new Date(clinic.updatedAt).toLocaleDateString()}
								</td>
								<td className=" p-3 flex justify-center items-center">
									<button
										onClick={() => navigate(`edit/${clinic.id}`)}
										className="btn border-none bg-transparent shadow-none hover:shadow-none text-slate-400 hover:text-green-800"
									>
										<Pencil size={18} />
									</button>
									<button
										onClick={() => setConfirmDeleteId(clinic.id)}
										className="btn border-none bg-transparent shadow-none hover:shadow-none text-slate-400 hover:text-red-800"
									>
										<Trash2 size={20} />
									</button>
								</td>
							</tr>
						))}
						{clinics.length === 0 && (
							<tr>
								<td colSpan="6" className="text-center py-6 text-slate-500">
									No clinic found.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			{confirmDeleteId && (
				<div className="fixed inset-0 bg-black/[20%] flex items-center justify-center z-50">
					<div className="flex flex-col items-center justify-center bg-white p-6 rounded shadow-lg w-[600px] h-[250px] text-center">
						<p className="text-slate-800 text-lg font-semibold mb-8">
							Delete this clinic?
						</p>
						<div className="flex justify-center gap-4">
							<button
								className=" btn h-fit px-4 py-1 bg-slate-300 rounded hover:bg-slate-400 hover:text-slate-100"
								onClick={() => setConfirmDeleteId(null)}
							>
								Cancel
							</button>
							<button
								className="btn h-fit px-4 py-1 bg-red-800 text-white rounded hover:bg-red-700"
								onClick={async () => {
									try {
										await axios.delete(
											`http://localhost:8000/clinic/${confirmDeleteId}`,
											{
												headers: { Authorization: `Bearer ${token}` },
											}
										);
										setClinics((prev) =>
											prev.filter((c) => c.id !== confirmDeleteId)
										);
										setConfirmDeleteId(null);
										toast.success("Clinic deleted successfully");
									} catch (err) {
										toast.error("Failed to delete clinic");
									}
								}}
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default ClinicList;
