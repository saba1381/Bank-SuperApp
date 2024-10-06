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
                    { path: "cp/edit-profile", element: <ProfileEdit /> },
                    { path: "cp/user-cards", element: <CardList /> }, 
                    { path: "cp/user-cards/add-card", element: <AddCard /> }, 
                    { path: "cp/user-cards/edit-card", element: <EditCard /> },
                    { path: "cp/setting", element: <Settings /> }, 
                    { path: "cp/setting/edit-password", element: <ChangePassword /> },   
                    { path: "cp/transfer", element: <Transfer /> },

                       
                ]
            },

            { path: "", element: <Navigate to="/sign-in" /> },
            { path: "server-error", element: <ServerError /> },
            { path: "not-found", element: <NotFound /> },
            { path: "*", element: <Navigate replace to="not-found" /> },
        ]
    },
]);
