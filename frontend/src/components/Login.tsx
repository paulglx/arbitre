import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { setCredentials } from '../features/auth/authSlice'
import { useLoginMutation, useGetGroupsMutation } from '../features/auth/authApiSlice'

const Login = () => {
    const userRef = useRef<any>()
    const errRef = useRef<any>()
    const [user, setUser] = useState('')
    const [pwd, setPwd] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const navigate = useNavigate()

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

            console.log(roles)

            dispatch(setCredentials({ ...userData, user, roles }))
            setUser('')
            setPwd('')
            navigate('/welcome')
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
        <section className="login">
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

            <h1>Employee Login</h1>

            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    ref={userRef}
                    value={user}
                    onChange={handleUserInput}
                    autoComplete="off"
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={handlePwdInput}
                    value={pwd}
                    required
                />
                <button>Sign In</button>
            </form>
        </section>
    )

    return content
}
export default Login