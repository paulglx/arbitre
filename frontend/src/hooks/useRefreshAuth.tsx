import { logOut, setCredentials } from "../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";

import { selectIsTeacher } from "../features/auth/authSlice";
import { useKeycloak } from "@react-keycloak/web";

export const useRefreshAuth = () => {

    const { keycloak, initialized } = useKeycloak()
    const dispatch = useDispatch()
    const isTeacher = useSelector(selectIsTeacher)

    return () => {

        initialized && keycloak.updateToken(60).then((refreshed) => {
            refreshed && keycloak.loadUserProfile().then((profile) => {
                dispatch(setCredentials({
                    user: profile.username,
                    keycloakToken: keycloak.token,
                    keycloakRefreshToken: keycloak.refreshToken,
                    isTeacher
                }));
                console.log("Re-authenticated", profile.username)
            }).catch((error) => console.log("Failed to load user profile"));
        }).catch(() => {
            console.log("Failed to refresh token")
            keycloak.logout()
            dispatch(logOut({}))
        });

    }

}