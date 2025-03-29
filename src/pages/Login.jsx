import React, { useState } from "react";
import { toast } from "react-toastify";
import useUserStore from "../stores/userStore";
import NavigateBtn from "../components/NavigateBtn";
import { useNavigate } from "react-router";

function Login() {
	const login = useUserStore((state) => state.login);
	const [input, setInput] = useState({
		identity: "",
		password: "",
	});
	const navigate = useNavigate();

	const hdlChange = (e) => {
		setInput((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const hdlLogin = async (e) => {
		try {
			const { identity, password } = input;
			e.preventDefault();

			if (!identity.trim() || !password.trim()) {
				return toast.error("Please fill all fields");
			}
			let data = await login(input);
			navigate("/");
		} catch (error) {
			const errMsg =
				error.response?.data?.message ||
				error.response?.data?.error ||
				error.message;
			toast.error(errMsg);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center flex-col bg-slate-50 w-screen">
			<div className="w-full max-w-md p-6 flex flex-col items-center justify-center">
				<div className="mb-6 bg">
					<h2 className="text-3xl font-bold text-center text-slate-950">
						Sign in or create an account
					</h2>
				</div>

				<div className="bg-white rounded-lg shadow-md p-6 w-80">
					<form onSubmit={hdlLogin} className="space-y-4  ">
						<label className="input validator rounded-lg">
							<svg
								className="h-[1em] opacity-50"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
							>
								<g
									strokeLinejoin="round"
									strokeLinecap="round"
									strokeWidth="2.5"
									fill="none"
									stroke="currentColor"
								>
									<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
									<circle cx="12" cy="7" r="4"></circle>
								</g>
							</svg>

							<input
								type="text"
								required
								className=" w-full p-3 mt-0.5 rounded-lg"
								placeholder="Enter e-mail or phone number"
								minLength="3"
								name="identity"
								value={input.identity}
								onChange={hdlChange}
							/>
						</label>
						<p className="validator-hint hidden ">
							Must be Phone number or email.
						</p>

						<label className="input validator rounded-lg">
							<svg
								className="h-[1em] opacity-50"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
							>
								<g
									strokeLinejoin="round"
									strokeLinecap="round"
									strokeWidth="2.5"
									fill="none"
									stroke="currentColor"
								>
									<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
									<circle
										cx="16.5"
										cy="7.5"
										r=".5"
										fill="currentColor"
									></circle>
								</g>
							</svg>

							<input
								type="password"
								required
								placeholder="Enter password"
								className=" w-full p-3 rounded-lg"
								minLength="6"
								name="password"
								value={input.password}
								onChange={hdlChange}
								title="Must be more than 6 characters"
							/>
						</label>
						<button
							type="submit"
							className="btn bg-green-900 text-white w-full py-3 rounded-lg hover:bg-green-700"
						>
							Login
						</button>
						<p className="text-center text-sm text-gray-500 cursor-pointer hover:underline hover:text-green-700">
							<a href="#">Forgot password?</a>
						</p>
					</form>
				</div>
			</div>

			<div className="mt-6 text-center max-w-150">
				<p className="text-lg font-bold text-green-900 mb-2">
					JOIN AM SMILES DENTAL CLINIC
				</p>
				<p className="text-sm text-gray-600 mb-4">
					Stay on top of your dental health with seamless treatment tracking,
					real-time updates on the latest procedures, and exclusive access to
					special offers and events. Join now and enjoy a personalized,
					hassle-free experience—completely FREE!
				</p>
				{/* <button
					className="btn bg-blend-lighten border-green-900 text-green-900 py-2 px-4 rounded-lg hover:bg-yellow-500 hover:text-slate-950 hover:border-slate-950"
					onClick={() => useNavigate("/register")}
				>
					Join now
				</button> */}
				<NavigateBtn
					route="/register"
					className="btn bg-blend-lighten border-green-900 text-green-900 py-2 px-4 rounded-lg hover:bg-yellow-500 hover:text-slate-950 hover:border-slate-950"
					text="Join now"
				/>
			</div>

			{/* <dialog id="register-form" className="modal">
				<div className="modal-box">
					<button
						className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
						onClick={() => document.getElementById("register-form").close()}
					>
						✕
					</button>
					Add your Register component here 
				</div>
			</dialog> */}
		</div>
	);
}

export default Login;
