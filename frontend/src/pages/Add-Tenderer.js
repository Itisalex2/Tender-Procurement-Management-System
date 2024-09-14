import { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/use-auth-context';

const AddTenderer = () => {
  const { user: authUser } = useAuthContext();
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    number: '',
    role: 'tenderer',
  });

  const [addingUser, setAddingUser] = useState(false);

  // Function to generate a random password
  const generateRandomPassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  // Generate random password on component mount
  useEffect(() => {
    setNewUser((prevUser) => ({
      ...prevUser,
      password: generateRandomPassword(),
    }));
  }, []);

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
        throw new Error(data.error || 'Failed to add tenderer');
      }

      // Reset form after successful user creation
      setNewUser({
        username: '',
        email: '',
        password: generateRandomPassword(), // Generate a new random password after creation
        number: '',
        role: 'tenderer',
      });
      alert('Tenderer created successfully!');
    } catch (err) {
      alert('Failed to add tenderer: ' + err.message);
    } finally {
      setAddingUser(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">创建供应商(密码随机生成)</h1>
      <form onSubmit={handleAddUser} className="mb-4">
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
          <label className="form-label">电话号码</label>
          <input
            type="text"
            className="form-control"
            value={newUser.number}
            onChange={(e) => setNewUser({ ...newUser, number: e.target.value })}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={addingUser}>
          {addingUser ? '添加中...' : '添加供应商'}
        </button>
      </form>
    </div>
  );
};

export default AddTenderer;
