import React from 'react';
import useLocalize from '../hooks/use-localize'; // Import localization hook

const AddUserForm = ({ newUser, setNewUser, handleAddUser, addingUser, canChooseRole = true }) => {
  const { localize } = useLocalize(); // Use localization hook

  return (
    <form onSubmit={handleAddUser} className="mb-4">
      <h3>{localize('addNewUser')}</h3>
      <div className="mb-3">
        <label className="form-label">{localize('username')}</label>
        <input
          type="text"
          className="form-control"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">{localize('emailAddress')}</label>
        <input
          type="email"
          className="form-control"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">{localize('password')}</label>
        <input
          type="password"
          className="form-control"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">{localize('phoneNumber')}</label>
        <input
          type="text"
          className="form-control"
          value={newUser.number}
          onChange={(e) => setNewUser({ ...newUser, number: e.target.value })}
          required
        />
      </div>

      {/* Conditionally allow role selection, or hardcode it to "tenderer" */}
      {canChooseRole ? (
        <div className="mb-3">
          <label className="form-label">{localize('role')}</label>
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="form-select"
          >
            <option value="admin">{localize('admin')}</option>
            <option value="tenderer">{localize('tenderer')}</option>
            <option value="tenderProcurementGroup">{localize('tenderProcurementGroup')}</option>
            <option value="secretary">{localize('secretary')}</option>
          </select>
        </div>
      ) : (
        <input
          type="hidden"
          value="tenderer"
          onChange={(e) => setNewUser({ ...newUser, role: 'tenderer' })}
        />
      )}

      <button type="submit" className="btn btn-primary" disabled={addingUser}>
        {addingUser ? localize('addingUser') : localize('addUser')}
      </button>
    </form>
  );
};

export default AddUserForm;
