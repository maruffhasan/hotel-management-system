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
 * Calculate total room price including number of nights and features
 * Formula: Sum of all rooms: (room_class_base_price + features_prices) * nights
 * @param {Array} rooms - Array of room objects
 * @param {Array} roomClasses - Array of room class objects with features
 * @param {number} nights - Number of nights
 * @returns {number} Total room price
 */
export const calculateRoomTotal = (rooms, roomClasses, nights) => {
  if (!rooms.length || nights <= 0 || !roomClasses.length) return 0;
  
  return rooms.reduce((total, room) => {
    // Find the corresponding room class
    const roomClass = roomClasses.find(rc => rc.name === room.room_class_name);
    
    if (!roomClass) {
      // Fallback to room's base_price if room class not found
      console.warn(`Room class ${room.room_class_name} not found, using room base price`);
      return total + (room.base_price * nights);
    }
    
    // Use room class base price (this is the correct price source)
    const basePrice = roomClass.base_price;
    
    // Calculate features price from room class features
    const featuresPrice = roomClass.features?.reduce((featureTotal, feature) => {
      return featureTotal + (feature.price_per_use || 0);
    }, 0) || 0;
    
    // Calculate room price: (base_price + features_prices) * nights
    const roomPrice = (basePrice + featuresPrice) * nights;
    
    console.log(`Room ${room.id}: base=${basePrice}, features=${featuresPrice}, nights=${nights}, total=${roomPrice}`);
    
    return total + roomPrice;
  }, 0);
};

/**
 * Calculate total addon price (multiplied by number of rooms)
 * @param {Array} addons - Array of all available addons
 * @param {Array} selectedAddonIds - Array of selected addon IDs
 * @param {number} roomCount - Number of rooms (addons apply per room)
 * @returns {number} Total addon price
 */
export const calculateAddonTotal = (addons, selectedAddonIds, roomCount = 1) => {
  if (!addons.length || !selectedAddonIds.length) return 0;
  
  const addonSubtotal = selectedAddonIds.reduce((total, addonId) => {
    const addon = addons.find(a => a.id === addonId);
    return total + (addon ? addon.price : 0);
  }, 0);
  
  // Multiply by room count since addons apply to each room
  return addonSubtotal * roomCount;
};

/**
 * Calculate grand total (rooms + addons)
 * @param {number} roomTotal - Total room price
 * @param {number} addonTotal - Total addon price (already multiplied by room count)
 * @returns {number} Grand total
 */
export const calculateGrandTotal = (roomTotal, addonTotal) => {
  return roomTotal + addonTotal;
};

/**
 * Get room class data by name
 * @param {Array} roomClasses - Array of room class objects
 * @param {string} roomClassName - Name of the room class
 * @returns {Object|null} Room class object or null if not found
 */
export const getRoomClassByName = (roomClasses, roomClassName) => {
  return roomClasses.find(rc => rc.name === roomClassName) || null;
};

/**
 * Calculate individual room price with features (per night)
 * @param {Object} room - Room object
 * @param {Array} roomClasses - Array of room class objects
 * @returns {number} Room price per night including features
 */
export const calculateRoomPriceWithFeatures = (room, roomClasses) => {
  const roomClass = getRoomClassByName(roomClasses, room.room_class_name);
  
  if (!roomClass) {
    // Fallback to room's base_price if room class not found
    console.warn(`Room class ${room.room_class_name} not found, using room base price`);
    return room.base_price;
  }
  
  // Use room class base price (this is the correct price source)
  const basePrice = roomClass.base_price;
  const featuresPrice = roomClass.features_id?.reduce((total, feature) => {
    return total + (feature.price_per_use || 0);
  }, 0) || 0;
  
  return basePrice + featuresPrice;
};

/**
 * Get room features list
 * @param {Object} room - Room object
 * @param {Array} roomClasses - Array of room class objects
 * @returns {Array} Array of feature objects
 */
