import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useUserStore from "../stores/userStore";
import axios from "axios";
import { useNavigate } from "react-router";

function CreateAdmin() {
	const initInput = {
		firstNameEn: "",
		lastNameEn: "",
		firstNameTh: "",
		lastNameTh: "",
		email: "",
		password: "",
		confirmPassword: "",
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

	useEffect(() => {
		if (user.role !== "ADMIN") {
			toast.error("Forbidden. Only admins can create new admins.");
			return navigate("/account");
		}

		const getClinics = async () => {
			try {
				const clinicsResponse = await axios.get(
					`http://localhost:8000/clinic`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setClinics(clinicsResponse.data || []);
			} catch (error) {
				toast.error(error.response?.data?.message || "Failed to load clinics");
			} finally {
				setLoading(false);
			}
		};
		getClinics();
	}, [user, token, navigate]);

	const hdlChange = (e) => {
		const { name, value } = e.target;
		setInput((prev) => ({
			...prev,
			[name]:
				name === "clinicId" ? (value === "" ? null : parseInt(value)) : value,
		}));
	};

	const hdlCreate = async (e) => {
		e.preventDefault();
		if (!user?.id) return navigate("/login");

		if (
			!input.firstNameEn.trim() ||
			!input.lastNameEn.trim() ||
			!input.firstNameTh.trim() ||
			!input.lastNameTh.trim() ||
			!input.email.trim() ||
			!input.password.trim() ||
			!input.confirmPassword.trim() ||
			!input.phone.trim() ||
			!input.idCard.trim() ||
			!input.role ||
			input.clinicId === null
		) {
			return toast.error("Please provide all required data.");
		}

		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (!emailRegex.test(input.email)) {
			return toast.error("Please correct your email.");
		}

		const mobileRegex = /^[0-9]{10,15}$/;
		if (!mobileRegex.test(input.phone)) {
			return toast.error("Please correct your phone number.");
		}

		if (input.password !== input.confirmPassword) {
			return toast.error("Passwords do not match.");
		}

		if (
			input.role === "DOCTOR" &&
			(!input.department || !input.dentalCouncilRegisId)
		) {
			return toast.error(
				"Provide department and Dental Council Regis ID for doctors."
			);
		}

		const payload = {
			...input,
			clinicId: input.clinicId,
		};

		try {
			const { data } = await axios.post(
				`http://localhost:8000/admin/create`,
				payload,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			toast.success("Admin created successfully");
			navigate("/admin");
			useUserStore.setState({ user: data.admin });
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to create admin");
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
							{`${input.firstNameEn || "New"} ${input.lastNameEn || "Admin"}`}
						</h2>
					</div>
				</div>

				<div className="bg-white p-6 rounded-lg shadow-md w-[700px]">
					<form onSubmit={hdlCreate} className="space-y-4">
						<div className="flex gap-2">
							<label className="w-1/2">
								<span className="text-slate-700">First Name (Eng):</span>
								<input
									type="text"
									name="firstNameEn"
									value={input.firstNameEn}
									onChange={hdlChange}
									className="w-full p-2 mt-1 border border-slate-300 rounded-md bg-slate-50 text-slate-900"
									required
								/>
							</label>
							<label className="w-1/2">
								<span className="text-slate-700">Last Name (Eng):</span>
								<input
									type="text"
									name="lastNameEn"
									value={input.lastNameEn}
									onChange={hdlChange}
									className="w-full p-2 mt-1 border border-slate-300 rounded-md bg-slate-50 text-slate-900"
									required
								/>
							</label>
						</div>

						<div className="flex gap-2">
							<label className="w-1/2">
								<span className="text-slate-700">Email:</span>
								<input
									type="email"
									name="email"
									value={input.email}
									onChange={hdlChange}
									className="w-full p-2 mt-1 border border-slate-300 rounded-md bg-slate-50 text-slate-900"
									required
								/>
							</label>
							<label className="w-1/2">
								<span className="text-slate-700">Phone:</span>
								<input
									type="tel"
									name="phone"
									value={input.phone}
									onChange={hdlChange}
									className="w-full p-2 mt-1 border border-slate-300 rounded-md bg-slate-50 text-slate-900"
									required
								/>
							</label>
						</div>

						<div className="flex gap-2">
							<label className="w-1/2">
								<span className="text-slate-700">First Name (Thai):</span>
								<input
									type="text"
									name="firstNameTh"
									value={input.firstNameTh}
									onChange={hdlChange}
									className="w-full p-2 mt-1 border border-slate-300 rounded-md bg-slate-50 text-slate-900"
									required
								/>
							</label>
							<label className="w-1/2">
								<span className="text-slate-700">Last Name (Thai):</span>
								<input
									type="text"
									name="lastNameTh"
									value={input.lastNameTh}
									onChange={hdlChange}
									className="w-full p-2 mt-1 border border-slate-300 rounded-md bg-slate-50 text-slate-900"
									required
								/>
							</label>
						</div>

						<div className="flex gap-2">
							<label className="w-1/2">
								<span className="text-slate-700">ID Card:</span>
								<input
									type="text"
									name="idCard"
									value={input.idCard}
									onChange={hdlChange}
									className="w-full p-2 mt-1 border border-slate-300 rounded-md bg-slate-50 text-slate-900"
									required
								/>
							</label>
							<label className="w-1/2">
								<span className="text-slate-700">Role:</span>
								<select
									name="role"
									value={input.role}
									onChange={hdlChange}
									className="w-full p-2 mt-1 border border-slate-300 rounded-md bg-slate-50 text-slate-900"
									required
								>
									<option value="ADMIN">Admin</option>
									<option value="DOCTOR">Doctor</option>
								</select>
							</label>
						</div>

						<label className="block">
							<span className="text-slate-700">Clinic ID:</span>
							<select
								name="clinicId"
								value={input.clinicId || ""}
								onChange={hdlChange}
								className="w-full p-2 mt-1 border border-slate-300 rounded-md bg-slate-50 text-slate-900"
								required
							>
								<option value="">Select Clinic</option>
								{clinics.map((clinic) => (
									<option key={clinic.id} value={clinic.id}>
										{clinic.name}
									</option>
								))}
							</select>
						</label>

						{input.role === "DOCTOR" && (
							<div className="flex gap-2">
								<label className="w-1/2">
									<span className="text-slate-700">Department:</span>
									<input
										type="text"
										name="department"
										value={input.department}
										onChange={hdlChange}
										className="w-full p-2 mt-1 border border-slate-300 rounded-md bg-slate-50 text-slate-900"
										required
									/>
								</label>
								<label className="w-1/2">
									<span className="text-slate-700">
										Dental Council Regis ID:
									</span>
									<input
										type="text"
										name="dentalCouncilRegisId"
										value={input.dentalCouncilRegisId}
										onChange={hdlChange}
										className="w-full p-2 mt-1 border border-slate-300 rounded-md bg-slate-50 text-slate-900"
										required
									/>
								</label>
							</div>
						)}

						<label className="block">
							<span className="text-slate-700 text-sm">
								New Password (optional):
							</span>
							<input
								type="password"
								name="password"
								value={input.password}
								onChange={hdlChange}
								className="w-full p-2 mt-1 border border-slate-300 rounded-md bg-slate-50 text-slate-900"
								placeholder="Enter password"
								required
							/>
						</label>

						<label className="block">
							<span className="text-slate-700 text-sm">
								Confirm Password (optional):
							</span>
							<input
								type="password"
								name="confirmPassword"
								value={input.confirmPassword}
								onChange={hdlChange}
								className="w-full p-2 mt-1 border border-slate-300 rounded-md bg-slate-50 text-slate-900"
								placeholder="Confirm your password"
								required
							/>
						</label>

						<button
							type="submit"
							className="btn bg-green-800 text-slate-50 w-full py-3 rounded-lg hover:bg-green-600"
						>
							Create
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}

export default CreateAdmin;
