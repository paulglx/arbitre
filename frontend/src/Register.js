import { useRef, useState, useEffect } from "react";
import React from 'react'

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,50}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,255}$/;

const Register = () => {

    const userRef = useRef();
    const errRef = useRef(); // If an error is raised, we focus on the error (for accessibility)

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    //Set focus on username when the component loads
    useEffect(() => {
        userRef.current.focus();
    }, []);

    //Validate username everytime `user` changes
    useEffect(() => {
        const result = USER_REGEX.test(user);
        console.log(result);
        console.log(user);   
        setValidName(result);
    }, [user])

    //Validate password
    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        console.log("Password Validation :" + result);
        setValidPwd(result);
    }, [pwd])

    //Update error msg everytime data changes
    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    return (
        <section>

            <p ref={errRef} classname={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Register</h1>
            <form>
                <label htmlFor="username">
                    Username
                    <span className={validName ? "valid" : "hide"}> ✓ </span>
                    <span className={validName || !user ? "hide" : "invalid"}> ✗ </span>
                </label>
                <input 
                    type="text"
                    id="username"
                    ref={userRef} //sets the focus on this field on page load
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    required
                    aria-invalid = {validName ? "false":"true"}
                    aria-describedby="uidnote"
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}
                />
                <p id="uidnote" className={userFocus && user &&!validName ? "instructions" : "offscreen"}>
                    4 to 24 characters. <br />Must begin with a letter.
                </p>

                <br/>

                <label htmlFor="password">
                    Password
                    <span className={validPwd ? "valid" : "hide"}> ✓ </span>
                    <span className={validPwd || !pwd ? "hide" : "invalid"}> ✗ </span>
                </label>
                <input 
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    required
                    aria-invalid = {validPwd ? "false":"true"}
                    aria-describedby="pwdnote"
                    onFocus={() => setPwdFocus(true)}
                    onBlur={() => setPwdFocus(false)}
                />
                <p id="pwdnote" className={pwdFocus && pwd &&!validPwd ? "instructions" : "offscreen"}>
                    At least 8 characters. <br />Must include lower and uppercase letters and a number.<br />
                </p>        

                <button type="submit" disabled={!validName || !validPwd ? true : false}>
                    Sign Up
                </button>

            </form>
        </section>
    )
}

export default Register