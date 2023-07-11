import { logOut, setCredentials } from "../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";

import { selectIsTeacher } from "../features/auth/authSlice";
import { useKeycloak } from "@react-keycloak/web";

export const useRefreshAuth = () => {

    const { keycloak, initialized } = useKeycloak()
    const dispatch = useDispatch()
    const isTeacher = useSelector(selectIsTeacher)

    return () => {

        console.log("Trying to refresh auth")
        initialized && keycloak.updateToken(60).then((refreshed) => {
            console.log("Refreshed auth? :", refreshed)
            refreshed && keycloak.loadUserProfile().then((profile) => {
                dispatch(setCredentials({
                    user: profile.username,
                    keycloakToken: keycloak.token,
                    keycloakRefreshToken: keycloak.refreshToken,
                    isTeacher
                }));
            }).catch((error) => console.log("Failed to load user profile"));
        }).catch(() => {
            keycloak.logout()
            dispatch(logOut({}))
        });

    }

}