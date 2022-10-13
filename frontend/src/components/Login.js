import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from '../api/axios'
import useInput from "../hooks/useInput";
import useToggle from "../hooks/useToggle";

const LOGIN_URL = '/api/auth/token/'
const GROUPS_URL = '/api/auth/users/groups'


const Login = () => {

    const { setAuth, persist, setPersist } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    //Accessibility : this allows focusing on components, e.g for screen readers
    const userRef = useRef();
    const errRef = useRef();

    const [user, resetUser, userAttributes] = useInput('user', ''); //useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [check, toggleCheck] = useToggle('persist', false);

    //Focus on component on pageload
    useEffect(() => {
        userRef.current.focus();
    }, [])

    //Reset errmsg on data edit
    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault(); //Prevents page reloading 

        try {
            const response = await axios.post(
                LOGIN_URL,
                JSON.stringify({username: user, password: pwd}),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            const accessToken = response?.data?.access;
            const refreshToken = response?.data?.refresh;

            const groupResponse = await axios.post(
                GROUPS_URL,
                JSON.stringify({username: user}),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            const groups = groupResponse?.data?.groups;
            const roles = groups.map(group => group.id)

            setAuth({user, accessToken, refreshToken, roles})
            resetUser(); //setUser('');
            setPwd('');
            navigate(from, {replace: true}); //navigate back to page before login prompt

        } catch (err) {
            if (!err?.response) {
                setErrMsg('No server response - is the backend server running ?');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing username or password');
            } else if (err.response?.status === 401) {
                setErrMsg('Wrong username or password');
            } else {
                setErrMsg('Login failed');
            }
            errRef.current.focus();
        }
    }

    /* const togglePersist = () => {
        setPersist(prev => !prev);
    }

    useEffect(() => {
        localStorage.setItem("persist", persist);
    }, [persist]) */

    return (
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    //onChange={(e) => setUser(e.target.value)}
                    //value={user}
                    {...userAttributes}
                    required
                />

                <br />

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                />

                <button>Login</button>

                <div>
                    <input 
                        type="checkbox"
                        id="persist"
                        onChange={toggleCheck}
                        checked={check}
                    />
                    <label htmlFor="persist">Remember me</label>
                </div>
            </form>

            <p>
                Need an account?<br />
                <span className="line">
                    { /* TODO add router link */}
                    <Link to="/register">Sign Up</Link>
                </span>
            </p>

        </section>
    )
}

export default Login