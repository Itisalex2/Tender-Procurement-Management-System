import { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/use-auth-context';
import useFetchUser from '../hooks/use-fetch-user';

const Settings = () => {
  const { user } = useAuthContext();
  const { userData, loading, error } = useFetchUser(); // Use the hook for user data
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // State for editable fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');

  // Populate form data when userData is fetched
  useEffect(() => {
    if (userData) {
      setUsername(userData.username);
      setEmail(userData.email);
      setNumber(userData.number);
    }
  }, [userData]);

  const handleSaveChanges = async () => {
    setSubmitting(true);
    setSuccess(false);

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ username, email, number }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update settings');
      }

      setSuccess(true);
    } catch (error) {
      console.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>下载中...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">个人设置</h1>

      <div className="card p-4 shadow-sm" style={{ maxWidth: '600px', margin: 'auto' }}>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">设置改变成功!</div>}

        <div className="mb-3">
          <label htmlFor="username" className="form-label">用户名</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            readOnly={submitting}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="role" className="form-label">角色</label>
          <input
            type="text"
            className="form-control"
            id="role"
            value={userData?.role || ''} // Get role from userData
            readOnly
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">邮件地址</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={submitting}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="number" className="form-label">电话号码</label>
          <input
            type="number"
            className="form-control"
            id="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            readOnly={submitting}
          />
        </div>

        <div className="text-center mt-4">
          <button
            className="btn btn-primary"
            onClick={handleSaveChanges}
            disabled={submitting}
          >
            {submitting ? '保存中...' : '保存更改'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
