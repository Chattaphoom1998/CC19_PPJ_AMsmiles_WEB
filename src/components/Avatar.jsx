import React from "react";
import defaultImg from "../assets/default-avatar.svg";
import { DropdownArrow } from "../icons";
import useUserStore from "../stores/userStore";

function Avatar(props) {
	const { imgSrc, menu, ...restProps } = props;
	const user = useUserStore((state) => state.user);
	return (
		<div className="avatar items-center cursor-pointer flex justify-between w-auto">
			<div {...restProps}>
				<img src={imgSrc ? imgSrc : defaultImg} alt="avatar" />
			</div>
			<div className="h-10 w-30">
				<p>
					{user.firstNameEn} {user.lastNameEn.charAt(0)}.
				</p>
				<p className="text-xs">{user.email.substring(0, 15)}...</p>
			</div>
			{menu && (
				<DropdownArrow className="absolute -bottom-1 -right-3 w-6 hover:fill-green-700" />
			)}
		</div>
	);
}

export default Avatar;
