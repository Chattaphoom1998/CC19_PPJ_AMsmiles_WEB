import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { Link, useLocation } from "react-router";

function SidebarMenu({ isOpen, onClose }) {
	const location = useLocation();
	const [isAdminOpen, setIsAdminOpen] = useState(true);
	const [isUserOpen, setIsUserOpen] = useState(true);
	const [isTreatmentOpen, setIsTreatmentOpen] = useState(true);

	const handleLinkClick = () => {
		if (onClose) onClose();
	};

	const navigate = useNavigate();

	return (
		<>
			{isOpen && (
				<div className="fixed inset-0 bg-black/30 z-40 " onClick={onClose} />
			)}

			<div
				className={`fixed z-50 top-14 h-full pt-6 w-[260px] bg-slate-50 transition-transform duration-300
		${isOpen ? "translate-x-0" : "-translate-x-full"}`}
			>
				<ul className="menu w-full h-full text-[18px]">
					{/* Admin Section */}
					<li>
						<details className="w-full" open={isAdminOpen}>
							<summary
								className="w-full cursor-pointer"
								onClick={() => setIsAdminOpen(!isAdminOpen)}
							>
								Admin and Doctor control
							</summary>
							<ul>
								<li
									className={`rounded hover:bg-green-700 hover:text-white ${
										location.pathname.startsWith("/admin") &&
										!location.pathname.includes("create")
											? "bg-green-700 text-white"
											: ""
									}`}
								>
									<Link to="/admin" onClick={handleLinkClick}>
										Find and Edit
									</Link>
								</li>
								<li
									className={`rounded hover:bg-green-700 hover:text-white ${
										location.pathname === "/admin/create"
											? "bg-green-700 text-white"
											: ""
									}`}
								>
									<Link to="/admin/create" onClick={handleLinkClick}>
										Create
									</Link>
								</li>
							</ul>
						</details>
					</li>

					{/* User Section */}
					<li>
						<details open={isUserOpen}>
							<summary onClick={() => setIsUserOpen(!isUserOpen)}>
								Patients control
							</summary>
							<ul>
								<li
									className={`rounded hover:bg-green-700 hover:text-white ${
										location.pathname.startsWith("/user") &&
										!location.pathname.includes("create")
											? "bg-green-700 text-white"
											: ""
									}`}
								>
									<Link to="/user" onClick={handleLinkClick}>
										Find and Edit
									</Link>
								</li>
								<li
									className={`rounded hover:bg-green-700 hover:text-white ${
										location.pathname === "/user/create"
											? "bg-green-700 text-white"
											: ""
									}`}
								>
									<Link to="/user/create" onClick={handleLinkClick}>
										Create
									</Link>
								</li>
							</ul>
						</details>
					</li>

					{/* Treatment Section */}
					<li>
						<details open={isTreatmentOpen}>
							<summary onClick={() => setIsTreatmentOpen(!isTreatmentOpen)}>
								Treatment and Service control
							</summary>
							<ul>
								<li
									className={`rounded hover:bg-green-700 hover:text-white ${
										location.pathname.startsWith("/schedule") &&
										!location.pathname.includes("create")
											? "bg-green-700 text-white"
											: ""
									}`}
								>
									<Link to="/schedule" onClick={handleLinkClick}>
										Find and Edit
									</Link>
								</li>
								<li
									className={`rounded hover:bg-green-700 hover:text-white ${
										location.pathname === "/schedule/create"
											? "bg-green-700 text-white"
											: ""
									}`}
								>
									<Link to="/schedule/create" onClick={handleLinkClick}>
										Create
									</Link>
								</li>
							</ul>
						</details>
					</li>
					<ul
						className={`rounded my-1 hover:bg-green-700 hover:text-white ${
							location.pathname === "/clinics" ? "bg-green-700 text-white" : ""
						}`}
					>
						<li>
							<Link to="/clinics" onClick={handleLinkClick}>
								Clinics control
							</Link>
						</li>
					</ul>
					<ul
						className={`rounded my-1 hover:bg-green-700 hover:text-white ${
							location.pathname === "/calendar" ? "bg-green-700 text-white" : ""
						}`}
					>
						<li>
							<Link to="/calendar" onClick={handleLinkClick}>
								Calendar
							</Link>
						</li>
					</ul>
				</ul>
			</div>
		</>
	);
}

export default SidebarMenu;
