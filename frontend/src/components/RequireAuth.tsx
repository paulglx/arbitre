import { Navigate, Outlet, useLocation } from "react-router-dom";
import { logOut, setCredentials } from "../features/auth/authSlice";
import { selectCurrentKeycloakToken, selectCurrentRoles } from "../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";

import { useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";

const RequireAuth = () => {

    const { keycloak, initialized } = useKeycloak()
    const dispatch = useDispatch()
    const keycloakToken = useSelector(selectCurrentKeycloakToken)
    const location = useLocation()
    const roles = useSelector(selectCurrentRoles)

    useEffect(() => {
        const interval = setInterval(() => {
            initialized && keycloak.updateToken(60).then((refreshed) => {
                if (refreshed) {
                    keycloak.loadUserProfile().then(function (profile) {
                        const user = profile.username;
                        const keycloakToken = keycloak.token;
                        const keycloakRefreshToken = keycloak.refreshToken;
                        dispatch(setCredentials({
                            user,
                            keycloakToken,
                            keycloakRefreshToken,
                            roles
                        }));
                        console.log("Re-authenticated", user)
                    }).catch((error) => {
                        console.log("Failed to load user profile")
                    });
                }
            }).catch(() => {
                console.log("Failed to refresh token")
                keycloak.logout()
                dispatch(logOut({}))
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [keycloak, initialized]);

    return (
        keycloakToken
            ? <Outlet />
            : <Navigate to="/" state={{ from: location }} replace />
    )
}

export default RequireAuth