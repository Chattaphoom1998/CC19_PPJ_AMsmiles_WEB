import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useUserStore from "../../stores/userStore";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { ChevronLeft } from "lucide-react";

function AdminDetail() {
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
		if (!user?.id) return navigate("/login");
		if (user.role !== "ADMIN") {
			toast.error("Forbidden. Only admins can view admin details.");
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
				console.log(adminData);
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
					department: adminData.doctorInfo[0]?.department || "",
					dentalCouncilRegisId:
						adminData.doctorInfo[0]?.dentalCouncilRegisId || "",
				});

				const clinicsResponse = await axios.get(
					`http://localhost:8000/clinic`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setClinics(clinicsResponse.data?.clinics || []);
			} catch (error) {
				toast.error(error.response?.data?.message || "Failed to load data");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [user, id, token, navigate]);

	if (loading)
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-50">
				Loading...
			</div>
		);

	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
			<div className=" fixed left-75 top-25 z-30">
				<button
					type="button"
					onClick={() => navigate("-1")}
					className="flex items-center border-1 rounded-full w-auto aspect-square p-2 text-slate-400 hover:text-green-800 hover:cursor-pointer"
				>
					<ChevronLeft size={20} />
				</button>
			</div>
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
								Info:
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
							{input.role?.toUpperCase() === "DOCTOR" && (
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

						<div className="flex gap-4 justify-end">
							<button
								onClick={() => navigate(`/admin/update/${id}`)}
								className="btn bg-green-800 text-slate-50  py-3 rounded-lg hover:bg-green-700"
							>
								Update
							</button>
							<button
								onClick={() => navigate(`/admin/delete/${id}`)}
								className="btn border-2 border-slate-600 text-slate-600  py-3 rounded-lg hover:text-red-600 hover:border-red-600 hover:bg-slate-200"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AdminDetail;
