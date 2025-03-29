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
		<div className="bg-slate-50 min-h-screen">
			<div>{dpHeader}</div>
			<div className="flex items-center justify-between min-h-screen bg-slate-50 ">
				<div className="w-[260px] ">{dpSidebar}</div>
				<div className=" flex flex-1 min-h-screen justify-center bg-slate-50">
					<main className="flex flex-1 gap-2 min-h-screen  pt-14 bg-slate-50">
						<Outlet />
					</main>
				</div>
				<div className="w-[260px] "></div>
			</div>
		</div>
	);
}

export default App;
