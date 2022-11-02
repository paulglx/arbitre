// TODO allow users to register as teacher for testing

import '../login-register.css'

import { useEffect, useRef, useState } from 'react'
import { useGetGroupsMutation, useLoginMutation, useRegisterMutation } from '../features/auth/authApiSlice'
import { useLocation, useNavigate } from 'react-router-dom'

import { Alert } from 'react-bootstrap'
import React from 'react'
import { setCredentials } from '../features/auth/authSlice'
import { useDispatch } from 'react-redux'

const Register = () => {
    const userRef = useRef<any>()
    const errRef = useRef<any>()
    const [user, setUser] = useState('')
    const [pwd, setPwd] = useState('')
    const [errMsg, setErrMsg] = useState('')

    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || "/"

    const [register, { isLoading:registerIsLoading }] = useRegisterMutation();
    const [login, { isLoading:loginIsLoading }] = useLoginMutation()
    const [getGroups] = useGetGroupsMutation();
    const dispatch = useDispatch()

    useEffect(() => {
        userRef?.current?.focus()
    }, [])

    useEffect(() => {
        setErrMsg('')
    }, [user, pwd])

    const handleSubmit = async (e : any) => {
        e.preventDefault()

        
        try {
            //Register user
            const registerResponse = await register({ username:user, password:pwd })
            //Login user
            const userData = await login({ username:user, password:pwd }).unwrap()
            const groupsData = await getGroups({ username:user }).unwrap()
            const roles = groupsData.groups.map((g:any) => g.id);

            dispatch(setCredentials({ ...userData, user, roles }))
            setUser('')
            setPwd('')
            if (from === "/") {
                navigate("/course")
            } else {
                navigate(from, { replace: true });
            }
        } catch (err:any) {
            if (!err?.status) {
                // isLoading: true until timeout occurs
                setErrMsg('No Server Response');
            } else if (err.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.status === 401) {
                setErrMsg('User already exists');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
        
    }

    const handleUserInput = (e:any) => setUser(e.target.value)
    const handlePwdInput = (e:any) => setPwd(e.target.value)

    const content = (registerIsLoading || loginIsLoading) ? <></> : (

        <div className="register text-center bg-light border rounded">
            <div className="form-signin w-100 m-auto">
            <form onSubmit={handleSubmit}>
                <h3 className='mb-3 p-3 fw-normal'>Create account</h3>

                <p ref={errRef} className={errMsg ? "errmsg text-danger" : "d-none"} aria-live="assertive">{errMsg}</p>

                <div className='form-floating'>
                    <input
                        className={errMsg ? 'is-invalid form-control' : 'form-control'}
                        type="text"
                        id="username-register"
                        ref={userRef}
                        value={user}
                        onChange={handleUserInput}
                        autoComplete="off"
                        required
                    />
                    <label htmlFor="username">Username:</label>
                </div>

                <div className='form-floating'>
                    <input
                        className={errMsg ? 'is-invalid form-control' : 'form-control'}
                        type="password"
                        id="password-register"
                        onChange={handlePwdInput}
                        value={pwd}
                        required
                    />
                    <label htmlFor="password">Password:</label>
                </div>
                <br/>
                <button className='w-100 btn btn-lg btn-primary'>Sign Up</button>
            </form>
            <p className="mt-5 mb-3 text-muted">2022 - WIP</p>
            </div>
        </div>
    )

    return content
}
export default Register