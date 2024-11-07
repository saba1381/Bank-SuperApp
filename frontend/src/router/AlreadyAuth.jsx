import { Navigate, Outlet } from "react-router-dom";

export default function AlreadyAuth() {
    const accessToken = localStorage.getItem('access_token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (accessToken && user) {
        if (user.is_superuser) {
            // اگر کاربر سوپر یوزر باشد، به صفحه ادمین هدایت شود
            return <Navigate to="/admin" />;
        } else {
            // در غیر این صورت، به صفحه مشتری هدایت شود
            return <Navigate to="/cp" />;
        }
    }

    // در صورت عدم وجود کاربر، اجازه دسترسی به سایر صفحات
    return <Outlet />;
}
