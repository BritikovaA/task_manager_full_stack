import React, { useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8061/auth/change_password/', {
                email,
                old_password: oldPassword,
                new_password: newPassword,
            });
            setMessage(response.data.message);
            navigate('/tasks');
        } catch (error) {
            if (typeof error.response.data.detail === 'object') {
                setMessage(JSON.stringify(error.response.data.detail));
            } else {
                setMessage(error.response.data.detail);
            }
        }
    };
    
    
    return (
        <div className="container">
            <h2>Change Password</h2>
            <form onSubmit={handleChangePassword}>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Old Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Change Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default ChangePassword;
