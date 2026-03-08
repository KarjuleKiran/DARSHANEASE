import React, { useState } from 'react';
import { X, Calendar, Clock, Users, IndianRupee, Loader } from 'lucide-react';
import './AddSlotModal.css';

const AddSlotModal = ({ temples, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        templeId: temples[0]?._id || '',
        date: '',
        startTime: '',
        endTime: '',
        maxSeats: 20,
        pricePerPerson: 50
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const slotData = {
                templeId: formData.templeId,
                date: formData.date,
                timeRange: {
                    start: formData.startTime,
                    end: formData.endTime
                },
                maxSeats: Number(formData.maxSeats),
                pricePerPerson: Number(formData.pricePerPerson)
            };

            await onSuccess(slotData);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create slot');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="slot-modal glass-card">
                <div className="modal-header">
                    <h2>ADD DARSHAN SLOT</h2>
                    <button className="close-btn" onClick={onClose}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="slot-form">
                    {error && <div className="error-msg">{error}</div>}

                    <div className="form-group">
                        <label>Select Temple</label>
                        <select
                            value={formData.templeId}
                            onChange={(e) => setFormData({ ...formData, templeId: e.target.value })}
                            required
                        >
                            {temples.map(t => (
                                <option key={t._id} value={t._id}>{t.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Date</label>
                        <div className="input-with-icon">
                            <Calendar size={18} />
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Start Time (e.g. 06:00 AM)</label>
                            <div className="input-with-icon">
                                <Clock size={18} />
                                <input
                                    type="text"
                                    placeholder="06:00 AM"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>End Time (e.g. 06:10 AM)</label>
                            <div className="input-with-icon">
                                <Clock size={18} />
                                <input
                                    type="text"
                                    placeholder="06:10 AM"
                                    value={formData.endTime}
                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Max Seats</label>
                            <div className="input-with-icon">
                                <Users size={18} />
                                <input
                                    type="number"
                                    value={formData.maxSeats}
                                    onChange={(e) => setFormData({ ...formData, maxSeats: e.target.value })}
                                    required
                                    min="1"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Price per Person (₹)</label>
                            <div className="input-with-icon">
                                <IndianRupee size={18} />
                                <input
                                    type="number"
                                    value={formData.pricePerPerson}
                                    onChange={(e) => setFormData({ ...formData, pricePerPerson: e.target.value })}
                                    required
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="gradient-btn submit-btn" disabled={submitting}>
                        {submitting ? <Loader className="spinner" size={20} /> : 'Create Slot 🕉️'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddSlotModal;
