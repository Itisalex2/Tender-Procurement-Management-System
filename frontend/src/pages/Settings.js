import { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/use-auth-context';
import useFetchUser from '../hooks/use-fetch-user';
import TendererDetailsForm from '../components/Tenderer-Details-Form';
import useLocalize from '../hooks/use-localize';

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
  const { localize } = useLocalize();

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
        throw new Error(data.error || localize('failedToUpdateSettings'));
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
    return <div>{localize('loading')}</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      {userData.role !== 'tenderer' && (
        <h1 className="mb-4">{localize('personalSettings')}</h1>
      )}
      {userData.role === 'tenderer' && (
        <h1 className="mb-4">{localize('settings')}</h1>
      )}

      <div className="row">
        {/* Normal User Settings */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h2 className="mb-4">{localize('basicInformation')}</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {normalSettingsSuccess && <div className="alert alert-success">{localize('settingsUpdatedSuccess')}</div>}

            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                {userData.role === 'tenderer' ? localize('companyName') : localize('username')}
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
              <label htmlFor="role" className="form-label">
                {localize('role')}
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="role"
                value={localize(userData?.role) || ''} // Get role from userData
                readOnly
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">{localize('emailAddress')}</label>
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
              <label htmlFor="number" className="form-label">
                {localize('phoneNumber')}
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
                {submitting ? localize('saving') : localize('saveChanges')}
              </button>
            </div>
          </div>
        </div>

        {/* Tenderer-specific Settings (only show if the user is a tenderer) */}
        {userData.role === 'tenderer' && (
          <div className="col-md-6">
            <div className="card p-4 shadow-sm">
              <h2 className="mb-4">{localize('companyDetails')}</h2>
              {tendererDetailsSuccess && (
                <div className="alert alert-success">{localize('companyDetailsSavedSuccess')}</div>
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
