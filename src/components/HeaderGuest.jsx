import React from "react";
import { Link } from "react-router";
import useUserStore from "../stores/userStore";
import { AmSmilesLogo, LocationIcon } from "../icons";
import NavigateBtn from "./NavigateBtn";

function HeaderGuest() {
	const logout = useUserStore((state) => state.logout);
	const user = useUserStore((state) => state.user);
	console.log(user);

	return (
		<header className="flex justify-between items-center px-4 h-14 w-full bg-green-900 text-slate-50 fixed top-0 z-10 shadow-md">
			<div className="flex flex-1 items-center gap-2 pl-15">
				<Link to="/">
					<AmSmilesLogo className="w-18" />
				</Link>
			</div>

			<div className="flex flex-1 gap-8 justify-center h-full items-center"></div>

			<div className="flex flex-1 justify-end items-center gap-4 ">
				<Link
					to="/find-clinic"
					className="flex items-center gap-1  transition-colors hover:text-yellow-500 hover:fill-yellow-500"
				>
					<LocationIcon className="h-5 fill-current" />
					<span>Find clinic</span>
				</Link>

				<NavigateBtn
					className="btn w-20 shadow-none bg-blend-lighten bg-green-700 border-green-900 text-slate-50 py-2 px-4 rounded-lg hover:bg-green-700 hover:text-slate-50 hover:border-green-600"
					route="/login"
					text="login"
				/>
				<NavigateBtn
					className="btn w-23 shadow-none bg-blend-lighten bg-yellow-500 border-slate-950 text-green-900 py-2 px-4 rounded-lg hover:bg-yellow-500 hover:text-slate-950 hover:border-slate-950"
					route="/register"
					text="Join now"
				/>
			</div>
		</header>
	);
}

export default HeaderGuest;
