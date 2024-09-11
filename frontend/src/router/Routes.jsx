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

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                element: <AlreadyAuth />, // برای جلوگیری از دسترسی لاگین شده‌ها به این صفحات
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
                    { path: "cp", element: <PrivatePage /> }
                ]
            },
            // Redirect root to "sign-in" unless authenticated
            { path: "", element: <Navigate to="/sign-in" /> },
            { path: "server-error", element: <ServerError /> },
            { path: "not-found", element: <NotFound /> },
            { path: "*", element: <Navigate replace to="not-found" /> },
        ]
    },
]);
