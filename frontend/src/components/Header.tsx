import React from 'react'
import store from '../app/store'
import { Container, Dropdown, DropdownButton, Navbar } from 'react-bootstrap'

const Header = () => {

    const username = store.getState().auth?.user

    return (
        <Navbar className="py-3 mb-3 border-bottom">
            <Container>
                <Navbar.Brand href={"/"} className="fw-bold">Arbitre</Navbar.Brand>
                <DropdownButton title={username} align="end">
                        <Dropdown.Item href="/courses">Courses</Dropdown.Item>
                        <Dropdown.Item href="/exercises">Submissions</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item href="#">Sign Out</Dropdown.Item>
                </DropdownButton>
            </Container>
        </Navbar>
    )
}

export default Header