export const getRoomFeatures = (room, roomClasses) => {
  const roomClass = getRoomClassByName(roomClasses, room.room_class_name);
  return roomClass?.features_id || [];
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
 * @param {Array} keys - Array of localStorage keys to clear
 */
export const clearStoredData = (keys) => {
  try {
    keys.forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing localStorage keys:', error);
  }
};

/**
 * Clear all cart-related data from localStorage
 */
export const clearAllCartData = () => {
  const cartKeys = ['selectedRooms', 'check_in', 'check_out', 'selectedAddons'];
  clearStoredData(cartKeys);
};

/**
 * Get booking summary data
 * @param {Array} rooms - Array of room objects
 * @param {Array} roomClasses - Array of room class objects
 * @param {Array} selectedAddons - Array of selected addon IDs
 * @param {Array} addons - Array of all available addons
 * @param {string} checkIn - Check-in date
 * @param {string} checkOut - Check-out date
 * @returns {Object} Booking summary object
 */
export const getBookingSummary = (rooms, roomClasses, selectedAddons, addons, checkIn, checkOut) => {
  const nights = calculateNights(checkIn, checkOut);
  const roomTotal = calculateRoomTotal(rooms, roomClasses, nights);
  const addonTotal = calculateAddonTotal(addons, selectedAddons, rooms.length);
  const grandTotal = calculateGrandTotal(roomTotal, addonTotal);
  
  return {
    nights,
    roomCount: rooms.length,
    addonCount: selectedAddons.length,
    roomTotal,
    addonTotal,
    grandTotal,
    checkIn,
    checkOut
  };
};

/**
 * Validate date range
 * @param {string} checkIn - Check-in date (YYYY-MM-DD)
 * @param {string} checkOut - Check-out date (YYYY-MM-DD)
 * @returns {Object} Validation result with isValid boolean and error message
 */
export const validateDateRange = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) {
    return {
      isValid: false,
      error: 'Both check-in and check-out dates are required'
    };
  }
  
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (checkInDate < today) {
    return {
      isValid: false,
      error: 'Check-in date cannot be in the past'
    };
  }
  
  if (checkOutDate <= checkInDate) {
    return {
      isValid: false,
      error: 'Check-out date must be after check-in date'
    };
  }
  
  return {
    isValid: true,
    error: null
  };
};

/**
 * Calculate tax amount (if applicable)
 * @param {number} subtotal - Subtotal amount
 * @param {number} taxRate - Tax rate (default 0.1 for 10%)
 * @returns {number} Tax amount
 */
export const calculateTax = (subtotal, taxRate = 0.1) => {
  return subtotal * taxRate;
};

/**
 * Calculate total with tax
 * @param {number} subtotal - Subtotal amount
 * @param {number} taxRate - Tax rate (default 0.1 for 10%)
 * @returns {number} Total amount including tax
 */
export const calculateTotalWithTax = (subtotal, taxRate = 0.1) => {
  const tax = calculateTax(subtotal, taxRate);
  return subtotal + tax;
};

/**
 * Format duration in a human-readable way
 * @param {number} nights - Number of nights
 * @returns {string} Formatted duration string
 */
export const formatDuration = (nights) => {
  if (nights === 0) return '0 nights';
  if (nights === 1) return '1 night';
  return `${nights} nights`;
};

/**
 * Get minimum stay duration (can be configured per room class)
 * @param {string} roomClass - Room class name
 * @returns {number} Minimum nights required
 */
export const getMinimumStay = (roomClass) => {
  const minimumStays = {
    'presidential': 2,
    'suite': 1,
    'deluxe': 1,
    'standard': 1,
    'economy': 1
  };
  
  return minimumStays[roomClass?.toLowerCase()] || 1;
};

/**
 * Check if booking meets minimum stay requirements
 * @param {Array} rooms - Array of room objects
 * @param {number} nights - Number of nights
 * @returns {Object} Validation result
 */
export const validateMinimumStay = (rooms, nights) => {
  const errors = [];
  
  rooms.forEach(room => {
    const minStay = getMinimumStay(room.room_class_name);
    if (nights < minStay) {
      errors.push(`${room.room_class_name} rooms require a minimum stay of ${minStay} night${minStay > 1 ? 's' : ''}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};