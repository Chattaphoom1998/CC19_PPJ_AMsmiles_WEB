import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useUserStore from "../../stores/userStore";
import { useNavigate } from "react-router";

function UserList() {
	const [users, setUsers] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const { user, token } = useUserStore();
	const navigate = useNavigate();

	useEffect(() => {
		if (user.role !== "ADMIN" && user.role !== "DOCTOR") {
			toast.error("Forbidden. Only admins can view user list.");
			return navigate("/account");
		}

		const fetchUsers = async () => {
			try {
				const res = await axios.get("http://localhost:8000/user/list", {
					headers: { Authorization: `Bearer ${token}` },
				});
				const userList = res.data.userList || [];
				setUsers(userList);
				setFilteredUsers(userList);
			} catch (err) {
				toast.error(err.response?.data?.message || "Failed to load users");
			} finally {
				setLoading(false);
			}
		};

		fetchUsers();
	}, [token, user.role, navigate]);

	const handleSearch = (e) => {
		const query = e.target.value.toLowerCase();
		setSearchQuery(query);
		const filtered = users.filter((u) => {
			const fullNameEn = `${u.firstNameEn} ${u.lastNameEn}`.toLowerCase();
			const fullNameTh = `${u.firstNameTh} ${u.lastNameTh}`.toLowerCase();
			return (
				fullNameEn.includes(query) ||
				fullNameTh.includes(query) ||
				(u.phone || "").includes(query) ||
				(u.email || "").toLowerCase().includes(query)
			);
		});
		setFilteredUsers(filtered);
	};

	if (loading)
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-50">
				Loading...
			</div>
		);

	return (
		<div className="min-h-screen w-full flex flex-col items-center bg-slate-50">
			<div className="w-full px-6">
				<div className="flex justify-center w-full max-w-lg mx-auto my-6 fixed top-14 left-100 right-100 z-10 rounded-lg">
					<input
						type="text"
						value={searchQuery}
						onChange={handleSearch}
						placeholder="Search by name, phone, or email..."
						className="input input-bordered w-full max-w-sm"
					/>
				</div>
				<h1 className="text-2xl font-bold text-slate-900 mb-12">User List</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{filteredUsers.map((u) => (
						<div
							key={u.id}
							className="card bg-slate-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow hover:bg-green-800 hover:text-white"
							onClick={() => navigate(`/user/${u.id}`)}
						>
							<figure>
								<div className="w-full h-60 bg-slate-200 rounded-t-lg flex items-center justify-center">
									<span className="text-slate-500 text-sm font-medium">
										_Profile
									</span>
								</div>
							</figure>
							<div className="card-body p-4">
								<h2 className="card-title text-lg font-medium text-current">
									{u.firstNameEn} {u.lastNameEn}
								</h2>
								<p className="text-sm text-current">Phone: {u.phone}</p>
								<p className="text-sm text-current">Email: {u.email}</p>
							</div>
						</div>
					))}
				</div>
				{filteredUsers.length === 0 && !loading && (
					<p className="text-slate-700 text-center mt-4">No users found.</p>
				)}
			</div>
		</div>
	);
}

export default UserList;
