import React from 'react';

const AddUserForm = ({ newUser, setNewUser, handleAddUser, addingUser, canChooseRole = true }) => {
  return (
    <form onSubmit={handleAddUser} className="mb-4">
      <h3>添加新用户</h3>
      <div className="mb-3">
        <label className="form-label">用户名</label>
        <input
          type="text"
          className="form-control"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">邮件地址</label>
        <input
          type="email"
          className="form-control"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">密码</label>
        <input
          type="password"
          className="form-control"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">电话号码</label>
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
          <label className="form-label">角色</label>
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="form-select"
          >
            <option value="admin">管理员</option>
            <option value="tenderer">供应商</option>
            <option value="tenderProcurementGroup">招标管理组</option>
            <option value="secretary">招标秘书</option>
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
        {addingUser ? '添加中...' : '添加用户'}
      </button>
    </form>
  );
};

export default AddUserForm;
