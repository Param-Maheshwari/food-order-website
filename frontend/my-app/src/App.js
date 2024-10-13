// App.js
import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import MainPage from './components/MainPage'; 
import AdminPage from './components/AdminPage'; 

// Create a User Context
const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
};

const App = () => {
    const [user, setUser] = useState(null);

    const handleLogin = (userInfo) => {
        setUser(userInfo);
        if (!userInfo.isAdmin) {
            // Store user info in local storage if it's a regular user
            localStorage.setItem('userName', userInfo.name);
            localStorage.setItem('userAddress', userInfo.address);
            localStorage.setItem('userEmail', userInfo.email);
            localStorage.setItem('userPhoneNo', userInfo.phoneNo);
            localStorage.setItem('isAdmin', false); // Store user as non-admin
        } else {
            // For admin, store admin status
            localStorage.setItem('isAdmin', true);
        }
    };

    const handleLogout = () => {
        // Clear user data from state and local storage on logout
        setUser(null);
        localStorage.removeItem('userName');
        localStorage.removeItem('userAddress');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userPhoneNo');
        localStorage.removeItem('isAdmin');
    };

    return (
        <UserContext.Provider value={{ user, handleLogin, handleLogout }}>
            <Router>
                <Routes>
                    <Route path="/" element={user ? <MainPage onLogout={handleLogout} /> : <Navigate to="/login" />} />
                    <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
                    <Route path="/admin" element={user && user.isAdmin ? <AdminPage /> : <Navigate to="/login" />} />
                </Routes>
            </Router>
        </UserContext.Provider>
    );
};

export default App;
