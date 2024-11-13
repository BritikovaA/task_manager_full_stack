import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import NavigationBar from './components/Navbar';
import ChangePassword from './components/ChangePassword';
import './styles.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    const handleLogin = () => setIsAuthenticated(true);
    const handleLogout = () => setIsAuthenticated(false);

    return (
        <Router>
            <NavigationBar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/tasks" element={<TaskList />} />
                <Route path="/task/new" element={<TaskForm />} />
                <Route path="/change_password" element={<ChangePassword />} />
            </Routes>
        </Router>
    );
}

export default App;
