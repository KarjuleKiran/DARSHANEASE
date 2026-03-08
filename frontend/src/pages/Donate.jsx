import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, IndianRupee, MessageCircle, ArrowRight, Loader } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import './Donate.css';

const Donate = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [temples, setTemples] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        templeId: '',
        amount: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchTemples = async () => {
            try {
                const { data } = await api.get('/temples');
                setTemples(data);
                if (data.length > 0) setFormData(prev => ({ ...prev, templeId: data[0]._id }));
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchTemples();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to contribute');
            navigate('/login');
            return;
        }
        setSubmitting(true);
        try {
            await api.post('/donations', {
                templeId: formData.templeId,
                amount: Number(formData.amount),
                message: formData.message
            });
            setSuccess(true);
            setFormData({ ...formData, amount: '', message: '' });
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            alert(err.response?.data?.message || 'Donation failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading-container"><Loader className="spinner" /></div>;

    return (
        <div className="donate-page">
            <div className="container auth-container">
                <div className="auth-logo-section">
                    <div className="auth-logo-icon"><Heart size={24} fill="currentColor" /></div>
                    <h1 className="auth-brand">DIVINE CONTRIBUTION</h1>
                    <p className="auth-welcome">Support your favorite temples</p>
                </div>

                <div className="auth-card glass-card">
                    {success && (
                        <div className="success-banner" style={{ background: 'rgba(40, 167, 69, 0.1)', color: '#28a745', padding: '15px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center' }}>
                            🕉️ Thank you for your generous contribution!
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label>Select Temple</label>
                            <div className="input-wrapper">
                                <select
                                    className="auth-select"
                                    value={formData.templeId}
                                    onChange={(e) => setFormData({ ...formData, templeId: e.target.value })}
                                    required
                                >
                                    {temples.map(t => (
                                        <option key={t._id} value={t._id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Donation Amount (₹)</label>
                            <div className="input-wrapper">
                                <IndianRupee className="input-icon" size={20} />
                                <input
                                    type="number"
                                    placeholder="501"
                                    required
                                    min="1"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Message (Optional)</label>
                            <div className="input-wrapper">
                                <MessageCircle className="input-icon" size={20} />
                                <textarea
                                    placeholder="Blessings for health and prosperity..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="auth-textarea"
                                />
                            </div>
                        </div>

                        <button type="submit" className="gradient-btn submit-btn" disabled={submitting}>
                            {submitting ? 'Processing...' : 'Contribute Now'} <ArrowRight size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Donate;
