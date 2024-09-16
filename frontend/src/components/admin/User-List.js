import React, { useState } from 'react';

const UserList = ({ filteredUsers, handleUserUpdate, handleDeleteUser, roleFilter, setRoleFilter }) => {
  const [editedFields, setEditedFields] = useState({});

  const handleInputChange = (userId, field, value) => {
    setEditedFields((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], [field]: value },
    }));
  };

  const handleSaveAll = () => {
    // Ask for confirmation once before saving all changes
    const confirmChange = window.confirm('您确定要保存所有更改吗?');
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
        <label className="form-label">筛选用户角色</label>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="form-select"
          style={{ width: '150px' }}
        >
          <option value="all">所有角色</option>
          <option value="admin">管理员</option>
          <option value="tenderer">供应商</option>
          <option value="tenderProcurementGroup">招标管理组</option>
          <option value="secretary">招标秘书</option>
        </select>
      </div>

      {/* Users table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>用户名</th>
            <th>电子邮件</th>
            <th>电话号码</th>
            <th>密码</th>
            <th>角色</th>
            <th>操作</th>
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
                  onChange={(e) => handleInputChange(user._id, 'email', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  value={editedFields[user._id]?.number || user.number} // Use value instead of defaultValue
                  onChange={(e) => handleInputChange(user._id, 'number', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="password"
                  className="form-control"
                  placeholder="更新密码"
                  onChange={(e) => handleInputChange(user._id, 'password', e.target.value)}
                />
              </td>
              <td>
                <select
                  value={editedFields[user._id]?.role || user.role} // Use value instead of defaultValue
                  onChange={(e) => handleInputChange(user._id, 'role', e.target.value)}
                  className="form-select"
                >
                  <option value="admin">管理员</option>
                  <option value="tenderer">供应商</option>
                  <option value="tenderProcurementGroup">招标管理组</option>
                  <option value="secretary">招标秘书</option>
                </select>
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteUser(user._id)}
                >
                  删除用户
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
          保存所有更改
        </button>
      </div>
    </>
  );
};

export default UserList;
