import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, MapPin, Search as LuSearch, ChevronRight, CheckCircle, Clock, Shield } from 'lucide-react';
import './Hero.css';

const Hero = () => {
    return (
        <div className="hero-section">
            <div className="container hero-container">
                <motion.div
                    className="hero-text"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="temple-badge">
                        <span className="badge-icon">🕉️</span>
                        <span>Temple Darshan Booking Platform</span>
                    </div>

                    <h1 className="hero-title">
                        BOOK YOUR <br />
                        <span className="accent-text">DIVINE DARSHAN</span> <br />
                        EFFORTLESSLY
                    </h1>

                    <p className="hero-subtitle">
                        Experience spirituality without the wait. Book darshan slots online
                        and avoid long waiting queues at your favorite temples.
                    </p>

                    <div className="cta-buttons">
                        <Link to="/temples" className="gradient-btn hero-btn">
                            View Temples <ChevronRight size={20} />
                        </Link>
                    </div>

                    <div className="hero-stats">
                        <div className="stat-item">
                            <CheckCircle className="stat-icon" size={20} />
                            <span>Free to Register</span>
                        </div>
                        <div className="stat-item">
                            <Clock className="stat-icon" size={20} />
                            <span>Instant Confirmation</span>
                        </div>
                        <div className="stat-item">
                            <Shield className="stat-icon" size={20} />
                            <span>Secure & Safe</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="hero-image"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="temple-illustration">
                        <div className="temple-glow"></div>
                        <img src="/temple-placeholder.png" alt="Divine Temple" className="floating-img" />
                        <div className="quote-badge">
                            <p>"सर्वे भवन्तु सुखिन:"</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
