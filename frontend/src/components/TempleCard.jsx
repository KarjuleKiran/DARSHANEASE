import React from 'react';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './TempleCard.css';

const TempleCard = ({ temple }) => {
    return (
        <div className="temple-card glass-card">
            <div className="temple-card-image">
                <img src={temple.imageUrl || '/temple-placeholder.png'} alt={temple.name} />
                <div className="temple-overlay-gradient"></div>
            </div>

            <div className="temple-card-content">
                <h3 className="temple-title">{temple.name}</h3>

                <div className="temple-info">
                    <div className="info-row">
                        <MapPin size={16} className="info-icon" />
                        {temple.mapLink ? (
                            <a href={temple.mapLink} target="_blank" rel="noopener noreferrer" className="location-link">
                                {temple.location}
                            </a>
                        ) : (
                            <span>{temple.location}</span>
                        )}
                    </div>
                    <div className="info-row">
                        <Clock size={16} className="info-icon" />
                        <span>{temple.darshanHours.start} – {temple.darshanHours.end}</span>
                    </div>
                </div>

                <p className="temple-desc">
                    {temple.description.length > 100
                        ? `${temple.description.substring(0, 100)}...`
                        : temple.description}
                </p>

                <Link to={`/temple/${temple._id}`} className="view-slots-btn">
                    Book Darshan <ArrowRight size={18} />
                </Link>
            </div>
        </div>
    );
};

export default TempleCard;
