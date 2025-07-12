/**
 * Utility functions for the Hotel Yammi application
 */

/**
 * Format price with currency symbol and proper formatting
 * @param {number|string} price - The price to format
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price) => {
  if (!price && price !== 0) return 'Price not available';
  
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) return 'Invalid price';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numPrice);
};

/**
 * Get appropriate icon for room class
 * @param {string} roomClass - The room class name
 * @returns {string} - Emoji icon for the room class
 */
export const getRoomIcon = (roomClass) => {
  if (!roomClass) return '🏨';
  
  const classLower = roomClass.toLowerCase();
  
  const iconMap = {
    'standard': '🛏️',
    'deluxe': '🌟',
    'suite': '👑',
    'presidential': '💎',
    'family': '👨‍👩‍👧‍👦',
    'single': '🛏️',
    'double': '🛏️',
    'twin': '🛏️',
    'king': '👑',
    'queen': '👸',
    'studio': '🎨',
    'penthouse': '🏰',
    'luxury': '✨',
    'economy': '💰',
    'business': '💼'
  };
  
  // Check for exact matches first
  if (iconMap[classLower]) {
    return iconMap[classLower];
  }
  
  // Check for partial matches
  for (const [key, icon] of Object.entries(iconMap)) {
    if (classLower.includes(key)) {
      return icon;
    }
  }
  
  return '🏨'; // Default icon
};

/**
 * Get bed type icon
 * @param {string} bedType - The bed type name
 * @returns {string} - Emoji icon for the bed type
 */
export const getBedIcon = (bedType) => {
  if (!bedType) return '🛏️';
  
  const bedLower = bedType.toLowerCase();
  
  const bedIconMap = {
    'king': '👑',
    'queen': '👸',
    'double': '🛏️',
    'twin': '🛏️',
    'single': '🛏️',
    'sofa': '🛋️',
    'bunk': '🪜',
    'murphy': '🚪'
  };
  
  for (const [key, icon] of Object.entries(bedIconMap)) {
    if (bedLower.includes(key)) {
      return icon;
    }
  }
  
  return '🛏️'; // Default bed icon
};

/**
 * Format date to readable string
 * @param {string|Date} date - The date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return 'Date not available';
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return 'Invalid date';
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(dateObj);
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Calculate number of nights between two dates
 * @param {string|Date} checkIn - Check-in date
 * @param {string|Date} checkOut - Check-out date
 * @returns {number} - Number of nights
 */
export const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  
  try {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return 0;
    }
    
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  } catch (error) {
    return 0;
  }
};

/**
 * Calculate total price for a stay
 * @param {number} basePrice - Base price per night
 * @param {number} nights - Number of nights
 * @param {number} taxRate - Tax rate (default 0.1 for 10%)
 * @returns {object} - Object with subtotal, tax, and total
 */
export const calculateTotalPrice = (basePrice, nights, taxRate = 0.1) => {
  if (!basePrice || !nights) {
    return { subtotal: 0, tax: 0, total: 0 };
  }
  
  const subtotal = basePrice * nights;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100
  };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
export const validateEmail = (email) => {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone format
 */
export const validatePhone = (phone) => {
  if (!phone) return false;
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's 10 digits (US format) or 11 digits (with country code)
  return cleaned.length === 10 || cleaned.length === 11;
};

/**
 * Format phone number for display
 * @param {string} phone - Phone number to format
 * @returns {string} - Formatted phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11) {
    return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone; // Return original if not standard format
};

/**
 * Generate a random booking confirmation number
 * @returns {string} - Random confirmation number
 */
export const generateConfirmationNumber = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

/**
 * Get user's preferred theme from localStorage
 * @returns {string} - Theme preference ('light' or 'dark')
 */
export const getThemePreference = () => {
  try {
    return localStorage.getItem('theme') || 'light';
  } catch (error) {
    return 'light';
  }
};

/**
 * Set user's theme preference
 * @param {string} theme - Theme to set ('light' or 'dark')
 */
export const setThemePreference = (theme) => {
  try {
    localStorage.setItem('theme', theme);
  } catch (error) {
    console.warn('Unable to save theme preference');
  }
};

/**
 * Check if user is on mobile device
 * @returns {boolean} - True if on mobile device
 */
export const isMobile = () => {
  return window.innerWidth <= 768;
};

/**
 * Smooth scroll to element
 * @param {string} elementId - ID of element to scroll to
 */
export const scrollToElement = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

export const getStatusColor = (status) => {
  if (!status) return 'available';
  
  const statusLower = status.toLowerCase();
  
  if (statusLower.includes('available')) return 'available';
  if (statusLower.includes('occupied')) return 'occupied';
  if (statusLower.includes('maintenance')) return 'maintenance';
  if (statusLower.includes('cleaning')) return 'cleaning';
  if (statusLower.includes('reserved')) return 'reserved';
  
  return 'available';
};

export const formatCapacity = (capacity) => {
  if (!capacity) return 'N/A';
  return `${capacity} guest${capacity !== 1 ? 's' : ''}`;
};

export const validateDateRange = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return false;
  
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);
  const today = new Date();
  
  // Check if check-in is in the future
  if (startDate < today) return false;
  
  // Check if check-out is after check-in
  if (endDate <= startDate) return false;
  
  return true;
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