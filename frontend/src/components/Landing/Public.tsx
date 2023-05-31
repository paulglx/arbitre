import React, { useEffect } from "react";

import { Container } from "react-bootstrap";
import LoginButton from "./LoginButton";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Public = () => {

    const navigate = useNavigate();
    const user = useSelector(selectCurrentUser);

    useEffect(() => {
        if (user) {
            navigate('/course');
        }
    }, [user, navigate]);

    return (<>
        <Container className="vertical-center d-flex align-items-center justify-content-between">
            <Container className="p-3">
                <div className="ms-auto w-50">
                    <h1 className='border border-3 rounded-pill packed-border border-dark arbitre'>ARBITRE</h1>
                    <h2 className="mt-3">An open source <br /> code judge</h2>
                </div>
            </Container>

            <Container className="p-3">
                <LoginButton />
            </Container>
        </Container>
    </>)
}

export default Public;