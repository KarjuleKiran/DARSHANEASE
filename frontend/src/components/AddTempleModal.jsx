import React, { useState, useEffect } from 'react';
import { X, Upload, MapPin, Clock, Info, User, Image, Link } from 'lucide-react';
import api from '../utils/api';
import './AddTempleModal.css';

const AddTempleModal = ({ onClose, onSuccess, initialData }) => {
    const [organizers, setOrganizers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [form, setForm] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        location: initialData?.location || '',
        imageUrl: initialData?.imageUrl || '',
        mapLink: initialData?.mapLink || '',
        darshanHoursStart: initialData?.darshanHours?.start || '05:00 AM',
        darshanHoursEnd: initialData?.darshanHours?.end || '09:00 PM',
        organizerId: initialData?.organizer?._id || initialData?.organizer || ''
    });

    useEffect(() => {
        if (initialData?.imageUrl) {
            setImagePreview(initialData.imageUrl);
        }
    }, [initialData]);

    useEffect(() => {
        api.get('/temples/organizers').then(res => {
            setOrganizers(res.data);
            if (res.data.length > 0) setForm(f => ({ ...f, organizerId: res.data[0]._id }));
        }).catch(() => { });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (name === 'imageUrl') setImagePreview(value);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            processFile(file);
        }
    };

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        if (file) processFile(file);
    };

    const processFile = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64Str = e.target.result;
            setImagePreview(base64Str);
            setForm(prev => ({ ...prev, imageUrl: base64Str }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.name || !form.description || !form.location || !form.organizerId) {
            setError('Please fill in all required fields.');
            return;
        }
        setLoading(true);
        try {
            const payload = {
                name: form.name,
                description: form.description,
                location: form.location,
                imageUrl: form.imageUrl,
                mapLink: form.mapLink,
                darshanHours: {
                    start: form.darshanHoursStart,
                    end: form.darshanHoursEnd
                },
                organizerId: form.organizerId
            };

            if (initialData?._id) {
                await api.put(`/temples/${initialData._id}`, payload);
            } else {
                await api.post('/temples', payload);
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${initialData ? 'update' : 'create'} temple.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="atm-overlay" onClick={onClose}>
            <div className="atm-modal" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="atm-header">
                    <h2 className="atm-title">🛕 {initialData ? 'EDIT TEMPLE' : 'ADD NEW TEMPLE'}</h2>
                    <button className="atm-close" onClick={onClose}><X size={22} /></button>
                </div>

                {error && <div className="atm-error">{error}</div>}

                <form onSubmit={handleSubmit} className="atm-form">
                    {/* Image Drag & Drop Area */}
                    <div className="atm-field">
                        <label><Upload size={14} /> Upload Temple Image</label>
                        <div
                            className={`atm-drag-drop ${isDragging ? 'dragging' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('templeImgUpload').click()}
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt="Temple Preview" className="atm-preview-img" />
                            ) : (
                                <div className="atm-upload-placeholder">
                                    <Upload size={32} />
                                    <span>Drag & Drop an image here</span>
                                    <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>or click to browse</span>
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            id="templeImgUpload"
                            accept="image/*"
                            onChange={handleFileInput}
                            style={{ display: 'none' }}
                        />
                        <div style={{ textAlign: 'center', margin: '4px 0', fontSize: '0.8rem', opacity: 0.5 }}>OR USE URL</div>
                        <input
                            type="url"
                            name="imageUrl"
                            placeholder="https://example.com/temple.jpg"
                            value={form.imageUrl}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Temple Name */}
                    <div className="atm-field">
                        <label><Info size={14} /> Temple Name <span className="req">*</span></label>
                        <input
                            type="text"
                            name="name"
                            placeholder="e.g. Shreemant Dagdusheth Halwai Ganpati"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="atm-field">
                        <label><Info size={14} /> Description / About Temple <span className="req">*</span></label>
                        <textarea
                            name="description"
                            rows={3}
                            placeholder="Brief history or description of the temple..."
                            value={form.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Location */}
                    <div className="atm-field">
                        <label><MapPin size={14} /> Location <span className="req">*</span></label>
                        <input
                            type="text"
                            name="location"
                            placeholder="e.g. Pune, Maharashtra"
                            value={form.location}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Map Link */}
                    <div className="atm-field">
                        <label><Link size={14} /> Google Maps Link</label>
                        <input
                            type="url"
                            name="mapLink"
                            placeholder="https://maps.google.com/?q=..."
                            value={form.mapLink}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Darshan Hours */}
                    <div className="atm-row">
                        <div className="atm-field">
                            <label><Clock size={14} /> Opening Time <span className="req">*</span></label>
                            <input
                                type="text"
                                name="darshanHoursStart"
                                placeholder="e.g. 05:00 AM"
                                value={form.darshanHoursStart}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="atm-field">
                            <label><Clock size={14} /> Closing Time <span className="req">*</span></label>
                            <input
                                type="text"
                                name="darshanHoursEnd"
                                placeholder="e.g. 09:00 PM"
                                value={form.darshanHoursEnd}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Assign Organizer */}
                    <div className="atm-field">
                        <label><User size={14} /> Assign Organizer <span className="req">*</span></label>
                        <select
                            name="organizerId"
                            value={form.organizerId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Select Organizer --</option>
                            {organizers.map(org => (
                                <option key={org._id} value={org._id}>
                                    {org.name} ({org.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Submit */}
                    <button type="submit" className="atm-submit" disabled={loading}>
                        {loading ? 'Saving...' : (initialData ? '📝 Save Changes' : '🛕 Create Temple')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTempleModal;
