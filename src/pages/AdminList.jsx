import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useUserStore from "../stores/userStore";
import axios from "axios";
import { useNavigate } from "react-router";

function AdminList() {
	const [admins, setAdmins] = useState([]);
	const [filteredAdmins, setFilteredAdmins] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const { user, token } = useUserStore();
	const navigate = useNavigate();

	useEffect(() => {
		if (user.role !== "ADMIN") {
			toast.error("Forbidden. Only admins can view admin list.");
			return navigate("/account");
		}

		const getAdmins = async () => {
			try {
				const response = await axios.get(`http://localhost:8000/admin/list`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setAdmins(response.data.cleanedAdminList || []);
				setFilteredAdmins(response.data.cleanedAdminList || []);
			} catch (error) {
				toast.error(error.response?.data?.message || "Failed to load admins");
			} finally {
				setLoading(false);
			}
		};
		getAdmins();
	}, [user, token, navigate]);

	const hdlSearch = (e) => {
		const query = e.target.value.toLowerCase();
		setSearchQuery(query);
		const filtered = admins.filter((admin) => {
			const fullNameEn = `${admin.firstNameEn || ""} ${
				admin.lastNameEn || ""
			}`.toLowerCase();
			const fullNameTh = `${admin.firstNameTh || ""} ${
				admin.lastNameTh || ""
			}`.toLowerCase();
			return (
				fullNameEn.includes(query) ||
				fullNameTh.includes(query) ||
				(admin.phone || "").toLowerCase().includes(query) ||
				(admin.email || "").toLowerCase().includes(query)
			);
		});
		setFilteredAdmins(filtered);
	};

	if (loading)
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-50">
				Loading...
			</div>
		);

	return (
		<div className="min-h-screen w-full flex flex-col  items-center bg-slate-50 ">
			<div className="w-full px-6">
				<div className="flex justify-center w-full max-w-lg mx-auto my-6 sticky top-16 z-10  rounded-lg">
					<input
						type="text"
						value={searchQuery}
						onChange={hdlSearch}
						placeholder="Search by name, phone, or email..."
						className="w-full max-w-md p-2 border shadow-md  border-slate-300 rounded-md bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-800"
					/>
				</div>
				<h1 className="text-2xl font-bold text-slate-900 mb-12 ">
					Admin & Doctor List
				</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
					{filteredAdmins.map((admin) => (
						<div
							key={admin.id}
							className="card bg-slate-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow hover:bg-green-800 hover:text-slate-50"
							onClick={() => navigate(`/admin/${admin.id}`)}
						>
							<figure>
								<div className="w-full h-60 bg-slate-200 rounded-t-lg flex items-center justify-center">
									<span className="text-slate-500 text-sm font-medium">
										_Profile
									</span>
								</div>
							</figure>
							<div className="card-body p-4 ">
								<h2 className="card-title text-lg font-medium text-current">
									{`${admin.firstNameEn || "undefined"} ${
										admin.lastNameEn || "undefined"
									}`}
								</h2>
								<p className="text-current text-sm">
									Role: {admin.role?.role || "N/A"}
								</p>
							</div>
						</div>
					))}
				</div>
				{filteredAdmins.length === 0 && !loading && (
					<p className="text-slate-700 text-center mt-4">
						No admins or doctors found.
					</p>
				)}
			</div>
		</div>
	);
}

export default AdminList;
