// UserList.js
import React from 'react';

const UserList = ({ filteredUsers, handleRoleChange, handleDeleteUser, roleFilter, setRoleFilter }) => {
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
            <th>角色</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
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
    </>
  );
};

export default UserList;
