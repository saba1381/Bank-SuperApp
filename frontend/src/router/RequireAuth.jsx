import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UseAppSelector } from "../store/configureStore";

export default function RequireAuth() {
    const { user } = UseAppSelector(state => state.account);
    const accessToken = localStorage.getItem('access_token');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const location = useLocation();

    if (!user && !accessToken) {
        return <Navigate to="/sign-in" state={{ from: location }} />;
    }

    if (location.pathname.startsWith('/admin') && (!storedUser || !storedUser.is_superuser)) {
        return <Navigate to="/sign-in" state={{ from: location }} />;
    }

    if (location.pathname.startsWith('/cp') && storedUser && storedUser.is_superuser) {
        return <Navigate to="/admin" />;
    }

    return <Outlet />; 
}
