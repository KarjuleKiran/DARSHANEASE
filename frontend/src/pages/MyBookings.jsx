import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Loader, Ticket, IndianRupee } from 'lucide-react';
import api from '../utils/api';
import './MyBookings.css';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMyBookings = async () => {
            try {
                const { data } = await api.get('/bookings/my-bookings');
                setBookings(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load your bookings. Please try again.');
                setLoading(false);
            }
        };
        fetchMyBookings();
    }, []);

    if (loading) {
        return (
            <div className="loading-container" style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Loader className="spinner" size={48} />
            </div>
        );
    }

    return (
        <div className="my-bookings-page">
            <div className="container">
                <div className="section-title">
                    <h1 className="premium-title">MY DIVINE DARSHAN PASSES</h1>
                    <p className="subtitle">View and manage your upcoming and past temple visits</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                {bookings.length === 0 ? (
                    <div className="empty-bookings glass-card">
                        <Ticket size={64} className="empty-icon" />
                        <h3>No Bookings Found</h3>
                        <p>You haven't booked any darshan slots yet. Start your spiritual journey today!</p>
                        <a href="/temples" className="gradient-btn">Explore Temples</a>
                    </div>
                ) : (
                    <div className="bookings-list">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="booking-card glass-card">
                                <div className="booking-status">
                                    <span className={`status-pill ${booking.status === 'confirmed' ? 'status-green' : 'status-red'}`}>
                                        {booking.status.toUpperCase()}
                                    </span>
                                </div>

                                <div className="booking-content">
                                    <div className="temple-info">
                                        <h2>{booking.temple?.name}</h2>
                                        <p className="location"><MapPin size={16} /> {booking.temple?.location}</p>
                                    </div>

                                    <div className="booking-details">
                                        <div className="detail-item">
                                            <Calendar size={18} />
                                            <div>
                                                <span>Date</span>
                                                <p>{new Date(booking.slot?.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                            </div>
                                        </div>

                                        <div className="detail-item">
                                            <Clock size={18} />
                                            <div>
                                                <span>Time Slot</span>
                                                <p>{booking.slot?.timeRange?.start} – {booking.slot?.timeRange?.end}</p>
                                            </div>
                                        </div>

                                        <div className="detail-item">
                                            <IndianRupee size={18} />
                                            <div>
                                                <span>Contribution</span>
                                                <p>₹{booking.totalAmount} ({booking.devotees} Devotees)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="booking-footer">
                                    <div className="booking-id">Pass ID: {booking._id.substring(0, 8).toUpperCase()}</div>
                                    <button className="download-btn">Download Pass</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
