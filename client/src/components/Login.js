import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Adjust path if necessary

const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        // Get a reference to the close button BEFORE the await, while it definitely exists.
        const closeButton = document.getElementById('loginModalCloseButton');
        if (!closeButton) {
            console.warn("[Login.js] Pre-emptive check: loginModalCloseButton NOT FOUND. This is unexpected before await login.");
        }

        try {
            // The login function from AuthContext now returns true on success or throws an error.
            const loginSuccessful = await login({ login: username, password: password });

            if (loginSuccessful) {
                console.log("[Login.js] AuthContext.login reported success.");
                // Call the callback instead of trying to click the button
                if (onLoginSuccess) {
                    onLoginSuccess();
                }
            }
            // If loginSuccessful was false or an error was thrown, the catch block handles it.
            // AuthProvider has already updated its state if login was successful.
            // The click on the close button should allow Bootstrap to hide the modal
            // before ListModels re-renders and potentially removes it abruptly.

        } catch (err) {
            console.error("Login component error:", err.message || err);
            setError(err.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mt-5 pt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Admin Login</h3>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label htmlFor="username">Username</label>
                                    <input 
                                        type="text" 
                                        className="form-control"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="password">Password</label>
                                    <input 
                                        type="password" 
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Logging in...' : 'Login'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login; 