import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import axios from '../axiosConfig';

function NavigationBar() {
    const navigate = useNavigate();
    const handleLogout = async (e) => {
        e.preventDefault();
            const response = await axios.post('http://127.0.0.1:8061/auth/logout/');
            localStorage.removeItem('token', response.data.access_token);
            navigate('/');
    };

    return (
        <Navbar bg="dark" variant="dark" className="navbar-dark">
            <Container>
                <Navbar.Brand href="/">Task Manager</Navbar.Brand>
                <Nav className="ml-auto">
                    {localStorage.getItem('token') ? (
                        <>
                            <Nav.Link as={Link} to="/tasks">View Tasks</Nav.Link>
                            <Nav.Link as={Link} to="/task/new">Create New Task</Nav.Link>
                            <Nav.Link as={Link} to="/change_password">Change Password</Nav.Link>
                            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                        </>
                    ) : (
                        <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;
