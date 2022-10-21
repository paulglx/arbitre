import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { setCredentials } from '../features/auth/authSlice'
import { useLoginMutation, useGetGroupsMutation } from '../features/auth/authApiSlice'

import '../login-register.css'

const Login = () => {
    const userRef = useRef<any>()
    const errRef = useRef<any>()
    const [user, setUser] = useState('')
    const [pwd, setPwd] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const navigate = useNavigate()

    const location = useLocation()
    const from = location.state?.from?.pathname || "/"

    const [login, { isLoading }] = useLoginMutation()
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
            const userData = await login({ username:user, password:pwd }).unwrap()
            const groupsData = await getGroups({ username:user }).unwrap()
            const roles = groupsData.groups.map((g:any) => g.id);

            dispatch(setCredentials({ ...userData, user, roles }))
            setUser('')
            setPwd('')
            if (from === "/") {
                navigate("/courses")
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
                setErrMsg('Wrong username or password');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    const handleUserInput = (e:any) => setUser(e.target.value)
    const handlePwdInput = (e:any) => setPwd(e.target.value)

    const content = isLoading ? <h1>Loading...</h1> : (

        <section className="login text-center bg-light border rounded">
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <div className="form-signin w-100 m-auto">
                <form onSubmit={handleSubmit}>

                <h3 className="mb-3 fw-normal">Welcome back</h3>

                    <br />

                    <div className="form-floating">
                    <input
                            className="form-control"
                            type="text"
                            id="username"
                            ref={userRef}
                            value={user}
                            onChange={handleUserInput}
                            autoComplete="off"
                            required
                        />
                        <label htmlFor="username">Username:</label>
                    </div>

                    <div className="form-floating">
                        <input
                            className='form-control'
                            type="password"
                            id="password"
                            onChange={handlePwdInput}
                            value={pwd}
                            required
                        />
                        <label htmlFor="password">Password:</label>
                    </div>

                    <br />

                    <button className='w-100 btn btn-lg btn-primary'>Sign In</button>
                    <a href="/register">No account yet ?</a>
                </form>

                <p className="mt-5 mb-3 text-muted">2022 - WIP</p>
            </div>
        </section>
    )

    return content
}
export default Login