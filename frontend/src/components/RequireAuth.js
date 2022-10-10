import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = () => {
    const { auth } = useAuth();
    const location = useLocation();

    //Send users to login page if not logged in
    return (
        auth?.user //Check if there is a logged in user
            ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace/> //`replace` keeps user history consistent
    )
}

export default RequireAuth;