import Register from "../features/auth/Register";
import { createBrowserRouter, Navigate } from "react-router-dom"; // Import createBrowserRouter and Navigate
import App from "../layout/App"; // Import the App component
import SignIn from "../features/auth/SignIn"; // Import the SignIn component
import RequireAuth from "./RequireAuth"; // Import RequireAuth component
import PrivatePage from "../features/private/PrivatePage"; // Import PrivatePage component
import ServerError from "../errors/ServerError"; // Import ServerError component
import NotFound from "../errors/NotFound"; // Import NotFound component
import ActivationCode from '../features/auth/ActivationCode'; // Import ActivationCode

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
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
                path: "activation-code", 
                element: <ActivationCode /> 
            },
            {
                element: <RequireAuth />, children: [
                    { path: "cp", element: <PrivatePage /> }
                ]
            },
            { path: "", element: <Navigate to="/sign-in" /> },
            { path: "server-error", element: <ServerError /> },
            { path: "not-found", element: <NotFound /> },
            { path: "*", element: <Navigate replace to="not-found" /> },
        ]
    },
]);
