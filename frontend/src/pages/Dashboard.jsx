import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    Calendar,
    Heart,
    MapPin,
    Plus,
    Check,
    X,
    Edit,
    Trash2,
    Users,
    IndianRupee,
    Loader,
    MessageCircle
} from 'lucide-react';
import api from '../utils/api';
import AddSlotModal from '../components/AddSlotModal';
import AddTempleModal from '../components/AddTempleModal';
import './Dashboard.css';

const Dashboard = ({ user }) => {
    const [activeTab, setActiveTab] = useState('temples');
    const [stats, setStats] = useState([]);
    const [data, setData] = useState({ temples: [], bookings: [], donations: [] });
    const [loading, setLoading] = useState(true);
    const [showAddSlot, setShowAddSlot] = useState(false);
    const [showAddTemple, setShowAddTemple] = useState(false);
    const [editingTemple, setEditingTemple] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                // Concurrent requests
                const [templesRes, bookingsRes, donationsRes] = await Promise.all([
                    api.get('/temples'),
                    api.get('/bookings'),
                    api.get('/donations')
                ]);

                const templesData = templesRes.data;
                const bookingsData = bookingsRes.data;
                const donationsData = donationsRes.data;

                setData({
                    temples: templesData,
                    bookings: bookingsData,
                    donations: donationsData
                });

                // Calculate Totals
                const totalDonation = donationsData.reduce((acc, curr) => acc + curr.amount, 0);
                const totalBookingRevenue = bookingsData.reduce((acc, curr) => acc + curr.totalAmount, 0);

                // Prep Stats
                setStats([
                    { label: 'Managed Temples', value: templesData.length, icon: <MapPin size={24} />, color: '#FFB800' },
                    { label: 'Total Bookings', value: bookingsData.length, icon: <Calendar size={24} />, color: '#FF7A00' },
                    { label: 'Booking Revenue', value: `₹${totalBookingRevenue}`, icon: <IndianRupee size={24} />, color: '#FFD600' },
                    { label: 'Donations Recvd', value: `₹${totalDonation}`, icon: <Heart size={24} />, color: '#FF4D00' },
                ]);

                setLoading(false);
            } catch (err) {
                console.error('DASHBOARD_FETCH_ERROR:', err);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    const handleDeleteTemple = async (templeId) => {
        if (!window.confirm("Are you sure you want to delete this temple? This action cannot be undone.")) return;
        try {
            await api.delete(`/temples/${templeId}`);
            // Update UI list statically without full refetch
            setData(prev => ({ ...prev, temples: prev.temples.filter(t => t._id !== templeId) }));
            setStats(prev => {
                const newStats = [...prev];
                newStats[0].value -= 1;
                return newStats;
            });
        } catch (err) {
            console.error("Failed to delete temple", err);
            alert("Failed to delete temple");
        }
    };

    if (loading) return <div className="loading-container"><Loader className="spinner" /></div>;

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header">
                    <div className="dashboard-title-section">
                        <h1 className="dashboard-title">
                            {user.role === 'admin' ? 'ADMIN DASHBOARD' : 'ORGANIZER DASHBOARD'}
                        </h1>
                        <p className="dashboard-subtitle">
                            {user.role === 'admin' ? 'Monitoring all 7 temples and global transactions' : 'Managing your respective temple data'}
                        </p>
                    </div>
                    {user.role === 'organizer' && (
                        <button className="gradient-btn add-btn" onClick={() => setShowAddSlot(true)}>
                            <Plus size={20} /> Add Slot
                        </button>
                    )}
                    {user.role === 'admin' && (
                        <button className="gradient-btn add-btn" onClick={() => setShowAddTemple(true)}>
                            <Plus size={20} /> Add Temple
                        </button>
                    )}
                </div>

                <div className="stats-row" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-card glass-card">
                            <div className="stat-icon-circle" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                                {stat.icon}
                            </div>
                            <div className="stat-info">
                                <h3>{stat.value}</h3>
                                <p>{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="dashboard-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'temples' ? 'active' : ''}`}
                        onClick={() => setActiveTab('temples')}
                    >
                        Temples
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bookings')}
                    >
                        Bookings
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'donations' ? 'active' : ''}`}
                        onClick={() => setActiveTab('donations')}
                    >
                        Donations
                    </button>
                </div>

                <div className="dashboard-content">
                    {activeTab === 'temples' && (
                        <div className="table-container glass-card">
                            <div className="table-header">
                                <h2>TEMPLES</h2>
                            </div>
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>Temple Name</th>
                                        <th>Location</th>
                                        <th>Darshan Hours</th>
                                        {user.role === 'admin' && <th>Status</th>}
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.temples.map(temple => (
                                        <tr key={temple._id}>
                                            <td className="bold-text">{temple.name}</td>
                                            <td>{temple.location}</td>
                                            <td>{temple.darshanHours.start} – {temple.darshanHours.end}</td>
                                            {user.role === 'admin' && (
                                                <td>
                                                    <span className={`status-tag ${temple.approved ? 'approved' : 'pending'}`}>
                                                        {temple.approved ? 'Approved' : 'Pending'}
                                                    </span>
                                                </td>
                                            )}
                                            <td>
                                                <div className="action-btns">
                                                    {user.role === 'admin' && !temple.approved && (
                                                        <button className="icon-btn check-btn" title="Approve"><Check size={18} /></button>
                                                    )}
                                                    <button
                                                        className="icon-btn edit-btn"
                                                        title="Edit"
                                                        onClick={() => setEditingTemple(temple)}
                                                    ><Edit size={18} /></button>
                                                    <button
                                                        className="icon-btn delete-btn"
                                                        title="Delete"
                                                        onClick={() => handleDeleteTemple(temple._id)}
                                                    ><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'bookings' && (
                        <div className="table-container glass-card">
                            <div className="table-header">
                                <h2>ALL BOOKINGS</h2>
                            </div>
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Temple</th>
                                        <th>Devotees</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.bookings.map(booking => (
                                        <tr key={booking._id}>
                                            <td className="bold-text">{booking.user?.name}</td>
                                            <td>{booking.temple?.name}</td>
                                            <td>{booking.devotees}</td>
                                            <td className="amount-text">₹{booking.totalAmount}</td>
                                            <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {activeTab === 'donations' && (
                        <div className="table-container glass-card">
                            <div className="table-header">
                                <h2>DONATIONS HISTORY</h2>
                            </div>
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>Donor</th>
                                        <th>Temple</th>
                                        <th>Amount</th>
                                        <th>Message</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.donations.map(donation => (
                                        <tr key={donation._id}>
                                            <td className="bold-text">{donation.user?.name}</td>
                                            <td>{donation.temple?.name}</td>
                                            <td className="amount-text">₹{donation.amount}</td>
                                            <td style={{ maxWidth: '300px' }}>
                                                {donation.message ? (
                                                    <div title={donation.message} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ccc' }}>
                                                        <MessageCircle size={14} />
                                                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{donation.message}</span>
                                                    </div>
                                                ) : '-'}
                                            </td>
                                            <td>{new Date(donation.donationDate).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {showAddSlot && (
                <AddSlotModal
                    temples={data.temples}
                    onClose={() => setShowAddSlot(false)}
                    onSuccess={async (slotData) => {
                        await api.post('/slots', slotData);
                        setShowAddSlot(false);
                        alert('Slot added successfully! 🕉️');
                    }}
                />
            )}

            {(showAddTemple || editingTemple) && (
                <AddTempleModal
                    initialData={editingTemple}
                    onClose={() => {
                        setShowAddTemple(false);
                        setEditingTemple(null);
                    }}
                    onSuccess={async () => {
                        setShowAddTemple(false);
                        setEditingTemple(null);
                        alert(editingTemple ? 'Temple updated successfully! 📝' : 'Temple added successfully! 🛕');
                        // Quick re-fetch to update the UI
                        try {
                            setLoading(true);
                            const res = await api.get('/temples');
                            setData(prev => ({ ...prev, temples: res.data }));
                            setStats(prev => {
                                const newStats = [...prev];
                                newStats[0].value = res.data.length;
                                return newStats;
                            });
                        } catch (err) {
                            console.error('Error refetching temples', err);
                        } finally {
                            setLoading(false);
                        }
                    }}
                />
            )}
        </div>
    );
};

export default Dashboard;
