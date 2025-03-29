import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import useUserStore from "../../stores/userStore";

function AppointmentBooking() {
	const { token } = useUserStore();
	const navigate = useNavigate();
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [availableSlots, setAvailableSlots] = useState([]);
	const [selectedSlots, setSelectedSlots] = useState([]);

	useEffect(() => {
		const fetchSlots = async () => {
			try {
				const res = await axios.get(
					`http://localhost:8000/service?date=${
						selectedDate.toISOString().split("T")[0]
					}`,
					{ headers: { Authorization: `Bearer ${token}` } }
				);

				setAvailableSlots(res.data.slots || []); // [{ startTime, endTime, userId/null, patientName }]
			} catch (err) {
				toast.error("Failed to load slots");
			}
		};
		fetchSlots();
	}, [selectedDate, token]);

	const generateTimeSlots = () => {
		const slots = [];
		const start = new Date(selectedDate.setHours(9, 0, 0, 0));
		for (let i = 0; i < 20; i++) {
			const slotStart = new Date(start.getTime() + i * 30 * 60 * 1000);
			const slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000);
			slots.push({ start: slotStart, end: slotEnd });
		}
		return slots;
	};

	const handleSlotToggle = (slot) => {
		const exists = selectedSlots.find(
			(s) => s.start.getTime() === slot.start.getTime()
		);
		if (exists) {
			setSelectedSlots((prev) =>
				prev.filter((s) => s.start.getTime() !== slot.start.getTime())
			);
		} else {
			setSelectedSlots((prev) => [...prev, slot]);
		}
	};

	const handleContinue = () => {
		if (selectedSlots.length === 0)
			return toast.error("Please select at least one slot");
		const sorted = selectedSlots.sort((a, b) => a.start - b.start);
		navigate("/appointment/confirm", {
			state: { date: selectedDate, slots: sorted },
		});
	};

	const isSlotBooked = (slot) => {
		return availableSlots.some((s) => {
			const sStart = new Date(s.startTime).getTime();
			const sEnd = new Date(s.endTime).getTime();
			return slot.start.getTime() >= sStart && slot.end.getTime() <= sEnd;
		});
	};

	const timeSlots = generateTimeSlots();

	return (
		<div className="p-6 min-h-screen bg-slate-50">
			<h1 className="text-2xl font-bold mb-4">Book an Appointment</h1>
			<Calendar
				onChange={setSelectedDate}
				value={selectedDate}
				className="mb-6 border rounded"
			/>

			<div className="grid grid-cols-3 gap-2">
				{timeSlots.map((slot, idx) => {
					const isBooked = isSlotBooked(slot);
					const isSelected = selectedSlots.some(
						(s) => s.start.getTime() === slot.start.getTime()
					);
					return (
						<button
							key={idx}
							disabled={isBooked}
							onClick={() => handleSlotToggle(slot)}
							className={`p-2 border rounded text-sm text-left ${
								isBooked
									? "bg-red-200 cursor-not-allowed"
									: isSelected
									? "bg-green-300"
									: "bg-white hover:bg-slate-100"
							}`}
						>
							{slot.start.toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							})}{" "}
							-
							{slot.end.toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							})}
							{isBooked && <div className="text-xs text-red-700">Booked</div>}
						</button>
					);
				})}
			</div>

			<div className="mt-6 flex justify-end">
				<button
					onClick={handleContinue}
					className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600"
				>
					Continue
				</button>
			</div>
		</div>
	);
}

export default AppointmentBooking;
