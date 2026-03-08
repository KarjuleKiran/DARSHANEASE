import React, { useState, useEffect } from 'react';
import { Search, MapPin, Loader, AlertCircle } from 'lucide-react';
import TempleCard from '../components/TempleCard';
import api from '../utils/api';
import './Temples.css';

const Temples = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [temples, setTemples] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTemples = async () => {
            try {
                const { data } = await api.get('/temples');
                setTemples(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load temples. Please try again later.');
                setLoading(false);
            }
        };
        fetchTemples();
    }, []);

    const filteredTemples = temples.filter(temple =>
        temple.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        temple.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="temples-page">
            <div className="container">
                <div className="temples-header">
                    <div className="header-info">
                        <h1 className="sacred-title">SACRED TEMPLES</h1>
                        <p className="sacred-subtitle">Choose a temple to view available darshan slots</p>
                    </div>

                    <div className="search-box">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search by temple name or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <Loader className="spinner" size={48} />
                        <p>Searching for Temples...</p>
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <AlertCircle size={48} />
                        <p>{error}</p>
                    </div>
                ) : (
                    <>
                        <div className="temple-count">
                            <span>{filteredTemples.length} temples found</span>
                        </div>
                        <div className="temples-grid">
                            {filteredTemples.map(temple => (
                                <TempleCard key={temple._id} temple={temple} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Temples;
