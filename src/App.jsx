import { Outlet } from "react-router";
import useUserStore from "./stores/userStore";
import Header from "./components/Header";
import HeaderGuest from "./components/HeaderGuest";
import SidebarMenu from "./components/Sidebar";

function App() {
	const user = useUserStore((state) => state.user);
	const logout = useUserStore((state) => state.logout);
	const dpHeader = user?.role ? <Header /> : <HeaderGuest />;
	const dpSidebar = user?.role === "ADMIN" ? <SidebarMenu /> : "";
	return (
		<div className="bg-slate-50">
			{dpHeader}
			<div className="flex items-center justify-between h-screen ">
				<div className="w-[260px] ">{dpSidebar}</div>
				<div className=" flex flex-1 justify-center">
					<main className=" relative flex flex-1 gap-2  pt-14 ">
						<Outlet />
					</main>
				</div>
				<div className="w-[260px] "></div>
			</div>
		</div>
	);
}

export default App;
