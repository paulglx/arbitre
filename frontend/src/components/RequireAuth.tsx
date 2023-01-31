import { Navigate, Outlet, useLocation } from "react-router-dom";

import { selectCurrentKeycloakToken } from "../features/auth/authSlice";
import { useKeycloak } from "@react-keycloak/web";
import { useSelector } from "react-redux";

const RequireAuth = () => {

    const { keycloak, initialized }: any = useKeycloak()
    const keycloakToken = useSelector(selectCurrentKeycloakToken)
    const location = useLocation()

    initialized && keycloak.updateToken(5).then((refreshed: boolean) => {
        if (refreshed) {
            console.log('Token was successfully refreshed');
        } else {
            console.log('Token is still valid');
        }
    }).catch(() => {
        console.log('Failed to refresh token');
    });

    return (
        keycloakToken
            ? <Outlet />
            : <Navigate to="/" state={{ from: location }} replace />
    )
}

export default RequireAuth