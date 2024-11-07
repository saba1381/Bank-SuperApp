import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UseAppSelector } from "../store/configureStore";

export default function RequireAuth() {
    const { user } = UseAppSelector(state => state.account);
    const accessToken = localStorage.getItem('access_token');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const location = useLocation();

    // اگر کاربر وارد نشده یا توکن وجود نداشته باشد، به صفحه ورود هدایت شود
    if (!user && !accessToken) {
        return <Navigate to="/sign-in" state={{ from: location }} />;
    }

    // اگر در حال دسترسی به /admin باشیم ولی کاربر سوپر یوزر نباشد، به صفحه ورود هدایت شود
    if (location.pathname === '/admin' && (!storedUser || !storedUser.is_superuser)) {
        return <Navigate to="/sign-in" state={{ from: location }} />;
    }

    // اگر کاربر در صفحه‌ی /cp باشد و سوپر یوزر باشد، به صفحه ادمین هدایت شود
    if (location.pathname === '/cp' && storedUser && storedUser.is_superuser) {
        return <Navigate to="/admin" />;
    }

    return <Outlet />; // در صورت صحت شرایط، اجازه دسترسی به صفحه داده می‌شود
}
