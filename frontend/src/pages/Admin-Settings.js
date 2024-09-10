import { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/use-auth-context';

const AdminSettings = () => {
  const { user: authUser } = useAuthContext(); // Use auth token from context
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        prevUsers.map((user) => (user._id === userId ? { ...user, role: data.role } : user))
      );
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

  if (loading) {
    return <div>下载中...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">管理用户</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>用户名</th>
            <th>角色</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className="form-select"
                >
                  <option value="admin">管理员</option>
                  <option value="supplier">供应商</option>
                  <option value="tenderProcurementGroup">招标管理组</option>
                  <option value="gjcWorker">国酒城员工</option>
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
