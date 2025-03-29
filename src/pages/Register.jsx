import React, { useState } from "react";
import { toast } from "react-toastify";
import useUserStore from "../stores/userStore";
import axios from "axios";
import { useNavigate } from "react-router";

function Register() {
	const initInput = {
		firstNameEn: "",
		lastNameEn: "",
		firstNameTh: "",
		lastNameTh: "",
		gender: "",
		email: "",
		phone: "",
		password: "",
		confirmPassword: "",
	};
	const [input, setInput] = useState(initInput);

	const [termOfUseAgreement, setTermOfUseAgreement] = useState(false);

	const hdlChange = (e) => {
		const { name, type, checked, value } = e.target;
		if (type === "checkbox") {
			setTermOfUseAgreement(checked);
		} else {
			setInput((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};
	const hdlClearInput = () => {
		setInput(initInput);
	};
	const navigate = useNavigate();
	const hdlNavigate = (route) => navigate(route);

	const hdlRegister = async (e) => {
		try {
			e.preventDefault();

			if (!termOfUseAgreement) {
				return toast.error("Please accept the Terms and Privacy Statement");
			}

			if (input.password !== input.confirmPassword) {
				return toast.error("Passwords do not match");
			}

			if (!Object.values(input).every((field) => field.trim())) {
				return toast.error("Please fill all fields");
			}

			const res = await axios.post("http://localhost:8000/auth/register", {
				...input,
				termOfUseAgreement,
			});
			hdlClearInput();
			hdlNavigate("/login");

			toast.success("Registration successful");
		} catch (error) {
			const errMsg = error.response?.data?.message || error.message;
			toast.error(errMsg);
		}
	};

	return (
		<div className="min-h-screen w-screen flex items-center flex-col bg-slate-50">
			<div className="w-full max-w-md p-6 flex flex-col items-center justify-center ">
				<div className="mb-6">
					<h2 className="text-3xl font-bold text-center text-slate-950">
						Create an account
					</h2>
				</div>

				<div className="bg-white rounded-lg shadow-md p-6 w-80">
					<form onSubmit={hdlRegister} className="space-y-4">
						<label className="input rounded-lg">
							<input
								type="text"
								required
								className="w-full p-3 rounded-lg"
								placeholder="Enter first name (English)"
								name="firstNameEn"
								value={input.firstNameEn}
								onChange={hdlChange}
							/>
						</label>

						<label className="input rounded-lg">
							<input
								type="text"
								required
								className="w-full p-3 rounded-lg"
								placeholder="Enter last name (English)"
								name="lastNameEn"
								value={input.lastNameEn}
								onChange={hdlChange}
							/>
						</label>

						<label className="input rounded-lg">
							<input
								type="text"
								required
								className="w-full p-3 rounded-lg"
								placeholder="กรอกชื่อ"
								name="firstNameTh"
								value={input.firstNameTh}
								onChange={hdlChange}
							/>
						</label>

						<label className="input rounded-lg">
							<input
								type="text"
								required
								className="w-full p-3 rounded-lg"
								placeholder="กรอกนามสกุล"
								name="lastNameTh"
								value={input.lastNameTh}
								onChange={hdlChange}
							/>
						</label>

						<label className="input rounded-lg">
							<select
								required
								className="w-full p-3 rounded-lg"
								name="gender"
								value={input.gender}
								onChange={hdlChange}
							>
								<option value="">Choose your gender</option>
								<option value="male">Male</option>
								<option value="female">Female</option>
								<option value="other">Other</option>
							</select>
						</label>

						<label className="input rounded-lg">
							<input
								type="email"
								required
								className="w-full p-3 rounded-lg"
								placeholder="Enter e-mail"
								name="email"
								value={input.email}
								onChange={hdlChange}
							/>
						</label>

						<label className="input rounded-lg">
							<input
								type="tel"
								required
								className="w-full p-3 rounded-lg"
								placeholder="Phone number"
								name="phone"
								value={input.phone}
								onChange={hdlChange}
							/>
						</label>

						<label className="input rounded-lg">
							<input
								type="password"
								required
								className="w-full p-3 rounded-lg"
								placeholder="Password"
								name="password"
								value={input.password}
								onChange={hdlChange}
							/>
						</label>

						<label className="input rounded-lg">
							<input
								type="password"
								required
								className="w-full p-3 rounded-lg"
								placeholder="Confirm password"
								name="confirmPassword"
								value={input.confirmPassword}
								onChange={hdlChange}
							/>
						</label>

						<label className="flex items-center space-x-2">
							<input
								type="checkbox"
								name="termOfUseAgreement"
								checked={termOfUseAgreement}
								onChange={hdlChange}
								className="checkbox border-slate-400   checked:text-green-900 checked:border-green-900 checked:border-2 "
							/>
							<span className="text-sm text-slate-400">
								I agree to the{" "}
								<a href="#" className="hover:underline hover:text-green-700">
									AM Smiles Dental Clinic Terms and Privacy Statement
								</a>
							</span>
						</label>

						<button
							type="submit"
							className="btn bg-green-900 text-white w-full py-3 rounded-lg hover:bg-green-700"
						>
							Create account
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}

export default Register;
