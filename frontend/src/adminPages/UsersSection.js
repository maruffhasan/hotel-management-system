import React, { useState } from 'react';
import '../styles/AdminDashboard.css';

const UsersSection = ({
  users,
  showAddUserModal,
  setShowAddUserModal,
  newUser,
  setNewUser,
  handleAddUser,
  loading,
  onUserUpdate // Add this prop to refresh users after ban/unban
}) => {
  const [banLoading, setBanLoading] = useState({});

  // Your existing toggleBan function (you can move this to utils/apiHelpers.js)
  const toggleBan = async (userInfo) => {
    const params = new URLSearchParams();
    params.append("email", userInfo.email);
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/user/disable?${params.toString()}`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error("Error toggling ban");
      }
      
      return true;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleBanToggle = async (user) => {
    setBanLoading(prev => ({ ...prev, [user.email]: true }));
    
    try {
      await toggleBan(user);
      
      // Show success message
      const action = user.enabled ? 'banned' : 'unbanned';
      alert(`User ${user.email} has been ${action} successfully!`);
      
      // Refresh the users list
      if (onUserUpdate) {
        onUserUpdate();
      }
    } catch (error) {
      console.error('Error toggling user ban status:', error);
      alert(`Error updating user status: ${error.message}`);
    } finally {
      setBanLoading(prev => ({ ...prev, [user.email]: false }));
    }
  };

  return (
    <div className="content-section">
      <div className="section-header">
        <h1>Users</h1>
        <button
          className="btn btn-primaryy"
          onClick={() => setShowAddUserModal(true)}
        >
          Add New
        </button>
      </div>
      
      <div className="users-table">
        <div className="table-header">
          <div className="table-cell">Email</div>
          <div className="table-cell">First Name</div>
          <div className="table-cell">Last Name</div>
          <div className="table-cell">Role</div>
          <div className="table-cell">Status</div>
          <div className="table-cell">Actions</div>
        </div>
        
        {users.map((user, index) => (
          <div key={user.email || index} className="table-row">
            <div className="table-cell" data-label="Email">{user.email}</div>
            <div className="table-cell" data-label="First Name">{user.first_name}</div>
            <div className="table-cell" data-label="Last Name">{user.last_name}</div>
            <div className="table-cell" data-label="Role">
              <span className="role-badge">
                {user.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
              </span>
            </div>
            <div className="table-cell" data-label="Status">
              <span className={`status-badge ${user.enabled ? 'active' : 'inactive'}`}>
                {user.enabled ? 'Active' : 'Banned'}
              </span>
            </div>
            <div className="table-cell" data-label="Actions">
              <button
                className={`btn ${user.enabled ? 'btn-delete' : 'btn-edit'}`}
                onClick={() => handleBanToggle(user)}
                disabled={banLoading[user.email]}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                {banLoading[user.email] 
                  ? 'Processing...' 
                  : user.enabled ? 'Ban' : 'Unban'
                }
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Admin User</h3>
              <button
                className="modal-close"
                onClick={() => setShowAddUserModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddUser} className="modal-body">
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>First Name:</label>
                <input
                  type="text"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name:</label>
                <input
                  type="text"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                  minLength="6"
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddUserModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primaryy"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersSection;