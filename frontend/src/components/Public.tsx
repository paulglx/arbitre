import React from "react";
import { Container } from "react-bootstrap";
import Register from "./Register";
import Login from "./Login";
import store from "../app/store";

const Public = () => {

    const state = store.getState()

    const loginRegisterBlock:JSX.Element = (state:any) => {
        if (state?.auth?.token === null) {
            return <Login />
        }
        else {
            return (<>
                <p>You are logged in as {state?.auth?.user}. <br /><a href="/courses">See courses</a></p>
            </>)
        }
    }

    const content = (
        <div className="vertical-center d-flex align-items-center justify-content-between">
            <Container className="p-3">
                    <div className="ms-auto w-50">
                        <h2 className='fw-bold border border-3 rounded-pill packed-border border-dark'>ARBITRE</h2>
                        <h5>an open source code judge</h5>
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