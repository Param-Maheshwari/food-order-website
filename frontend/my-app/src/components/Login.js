import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ onLogin }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State to handle error messages
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        if (isAdmin) {
            // Check admin credentials
            if (username === 'admin' && password === '1234') {
                onLogin({ name: 'Admin', isAdmin: true });
                navigate('/admin'); // Navigate to admin portal
            } else {
                setErrorMessage('Invalid admin credentials');
            }
        } else {
            // Check user credentials
            if (name && email && phoneNo) {
                // Store user info in local storage
                localStorage.setItem('userName', name); // Store user name for future use
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userPhoneNo', phoneNo);
                
                onLogin({ name, isAdmin: false }); // Pass user data to parent component
                navigate('/'); // Navigate to user dashboard or home
            } else {
                setErrorMessage('Please enter valid user credentials'); // Set error if form is incomplete
            }
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>

            <div>
                <label>
                    <input
                        type="radio"
                        value="user"
                        checked={!isAdmin}
                        onChange={() => setIsAdmin(false)}
                    />
                    Login as User
                </label>
                <label>
                    <input
                        type="radio"
                        value="admin"
                        checked={isAdmin}
                        onChange={() => setIsAdmin(true)}
                    />
                    Login as Admin
                </label>
            </div>

            <form onSubmit={handleLogin}>
                {isAdmin ? (
                    <>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </>
                ) : (
                    <>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={phoneNo}
                            onChange={(e) => setPhoneNo(e.target.value)}
                            required
                        />
                    </>
                )}

                <button type="submit">Login</button>

                {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Error message */}
            </form>
        </div>
    );
}

export default Login;
