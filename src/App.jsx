import { Outlet } from "react-router";
import useUserStore from "./stores/userStore";
import Header from "./components/Header";
import HeaderGuest from "./components/HeaderGuest";
import SidebarMenu from "./components/Sidebar";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

function App() {
	const user = useUserStore((state) => state.user);
	const logout = useUserStore((state) => state.logout);
	const dpHeader = user?.role ? <Header /> : <HeaderGuest />;
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const dpSidebar =
		user?.role !== "USER" ? (
			<>
				{/* ปุ่ม toggle sidebar */}
				<button
					onClick={() => setSidebarOpen((prev) => !prev)}
					className={`fixed top-16 left-4 z-50 bg-white p-2 rounded shadow border border-slate-300 hover:cursor-pointer hover:bg-slate-200 transition-transform duration-300 ${
						sidebarOpen ? "translate-x-64" : "translate-x-0"
					}`}
				>
					{sidebarOpen ? (
						<X size={24} />
					) : (
						<div className="flex gap-2 font-bold items-center">
							<Menu size={24} />
							<p className="text-gray-900/[80%] text-sm">Admin controller</p>
						</div>
					)}
				</button>

				<SidebarMenu
					isOpen={sidebarOpen}
					onClose={() => setSidebarOpen(false)}
				/>
			</>
		) : null;

	return (
		<div className="bg-slate-50 min-h-screen">
			<div>{dpHeader}</div>
			<div className="min-h-screen bg-slate-50">
				{dpSidebar}
				<div className="flex-1 min-h-screen pt-14">
					<main className="p-4 w-10/12 mx-auto">
						<Outlet />
					</main>
				</div>
			</div>
		</div>
	);
}

export default App;
