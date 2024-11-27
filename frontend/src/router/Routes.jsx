import Register from "../features/auth/Register";
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../layout/App"; 
import SignIn from "../features/auth/SignIn"; 
import RequireAuth from "./RequireAuth";
import AlreadyAuth from "./AlreadyAuth";
import PrivatePage from "../features/private/PrivatePage"; 
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound"; 
import ActivationCode from '../features/auth/ActivationCode'; 
import ProfileEdit from '../features/private/ProfileEdit';
import CardList from "../features/private/CardList";
import EditCard from "../features/private/EditCard";
import AddCard from "../features/private/AddCard";
import ChangePassword from "../features/private/bottomMenu/ChangePassword";
import Settings from "../features/private/bottomMenu/settings";
import Transfer from "../features/private/Transfer";
import TransactionList from "../features/private/TransactionList";
import CompleteInfo from "../features/private/CompleteInfo";
import Charging from "../features/private/Charging";
import ProfileView from "../features/private/ProfileView";
import AdminDashboard from "../features/private/Admin components/AdminDashboard";
import UserList from "../features/private/Admin components/UserList";
import Transfers from "../features/private/Admin components/Transfers";
import Recharges from "../features/private/Admin components/Recharges";
import SignInAdmin from "../features/auth/SignInAdmin";


const adminOrCpPath = (base, path) => `${base}${path}`;

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                element: <AlreadyAuth />, 
                children: [
                    {
                        path: "sign-in",
                        element: <SignIn />
                    },
                    {
                        path: "register", 
                        element: <Register />
                    },
                    {
                        path: "sign-in-admin", 
                        element: <SignInAdmin />
                    },
                ]
            },
            {
                path: "activation-code", 
                element: <ActivationCode /> 
            },
            {
                element: <RequireAuth />, 
                children: [
                    { path: "cp", element: <PrivatePage /> },
                    { path: "admin", element: <AdminDashboard /> },

                    {
                        path: "cp",
                        children: [
                            { path: adminOrCpPath("/cp", "/edit-profile"), element: <ProfileEdit /> },
                            { path: adminOrCpPath("/cp", "/user-cards"), element: <CardList /> },
                            { path: adminOrCpPath("/cp", "/user-cards/add-card"), element: <AddCard /> },
                            { path: adminOrCpPath("/cp", "/user-cards/edit-card"), element: <EditCard /> },
                            { path: adminOrCpPath("/cp", "/setting"), element: <Settings /> },
                            { path: adminOrCpPath("/cp", "/setting/edit-password"), element: <ChangePassword /> },
                            { path: adminOrCpPath("/cp", "/transfer"), element: <Transfer /> },
                            { path: adminOrCpPath("/cp", "/transaction-list"), element: <TransactionList /> },
                            { path: adminOrCpPath("/cp", "/complete-info"), element: <CompleteInfo /> },
                            { path: adminOrCpPath("/cp", "/charge"), element: <Charging /> },
                            { path: adminOrCpPath("/cp", "/profile-view"), element: <ProfileView /> },
                        ]
                    },

                    {
                        path: "admin",
                        children: [
                            { path: adminOrCpPath("/admin", "/edit-profile"), element: <ProfileEdit /> },
                            { path: adminOrCpPath("/admin", "/setting"), element: <Settings /> },
                            { path: adminOrCpPath("/admin", "/setting/edit-password"), element: <ChangePassword /> },
                            { path: adminOrCpPath("/admin", "/profile-view"), element: <ProfileView /> },
                            { path: adminOrCpPath("/admin", "/user-list"), element: <UserList /> },
                            { path: adminOrCpPath("/admin", "/transfers"), element: <Transfers /> },
                            { path: adminOrCpPath("/admin", "/recharges"), element: <Recharges /> },
                        ]
                    },
                ]
            },

            { path: "", element: <Navigate to="/sign-in" /> },
            { path: "server-error", element: <ServerError /> },
            { path: "not-found", element: <NotFound /> },
            { path: "*", element: <Navigate replace to="not-found" /> },
        ]
    },
]);
