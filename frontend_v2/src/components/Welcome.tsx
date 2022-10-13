import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrentToken } from "../features/auth/authSlice";
import { Link } from "react-router-dom";

const Welcome = () => {
    const user = useSelector(selectCurrentUser)
    const token = useSelector(selectCurrentToken)
    const welcome = user ? `Welcome, ${user}!` : `Welcome!`
    const tokenAbbr = `${token.slice(0,9)}...`

    const content = (
        <section className="welcome">
            <h1>{welcome}</h1>
            <p>Token : {tokenAbbr}</p>
            <p>
                <Link to="/users">Users list</Link>
            </p>
        </section>
    )

    return content
}

export default Welcome