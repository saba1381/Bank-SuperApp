import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UseAppSelector } from "../store/configureStore";

export default function RequireAuth() {
    const { user } = UseAppSelector(state => state.account);
    const location = useLocation();
    const accessToken = localStorage.getItem('access_token');

 

    // اگر کاربر وارد نشده است و به صفحه محافظت‌شده می‌رود
    if (!user && !accessToken) {
        return <Navigate to="/sign-in" state={{ from: location }} />
    }

    // اجازه دسترسی به بقیه‌ی صفحات
    return <Outlet />
}
