import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import axios from "axios";
import useUserStore from "../../stores/userStore";
import { Pencil, PlusCircle } from "lucide-react";

function ScheduleList() {
	const { token, user } = useUserStore();
	const [schedules, setSchedules] = useState([]);
	const [filteredSchedules, setFilteredSchedules] = useState([]);
	const [statusFilter, setStatusFilter] = useState("ALL");
	const [searchQuery, setSearchQuery] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const fetchSchedules = async () => {
			try {
				const res = await axios.get("http://localhost:8000/schedule/list", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setSchedules(res.data.scheduleList);
				setFilteredSchedules(res.data.scheduleList);
			} catch (err) {
				toast.error("Failed to load schedule list");
			}
		};
		fetchSchedules();
	}, [token]);

	const hdlSearch = (e) => {
		const q = e.target.value.toLowerCase();
		setSearchQuery(q);
		filterAndSearch(statusFilter, q);
	};

	const filterAndSearch = (status, query) => {
		let filtered = schedules;
		if (status !== "ALL") {
			filtered = filtered.filter(
				(item) => item.status.toLowerCase() === status.toLowerCase()
			);
		}
		if (query) {
			filtered = filtered.filter((item) => {
				const doctorName = `${item.admin?.firstNameEn || ""} ${
					item.admin?.lastNameEn || ""
				}`.toLowerCase();
				const userName = `${item.user?.firstNameEn || ""} ${
					item.user?.lastNameEn || ""
				}`.toLowerCase();
				const treatmentTitle = (item.title || "").toLowerCase();
				return (
					doctorName.includes(query) ||
					userName.includes(query) ||
					treatmentTitle.includes(query)
				);
			});
		}
		setFilteredSchedules(filtered);
	};

	const handleStatusChange = (e) => {
		const newStatus = e.target.value;
		setStatusFilter(newStatus);
		filterAndSearch(newStatus, searchQuery);
	};

	return (
		<div className="min-h-screen bg-slate-50 px-6">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold text-slate-900">Treatment List</h1>
				{user.role !== "USER" ? (
					<>
						<button
							onClick={() => navigate("/schedule/create")}
							className="btn btn-sm bg-green-800 text-white hover:bg-green-700"
						>
							<PlusCircle className="mr-1" size={18} /> New Treatment
						</button>
					</>
				) : (
					""
				)}
			</div>
			<div className="flex justify-center w-full max-w-lg mx-auto my-6 fixed top-14 left-100 right-100 z-10  rounded-lg">
				<input
					type="text"
					value={searchQuery}
					onChange={hdlSearch}
					placeholder="Search by doctor, patient, or title"
					className="input input-bordered w-full max-w-sm"
				/>
			</div>

			<div className="flex justify-end mb-6 h-fit ">
				<select
					value={statusFilter}
					onChange={handleStatusChange}
					className="select select-bordered ml-auto py-1 w-fit h-fit "
				>
					<option value="ALL">All</option>
					<option value="PENDING">Pending</option>
					<option value="DONE">Done</option>
				</select>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredSchedules.map((item) => (
					<div
						key={item.id}
						className="card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer relative"
						onClick={() => navigate(`/schedule/${item.id}`)}
					>
						<div className="absolute top-2 right-2 z-5">
							<Pencil
								onClick={(e) => {
									e.stopPropagation();
									navigate(`/schedule/update/${item.id}`);
								}}
								className="text-slate-500 hover:text-green-700"
							/>
						</div>
						<div className="card-body">
							<h2 className="card-title text-lg font-bold">{item.title}</h2>
							<p className="text-slate-700 text-sm mb-1">
								<b>Doctor:</b> {item.admin?.firstNameEn}{" "}
								{item.admin?.lastNameEn} ({item.admin?.doctorInfo?.department})
							</p>
							<p className="text-slate-700 text-sm mb-1">
								<b>Patient:</b> {item.user?.firstNameEn} {item.user?.lastNameEn}
							</p>
							{item.service?.[0] && (
								<>
									<p className="text-slate-700 text-sm mb-1">
										<b>Service Date:</b>{" "}
										{new Date(item.service[0].serviceStart).toLocaleDateString(
											"th-TH"
										)}
									</p>
									<p className="text-slate-700 text-sm mb-1">
										<b>Time:</b>{" "}
										{new Date(item.service[0].serviceStart).toLocaleTimeString(
											[],
											{ hour: "2-digit", minute: "2-digit" }
										)}{" "}
										-{" "}
										{new Date(item.service[0].serviceEnd).toLocaleTimeString(
											[],
											{ hour: "2-digit", minute: "2-digit" }
										)}
									</p>
								</>
							)}
							<p className="w-fit">
								Status:{" "}
								<span
									className={`text-sm font-semibold px-2 py-1 rounded w-fit ${
										item.status === "PENDING"
											? "bg-yellow-300 text-yellow-900"
											: item.status === "DONE"
											? "bg-green-300 text-green-900"
											: "bg-slate-200 text-slate-800"
									}`}
								>
									{item.status.toUpperCase()}
								</span>
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default ScheduleList;
