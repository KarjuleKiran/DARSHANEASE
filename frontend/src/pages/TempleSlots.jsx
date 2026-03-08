import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, Clock, ArrowRight, IndianRupee, MapPin, Loader } from 'lucide-react';
import BookingModal from '../components/BookingModal';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import './TempleSlots.css';

const TempleSlots = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [slots, setSlots] = useState([]);
    const [temple, setTemple] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                // In a real flow, we'd fetch temple details and slots separately or together
                const slotsRes = await api.get(`/slots/temple/${id}`);
                setSlots(slotsRes.data);

                // Assuming we can get name from the first slot or fetch temple
                if (slotsRes.data.length > 0) {
                    setTemple(slotsRes.data[0].templeId);
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchSlots();
    }, [id]);

    const handleConfirmBooking = async (devotees, total) => {
        try {
            await api.post('/bookings', {
                slotId: selectedSlot._id,
                devotees
            });
            alert('Darshan booked successfully! 🕉️');
            setIsModalOpen(false);
            // Re-fetch slots to update availability
            const { data } = await api.get(`/slots/temple/${id}`);
            setSlots(data);
        } catch (err) {
            alert(err.response?.data?.message || 'Booking failed');
        }
    };

    if (loading) {
        return (
            <div className="loading-container" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Loader className="spinner" size={48} />
            </div>
        );
    }

    return (
        <div className="slots-page">
            <div className="container">
                <div className="temple-detail-header">
                    <h1 className="temple-name-header">{temple?.name || 'SACRED TEMPLE'}</h1>
                    <div className="temple-meta">
                        <span className="meta-item"><MapPin size={18} /> {temple?.location}</span>
                        <span className="meta-item"><Clock size={18} /> {temple?.darshanHours?.start} – {temple?.darshanHours?.end}</span>
                    </div>
                </div>

                <div className="section-title">
                    <h2>AVAILABLE DARSHAN SLOTS</h2>
                    <span className="count-badge">{slots.length}</span>
                </div>

                <div className="slots-grid">
                    {slots.map(slot => (
                        <div key={slot._id} className="slot-card glass-card">
                            <div className="slot-date">
                                <Calendar size={20} className="slot-icon" />
                                <div>
                                    <h4>{new Date(slot.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</h4>
                                    <p>{slot.timeRange.start} – {slot.timeRange.end}</p>
                                </div>
                            </div>

                            <div className="slot-seats-status">
                                <span className={`status-pill ${slot.maxSeats - slot.bookedSeats > 20 ? 'status-green' : 'status-red'}`}>
                                    {slot.maxSeats - slot.bookedSeats} seats available
                                </span>
                            </div>

                            <div className="slot-footer">
                                <div className="slot-pricing">
                                    <Users size={16} /> <span>{slot.maxSeats - slot.bookedSeats} seats</span> | <IndianRupee size={16} /> <span>₹{slot.pricePerPerson} / person</span>
                                </div>
                                <button className="book-btn" onClick={() => {
                                    if (!user) {
                                        alert('Please login to book darshan slots');
                                        navigate('/login');
                                        return;
                                    }
                                    setSelectedSlot(slot);
                                    setIsModalOpen(true);
                                }}>
                                    Book Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {isModalOpen && selectedSlot && (
                    <BookingModal
                        slot={{
                            ...selectedSlot,
                            date: new Date(selectedSlot.date).toLocaleDateString(),
                            timeRange: `${selectedSlot.timeRange.start} - ${selectedSlot.timeRange.end}`,
                            price: selectedSlot.pricePerPerson,
                            seats: selectedSlot.maxSeats - selectedSlot.bookedSeats
                        }}
                        templeName={temple?.name}
                        onClose={() => setIsModalOpen(false)}
                        onConfirm={handleConfirmBooking}
                    />
                )}
            </div>
        </div>
    );
};

export default TempleSlots;
