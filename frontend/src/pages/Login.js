import { useState } from "react";
import { useLogin } from "../hooks/use-login";
import { useNavigate } from "react-router-dom";
import useLocalize from "../hooks/use-localize"; // Import localization hook

const Login = () => {
  const { localize } = useLocalize(); // Use localization hook
  const { login, error } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isSMSLogin, setIsSMSLogin] = useState(false); // Toggle between email/password and SMS login
  const [smsSent, setSmsSent] = useState(false); // Ensure SMS login form is maintained after sending SMS
  const [smsError, setSmsError] = useState('');
  const [smsMessage, setSmsMessage] = useState('');

  const navigate = useNavigate();

  // Handles regular email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    navigate('/'); // Redirect after successful login
  };

  // Handle sending SMS verification code
  const handleSendSMS = async (e) => {
    e.preventDefault(); // Prevent form refresh
    setSmsError('');
    setSmsMessage('');
    const correctedPhoneNumber = '86' + phoneNumber;
    try {
      const response = await fetch('/api/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: correctedPhoneNumber,
          signName: `${process.env.REACT_APP_SIGN_NAME}`,
          templateCode: `${process.env.REACT_APP_TEMPLATE_CODE}`,
        }),
      });
      const json = await response.json();

      if (response.ok) {
        setSmsMessage(localize('verificationSent')); // Localized message
        setSmsSent(true); // Switch to verification code form
      } else {
        setSmsError(json.message || localize('sendVerificationError')); // Localized error message
      }
    } catch (error) {
      setSmsError(localize('sendVerificationError')); // Localized error message
    }
  };

  // Handle SMS code verification
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/sms/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, code: verificationCode }),
      });
      const json = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(json));
        setSmsMessage(localize('loginSuccess')); // Localized message
        window.location.reload();
      } else {
        setSmsError(json.message || localize('loginFailed')); // Localized error message
      }
    } catch (error) {
      setSmsError(localize('loginFailed')); // Localized error message
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card p-4 shadow-sm" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="mb-4 text-center">{localize('login')}</h2>

        {!isSMSLogin ? (
          // Email/Password login form
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="email">{localize('email')}</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password">{localize('password')}</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">{localize('login')}</button>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </form>
        ) : (
          // SMS login form
          <form onSubmit={smsSent ? handleVerifyCode : handleSendSMS}>
            <div className="form-group mb-3">
              <label htmlFor="phoneNumber">{localize('phoneNumber')}</label>
              <input
                type="text"
                id="phoneNumber"
                className="form-control"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            {smsSent && (
              <div className="form-group mb-3">
                <label htmlFor="verificationCode">{localize('verificationCode')}</label>
                <input
                  type="text"
                  id="verificationCode"
                  className="form-control"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </div>
            )}
            <button type="submit" className="btn btn-primary w-100">
              {smsSent ? localize('loginWithCode') : localize('sendVerificationCode')}
            </button>
            {smsMessage && <div className="alert alert-success mt-3">{smsMessage}</div>}
            {smsError && <div className="alert alert-danger mt-3">{smsError}</div>}
          </form>
        )}

        {/* Toggle between email/password and SMS login */}
        <div className="text-center mt-3">
          <button
            className="btn btn-link"
            onClick={() => {
              setIsSMSLogin(!isSMSLogin);
              setSmsSent(false); // Reset SMS state when switching login modes
            }}
          >
            {isSMSLogin ? localize('useEmailLogin') : localize('usePhoneLogin')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
