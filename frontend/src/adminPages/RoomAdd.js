import React, { useState, useEffect } from 'react';
import { getRoomClass, getBedType, getRoomStatus, roomAdd } from '../api/index';
import styles from '../styles/RoomEdit.module.css';

const RoomAdd = ({ onBack }) => { 
    const [formData, setFormData] = useState({
        room_class_id: '',
        bed_type_id: '',
        room_status_id: '',
        floor: 1,
        bed_count: 1
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [roomClasses, setRoomClasses] = useState([]);
    const [bedTypes, setBedTypes] = useState([]);
    const [roomStatuses, setRoomStatuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [roomClassData, bedTypeData, roomStatusData] = await Promise.all([
                getRoomClass(),
                getBedType(),
                getRoomStatus()
            ]);

            setRoomClasses(roomClassData.data || roomClassData);
            setBedTypes(bedTypeData.data || bedTypeData);
            setRoomStatuses(roomStatusData.data || roomStatusData);
            setError(null);
        } catch (err) {
            setError('Failed to fetch form data. Please try again.');
            console.error('Error fetching form data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);

            const roomJson = {
                room_class_id: formData.room_class_id,
                bed_type_id: formData.bed_type_id,
                room_status_id: formData.room_status_id,
                floor: formData.floor,
                bed_count: formData.bed_count
            };

            const submitFormData = new FormData();
            submitFormData.append('image', image);
            submitFormData.append('room', JSON.stringify(roomJson));

            await roomAdd(submitFormData); 

            alert('Room added successfully!');
            if (onBack) {
                onBack();
            }

        } catch (err) {
            console.error('Error adding room:', err);
            alert('Failed to add room. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const generateFloorOptions = () => {
        return Array.from({ length: 10 }, (_, i) => i + 1).map(floor => (
            <option key={floor} value={floor}>
                Floor {floor}
            </option>
        ));
    };

    const generateBedCountOptions = () => {
        return Array.from({ length: 5 }, (_, i) => i + 1).map(count => (
            <option key={count} value={count}>
                {count} {count === 1 ? 'Bed' : 'Beds'}
            </option>
        ));
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading form data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>{error}</div>
                <button onClick={fetchAllData} className={styles.retryButton}>
                    Retry
                </button>
                <button onClick={onBack} className={styles.backButton}>
                    Back to Room Section
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={onBack} className={styles.backButton}>
                    ← Back to Room Section
                </button>
                <h2 className={styles.title}>Add New Room</h2> {/* Fixed: Changed title from "Edit Room" to "Add New Room" */}
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                {/* Image Upload Section */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Room Image</label>
                    <div className={styles.imageUploadSection}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className={styles.fileInput}
                            id="imageUpload"
                            required
                        />
                        <label htmlFor="imageUpload" className={styles.fileInputLabel}>
                            Choose Image
                        </label>
                        {imagePreview && (
                            <div className={styles.imagePreview}>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className={styles.previewImage}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Room Class Selection */}
                <div className={styles.formGroup}>
                    <label htmlFor="room_class_id" className={styles.label}>
                        Room Class
                    </label>
                    <select
                        id="room_class_id"
                        name="room_class_id"
                        value={formData.room_class_id}
                        onChange={handleInputChange}
                        className={styles.select}
                        required
                    >
                        <option value="">Select Room Class</option>
                        {roomClasses.map((roomClass) => (
                            <option key={roomClass.id} value={roomClass.id}>
                                {roomClass.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Bed Type Selection */}
                <div className={styles.formGroup}>
                    <label htmlFor="bed_type_id" className={styles.label}>
                        Bed Type
                    </label>
                    <select
                        id="bed_type_id"
                        name="bed_type_id"
                        value={formData.bed_type_id}
                        onChange={handleInputChange}
                        className={styles.select}
                        required
                    >
                        <option value="">Select Bed Type</option>
                        {bedTypes.map((bedType) => (
                            <option key={bedType.id} value={bedType.id}>
                                {bedType.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Room Status Selection */}
                <div className={styles.formGroup}>
                    <label htmlFor="room_status_id" className={styles.label}>
                        Room Status
                    </label>
                    <select
                        id="room_status_id"
                        name="room_status_id"
                        value={formData.room_status_id}
                        onChange={handleInputChange}
                        className={styles.select}
                        required
                    >
                        <option value="">Select Room Status</option>
                        {roomStatuses.map((status) => (
                            <option key={status.id} value={status.id}>
                                {status.status}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Floor Selection */}
                <div className={styles.formGroup}>
                    <label htmlFor="floor" className={styles.label}>
                        Floor
                    </label>
                    <select
                        id="floor"
                        name="floor"
                        value={formData.floor}
                        onChange={handleInputChange}
                        className={styles.select}
                        required
                    >
                        {generateFloorOptions()}
                    </select>
                </div>

                {/* Bed Count Selection */}
                <div className={styles.formGroup}>
                    <label htmlFor="bed_count" className={styles.label}>
                        Bed Count
                    </label>
                    <select
                        id="bed_count"
                        name="bed_count"
                        value={formData.bed_count}
                        onChange={handleInputChange}
                        className={styles.select}
                        required
                    >
                        {generateBedCountOptions()}
                    </select>
                </div>

                {/* Submit Button */}
                <div className={styles.formActions}>
                    <button
                        type="submit"
                        disabled={submitting}
                        className={styles.submitButton}
                    >
                        {submitting ? 'Adding...' : 'Add Room'}
                    </button>
                    <button
                        type="button"
                        onClick={onBack}
                        className={styles.cancelButton}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RoomAdd;