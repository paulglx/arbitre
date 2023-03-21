import '../login-register.css'

import { useLocation, useNavigate } from 'react-router-dom'

import { Button } from 'react-bootstrap'
import React from 'react'
import { setCredentials } from '../features/auth/authSlice'
import { useDispatch } from 'react-redux'
import { useKeycloak } from '@react-keycloak/web'

const Login = () => {

    const dispatch = useDispatch()
    const location = useLocation()
    const from = location.state?.from?.pathname || "/"
    const navigate = useNavigate()
    const { keycloak, initialized: keycloakInitialized } = useKeycloak()

    if (!keycloakInitialized) {
        return <div>Loading...</div>
    }

    if (keycloak.authenticated) {
        keycloak.loadUserProfile().then(function (profile) {

            const user = profile.username;
            const keycloakToken = keycloak.token;
            const keycloakRefreshToken = keycloak.refreshToken;
            const isTeacher = keycloak.hasRealmRole("teacher")

            dispatch(setCredentials({
                user,
                keycloakToken,
                keycloakRefreshToken,
                isTeacher
            }));

            if (from === "/") {
                navigate("/course")
            } else {
                navigate(from, { replace: true });
            }
        }).catch((error) => {
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