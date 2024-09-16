import { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/use-auth-context';
import useLocalize from '../hooks/use-localize'; // Import the localization hook

const AddTenderer = () => {
  const { user: authUser } = useAuthContext();
  const { localize } = useLocalize(); // Use the localize hook for translations
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
        throw new Error(data.error || localize('failureMessage'));
      }

      // Reset form after successful user creation
      setNewUser({
        username: '',
        email: '',
        password: generateRandomPassword(), // Generate a new random password after creation
        number: '',
        role: 'tenderer',
      });
      alert(localize('successMessage'));
    } catch (err) {
      alert(`${localize('failureMessage')}: ${err.message}`);
    } finally {
      setAddingUser(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">{localize('addTendererTitle')}</h1>
      <form onSubmit={handleAddUser} className="mb-4">
        <div className="mb-3">
          <label className="form-label">{localize('usernameLabel')}</label>
          <input
            type="text"
            className="form-control"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{localize('emailLabel')}</label>
          <input
            type="email"
            className="form-control"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{localize('phoneLabel')}</label>
          <input
            type="text"
            className="form-control"
            value={newUser.number}
            onChange={(e) => setNewUser({ ...newUser, number: e.target.value })}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={addingUser}>
          {addingUser ? localize('submittingButton') : localize('submitButton')}
        </button>
      </form>
    </div>
  );
};

export default AddTenderer;
