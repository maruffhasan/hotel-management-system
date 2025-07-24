import React from 'react';

const UsersSection = ({ 
  users, 
  showAddUserModal, 
  setShowAddUserModal, 
  newUser, 
  setNewUser, 
  handleAddUser, 
  loading 
}) => {
  return (
    <div className="content-section">
      <div className="section-header">
        <h1>Users</h1>
        <button
          className="btn btn-primary"
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
          <div className="table-cell">Actions</div>
        </div>

        {users.map((user, index) => (
          <div key={user.id || index} className="table-row">
            <div className="table-cell">{user.email}</div>
            <div className="table-cell">{user.firstName}</div>
            <div className="table-cell">{user.lastName}</div>
            <div className="table-cell">
             <span className="role-badge">
              {user.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
              </span>
            </div>
            <div className="table-cell">
              <button className="btn btn-edit">Edit</button>
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
                  className="btn btn-primary"
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