import { Navigate, Outlet, useLocation } from "react-router-dom";

import { selectCurrentKeycloakToken } from "../features/auth/authSlice";
import { useSelector } from "react-redux";

const RequireAuth = () => {

    const keycloakToken = useSelector(selectCurrentKeycloakToken)
    const location = useLocation()

    return (
        keycloakToken
            ? <Outlet />
            : <Navigate to="/" state={{ from: location }} replace />
    )
}

export default RequireAuth