import React from 'react'
import store from '../app/store'
import { Container, Dropdown, DropdownButton, Navbar } from 'react-bootstrap'
import { useLogoutMutation } from '../features/auth/authApiSlice'
import { useNavigate } from 'react-router-dom'
import { logOut } from '../features/auth/authSlice'
import { useDispatch } from 'react-redux'


const Header = () => {

    const username = store.getState().auth?.user

    const [ logout ] = useLogoutMutation()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const signout = () => {
        const refresh = store.getState().auth?.refreshToken
        logout({refresh})
        dispatch(logOut({}))
        navigate('/')
    }

    return (
        <Navbar className="py-3 border-bottom bg-light">
            <Container>
                <Navbar.Brand href={"/"} className="arbitre">ARBITRE</Navbar.Brand>
                <DropdownButton title={username} align="end" variant="outline-dark">
                        <Dropdown.Item href="/course">Courses</Dropdown.Item>
                        <Dropdown.Item href="/exercise">Submissions</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item as="button" onClick={signout}>Sign Out</Dropdown.Item>
                </DropdownButton>
            </Container>
        </Navbar>
    )
}

export default Header