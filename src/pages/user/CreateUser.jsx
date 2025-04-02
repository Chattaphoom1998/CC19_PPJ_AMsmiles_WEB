import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useUserStore from "../../stores/userStore";
import axios from "axios";
import { useNavigate } from "react-router";

function CreateUser() {
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

	useEffect(() => {
		if (user.role !== "ADMIN") {
			toast.error("Forbidden. Only admins can create new users.");
			return navigate("/account");
		}

		const getClinics = async () => {
			try {
				const res = await axios.get("http://localhost:8000/clinic", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setClinics(res.data.clinics || []);
			} catch (err) {
				toast.error("Failed to load clinics");
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
			!input.phone.trim()
		) {
			return toast.error("Please fill all required fields.");
		}

		if (input.password !== input.confirmPassword) {
			return toast.error("Passwords do not match");
		}

		try {
			await axios.post("http://localhost:8000/user/create", input, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			toast.success("User created successfully");
			navigate("/user");
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to create user");
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
			<div className="bg-white p-6 rounded-lg shadow-md w-[700px]">
				<form onSubmit={hdlCreate} className="space-y-4">
					<div className="flex gap-2">
						<input
							type="text"
							name="firstNameEn"
							value={input.firstNameEn}
							onChange={hdlChange}
							placeholder="First Name (Eng)"
							className="input input-bordered w-1/2"
							required
						/>
						<input
							type="text"
							name="lastNameEn"
							value={input.lastNameEn}
							onChange={hdlChange}
							placeholder="Last Name (Eng)"
							className="input input-bordered w-1/2"
							required
						/>
					</div>
					<div className="flex gap-2">
						<input
							type="text"
							name="firstNameTh"
							value={input.firstNameTh}
							onChange={hdlChange}
							placeholder="First Name (Thai)"
							className="input input-bordered w-1/2"
							required
						/>
						<input
							type="text"
							name="lastNameTh"
							value={input.lastNameTh}
							onChange={hdlChange}
							placeholder="Last Name (Thai)"
							className="input input-bordered w-1/2"
							required
						/>
					</div>
					<input
						type="email"
						name="email"
						value={input.email}
						onChange={hdlChange}
						placeholder="Email"
						className="input input-bordered w-full"
						required
					/>
					<input
						type="tel"
						name="phone"
						value={input.phone}
						onChange={hdlChange}
						placeholder="Phone"
						className="input input-bordered w-full"
						required
					/>
					<input
						type="text"
						name="idCard"
						value={input.idCard}
						onChange={hdlChange}
						placeholder="ID Card (optional)"
						className="input input-bordered w-full"
					/>
					<select
						name="clinicId"
						value={input.clinicId || ""}
						onChange={hdlChange}
						className="select select-bordered w-full"
					>
						<option value="">Select Clinic</option>
						{clinics.map((clinic) => (
							<option key={clinic.id} value={clinic.id}>
								{clinic.name}
							</option>
						))}
					</select>
					<input
						type="password"
						name="password"
						value={input.password}
						onChange={hdlChange}
						placeholder="Password"
						className="input input-bordered w-full"
						required
					/>
					<input
						type="password"
						name="confirmPassword"
						value={input.confirmPassword}
						onChange={hdlChange}
						placeholder="Confirm Password"
						className="input input-bordered w-full"
						required
					/>
					<button
						type="submit"
						className="btn bg-green-700 text-white w-full hover:bg-green-600"
					>
						Create
					</button>
				</form>
			</div>
		</div>
	);
}

export default CreateUser;
