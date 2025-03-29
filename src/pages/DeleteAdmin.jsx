import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useUserStore from "../stores/userStore";
import axios from "axios";
import { useNavigate, useParams } from "react-router";

function DeleteAdmin() {
	const initInput = {
		id: "",
		firstNameEn: "",
		lastNameEn: "",
		firstNameTh: "",
		lastNameTh: "",
		email: "",
		phone: "",
		idCard: "",
		role: "ADMIN",
		clinicId: null,
		department: "",
		dentalCouncilRegisId: "",
	};

	const [input, setInput] = useState(initInput);
	const [loading, setLoading] = useState(true);
	const [clinics, setClinics] = useState([]);
	const { user, token } = useUserStore();
	const navigate = useNavigate();
	const { id } = useParams();

	useEffect(() => {
		if (user.role !== "ADMIN") {
			toast.error("Forbidden. Only admins can delete admins.");
			return navigate("/admin");
		}

		const fetchData = async () => {
			try {
				const adminResponse = await axios.get(
					`http://localhost:8000/admin/${id}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				const adminData = adminResponse.data.admin;
				setInput({
					id: adminData.id || "",
					firstNameEn: adminData.firstNameEn || "",
					lastNameEn: adminData.lastNameEn || "",
					firstNameTh: adminData.firstNameTh || "",
					lastNameTh: adminData.lastNameTh || "",
					email: adminData.email || "",
					phone: adminData.phone || "",
					idCard: adminData.idCard || "",
					role: adminData.role?.role || "ADMIN",
					clinicId: adminData.clinic?.id || null,
					department: adminData.doctorInfo?.department || "",
					dentalCouncilRegisId:
						adminData.doctorInfo?.dentalCouncilRegisId || "",
				});

				const clinicsResponse = await axios.get(
					`http://localhost:8000/clinic`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setClinics(clinicsResponse.data || []);
			} catch (error) {
				toast.error(error.response?.data?.message || "Failed to load data");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [user, id, token, navigate]);

	const hdlDelete = async () => {
		if (!user?.id) return navigate("/login");

		try {
			await axios.delete(`http://localhost:8000/admin/delete/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			toast.success("Admin deleted successfully");
			navigate("/admin");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to delete admin");
		}
	};

	if (loading)
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-50">
				Loading...
			</div>
		);

	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
			<div className="w-full p-6 flex items-center justify-evenly gap-20">
				<div className="card bg-slate-100 w-96 shadow-sm">
					<figure>
						<div className="w-100 h-100 bg-slate-200 rounded-lg flex items-center justify-center mb-4">
							<span className="text-slate-500 text-sm font-medium">
								_Profile
							</span>
						</div>
					</figure>
					<div className="card-body">
						<h2 className="card-title text-2xl font-medium justify-center text-slate-950">
							{`${input.firstNameEn || "undefined"} ${
								input.lastNameEn || "undefined"
							}`}
						</h2>
					</div>
				</div>

				<div className="bg-white p-6 rounded-lg shadow-md w-[600px]">
					<div className="space-y-4">
						<div>
							<h3 className="text-lg font-semibold text-slate-800 mb-2">
								Confirm Deletion
							</h3>
							<hr className="border-slate-300 mb-4" />
							<p className="text-slate-700">
								<strong>Name (English):</strong> {input.firstNameEn}{" "}
								{input.lastNameEn}
							</p>
							<p className="text-slate-700">
								<strong>Name (Thai):</strong> {input.firstNameTh}{" "}
								{input.lastNameTh}
							</p>
							<p className="text-slate-700">
								<strong>Email:</strong> {input.email}
							</p>
							<p className="text-slate-700">
								<strong>Phone:</strong> {input.phone}
							</p>
							<p className="text-slate-700">
								<strong>ID Card:</strong> {input.idCard}
							</p>
							<p className="text-slate-700">
								<strong>Role:</strong> {input.role}
							</p>
							{input.role === "DOCTOR" && (
								<>
									<p className="text-slate-700">
										<strong>Department:</strong> {input.department}
									</p>
									<p className="text-slate-700">
										<strong>Dental Council Regis ID:</strong>{" "}
										{input.dentalCouncilRegisId}
									</p>
								</>
							)}
							<p className="text-slate-700">
								<strong>Clinic:</strong>{" "}
								{clinics.find((c) => c.id === input.clinicId)?.name || "None"}
							</p>
						</div>

						<div>
							<p className="text-red-600 text-sm mb-4">
								Are you sure you want to delete this admin? This action cannot
								be undone.
							</p>
							<button
								onClick={hdlDelete}
								className="btn bg-red-600 text-slate-50 w-full py-3 rounded-lg hover:bg-red-500"
							>
								Delete
							</button>
							<button
								onClick={() => navigate(`/admin/${id}`)}
								className="btn bg-slate-300 text-slate-700 w-full py-3 rounded-lg mt-2 hover:bg-slate-400"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default DeleteAdmin;
