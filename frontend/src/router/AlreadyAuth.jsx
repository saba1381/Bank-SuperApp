import { Navigate, Outlet } from "react-router-dom";

export default function AlreadyAuth() {
    const accessToken = localStorage.getItem('access_token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (accessToken && user) {
        if (user.is_superuser) {
            return <Navigate to="/admin" />;
        } else {
            return <Navigate to="/cp" />;
        }
    }

    return <Outlet />;
}
