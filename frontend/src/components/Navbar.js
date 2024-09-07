// Navbar.js

import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported
import '../css-components/navbar.css'; // Custom CSS for the medium gray

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-mediumgray">
        <div className="container">
          <Link className="navbar-brand" to="/">招采系统</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={() => navigate('/')}>Home</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={() => navigate('/signup')}>Sign Up</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={() => navigate('/login')}>Login</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
