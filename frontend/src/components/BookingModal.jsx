import React, { useState } from 'react';
import { X, Users, CreditCard, ChevronRight } from 'lucide-react';
import './BookingModal.css';

const BookingModal = ({ slot, templeName, onClose, onConfirm }) => {
    const [devotees, setDevotees] = useState(1);

    const totalPrice = devotees * slot.price;

    return (
        <div className="modal-overlay">
            <div className="booking-modal glass-card">
                <button className="close-btn" onClick={onClose}><X size={24} /></button>

                <div className="modal-header">
                    <h2 className="premium-title">CONFIRM BOOKING</h2>
                    <p className="temple-subtitle">{templeName}</p>
                </div>

                <div className="booking-summary-box">
                    <div className="summary-item">
                        <span className="label">Date</span>
                        <span className="value">{slot.date}</span>
                    </div>
                    <div className="summary-item">
                        <span className="label">Time</span>
                        <span className="value">{slot.timeRange}</span>
                    </div>
                    <div className="summary-item">
                        <span className="label">Price per person</span>
                        <span className="value">₹{slot.price}</span>
                    </div>
                </div>

                <div className="devotee-selector">
                    <h3>Number of Devotees</h3>
                    <div className="counter">
                        <button
                            className="counter-btn"
                            onClick={() => setDevotees(Math.max(1, devotees - 1))}
                            disabled={devotees <= 1}
                        >–</button>
                        <span className="count-display">{devotees}</span>
                        <button
                            className="counter-btn"
                            onClick={() => setDevotees(Math.min(slot.seats, devotees + 1))}
                            disabled={devotees >= slot.seats}
                        >+</button>
                    </div>
                    <p className="available-info">Available: {slot.seats} seats</p>
                </div>

                <div className="total-box">
                    <span className="total-label">Total Amount</span>
                    <span className="total-value">₹{totalPrice}</span>
                </div>

                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="confirm-btn" onClick={() => onConfirm(devotees, totalPrice)}>
                        Confirm Booking 🕉️
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
