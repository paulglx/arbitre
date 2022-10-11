import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({allowedRoles}) => {
    const { auth } = useAuth();
    const location = useLocation();

    /* TODO correctly get roles */
    console.log("context:");
    console.log(auth)

    console.log("find result:");
    console.log(auth?.roles?.find(role => allowedRoles?.includes(role)));

    //Send users to login page if not logged in
    return (
        auth?.roles?.find(role => allowedRoles?.includes(role)) //Check if there is a logged in user, with the valid roles
            ? <Outlet />
            : auth?.user
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace/> //`replace` keeps user history consistent
    )
}

export default RequireAuth;