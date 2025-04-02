import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import useUserStore from "../stores/userStore";
import {
	format,
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	addDays,
	isSameMonth,
	isToday,
	addMinutes,
	setHours,
	setMinutes,
} from "date-fns";

function CalendarView() {
	const { token, user } = useUserStore();
	const navigate = useNavigate();

	const [clinics, setClinics] = useState([]);
	const [selectedClinicId, setSelectedClinicId] = useState(user?.clinicId);
	const [currentDate, setCurrentDate] = useState(new Date());
	const [highlightedDates, setHighlightedDates] = useState([]);
	const [selectedDate, setSelectedDate] = useState(
		format(new Date(), "yyyy-MM-dd")
	);
	const [services, setServices] = useState([]);
	const [rooms, setRooms] = useState([]);

	const months = Array.from({ length: 12 }, (_, i) =>
		format(new Date(2023, i), "MMMM")
	);
	const years = Array.from(
		{ length: 5 },
		(_, i) => new Date().getFullYear() - 2 + i
	);

	const fetchServices = async () => {
		if (!selectedClinicId) return;
		try {
			const month = currentDate.getMonth() + 1;
			const year = currentDate.getFullYear();
			const res = await axios.get(
				`http://localhost:8000/service/by-clinic?clinicId=${selectedClinicId}&month=${month}&year=${year}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			const all = res.data.services;
			const serviceDates = all.map((svc) =>
				format(new Date(svc.serviceStart), "yyyy-MM-dd")
			);
			setHighlightedDates([...new Set(serviceDates)]);
			setServices(all);
		} catch (err) {
			console.error("Failed to fetch services", err);
		}
	};

	const fetchRooms = async () => {
		if (!selectedClinicId) return;
		try {
			const res = await axios.get(
				`http://localhost:8000/room?clinicId=${selectedClinicId}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			console.log(res);
			setRooms(res.data.rooms.filter((r) => r.clinicId === selectedClinicId));
		} catch (err) {
			console.error("Failed to fetch rooms", err);
		}
	};

	const fetchClinics = async () => {
		try {
			const res = await axios.get("http://localhost:8000/clinic", {
				headers: { Authorization: `Bearer ${token}` },
			});
			setClinics(res.data.clinics);
			console.log(res);
		} catch (err) {
			console.error("Failed to fetch clinics", err);
		}
	};

	useEffect(() => {
		fetchClinics();
	}, []);

	useEffect(() => {
		fetchServices();
		fetchRooms();
	}, [currentDate, selectedClinicId]);

	const renderCalendar = () => {
		const monthStart = startOfMonth(currentDate);
		const monthEnd = endOfMonth(currentDate);
		const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
		const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

		const rows = [];
		let days = [];
		let day = startDate;

		while (day <= endDate) {
			for (let i = 0; i < 7; i++) {
				const formatted = format(day, "d");
				const fullDate = format(day, "yyyy-MM-dd");
				const isCurrentMonth = isSameMonth(day, monthStart);
				const isHighlighted = highlightedDates.includes(fullDate);
				const isCurrentDay = isToday(day);

				days.push(
					<div
						key={day}
						onClick={() => isCurrentMonth && setSelectedDate(fullDate)}
						className={`p-2 text-center rounded-lg text-sm cursor-pointer
							${!isCurrentMonth ? "text-gray-300" : ""}
							${isHighlighted ? "bg-green-200 font-bold text-green-900" : ""}
							${isCurrentDay ? "border border-green-500" : ""}
							${selectedDate === fullDate ? "bg-green-700 text-white" : ""}
							hover:bg-green-100`}
					>
						{formatted}
					</div>
				);
				day = addDays(day, 1);
			}
			rows.push(
				<div key={day.toISOString()} className="grid grid-cols-7 gap-2">
					{days}
				</div>
			);
			days = [];
		}
		return <div className="space-y-2">{rows}</div>;
	};

	const renderDailyTable = () => {
		const timeSlots = [];
		const start = setHours(setMinutes(new Date(), 0), 8);
		const end = setHours(setMinutes(new Date(), 30), 20);
		for (let t = start; t < end; t = addMinutes(t, 30)) {
			timeSlots.push(format(t, "HH:mm"));
		}

		const getServiceInSlot = (time, roomId) => {
			const slotDate = new Date(`${selectedDate}T${time}:00`);

			return services.find((svc) => {
				const start = new Date(svc.serviceStart);
				const end = new Date(svc.serviceEnd);

				return (
					svc.schedule.room.id === roomId &&
					format(start, "yyyy-MM-dd") === selectedDate &&
					slotDate >= start &&
					slotDate < end
				);
			});
		};
		return (
			<div className="mt-6">
				<h2 className="text-xl font-semibold mb-2">
					Schedule Table for {selectedDate}
				</h2>
				<div className="overflow-x-auto">
					<table className="table table-bordered w-full">
						<thead>
							<tr>
								<th className="w-24">Time</th>
								{rooms.map((room) => (
									<th key={room.id} className="text-center">
										Room {room.roomNumber}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{timeSlots.map((time) => (
								<tr key={time}>
									<td className="text-sm text-slate-600">{time}</td>
									{rooms.map((room) => {
										const svc = getServiceInSlot(time, room.id);
										return (
											<td
												key={room.id + time}
												className={`text-sm text-center cursor-pointer p-2 rounded-lg border hover:bg-slate-100 ${
													svc ? "bg-green-100" : "bg-slate-50 text-slate-400"
												}`}
												onClick={
													() =>
														svc
															? navigate(
																	`/schedule/${svc.schedule.id}/service/update/${svc.id}`
															  )
															: navigate(`/schedule`) //modal booking is coming soon
												}
											>
												{svc ? (
													<div>
														<p className="font-bold text-green-800">
															{svc.title} ({svc.schedule.admin.firstNameTh})
														</p>
														<p className="text-md font-bold">
															{svc.schedule.user.firstNameTh} (
															{svc.schedule.user.phone})
														</p>
														<span
															className={`badge badge-xs badge-warning mt-1`}
														>
															{svc.status}
														</span>
													</div>
												) : (
													<span>ว่าง</span>
												)}
											</td>
										);
									})}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		);
	};

	return (
		<div className="p-6 bg-slate-50 min-h-screen">
			<div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl font-bold">Clinic Calendar</h1>
					<div className="flex gap-2">
						<select
							className="select select-bordered"
							value={selectedClinicId}
							onChange={(e) => setSelectedClinicId(Number(e.target.value))}
						>
							{clinics.map((c) => (
								<option key={c.id} value={c.id}>
									{c.name}
								</option>
							))}
						</select>
						<select
							className="select select-bordered"
							value={currentDate.getMonth()}
							onChange={(e) => {
								const newDate = new Date(currentDate);
								newDate.setMonth(+e.target.value);
								setCurrentDate(newDate);
							}}
						>
							{months.map((m, i) => (
								<option key={i} value={i}>
									{m}
								</option>
							))}
						</select>
						<select
							className="select select-bordered"
							value={currentDate.getFullYear()}
							onChange={(e) => {
								const newDate = new Date(currentDate);
								newDate.setFullYear(+e.target.value);
								setCurrentDate(newDate);
							}}
						>
							{years.map((y) => (
								<option key={y} value={y}>
									{y}
								</option>
							))}
						</select>
					</div>
				</div>

				<div className="grid grid-cols-7 text-center font-semibold text-slate-600 mb-2">
					{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
						<div key={d}>{d}</div>
					))}
				</div>

				{renderCalendar()}
				{renderDailyTable()}
			</div>
		</div>
	);
}

export default CalendarView;
