import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../features/home/HomePage";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import RequireAuth from "./RequireAuth";
import PrivatePage from "../features/private/PrivatePage";
import SignIn from "../features/auth/SignIn"; // Import the SignIn component

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "sign-in", // Route for SignIn
                element: <SignIn />
            },
            {
                element: <RequireAuth />, children: [
                    { path: "cp", element: <PrivatePage /> }
                ]
            },
            {
                path: "", // Root path
                element: <Navigate to="/sign-in" /> // Redirect to SignIn
            },
            { path: "server-error", element: <ServerError /> },
            { path: "not-found", element: <NotFound /> },
            { path: "*", element: <Navigate replace to="not-found" /> },
        ]
    },
]);
