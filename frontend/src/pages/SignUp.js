import { useState } from "react";
import { useSignup } from '../hooks/use-signup';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import useLocalize from '../hooks/use-localize'; // Import localization hook

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [number, setNumber] = useState('');
  const { signup, error } = useSignup();
  const { localize } = useLocalize(); // Use localization hook

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh on form submission

    await signup(username, email, password, number);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card p-4 shadow-sm" style={{ width: "100%", maxWidth: "500px" }}>
        <h1 className="text-center mb-4">{localize('supplierSignup')}</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="username">{localize('supplierName')}</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="email">{localize('emailAddress')}</label>
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

          <div className="form-group mb-3">
            <label htmlFor="number">{localize('phoneNumber')}</label>
            <input
              type="tel"
              id="number"
              className="form-control"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">{localize('signup')}</button>
        </form>

        {/* Display error message */}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
};

export default SignUp;
