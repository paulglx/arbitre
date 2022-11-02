import { Navigate, Outlet, useLocation } from "react-router-dom";

import { selectCurrentAccessToken } from "../features/auth/authSlice";
import { useSelector } from "react-redux";

const RequireAuth = () => {
    const accessToken = useSelector(selectCurrentAccessToken)
    const location = useLocation()


    return (
        accessToken
            ? <Outlet />
            : <Navigate to="/" state={{ from: location }} replace />
    )
}

export default RequireAuth