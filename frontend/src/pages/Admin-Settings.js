import { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/use-auth-context';

const AdminSettings = () => {
  const { user: authUser } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state for adding a new user
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    number: '',
    role: 'tenderer', // default role
  });

  const [addingUser, setAddingUser] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false); // New state for toggling the form

  const [roleFilter, setRoleFilter] = useState('all'); // State for filtering users by role

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authUser.token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch users');
        }

        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [authUser]);

  // Confirm before changing role
  const handleRoleChange = async (userId, newRole) => {
    const confirmChange = window.confirm('您确定要更改这位用户的角色吗?');
    if (!confirmChange) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authUser.token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update role');
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === userId ? { ...user, role: data.role } : user
        )));
    } catch (error) {
      alert('Failed to update user role: ' + error.message);
    }
  };

  // Confirm before deleting user
  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm('您确定要删除这位用户吗?这个操作无法撤销。');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authUser.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      alert('Failed to delete user: ' + error.message);
    }
  };

  // Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddingUser(true);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authUser.token}`,
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add user');
      }

      // Update users list
      setUsers([...users, data]);
      setNewUser({
        username: '',
        email: '',
        password: '',
        number: '',
        role: 'tenderer',
      });
    } catch (err) {
      alert('Failed to add user: ' + err.message);
    } finally {
      setAddingUser(false);
    }
  };

  // Filter users based on the selected role
  const filteredUsers = users.filter((user) => {
    if (roleFilter === 'all') return true;
    return user.role === roleFilter;
  });

  if (loading) {
    return <div>下载中...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">管理用户</h1>

      {/* Button to toggle the add user form */}
      <button
        className="btn btn-success mb-3"
        onClick={() => setShowAddUserForm((prev) => !prev)}
      >
        {showAddUserForm ? '取消添加用户' : '添加用户'}
      </button>

      {/* Conditionally render the form */}
      {showAddUserForm && (
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
          <button type="submit" className="btn btn-primary" disabled={addingUser}>
            {addingUser ? '添加中...' : '添加用户'}
          </button>
        </form>
      )}

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
    </div>
  );
};

export default AdminSettings;
