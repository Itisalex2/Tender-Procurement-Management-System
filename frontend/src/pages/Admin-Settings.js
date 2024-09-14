import { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/use-auth-context';
import UserList from '../components/admin/User-List';
import AddUserForm from '../components/Add-User-Form';

const AdminSettings = () => {
  const { user: authUser } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [addingUser, setAddingUser] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all'); // State for filtering users by role

  // Form state for adding a new user
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    number: '',
    role: 'tenderer', // default role
  });

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
        <AddUserForm
          newUser={newUser}
          setNewUser={setNewUser}
          handleAddUser={handleAddUser}
          addingUser={addingUser}
        />
      )}

      {/* User list component */}
      <UserList
        users={users}
        filteredUsers={filteredUsers}
        handleRoleChange={handleRoleChange}
        handleDeleteUser={handleDeleteUser}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />
    </div>
  );
};

export default AdminSettings;
