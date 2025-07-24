// Room Classes API Helper Functions

const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to create headers with authorization
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Get all room classes
 * GET /api/roomclass/all
 */
export const getAllRoomClasses = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/room-class/all`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching room classes:', error);
    throw error;
  }
};

/**
 * Get a specific room class by ID
 * GET /api/roomclass/{id}
 */
export const getRoomClassById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/room-class/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error fetching room class ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new room class
 * POST /api/roomclass
 */
export const createRoomClass = async (roomClassData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/room-class/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(roomClassData)
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error creating room class:', error);
    throw error;
  }
};

/**
 * Update an existing room class
 * PUT /api/roomclass/{id}
 */
export const updateRoomClass = async (id, roomClassData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/room-class/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(roomClassData)
    });
    
    if(!response.ok)
        throw new ERROR('Room class update failed!');
  } catch (error) {
    console.error(`Error updating room class ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a room class
 * DELETE /api/roomclass/{id}
 */
export const deleteRoomClass = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/room-class/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    // Check if response has content
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting room class ${id}:`, error);
    throw error;
  }
};

/**
 * Get all features
 * GET /api/feature/all
 */
export const getAllFeatures = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/feature/all`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching features:', error);
    throw error;
  }
};

/**
 * Get a specific feature by ID
 * GET /api/feature/{id}
 */
export const getFeatureById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/feature/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error fetching feature ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new feature
 * POST /api/feature
 */
export const createFeature = async (featureData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/feature`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(featureData)
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error creating feature:', error);
    throw error;
  }
};

/**
 * Update an existing feature
 * PUT /api/feature/{id}
 */
export const updateFeature = async (id, featureData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/feature/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(featureData)
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error updating feature ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a feature
 * DELETE /api/feature/{id}
 */
export const deleteFeature = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/feature/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    // Check if response has content
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting feature ${id}:`, error);
    throw error;
  }
};

/**
 * Get room classes with specific features
 * GET /api/roomclass/with-features?featureIds=1,2,3
 */
export const getRoomClassesWithFeatures = async (featureIds) => {
  try {
    const featureIdsParam = Array.isArray(featureIds) ? featureIds.join(',') : featureIds;
    const response = await fetch(`${API_BASE_URL}/roomclass/with-features?featureIds=${featureIdsParam}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching room classes with features:', error);
    throw error;
  }
};

/**
 * Calculate total price for a room class (utility function)
 * This is a client-side calculation based on base price and features
 */
export const calculateRoomClassTotalPrice = (basePrice, features) => {
  if (!features || !Array.isArray(features)) {
    return basePrice;
  }
  
  const featuresTotal = features.reduce((sum, feature) => {
    return sum + (feature.price_per_use || 0);
  }, 0);
  
  return basePrice + featuresTotal;
};

/**
 * Format price for display (utility function)
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(price);
};

/**
 * Validate room class data before sending to API (utility function)
 */
export const validateRoomClassData = (roomClassData) => {
  const errors = [];
  
  if (!roomClassData.name || roomClassData.name.trim().length === 0) {
    errors.push('Room class name is required');
  }
  
  if (roomClassData.base_price === undefined || roomClassData.base_price === null || roomClassData.base_price < 0) {
    errors.push('Base price must be a non-negative number');
  }
  
  if (roomClassData.feature_ids && !Array.isArray(roomClassData.feature_ids)) {
    errors.push('Feature IDs must be an array');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
