import '../login-register.css'

import { useLocation, useNavigate } from 'react-router-dom'

import { Button } from 'react-bootstrap'
import React from 'react'
import { setCredentials } from '../features/auth/authSlice'
import { useDispatch } from 'react-redux'
import { useGetGroupsMutation } from '../features/auth/authApiSlice'
import { useKeycloak } from '@react-keycloak/web'

const Login = () => {

    console.log("Login")

    const [getGroups] = useGetGroupsMutation();
    const dispatch = useDispatch()
    const location = useLocation()
    const from = location.state?.from?.pathname || "/"
    const navigate = useNavigate()
    const { keycloak, initialized: keycloakInitialized } = useKeycloak()

    console.log("keycloakInitialized: " + keycloakInitialized)

    if (!keycloakInitialized) {
        return <div>Loading...</div>
    }

    if (keycloak.authenticated) {

        console.log("Authenticated. Loading user profile")

        keycloak.loadUserProfile().then(function (profile) {
            const user = profile.username;
            const keycloakToken = keycloak.token;
            const keycloakRefreshToken = keycloak.refreshToken;

            //const groupsData = await getGroups({ username }).unwrap()
            //const roles = groupsData?.groups.map((g: any) => g.id);

            console.log("Loaded user profile: " + user + ". Dispatching setCredentials")

            dispatch(setCredentials({
                user,
                keycloakToken,
                keycloakRefreshToken,
                roles: []
            }));

            console.log("Dispatched setCredentials. navigating now. bye")

            if (from === "/") {
                navigate("/course")
            } else {
                navigate(from, { replace: true });
            }

        }).catch(function () {
            console.log("Failed to load user profile")
        });
    } else {
        console.log("Not authenticated")
    }

    return (<>
        <Button className='btn-light' href={keycloak.createLoginUrl()}>
            Login via SSO
        </Button >
    </>)
}
export default Login