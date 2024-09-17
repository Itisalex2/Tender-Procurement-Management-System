import React, { useState } from 'react';
import useLocalize from '../../hooks/use-localize';

const UserList = ({
  filteredUsers,
  handleUserUpdate,
  handleDeleteUser,
  roleFilter,
  setRoleFilter,
}) => {
  const [editedFields, setEditedFields] = useState({});
  const { localize } = useLocalize();

  const handleInputChange = (userId, field, value) => {
    setEditedFields((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], [field]: value },
    }));
  };

  const handleSaveAll = () => {
    // Ask for confirmation once before saving all changes
    const confirmChange = window.confirm(localize('confirmSaveAllChanges'));
    if (!confirmChange) return;

    // Iterate through edited fields and update each user
    Object.keys(editedFields).forEach((userId) => {
      const updatedFields = editedFields[userId];
      if (Object.keys(updatedFields).length > 0) {
        handleUserUpdate(userId, updatedFields);
      }
    });
    setEditedFields({}); // Clear the edited fields after saving
  };

  return (
    <>
      {/* Role filter dropdown */}
      <div className="mb-4">
        <label className="form-label">{localize('filterUserRole')}</label>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="form-select"
          style={{ width: '150px' }}
        >
          <option value="all">{localize('allRoles')}</option>
          <option value="admin">{localize('admin')}</option>
          <option value="tenderer">{localize('tenderer')}</option>
          <option value="tenderProcurementGroup">
            {localize('tenderProcurementGroup')}
          </option>
          <option value="secretary">{localize('secretary')}</option>
        </select>
      </div>

      {/* Users table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>{localize('username')}</th>
            <th>{localize('email')}</th>
            <th>{localize('phoneNumber')}</th>
            <th>{localize('password')}</th>
            <th>{localize('role')}</th>
            <th>{localize('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>
                <input
                  type="email"
                  className="form-control"
                  value={editedFields[user._id]?.email || user.email} // Use value instead of defaultValue
                  onChange={(e) =>
                    handleInputChange(user._id, 'email', e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  value={editedFields[user._id]?.number || user.number} // Use value instead of defaultValue
                  onChange={(e) =>
                    handleInputChange(user._id, 'number', e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="password"
                  className="form-control"
                  placeholder={localize('updatePassword')}
                  onChange={(e) =>
                    handleInputChange(user._id, 'password', e.target.value)
                  }
                />
              </td>
              <td>
                <select
                  value={editedFields[user._id]?.role || user.role} // Use value instead of defaultValue
                  onChange={(e) =>
                    handleInputChange(user._id, 'role', e.target.value)
                  }
                  className="form-select"
                >
                  <option value="admin">{localize('admin')}</option>
                  <option value="tenderer">{localize('tenderer')}</option>
                  <option value="tenderProcurementGroup">
                    {localize('tenderProcurementGroup')}
                  </option>
                  <option value="secretary">{localize('secretary')}</option>
                </select>
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteUser(user._id)}
                >
                  {localize('deleteUser')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Save All button */}
      <div className="mt-3">
        <button
          className="btn btn-primary"
          onClick={handleSaveAll}
          disabled={Object.keys(editedFields).length === 0} // Disable if no changes made
        >
          {localize('saveAllChanges')}
        </button>
      </div>
    </>
  );
};

export default UserList;
