import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import useUserStore from "../../stores/userStore";
import { toast } from "react-toastify";
import { Pencil, PlusCircle } from "lucide-react";

function ScheduleDetail() {
	const { id } = useParams();
	const { token, user } = useUserStore();
	const [schedule, setSchedule] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await axios.get(`http://localhost:8000/schedule/${id}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setSchedule(res.data.schedule);
			} catch (err) {
				toast.error("Failed to fetch treatment details");
			}
		};
		fetchData();
	}, [id, token]);
	console.log(schedule);

	if (!schedule)
		return (
			<div className="min-h-screen flex items-center justify-center">
				Loading...
			</div>
		);

	return (
		<div className="min-h-screen bg-slate-50 px-6 py-10">
			{/* === Treatment Card === */}
			<div className="card bg-white p-6 rounded-lg shadow-md mb-8 relative">
				{user.role !== "USER" ? (
					<>
						<div className="absolute top-4 right-4">
							<Pencil
								className="text-slate-500 hover:text-green-700 cursor-pointer"
								onClick={() => navigate(`/schedule/update/${schedule.id}`)}
							/>
						</div>
					</>
				) : (
					""
				)}
				<h2 className="text-xl font-bold mb-4">{schedule.title}</h2>
				<p className="text-slate-700 mb-2">
					<b>Doctor:</b> {schedule.admin.firstNameEn}{" "}
					{schedule.admin.lastNameEn} ({schedule.admin.doctorInfo?.department})
				</p>
				<p className="text-slate-700 mb-2">
					<b>Patient:</b> {schedule.user.firstNameEn} {schedule.user.lastNameEn}
				</p>
				<p className="text-slate-700 mb-2">
					<b>Status:</b>{" "}
					<span
						className={`font-semibold px-2 py-1 rounded ${
							schedule.status === "PENDING"
								? "bg-yellow-300 text-yellow-900"
								: "bg-green-300 text-green-900"
						}`}
					>
						{schedule.status}
					</span>
				</p>
				<p className="text-slate-700 mb-2">
					<b>Description:</b> {schedule.description || "-"}
				</p>
				<p className="text-slate-700">
					<b>Room:</b> {schedule.room?.roomNumber} -{" "}
					{schedule.room?.description}
				</p>
			</div>

			{/* === Service Section Header === */}
			<div className="flex justify-between items-center mb-4">
				<h3 className="text-lg font-semibold text-slate-800">Services</h3>
				{user.role !== "USER" ? (
					<>
						<button
							className="btn btn-sm bg-green-800 text-white hover:bg-green-700"
							onClick={() => navigate(`service/create`)}
						>
							<PlusCircle size={18} className="mr-1" /> Add Service
						</button>
					</>
				) : (
					""
				)}
			</div>

			{/* === Service Cards === */}
			{schedule.service
				.slice()
				.sort((a, b) => new Date(b.serviceStart) - new Date(a.serviceStart))
				.map((svc) => (
					<div
						key={svc.id}
						className="card bg-white p-4 rounded-lg shadow mb-4 cursor-pointer hover:bg-slate-100"
						onClick={() =>
							navigate(`/schedule/${schedule.id}/service/update/${svc.id}`)
						}
					>
						<h4 className="font-bold mb-2">{svc.title || "(no title)"}</h4>
						<p className="text-sm text-slate-700 mb-1">
							<b>Date:</b>{" "}
							{new Date(svc.serviceStart).toLocaleDateString("th-TH")}
						</p>
						<p className="text-sm text-slate-700 mb-1">
							<b>Time:</b>{" "}
							{new Date(svc.serviceStart).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							})}{" "}
							-{" "}
							{new Date(svc.serviceEnd).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</p>
						<p className="text-sm text-slate-700 mb-1">
							<b>Status:</b> {svc.status}
						</p>
						{svc.description && (
							<p className="text-sm text-slate-600">{svc.description}</p>
						)}
					</div>
				))}
		</div>
	);
}

export default ScheduleDetail;
