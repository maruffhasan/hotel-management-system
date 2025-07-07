// dashboardUtils.js - Utility functions for the dashboard

/**
 * Safely decode JWT token
 * @param {string} token - JWT token
 * @returns {Object|null} - Decoded token or null if invalid
 */
export const decodeToken = (token) => {
  try {
    if (!token) return null;
    
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - True if expired
 */
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

/**
 * Get user info from localStorage
 * @returns {Object} - User information
 */
export const getUserInfo = () => {
  try {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || !role) {
      return { isAuthenticated: false, user: null };
    }
    
    if (isTokenExpired(token)) {
      localStorage.clear();
      return { isAuthenticated: false, user: null };
    }
    
    const decoded = decodeToken(token);
    return {
      isAuthenticated: true,
      user: {
        email: decoded.sub,
        role: role,
        id: decoded.id || decoded.user_id,
        name: decoded.name || decoded.sub?.split('@')[0]
      }
    };
  } catch (error) {
    console.error('Error getting user info:', error);
    return { isAuthenticated: false, user: null };
  }
};

/**
 * Get time-based greeting
 * @returns {string} - Greeting message
 */
export const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

/**
 * Format role for display
 * @param {string} role - User role
 * @returns {string} - Formatted role
 */
export const formatRole = (role) => {
  if (!role) return 'User';
  
  const roleMap = {
    'admin': 'Administrator',
    'manager': 'Hotel Manager',
    'guest': 'Guest',
    'staff': 'Staff Member',
    'receptionist': 'Receptionist'
  };
  
  return roleMap[role.toLowerCase()] || role.charAt(0).toUpperCase() + role.slice(1);
};

/**
 * Get navigation items based on user role
 * @param {string} role - User role
 * @returns {Array} - Array of navigation items
 */
export const getNavigationItems = (role) => {
  const baseItems = [
    {
      to: '/rooms',
      icon: '🏨',
      title: 'Browse Rooms',
      description: 'View available accommodations'
    },
    {
      to: '/booking',
      icon: '📅',
      title: 'Make a Booking',
      description: 'Reserve your stay'
    },
    {
      to: '/chatbot',
      icon: '💬',
      title: 'Ask Chatbot',
      description: 'Get instant help'
    },
    {
      to: '/cart',
      icon: '🛒',
      title: 'Go to Cart',
      description: 'Review your selections'
    }
  ];
  
  const adminItems = [
    {
      to: '/admin',
      icon: '⚙️',
      title: 'Admin Panel',
      description: 'Manage hotel operations'
    },
    {
      to: '/reports',
      icon: '📊',
      title: 'Reports',
      description: 'View analytics and reports'
    }
  ];
  
  const managerItems = [
    {
      to: '/manage-bookings',
      icon: '📋',
      title: 'Manage Bookings',
      description: 'Handle reservations'
    },
    {
      to: '/staff',
      icon: '👥',
      title: 'Staff Management',
      description: 'Manage hotel staff'
    }
  ];
  
  if (role === 'admin') {
    return [...baseItems, ...adminItems];
  } else if (role === 'manager') {
    return [...baseItems, ...managerItems];
  }
  
  return baseItems;
};

/**
 * Safe logout function
 * @param {Function} navigate - React Router navigate function
 */
export const performLogout = (navigate) => {
  try {
    localStorage.clear();
    // Clear any other stored data
    sessionStorage.clear();
    
    // Navigate to login
    navigate('/login', { replace: true });
  } catch (error) {
    console.error('Error during logout:', error);
    // Fallback to window.location
    window.location.href = '/login';
  }
};

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date
 */
export const formatDate = (date) => {
  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Get dashboard statistics based on role
 * @param {string} role - User role
 * @returns {Array} - Array of stat objects
 */
export const getDashboardStats = (role) => {
  const baseStats = [
    {
      title: 'Account Status',
      value: 'Active',
      icon: '✅'
    },
    {
      title: 'Member Since',
      value: formatDate(new Date()),
      icon: '📅'
    }
  ];
  
  const adminStats = [
    {
      title: 'Total Bookings',
      value: 'Loading...',
      icon: '📊'
    },
    {
      title: 'Active Rooms',
      value: 'Loading...',
      icon: '🏨'
    }
  ];
  
  if (role === 'admin' || role === 'manager') {
    return [...baseStats, ...adminStats];
  }
  
  return baseStats;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Get initials from name or email
 * @param {string} nameOrEmail - Name or email
 * @returns {string} - Initials
 */
export const getInitials = (nameOrEmail) => {
  if (!nameOrEmail) return 'U';
  
  const name = nameOrEmail.split('@')[0]; // Remove domain if email
  const parts = name.split(/[\s._-]+/);
  
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  
  return name.substring(0, 2).toUpperCase();
};