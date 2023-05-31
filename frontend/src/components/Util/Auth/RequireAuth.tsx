import { Navigate, Outlet, useLocation } from "react-router-dom";

import { selectCurrentKeycloakToken } from "../../../features/auth/authSlice";
import { useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { useRefreshAuth } from "../../../hooks/useRefreshAuth";
import { useSelector } from "react-redux";

const RequireAuth = () => {

    const { keycloak, initialized } = useKeycloak()
    const refreshAuth = useRefreshAuth()
    const keycloakToken = useSelector(selectCurrentKeycloakToken)
    const location = useLocation()

    // Periodically refresh auth if token is about to expire
    useEffect(() => {
        const interval = setInterval(() => {
            refreshAuth()
        }, 30000);
        return () => clearInterval(interval);
    }, [keycloak, initialized, refreshAuth]);

    return (
        keycloakToken
            ? <Outlet />
            : <Navigate to="/" state={{ from: location }} replace />
    )
}

export default RequireAuth