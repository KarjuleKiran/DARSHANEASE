import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Temples from './pages/Temples';
import TempleSlots from './pages/TempleSlots';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Donate from './pages/Donate';
import MyBookings from './pages/MyBookings';
import { AuthContext } from './context/AuthContext';
import './index.css';

function App() {
    const { user, logout } = React.useContext(AuthContext);

    return (
        <div className="App">
            <Navbar user={user} onLogout={logout} />
            <main>
                <Routes>
                    <Route path="/" element={
                        <>
                            <Hero />
                            {/* Other sections will go here */}
                        </>
                    } />
                    <Route path="/temples" element={<Temples />} />
                    <Route path="/temple/:id" element={<TempleSlots />} />
                    <Route path="/dashboard" element={<Dashboard user={user} />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/donate" element={<Donate />} />
                    <Route path="/my-bookings" element={<MyBookings />} />
                </Routes>
            </main>

            <footer className="footer" style={{ padding: '60px 0', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', color: '#666' }}>
                <div className="container">
                    <p>© 2026 DARSHANEASE - All rights reserved</p>
                </div>
            </footer>
        </div>
    );
}

export default App;
