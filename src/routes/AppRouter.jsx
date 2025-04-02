import {
	createBrowserRouter,
	Navigate,
	Outlet,
	RouterProvider,
} from "react-router";
import useUserStore from "../stores/userStore";
import App from "../App";
import Login from "../pages/Login";
import Home from "../pages/Home";
import News from "../pages/News";
import Register from "../pages/Register";
import SidebarMenu from "../components/Sidebar";
import Me from "../components/Me";
import UpdateAdmin from "../pages/admin/UpdateAdmin";
import CreateAdmin from "../pages/admin/CreateAdmin";
import AdminList from "../pages/admin/AdminList";
import AdminDetail from "../pages/admin/AdminDetail";
import DeleteAdmin from "../pages/admin/DeleteAdmin";
import ClinicList from "../pages/clinic/ClinicList";
import ClinicCreate from "../pages/clinic/ClinicCreate";
import ClinicEdit from "../pages/clinic/ClinicEdit";
import ScheduleList from "../pages/appointment/ScheduleCardList";
import ScheduleDetail from "../pages/appointment/ScheduleDetail";
import CreateService from "../pages/appointment/CreateService";
import UpdateService from "../pages/appointment/UpdateService";
import CreateSchedule from "../pages/appointment/CreateSchedule";
import UpdateSchedule from "../pages/appointment/UpdateSchedule";
import CalendarView from "../pages/CalendarView";
import UserList from "../pages/user/UserList";
import UserDetail from "../pages/user/UserDetail";
import UpdateUser from "../pages/user/UpdateUser";
import CreateUser from "../pages/user/CreateUser";
import DeleteUser from "../pages/user/DeleteUser";

const guestRouter = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{ index: true, element: <Home /> },
			{ path: "/news", element: <News /> },
			{ path: "/login", element: <Login /> },
			{ path: "/register", element: <Register /> },
			{ path: "*", element: <Navigate to="/login" /> },
		],
	},
]);

const userRouter = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{ index: true, element: <Home /> },
			{ path: "/news", element: <News /> },
			{ path: "user/:id", element: <UserDetail /> },
			{ path: `/user/update/:id`, element: <UpdateUser /> },
			{ path: "/schedule", element: <ScheduleList /> },
			{ path: "/schedule/:id", element: <ScheduleDetail /> },
			{ path: "/schedule/:id/service/update/:id", element: <UpdateService /> },
		],
	},
	{ path: "*", element: <Navigate to="/" /> },
]);

const doctorRouter = createBrowserRouter([
	{
		path: "/",
		element: <App />,

		children: [
			{ index: true, element: <Home /> },
			{ path: "news", element: <News /> },
			{
				path: "admin",
				children: [
					{ index: true, element: <AdminList /> },
					{ path: "create", element: <Navigate to="/admin" replace /> },
					{ path: "update/:id", element: <UpdateAdmin /> },
					{ path: ":id", element: <AdminDetail /> },
					{ path: "*", element: <Navigate to="/admin" /> },
				],
			},
			{
				path: "user",
				children: [
					{ index: true, element: <UserList /> },
					{ path: "create", element: <Navigate to="/user" replace /> },
					{ path: ":id", element: <UserDetail /> },
					{ path: "*", element: <Navigate to="/user" /> },
				],
			},
			{
				path: "schedule",
				children: [
					{ index: true, element: <ScheduleList /> },
					{
						path: ":id",
						children: [
							{ index: true, element: <ScheduleDetail /> },
							{
								path: "service",
								children: [
									{ path: "create", element: <CreateService /> },
									{ path: "update/:id", element: <UpdateService /> },
									{ path: "*", element: <Navigate to="/schedule/service" /> },
								],
							},
						],
					},
					{ path: "create", element: <CreateSchedule /> },
					{ path: "update/:id", element: <UpdateSchedule /> },
					{ path: "*", element: <Navigate to="/schedule" /> },
				],
			},
			{
				path: "clinics",
				children: [
					{ index: true, element: <ClinicList /> },
					{ path: "create", element: <ClinicCreate /> },
					{ path: "edit/:id", element: <ClinicEdit /> },
					{ path: "*", element: <Navigate to="" /> },
				],
			},
			{ path: "calendar", element: <CalendarView /> },
			{ path: "*", element: <Navigate to="/" /> },
		],
	},
]);

const adminRouter = createBrowserRouter([
	{
		path: "/",
		element: <App />,

		children: [
			{ index: true, element: <Home /> },
			{ path: "news", element: <News /> },
			{
				path: "admin",
				children: [
					{ index: true, element: <AdminList /> },
					{ path: ":id", element: <AdminDetail /> },
					{ path: "create", element: <CreateAdmin /> },
					{ path: "update/:id", element: <UpdateAdmin /> },
					{ path: "delete/:id", element: <DeleteAdmin /> },
					{ path: "*", element: <Navigate to="/admin" /> },
				],
			},
			{
				path: "user",
				children: [
					{ index: true, element: <UserList /> },
					{ path: ":id", element: <UserDetail /> },
					{ path: "create", element: <CreateUser /> },
					{ path: "update/:id", element: <UpdateUser /> },
					{ path: "delete/:id", element: <DeleteUser /> },
					{ path: "*", element: <Navigate to="/user" /> },
				],
			},
			{
				path: "schedule",
				children: [
					{ index: true, element: <ScheduleList /> },
					{
						path: ":id",
						children: [
							{ index: true, element: <ScheduleDetail /> },
							{
								path: "service",
								children: [
									{ path: "create", element: <CreateService /> },
									{ path: "update/:id", element: <UpdateService /> },
									// { path: "delete/:id", element: <p>delete own service</p> },
									// { path: ":id", element: <p>a service</p> },
									{ path: "*", element: <Navigate to="/schedule/service" /> },
								],
							},
						],
					},
					{ path: "create", element: <CreateSchedule /> },
					{ path: "update/:id", element: <UpdateSchedule /> },
					// { path: "delete/:id", element: <p>delete schedule</p> },
					{ path: "*", element: <Navigate to="/schedule" /> },
				],
			},
			{
				path: "clinics",
				children: [
					{ index: true, element: <ClinicList /> },
					{ path: "create", element: <ClinicCreate /> },
					{ path: "edit/:id", element: <ClinicEdit /> },
					{ path: "*", element: <Navigate to="" /> },
				],
			},
			{ path: "calendar", element: <CalendarView /> },
			{ path: "*", element: <Navigate to="/" /> },
		],
	},
]);

export default function AppRouter() {
	const user = useUserStore((state) => state.user);
	const finalRouter =
		user?.role === "ADMIN"
			? adminRouter
			: user?.role === "DOCTOR"
			? doctorRouter
			: user?.role === "USER"
			? userRouter
			: guestRouter;

	return <RouterProvider key={user?.id} router={finalRouter} />;
}
