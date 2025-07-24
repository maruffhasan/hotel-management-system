import React, { useState, useEffect } from 'react';
import { getAllFeatures, createFeature, updateFeature, deleteFeature } from '../utils/roomClassesApiHelpers.js';
import '../styles/AdminDashboard.css';

export default function RoomFeaturesSection() {
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [featureToDelete, setFeatureToDelete] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [newFeature, setNewFeature] = useState({
        name: '',
        price_per_use: ''
    });
    const [editFeature, setEditFeature] = useState({
        name: '',
        price_per_use: ''
    });

    useEffect(() => {
        fetchFeatures();
    }, []);

    const fetchFeatures = async () => {
        setLoading(true);
        try {
            const featuresData = await getAllFeatures();
            setFeatures(featuresData);
        } catch (error) {
            console.error('Error fetching features:', error);
            alert('Error fetching features. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddFeature = async (e) => {
        e.preventDefault();
        if (!newFeature.name.trim()) {
            alert('Feature name is required');
            return;
        }
        if (!newFeature.price_per_use || parseFloat(newFeature.price_per_use) < 0) {
            alert('Valid price per use is required');
            return;
        }

        setLoading(true);
        try {
            const featureData = {
                name: newFeature.name.trim(),
                price_per_use: parseFloat(newFeature.price_per_use)
            };
            await createFeature(featureData);
            setShowAddModal(false);
            setNewFeature({ name: '', price_per_use: '' });
            fetchFeatures();
            alert('Feature added successfully!');
        } catch (error) {
            console.error('Error adding feature:', error);
            alert(`Error adding feature: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleEditFeature = async (e) => {
        e.preventDefault();
        if (!editFeature.name.trim()) {
            alert('Feature name is required');
            return;
        }
        if (!editFeature.price_per_use || parseFloat(editFeature.price_per_use) < 0) {
            alert('Valid price per use is required');
            return;
        }

        setLoading(true);
        try {
            const featureData = {
                name: editFeature.name.trim(),
                price_per_use: parseFloat(editFeature.price_per_use)
            };
            await updateFeature(selectedFeature.id, featureData);
            setShowEditModal(false);
            setSelectedFeature(null);
            setEditFeature({ name: '', price_per_use: '' });
            fetchFeatures();
            alert('Feature updated successfully!');
        } catch (error) {
            console.error('Error updating feature:', error);
            alert(`Error updating feature: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFeature = async () => {
        if (!featureToDelete) return;

        setLoading(true);
        try {
            await deleteFeature(featureToDelete.id);
            setShowDeleteModal(false);
            setFeatureToDelete(null);
            fetchFeatures();
            alert('Feature deleted successfully!');
        } catch (error) {
            console.error('Error deleting feature:', error);
            alert(`Error deleting feature: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (feature) => {
        setSelectedFeature(feature);
        setEditFeature({
            name: feature.name || '',
            price_per_use: feature.price_per_use ? feature.price_per_use.toString() : ''
        });
        setShowEditModal(true);
    };

    const closeModals = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setSelectedFeature(null);
        setNewFeature({ name: '', price_per_use: '' });
        setEditFeature({ name: '', price_per_use: '' });
    };

    const renderAddModal = () => {
        if (!showAddModal) return null;

        return (
            <div className="modal-overlay">
                <div className="modal">
                    <div className="modal-header">
                        <h3>Add New Feature</h3>
                        <button className="modal-close" onClick={closeModals}>
                            ×
                        </button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleAddFeature}>
                            <div className="form-group">
                                <label htmlFor="featureName">Feature Name *</label>
                                <input
                                    type="text"
                                    id="featureName"
                                    value={newFeature.name}
                                    onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
                                    placeholder="Enter feature name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="featurePricePerUse">Price Per Use *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    id="featurePricePerUse"
                                    value={newFeature.price_per_use}
                                    onChange={(e) => setNewFeature({ ...newFeature, price_per_use: e.target.value })}
                                    placeholder="Enter price per use"
                                    required
                                />
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={closeModals}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primaryy"
                                    disabled={loading}
                                >
                                    {loading ? 'Adding...' : 'Add Feature'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    };

    const renderEditModal = () => {
        if (!showEditModal) return null;

        return (
            <div className="modal-overlay">
                <div className="modal">
                    <div className="modal-header">
                        <h3>Edit Feature</h3>
                        <button className="modal-close" onClick={closeModals}>
                            ×
                        </button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleEditFeature}>
                            <div className="form-group">
                                <label htmlFor="editFeatureName">Feature Name *</label>
                                <input
                                    type="text"
                                    id="editFeatureName"
                                    value={editFeature.name}
                                    onChange={(e) => setEditFeature({ ...editFeature, name: e.target.value })}
                                    placeholder="Enter feature name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="editFeaturePricePerUse">Price Per Use *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    id="editFeaturePricePerUse"
                                    value={editFeature.price_per_use}
                                    onChange={(e) => setEditFeature({ ...editFeature, price_per_use: e.target.value })}
                                    placeholder="Enter price per use"
                                    required
                                />
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={closeModals}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primaryy"
                                    disabled={loading}
                                >
                                    {loading ? 'Updating...' : 'Update Feature'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    };

    // Add this with your other modal renderers
    const renderDeleteModal = () => {
        if (!showDeleteModal) return null;

        return (
            <div className="modal-overlay">
                <div className="modal">
                    <div className="modal-header">
                        <h3>Confirm Delete</h3>
                        <button className="modal-close" onClick={() => {
                            setShowDeleteModal(false);
                            setFeatureToDelete(null);
                        }}>
                            ×
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure you want to delete the feature "{featureToDelete?.name}"?</p>
                        <p>This action cannot be undone.</p>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setFeatureToDelete(null);
                                }}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-delete"
                                onClick={handleDeleteFeature}
                                disabled={loading}
                            >
                                {loading ? 'Deleting...' : 'Delete Feature'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    return (
        <div className="content-section">
            <div className="section-header">
                <h1>Room Features</h1>
                <button
                    className="btn btn-primaryy"
                    onClick={() => setShowAddModal(true)}
                    disabled={loading}
                >
                    Add Feature
                </button>
            </div>

            {loading && features.length === 0 ? (
                <div className="placeholder-content">
                    <p>Loading features...</p>
                </div>
            ) : features.length === 0 ? (
                <div className="placeholder-content">
                    <p>No features found. Add your first feature to get started.</p>
                </div>
            ) : (
                <div className="users-table">
                    <div className="table-header">
                        <div className="table-cell">Feature Name</div>
                        <div className="table-cell">Price Per Use</div>
                        <div className="table-cell">Edit features</div>
                        <div className="table-cell">Delete features</div>
                    </div>

                    {features.map((feature) => (
                        <div key={feature.id} className="table-row">
                            <div className="table-cell" data-label="Feature Name">
                                <strong>{feature.name}</strong>
                            </div>
                            <div className="table-cell" data-label="Price Per Use">
                                ${feature.price_per_use ? parseFloat(feature.price_per_use).toFixed(2) : '0.00'}
                            </div>
                            <div className="table-cell" data-label="Edit features">
                                <button
                                    className="btn btn-edit"
                                    onClick={() => openEditModal(feature)}
                                    disabled={loading}
                                >
                                    Edit
                                </button>
                            </div>
                            <div className="table-cell" data-label="Delete features">
                                <button
                                    className="btn btn-delete"
                                    onClick={() => {
                                        setFeatureToDelete(feature);
                                        setShowDeleteModal(true);
                                    }}
                                    disabled={loading}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {renderAddModal()}
            {renderEditModal()}
            {renderDeleteModal()}
        </div>
    );
}