import { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/use-auth-context';
import UserList from '../components/admin/User-List';
import AddUserForm from '../components/Add-User-Form';
import useLocalize from '../hooks/use-localize';

const AdminSettings = () => {
  const { user: authUser } = useAuthContext();
  const { localize } = useLocalize();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [addingUser, setAddingUser] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState(''); // Search keyword state

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
        const response = await fetch('/api/admin/users?sort=true', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authUser.token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || localize('error'));
        }

        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [authUser, localize]);

  const handleUserUpdate = async (userId, updatedFields) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authUser.token}`,
        },
        body: JSON.stringify(updatedFields),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || localize('failedToUpdateUser'));
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === userId ? { ...user, ...data } : user))
      );
    } catch (error) {
      alert(localize('failedToUpdateUser') + ': ' + error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(localize('confirmDelete'));
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
        throw new Error(localize('failedToDeleteUser'));
      }

      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      alert(localize('failedToDeleteUser') + ': ' + error.message);
    }
  };

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
        throw new Error(localize('failedToAddUser'));
      }

      setUsers([...users, data]);
      setNewUser({
        username: '',
        email: '',
        password: '',
        number: '',
        role: 'tenderer',
      });
    } catch (err) {
      alert(localize('failedToAddUser') + ': ' + err.message);
    } finally {
      setAddingUser(false);
    }
  };

  // Filter users based on the selected role and search keyword.
  const filteredUsers = users.filter((user) => {
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesKeyword = searchKeyword === '' || user.username.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesRole && matchesKeyword;
  });

  if (loading) {
    return <div>{localize('fetchingUsers')}</div>;
  }

  if (error) {
    return <div>{localize('error')}: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">{localize('manageUsers')}</h1>

      {/* Search bar */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder={localize('searchByUsername')}
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        autoComplete="off"
      />

      {/* Button to toggle the add user form */}
      <button
        className="btn btn-success mb-3"
        onClick={() => setShowAddUserForm((prev) => !prev)}
      >
        {showAddUserForm ? localize('cancelAddUser') : localize('addUser')}
      </button>

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
        handleUserUpdate={handleUserUpdate}
        handleDeleteUser={handleDeleteUser}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />
    </div>
  );
};

export default AdminSettings;
