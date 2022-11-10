import { Container, Tab, Tabs } from "react-bootstrap";
import React, { useEffect } from "react";

import Login from "./Login";
import Register from "./Register";
import { selectCurrentUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Public = () => {

    const navigate = useNavigate();
    const user = useSelector(selectCurrentUser);

    useEffect(() => {
        if (user) {
            navigate('/course');
        }
    }, [user]);

    const loginRegisterBlock = () => {
        return (
            <Tabs defaultActiveKey='login' id='login-register-tab' className='mb-3' variant="pills">
                <Tab eventKey='login' title='Login'>
                    <Login />
                </Tab>
                <Tab eventKey='register' title='Register'>
                    <Register />
                </Tab>
            </Tabs>
        )}

    const content = (
        <div className="vertical-center d-flex align-items-center justify-content-between">
            <Container className="p-3">
                    <div className="ms-auto w-50">
                        <h1 className='border border-3 rounded-pill packed-border border-dark arbitre'>ARBITRE</h1>
                        <h2 className="mt-3">An open source <br/> code judge</h2>
                    </div>
            </Container>

            <Container>
                <div>
                    {loginRegisterBlock()}
                </div>
            </Container>
        </div>
    )
    return content
}

export default Public;