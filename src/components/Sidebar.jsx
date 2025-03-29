import React, { useState } from "react";
import { Link } from "react-router";

function SidebarMenu() {
	const [isAdminOpen, setIsAdminOpen] = useState(true);
	const [isUserOpen, setIsUserOpen] = useState(true);
	const [isTreatmentOpen, setIsTreatmentOpen] = useState(true);

	return (
		<div className="fixed z-30  top-12 h-full  pt-6  w-[260px] bg-slate-100 ">
			<ul className="menu w-full  h-full text-[18px]">
				<li>
					<details className="w-full" open={isAdminOpen}>
						<summary
							className="w-full"
							onClick={() => setIsAdminOpen(!isAdminOpen)}
						>
							Admin and Doctor control
						</summary>
						<ul className="">
							<li
								className={`rounded-lg hover:bg-green-700 hover:text-slate-50 ${
									location.pathname === "/admin" ||
									location.pathname === `/admin/${!NaN}` ||
									location.pathname === `/admin/update/${!NaN}` ||
									location.pathname === `/admin/delete/${!NaN}`
										? "bg-green-700 text-slate-50"
										: ""
								}`}
							>
								<Link to="/admin">Find and Edit</Link>
							</li>
							<li
								className={`hover:bg-green-700 hover:text-slate-50 ${
									location.pathname === "/admin/create"
										? "bg-green-700 text-slate-50"
										: ""
								}`}
							>
								<Link className="w-full" to="/admin/create">
									Create
								</Link>
							</li>
						</ul>
					</details>
				</li>
				<li>
					<details open={isUserOpen}>
						<summary onClick={() => setIsUserOpen(!isUserOpen)}>
							Patients control
						</summary>
						<ul>
							<li
								className={`rounded-lg hover:bg-green-700 hover:text-slate-50 ${
									location.pathname === "/user" ||
									location.pathname === `/user/${!NaN}` ||
									location.pathname === `/user/update/${!NaN}` ||
									location.pathname === `/user/delete/${!NaN}`
										? "bg-green-700 text-slate-50"
										: ""
								}`}
							>
								<Link to="/user">Find and Edit</Link>
							</li>
							<li
								className={`rounded-lg hover:bg-green-700 hover:text-slate-50 ${
									location.pathname === "/user/create"
										? "bg-green-700 text-slate-50"
										: ""
								}`}
							>
								<Link to="/user/create">Create</Link>
							</li>
						</ul>
					</details>
				</li>
				<li>
					<details open={isTreatmentOpen}>
						<summary onClick={() => setIsTreatmentOpen(!isTreatmentOpen)}>
							Treatment and Service control
						</summary>
						<ul>
							<li
								className={`rounded-lg hover:bg-green-700 hover:text-slate-50 ${
									location.pathname === "/schedule" ||
									location.pathname === `/schedule//${!NaN}` ||
									location.pathname === `/schedule/update/${!NaN}` ||
									location.pathname === `/schedule/delete/${!NaN}`
										? "bg-green-700 text-slate-50"
										: ""
								}`}
							>
								<Link to="/schedule">Find and Edit</Link>
							</li>
							<li
								className={`rounded-lg hover:bg-green-700 hover:text-slate-50 ${
									location.pathname === "/schedule/create"
										? "bg-green-700 text-slate-50"
										: ""
								}`}
							>
								<Link to="/schedule/create">Create</Link>
							</li>
						</ul>
					</details>
				</li>
			</ul>
		</div>
	);
}

export default SidebarMenu;
