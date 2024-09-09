import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UseAppSelector } from "../store/configureStore";

export default function RequireAuth() {
    const { user } = UseAppSelector(state => state.account);
    const location = useLocation();
    const accessToken = localStorage.getItem('access_token');

    // اگر کاربر در استیت وجود ندارد و توکن هم موجود نیست، به صفحه ورود هدایت شود
    if (!user && !accessToken) {
        return <Navigate to='/sign-in' state={{ from: location }} />
    }

    // اگر کاربر یا توکن معتبر است، اجازه دسترسی بدهد
    return <Outlet />
}
