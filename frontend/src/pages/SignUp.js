import { useState } from "react";
import { useSignup } from '../hooks/use-signup';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [number, setNumber] = useState('');
  const { signup, error } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh on form submission

    await signup(username, email, password, number);
    console.log(error)
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card p-4 shadow-sm" style={{ width: "100%", maxWidth: "500px" }}>
        <h1 className="text-center mb-4">供应商报名</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="username">供应商名</label>
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
            <label htmlFor="email">邮件地址</label>
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
            <label htmlFor="password">密码</label>
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
            <label htmlFor="number">手机号</label>
            <input
              type="tel"
              id="number"
              className="form-control"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">报名</button>
        </form>

        {/* Display error message */}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
};

export default SignUp;
