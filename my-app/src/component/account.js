// Component for managing and updating user account details
import React, { useState } from 'react';
import './account.css';
import { useLocation } from 'react-router';
import axios from 'axios';
import Loading from './Loading';

const AccountPage = () => {
    // Initialize user data from router state
    const location = useLocation();
    const {user} = location.state || {};

    // State management for form data and UI controls
    const [formData, setFormData] = useState({
        Username: user.Username,
        Password: user.Password,
        Phone: user.Phone,
        Email: user.Email,
        ID: user.ID
    });

    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Handle input changes in the form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    if (isLoading) return <div><Loading/></div>;

    // Handle form submission and API call
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);
        try {
            const response = await axios.put(`http://localhost:5000/api/users/update`, formData);
            
            setSuccess('Details updated successfully!');
            setIsEditing(false);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update details');
            console.error('Update error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="account-page">
            <div className="account-container">
                <h1>Account Details</h1>
                {/* Account details form with editable fields */}
                <form onSubmit={handleSubmit} className="account-form">
                    <div className="form-group">
                        <label htmlFor="Username">Username:</label>
                        <input
                            type="text"
                            id="Username"
                            name="Username"
                            value={formData.Username}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>

                    {/* Password field with show/hide toggle */}
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <div className="password-input">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="Password"
                                value={formData.Password}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                className="show-password"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone:</label>
                        <input
                            type="tel"
                            id="phone"
                            name="Phone"
                            value={formData.Phone}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="Email"
                            value={formData.Email}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="id">ID:</label>
                        <input
                            type="text"
                            id="id"
                            name="ID"
                            value={formData.ID}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>

                    {/* Conditional rendering of action buttons based on edit mode */}
                    <div className="button-group">
                        {isEditing ? (
                            <>
                                <button type="submit" className="save-button">
                                    Save Changes
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setIsEditing(false)}
                                    className="cancel-button"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button 
                                type="button" 
                                onClick={() => setIsEditing(true)}
                                className="edit-button"
                            >
                                Edit Details
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountPage;