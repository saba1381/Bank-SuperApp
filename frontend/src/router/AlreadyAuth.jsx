import { Navigate, Outlet } from "react-router-dom";

export default function AlreadyAuth() {
    const accessToken = localStorage.getItem('access_token');
    const user = localStorage.getItem('user'); 

    
    if (user && accessToken) {
        return <Navigate to="/cp" />;
    }

    return <Outlet />;
}
