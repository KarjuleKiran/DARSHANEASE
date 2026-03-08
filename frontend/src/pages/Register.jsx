import React, { useState, useContext } from 'react';
import { Mail, Lock, User, UserCheck, ShieldCheck, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const res = await register(formData.name, formData.email, formData.password, formData.role);
        if (res.success) {
            navigate('/dashboard');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-glow"></div>
            <div className="container auth-container">
                <div className="auth-logo-section">
                    <div className="auth-logo-icon">🕉️</div>
                    <h2 className="auth-brand">DARSHANEASE</h2>
                    <p className="auth-welcome">Join the Divine Connection</p>
                </div>

                <div className="auth-card glass-card luxury-register">
                    <h1 className="auth-title">Register</h1>

                    {error && (
                        <div className="auth-error" style={{ background: 'rgba(255, 0, 0, 0.1)', color: '#ff5e5e', padding: '12px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label>Full Name</label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={20} />
                                <input
                                    type="text"
                                    placeholder="Kiran Kumar"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={20} />
                                <input
                                    type="email"
                                    placeholder="kiran@test.com"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Join as</label>
                            <div className="role-selector">
                                <button
                                    type="button"
                                    className={`role-btn ${formData.role === 'user' ? 'selected' : ''}`}
                                    onClick={() => setFormData({ ...formData, role: 'user' })}
                                >
                                    <User size={18} /> Devotee
                                </button>
                                <button
                                    type="button"
                                    className={`role-btn ${formData.role === 'organizer' ? 'selected' : ''}`}
                                    onClick={() => setFormData({ ...formData, role: 'organizer' })}
                                >
                                    <ShieldCheck size={18} /> Organizer
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="gradient-btn submit-btn">
                            Create Account <ArrowRight size={20} />
                        </button>
                    </form>

                    <p className="auth-footer">
                        Already have an account? <Link to="/login">Sign in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
