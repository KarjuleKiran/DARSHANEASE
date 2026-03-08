import React from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, Menu, MapPin, Calendar, Heart, Shield, LayoutDashboard, Settings } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="logo-container">
                    <div className="logo-icon">🕉️</div>
                    <span className="logo-text">DARSHANEASE</span>
                </Link>

                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/temples" className="nav-link"><MapPin size={18} /> Temples</Link>

                    {user ? (
                        <>
                            {(user.role === 'user' || user.role === 'admin' || user.role === 'organizer') && (
                                <>
                                    <Link to="/my-bookings" className="nav-link"><Calendar size={18} /> My Bookings</Link>
                                    <Link to="/donate" className="nav-link"><Heart size={18} /> Donate</Link>
                                </>
                            )}

                            {(user.role === 'organizer' || user.role === 'admin') && (
                                <Link to="/dashboard" className="nav-link"><LayoutDashboard size={18} /> {user.role === 'organizer' ? 'Organizer' : 'Admin'}</Link>
                            )}

                            <div className="user-profile">
                                <div className="profile-btn">
                                    <User size={20} />
                                    <span>{user.name}</span>
                                </div>
                                <button onClick={onLogout} className="logout-btn">
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="login-btn">Login</Link>
                            <Link to="/register" className="gradient-btn login-btn">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
