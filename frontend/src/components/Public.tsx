import React from "react";
import { Container, Tabs, Tab } from "react-bootstrap";
import Register from "./Register";
import Login from "./Login";
import store from "../app/store";

const Public = () => {

    const state = store.getState()

    const loginRegisterBlock = (state:any) => {
        if (state?.auth?.user === null) {
            return (
                <Tabs defaultActiveKey='login' id='login-register-tab' className='mb-3' variant="pills">
                    <Tab eventKey='login' title='Login'>
                        <Login />
                    </Tab>
                    <Tab eventKey='register' title='Register'>
                        <Register />
                    </Tab>
                </Tabs>
            )
        }
        else {
            return (<>
                <p>You are logged in as {state?.auth?.user}. <br /><a href="/course">See course</a></p>
            </>)
        }
    }

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
                    {loginRegisterBlock(state)}
                </div>
            </Container>
        </div>
    )
    return content
}

export default Public;