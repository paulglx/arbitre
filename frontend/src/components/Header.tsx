import { Container, Dropdown, Nav, Navbar } from 'react-bootstrap'
import { selectCurrentRefreshToken, selectCurrentUser, selectIsTeacher } from '../features/auth/authSlice'

import { PersonCircle } from 'react-bootstrap-icons'
import React from 'react'
import { logOut } from '../features/auth/authSlice'
import { useDispatch } from 'react-redux'
import { useLogoutMutation } from '../features/auth/authApiSlice'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Header = () => {

    const username = useSelector(selectCurrentUser)
    const isTeacher = useSelector(selectIsTeacher)
    const refresh = useSelector(selectCurrentRefreshToken)

    const [logout] = useLogoutMutation()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const signout = () => {
        logout({ refresh })
        dispatch(logOut({}))
        navigate('/')
    }

    return (
        <Navbar className="py-3 border-bottom bg-light">
            <Container>
                <Navbar.Brand href={"/"} className="arbitre">ARBITRE</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/course">Courses</Nav.Link>
                        {isTeacher ? (<Nav.Link href="/results">Results</Nav.Link>) : (<></>)}
                    </Nav>

                    <Dropdown align="end">

                        <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
                            <PersonCircle className="align-middle" />
                            &nbsp;&nbsp;
                            <span>{username}</span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href="/course">Courses</Dropdown.Item>
                            <Dropdown.Item href="/exercise">Submissions</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item as="button" onClick={signout}>Sign Out</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header