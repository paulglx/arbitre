import React from 'react'
import store from '../app/store'
import { Container, Dropdown, DropdownButton, Navbar } from 'react-bootstrap'
import { useLogoutMutation } from '../features/auth/authApiSlice'

const Header = () => {

    const username = store.getState().auth?.user

    const [ logout ] = useLogoutMutation()

    const signout = () => {
        const refresh = store.getState().auth?.token
        logout({refresh})

    }

    return (
        <Navbar className="py-3 mb-3 border-bottom">
            <Container>
                <Navbar.Brand href={"/"} className="fw-bold">Arbitre</Navbar.Brand>
                <DropdownButton title={username} align="end">
                        <Dropdown.Item href="/courses">Courses</Dropdown.Item>
                        <Dropdown.Item href="/exercises">Submissions</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item as="button" onClick={signout}>Sign Out</Dropdown.Item>
                </DropdownButton>
            </Container>
        </Navbar>
    )
}

export default Header