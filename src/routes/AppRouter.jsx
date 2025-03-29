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
import Me from "../pages/Me";
import UpdateAdmin from "../pages/UpdateAdmin";
import CreateAdmin from "../pages/CreateAdmin";
import AdminList from "../pages/AdminList";
import AdminDetail from "../pages/AdminDetail";
import DeleteAdmin from "../pages/DeleteAdmin";

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
			{ path: "/me", element: <p>me</p> },
		],
	},
	{ path: "/user/update/:id", element: <p>update me</p> },
	{ path: "/schedule/list", element: <p>schedule-list</p> },
	{ path: "/schedule/:id", element: <p>a schedule</p> },
	{ path: "/service/:id", element: <p>a service</p> },
	{ path: "/service/update/:id", element: <p>service time update</p> },
	{ path: "*", element: <Navigate to="/" /> },
]);

const doctorRouter = createBrowserRouter([
	{ path: "/", element: <p>home</p> },
	{ path: "/news", element: <p>news</p> },
	{ path: "/me", element: <p>me</p> },
	{ path: "/admin/update/:id", element: <p>update me</p> },
	{ path: "/admin/list", element: <p>admin list</p> },
	{ path: "/admin/:id", element: <p>a admin</p> },
	{ path: "/user/list", element: <p>user list</p> },
	{ path: "/user/:id", element: <p>a user</p> },
	{ path: "/schedule/list", element: <p>schedule-list</p> },
	{ path: "/schedule/:id", element: <p>a schedule</p> },
	{ path: "/service/:id", element: <p>a service</p> },
	{ path: "/service/create", element: <p>create service</p> },
	{ path: "/service/update/:id", element: <p>service update</p> },
	{ path: "/service/delete/:id", element: <p>delete own service update</p> },
	{ path: "*", element: <Navigate to="/" /> },
]);

const adminRouter = createBrowserRouter([
	{
		path: "/",
		element: <App />,

		children: [
			{ index: true, element: <Home /> },
			{ path: "news", element: <News /> },
			{ path: "me", element: <Me /> },
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
					{ index: true, element: <p>user list</p> },
					{ path: ":id", element: <p>a user</p> },
					{ path: "create", element: <p>create user</p> },
					{ path: "update/:id", element: <p>update a user</p> },
					{ path: "delete/:id", element: <p>delete a user</p> },
					{ path: "*", element: <Navigate to="/user" /> },
				],
			},
			{
				path: "schedule",
				children: [
					{ index: true, element: <p>schedule-list</p> },
					{ path: ":id", element: <p>a schedule</p> },
					{ path: "create", element: <p>create schedule</p> },
					{ path: "update/:id", element: <p>update schedule</p> },
					{ path: "delete/:id", element: <p>delete schedule</p> },
					{
						path: "service",
						children: [
							{ path: ":id", element: <p>a service</p> },
							{ path: "update/:id", element: <p>service update</p> },
							{ path: "delete/:id", element: <p>delete own service</p> },
							{ path: "create", element: <p>create service</p> },
							{ path: "*", element: <Navigate to="/schedule/service" /> },
						],
					},
					{ path: "*", element: <Navigate to="/schedule" /> },
				],
			},
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
