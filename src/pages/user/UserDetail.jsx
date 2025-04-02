import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useUserStore from "../../stores/userStore";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { ChevronLeft } from "lucide-react";

function UserDetail() {
	const [userData, setUserData] = useState(null);
	const [loading, setLoading] = useState(true);
	const { user, token } = useUserStore();
	const navigate = useNavigate();
	const { id } = useParams();

	useEffect(() => {
		if (!user?.id) return navigate("/login");
		if (user.role !== "ADMIN" && user.id !== +id && user.role !== "DOCTOR") {
			toast.error("Forbidden. Only admins can view user details.");
			return navigate("/user");
		}

		const fetchUser = async () => {
			try {
				const res = await axios.get(`http://localhost:8000/user/${id}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setUserData(res.data.user);
			} catch (err) {
				toast.error(err.response?.data?.message || "Failed to load user data");
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, [id, token, user, navigate]);

	if (loading)
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-50">
				Loading...
			</div>
		);

	if (!userData) return null;

	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
			<div className="fixed left-75 top-25 z-30">
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
							{`${userData.firstNameEn || "undefined"} ${
								userData.lastNameEn || "undefined"
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
								<strong>Name (English):</strong> {userData.firstNameEn}{" "}
								{userData.lastNameEn}
							</p>
							<p className="text-slate-700">
								<strong>Name (Thai):</strong> {userData.firstNameTh}{" "}
								{userData.lastNameTh}
							</p>
							<p className="text-slate-700">
								<strong>Email:</strong> {userData.email}
							</p>
							<p className="text-slate-700">
								<strong>Phone:</strong> {userData.phone}
							</p>
							<p className="text-slate-700">
								<strong>ID Card:</strong> {userData.idCard || "-"}
							</p>
							<p className="text-slate-700">
								<strong>Clinic:</strong> {userData.clinic?.name || "None"}
							</p>
							<p className="text-slate-700">
								<strong>Role:</strong> {userData.role || "USER"}
							</p>
						</div>

						<div className="flex gap-4 justify-end">
							<button
								onClick={() => navigate(`/user/update/${id}`)}
								className="btn bg-green-800 text-white hover:bg-green-700"
							>
								Update
							</button>
							<button
								onClick={() => navigate(`/user/delete/${id}`)}
								className="btn border-2 border-slate-600 text-slate-600 hover:text-red-600 hover:border-red-600 hover:bg-slate-200"
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

export default UserDetail;
