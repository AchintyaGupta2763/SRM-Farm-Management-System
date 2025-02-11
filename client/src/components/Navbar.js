import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <div className='navbar-heading'>
                <h1>SRM FARM MANAGEMENT SYSTEM</h1>
            </div>
            <nav className="navbar">
                <div className="navbar-links">
                    <Link to="/home" className="navbar-link">
                        Home
                    </Link>
                    <Link to="/dashboard" className="navbar-link">
                        Dashboard
                    </Link>
                    <Link to="/attendance" className="navbar-link">
                        Attendance
                    </Link>
                    <Link to="/daily-memorandum" className="navbar-link">
                        Daily Memorandum
                    </Link>
                    <Link to="/farm-produces" className="navbar-link">
                        Farm Produces
                    </Link>
                    <Link to="/forecast" className="navbar-link">
                        Forecast
                    </Link>
                    <Link to="/programme" className="navbar-link">
                        Programme
                    </Link>
                    <Link to="/purchase-register" className="navbar-link">
                        Purchase Register
                    </Link>
                    <Link to="/stock-register" className="navbar-link">
                        Stock Register
                    </Link>
                    <Link to="/farm-tools" className="navbar-link">
                        Farm Tools
                    </Link>
                    <Link to="/movement-register" className="navbar-link">
                        Movement Register
                    </Link>
                </div>
                <button onClick={handleLogout} className="navbar-button">
                    Logout
                </button>
            </nav>
        </>
        
    );
};

export default Navbar;
