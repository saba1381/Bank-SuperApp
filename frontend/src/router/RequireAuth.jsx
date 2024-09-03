import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UseAppSelector } from "../store/configureStore";

export default function RequireAuth() {
    const { user } = UseAppSelector(state => state.account);
    const location = useLocation();

    console.log(user);
    if (!user || user?.role!=="admin") {
        return <Navigate to='/sign-in' state={{ from: location }} />
    }

    return <Outlet />
}