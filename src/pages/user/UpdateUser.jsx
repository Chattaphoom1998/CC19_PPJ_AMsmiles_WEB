import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useUserStore from "../../stores/userStore";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { ChevronLeft } from "lucide-react";

function UpdateUser() {
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
		clinicId: null,
	};

	const [input, setInput] = useState(initInput);
	const [loading, setLoading] = useState(true);
	const [clinics, setClinics] = useState([]);
	const { user, token } = useUserStore();
	const navigate = useNavigate();
	const { id } = useParams();

	useEffect(() => {
		const fetchData = async () => {
			if (!user?.id) return navigate("/login");
			if (user.role !== "ADMIN" && user.id !== +id) {
				toast.error("Forbidden. Contact ADMIN.");
				return navigate("/account");
			}

			try {
				const userResponse = await axios.get(
					`http://localhost:8000/user/${id}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				const userData = userResponse.data.user;
				setInput({
					firstNameEn: userData.firstNameEn || "",
					lastNameEn: userData.lastNameEn || "",
					firstNameTh: userData.firstNameTh || "",
					lastNameTh: userData.lastNameTh || "",
					email: userData.email || "",
					phone: userData.phone || "",
					idCard: userData.idCard || "",
					clinicId: userData.clinic?.id || null,
					password: "",
					confirmPassword: "",
				});

				const clinicsResponse = await axios.get(
					"http://localhost:8000/clinic",
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setClinics(clinicsResponse.data.clinics || []);
			} catch (error) {
				toast.error(error.response?.data?.message || "Failed to load data");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [user, id, token, navigate]);

	const hdlChange = (e) => {
		const { name, value } = e.target;
		setInput((prev) => ({
			...prev,
			[name]:
				name === "clinicId" ? (value === "" ? null : parseInt(value)) : value,
		}));
	};

	const hdlSave = async (e) => {
		e.preventDefault();
		if (!user?.id) return navigate("/login");

		if (input.password && input.password !== input.confirmPassword) {
			return toast.error("Passwords do not match");
		}

		const payload = { ...input };
		delete payload.confirmPassword;

		try {
			const { data } = await axios.patch(
				`http://localhost:8000/user/update/${id}`,
				payload,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			toast.success("User updated successfully");
			navigate("/user");
		} catch (error) {
			toast.error(error.response?.data?.message || "Update failed");
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
			<div className=" fixed left-75 top-25 z-30">
				<button
					type="button"
					onClick={() => navigate(-1)}
					className="flex items-center border-1 rounded-full w-auto aspect-square p-2 text-slate-400 hover:text-green-800 hover:cursor-pointer"
				>
					<ChevronLeft size={20} />
				</button>
			</div>
			<div className="w-full p-6 flex  items-center justify-evenly gap-20">
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

				<div className="bg-white p-6 rounded-lg shadow-md w-[700px]">
					<form onSubmit={hdlSave} className="space-y-4">
						<div className="flex gap-2">
							<label className="w-1/2">
								<span className="text-slate-700">First Name (Eng):</span>
								<input
									type="text"
									name="firstNameEn"
									value={input.firstNameEn}
									onChange={hdlChange}
									className="w-full p-2 mt-1 border border-slate-300 rounded-md bg-slate-50 text-slate-900"
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
									disabled
									className="w-full p-2 mt-1 border border-slate-300 rounded-md bg-slate-200 text-slate-500"
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
								/>
							</label>
							<label className="w-1/2">
								<span className="text-slate-700">Clinic:</span>
								<select
									name="clinicId"
									value={input.clinicId || ""}
									onChange={hdlChange}
									className="w-full p-2 mt-1 border border-slate-300 rounded-md bg-slate-50 text-slate-900"
								>
									<option value="">Select Clinic</option>
									{clinics.map((clinic) => (
										<option key={clinic.id} value={clinic.id}>
											{clinic.name}
										</option>
									))}
								</select>
							</label>
						</div>

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
								placeholder="Leave blank to keep current"
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
								placeholder="Confirm your new password"
							/>
						</label>

						<button
							type="submit"
							className="btn bg-green-800 text-slate-50 w-full py-3 rounded-lg hover:bg-green-600"
						>
							Save
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}

export default UpdateUser;
