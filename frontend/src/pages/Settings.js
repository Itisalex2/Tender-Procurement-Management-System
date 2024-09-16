import { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/use-auth-context';
import useFetchUser from '../hooks/use-fetch-user';
import { roleMap } from '../utils/english-to-chinese-map';
import TendererDetailsForm from '../components/Tenderer-Details-Form';

const Settings = () => {
  const { user } = useAuthContext();
  const { userData, loading, error } = useFetchUser({ includeTendererDetails: true });
  const [submitting, setSubmitting] = useState(false);
  const [normalSettingsSuccess, setNormalSettingsSuccess] = useState(false); // For normal settings
  const [tendererDetailsSuccess, setTendererDetailsSuccess] = useState(false); // For tenderer details

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
    setNormalSettingsSuccess(false); // Reset normal settings success message

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

      setNormalSettingsSuccess(true); // Show success for normal settings
    } catch (error) {
      console.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTendererDetailsSave = () => {
    setTendererDetailsSuccess(true); // Set success message for tenderer details
  };

  if (loading) {
    return <div>下载中...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      {userData.role !== 'tenderer' && (
        <h1 className="mb-4">个人设置</h1>
      )}
      {userData.role === 'tenderer' && (
        <h1 className="mb-4">设置</h1>
      )}

      <div className="row">
        {/* Normal User Settings */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h2 className="mb-4">基本信息</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {normalSettingsSuccess && <div className="alert alert-success">设置改变成功!</div>}

            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                {userData.role === 'tenderer' ? '企业名' : '用户名'}
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                readOnly={submitting}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="role" className="form-label">角色
                <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control"
                id="role"
                value={roleMap[userData?.role] || ''} // Get role from userData
                readOnly
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">邮件地址
              </label>
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
              <label htmlFor="number" className="form-label">电话号码
                <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                id="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                readOnly={submitting}
                required
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

        {/* Tenderer-specific Settings (only show if the user is a tenderer) */}
        {userData.role === 'tenderer' && (
          <div className="col-md-6">
            <div className="card p-4 shadow-sm">
              <h2 className="mb-4">企业详情</h2>
              {tendererDetailsSuccess && (
                <div className="alert alert-success">企业详情已保存成功!</div>
              )}
              <TendererDetailsForm
                user={user}
                tendererDetails={userData.tendererDetails}
                onSave={handleTendererDetailsSave} // Separate success handler for tenderer details
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
