import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useUserStore from "../stores/userStore";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { defaultAvatar } from "../icons";
function Me() {
	const [input, setInput] = useState({
		firstNameEn: "",
		lastNameEn: "",
		firstNameTh: "",
		lastNameTh: "",
		email: "",
		phone: "",
		createdAt: "",
		image: null,
	});
	const user = useUserStore((state) => state.user);
	const token = useUserStore((state) => state.token);
	const navigate = useNavigate();

	useEffect(() => {
		const getUserProfile = async () => {
			try {
				const res = await axios.get(`http://localhost:8000/auth/me`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const userData = res.data.user;

				setInput({
					firstNameEn: userData.firstNameEn || "",
					lastNameEn: userData.lastNameEn || "",
					firstNameTh: userData.firstNameTh || "",
					lastNameTh: userData.lastNameTh || "",
					email: userData.email || "",
					phone: userData.phone || "",
					createdAt: userData.createdAt || "",
					image: userData.image || null,
				});
			} catch (error) {
				const errMsg = error.response?.data?.message || error.message;
				toast.error(errMsg || "Failed to load profile data");
			} finally {
				setLoading(false);
			}
		};

		getUserProfile();
	}, [user?.id, navigate]);

	const updatePath = user.role === "USER" ? "user" : "admin";

	return (
		<div className=" w-full flex items-center justify-center flex-col bg-none p-0 m-0">
			<div className="w-full bg-slate-100 p-0 flex flex-col items-center justify-center">
				<div className="bg-none rounded-lg p-2 w-full">
					<div className="space-y-4">
						<div>
							<h2 className="text-xl font-normal text-center text-slate-900 mb-1">
								{`${input.firstNameEn} ${input.lastNameEn} (${input.firstNameTh} ${input.lastNameTh})`}
							</h2>

							<hr className="border-slate-300 mb-1" />

							<div className="mb-2">
								<span className="text-slate-700">Email:</span>
								<p className="w-full p-1 mt-1 border border-slate-300 rounded-lg bg-slate-50 text-blue-600">
									{input.email}
								</p>
							</div>

							<div className="mb-1">
								<span className="text-slate-700">Phone:</span>
								<p className="w-full p-1 mt-1 border border-slate-300 rounded-lg bg-slate-50">
									{input.phone}
								</p>
							</div>

							<div className="mb-0">
								<span className="text-slate-700">createdAt:</span>
								<p className="w-full p-1 mt-1 border border-slate-300 rounded-lg bg-slate-50">
									{input.createdAt
										? new Date(input.createdAt).toLocaleString("en-US", {
												year: "numeric",
												month: "long",
												day: "numeric",
												hour: "numeric",
												minute: "numeric",
												hour12: true,
										  })
										: "Not available"}
								</p>
							</div>
						</div>

						<Link
							to={`/${updatePath}/update/${user.id}`}
							className="btn h-fit bg-slate-100 border-2 border-green-800 text-green-950 w-full py-1 rounded-lg hover:bg-green-800 hover:text-slate-50"
						>
							Edit information
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Me;
