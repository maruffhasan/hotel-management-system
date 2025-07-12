// utils/cartUtils.js

/**
 * Calculate the number of nights between two dates
 * @param {string} checkIn - Check-in date (YYYY-MM-DD)
 * @param {string} checkOut - Check-out date (YYYY-MM-DD)
 * @returns {number} Number of nights
 */
export const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const timeDiff = end.getTime() - start.getTime();
  const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  return nights > 0 ? nights : 0;
};

/**
 * Calculate total room price including number of nights
 * @param {Array} rooms - Array of room objects
 * @param {number} nights - Number of nights
 * @returns {number} Total room price
 */
export const calculateRoomTotal = (rooms, nights) => {
  if (!rooms.length || nights <= 0) return 0;
  
  return rooms.reduce((total, room) => {
    return total + (room.base_price * nights);
  }, 0);
};

/**
 * Calculate total addon price
 * @param {Array} addons - Array of all available addons
 * @param {Array} selectedAddonIds - Array of selected addon IDs
 * @returns {number} Total addon price
 */
export const calculateAddonTotal = (addons, selectedAddonIds) => {
  if (!addons.length || !selectedAddonIds.length) return 0;
  
  return selectedAddonIds.reduce((total, addonId) => {
    const addon = addons.find(a => a.id === addonId);
    return total + (addon ? addon.price : 0);
  }, 0);
};

/**
 * Calculate grand total (rooms + addons)
 * @param {number} roomTotal - Total room price
 * @param {number} addonTotal - Total addon price
 * @returns {number} Grand total
 */
export const calculateGrandTotal = (roomTotal, addonTotal) => {
  return roomTotal + addonTotal;
};

/**
 * Format price with currency symbol
 * @param {number} price - Price to format
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price || 0);
};

/**
 * Format date for display
 * @param {string} dateString - Date string (YYYY-MM-DD)
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Get room icon based on room class
 * @param {string} roomClass - Room class name
 * @returns {string} Room icon emoji
 */
export const getRoomIcon = (roomClass) => {
  const icons = {
    'standard': '🛏️',
    'deluxe': '🏨',
    'suite': '👑',
    'presidential': '💎',
    'economy': '🏠',
    'luxury': '✨'
  };
  
  const key = roomClass?.toLowerCase() || 'standard';
  return icons[key] || '🛏️';
};

/**
 * Validate booking form data
 * @param {Object} formData - Form data to validate
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export const validateBookingForm = (formData) => {
  const errors = [];
  
  if (!formData.check_in) {
    errors.push('Check-in date is required');
  }
  
  if (!formData.check_out) {
    errors.push('Check-out date is required');
  }
  
  if (formData.check_in && formData.check_out) {
    const checkIn = new Date(formData.check_in);
    const checkOut = new Date(formData.check_out);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkIn < today) {
      errors.push('Check-in date cannot be in the past');
    }
    
    if (checkOut <= checkIn) {
      errors.push('Check-out date must be after check-in date');
    }
  }
  
  if (!formData.price || formData.price <= 0) {
    errors.push('Price must be greater than 0');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Get stored data from localStorage with fallback
 * @param {string} key - localStorage key
 * @param {any} fallback - Fallback value if key doesn't exist
 * @returns {any} Stored value or fallback
 */
export const getStoredData = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return fallback;
  }
};

/**
 * Store data in localStorage
 * @param {string} key - localStorage key
 * @param {any} value - Value to store
 */
export const setStoredData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error storing ${key} in localStorage:`, error);
  }
};

/**
 * Clear specific keys from localStorage
 * @param {Array} keys - Array of keys to remove
 */
export const clearStoredData = (keys) => {
  keys.forEach(key => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  });
};