import React from "react";
import { Link } from "react-router";
import useUserStore from "../stores/userStore";
import { AmSmilesLogo, LocationIcon } from "../icons";
import Avatar from "./Avatar";
import Me from "../components/Me";

function Header() {
	const logout = useUserStore((state) => state.logout);
	const user = useUserStore((state) => state.user);

	const path = user.role === "USER" ? "user" : "admin";

	return (
		<header className="flex justify-between items-center px-4 h-14 w-full bg-green-900 text-slate-50 fixed top-0 z-10 shadow-md">
			<div className="flex flex-1 items-center pl-15 h-full">
				<AmSmilesLogo className="w-18 h-full" />
			</div>

			<div className="flex flex-1 gap-8 justify-center h-full items-center">
				<Link
					to="/"
					className={`flex h-full items-center hover:border-b-2 transition-colors ${
						location.pathname === "/" ? "border-b-2 border-slate-50" : ""
					}`}
				>
					HOME
				</Link>

				<Link
					to="/schedule"
					className={`flex h-full items-center hover:border-b-2 transition-colors ${
						location.pathname === "/schedule"
							? "border-b-2 border-slate-50"
							: ""
					}`}
				>
					APPOINTMENT
				</Link>

				<Link
					to="/news"
					className={`flex h-full items-center hover:border-b-2 transition-colors ${
						location.pathname === "/news" ? "border-b-2 border-slate-50" : ""
					}`}
				>
					NEWS
				</Link>
			</div>

			<div className="flex flex-1 justify-end items-center gap-4 ">
				<Link
					to="/find-clinic"
					className="flex items-center gap-1  transition-colors hover:text-yellow-500 hover:fill-yellow-500"
				>
					<LocationIcon className="h-5 fill-current" />
					<span>Find clinic</span>
				</Link>

				<div className="dropdown dropdown-end ">
					<div
						tabIndex={0}
						role="button"
						className="btn btn-ghost h-12 border-none hover:bg-transparent  hover:text-yellow-600 hover:border-none"
					>
						<Avatar
							className="w-9 h-9 rounded-full bg-yellow-600 ring-offset-green-700 ring ring-offset-2 ring-white"
							menu={true}
							imgSrc={user?.image}
						/>
					</div>
					<ul
						tabIndex={0}
						className="dropdown-content menu bg-slate-50 rounded-box z-[1] w-60 p-2 shadow text-green-950 rounded"
					>
						<div>
							<Me />
						</div>
						<div className="divider my-1"></div>
						<li className="hover:bg-green-700 hover:text-slate-50 rounded ">
							<Link to={`/${path}/${user.id}`}>Profile</Link>
						</li>

						<li
							className="hover:bg-slate-300 hover:border-red-500 hover:text-red-400 rounded"
							onClick={logout}
						>
							<a>Logout</a>
						</li>
					</ul>
				</div>
			</div>
		</header>
	);
}

export default Header;
