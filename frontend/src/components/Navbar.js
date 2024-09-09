import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/use-logout';
import useFetchUser from '../hooks/use-fetch-user';
import { useAuthContext } from '../hooks/use-auth-context';
import '../css-components/navbar.css';
const roleMap = require('../utils/english-to-chinese-role-map');
const permissionRoles = require('../utils/permissions');

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const { user: authUser } = useAuthContext();
  const { userData, loading, error, fetchUserData } = useFetchUser(); // Fetch user data only when needed
  const [profileOpen, setProfileOpen] = useState(false);

  const hasPermission = (permission) => {
    return userData && permissionRoles[permission]?.includes(userData.role);
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/');
    setProfileOpen(false); // Close dropdown after logout
  };

  const handleProfileClick = () => {
    setProfileOpen((prevState) => !prevState); // Toggle dropdown
    if (!userData && authUser) {
      fetchUserData(); // Fetch user data only when opening profile for the first time
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setProfileOpen(false); // Close dropdown after navigation
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-mediumgray">
        <div className="container">
          <Link className="navbar-brand" to="/">招采系统</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {/* Show profile dropdown if the user is logged in (based on authUser) */}
              {authUser && (
                <div className="d-flex align-items-center">
                  <li className="nav-item me-3">
                    <button className="btn btn-link nav-link" onClick={() => handleNavigation('/')}>主页</button>
                  </li>

                  {/* Profile Icon Dropdown */}
                  <li className="nav-item dropdown">
                    <button
                      className="btn btn-link nav-link p-0"
                      aria-expanded={profileOpen}
                      onClick={handleProfileClick} // Toggle dropdown with React state
                    >
                      <i className="bi bi-person-circle" style={{ fontSize: '1.5rem' }}></i>
                    </button>

                    {/* Conditionally render dropdown only if profileOpen is true */}
                    {profileOpen && (
                      <ul className="dropdown-menu dropdown-menu-end dropdown-menu-center show" aria-labelledby="profileDropdown">
                        {loading ? (
                          <>
                            {/* Placeholder while loading */}
                            <li className="dropdown-item text-center">
                              <strong>{'\u00A0'}</strong>
                              <p>{'\u00A0'}</p>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li className="dropdown-item" onClick={() => handleNavigation('/settings')}>
                              <i className="bi bi-gear me-2"></i>设置
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li className="dropdown-item text-danger" onClick={handleLogoutClick}>
                              <i className="bi bi-box-arrow-right me-2"></i>退出</li>
                          </>
                        ) : error ? (
                          <li className="dropdown-item text-center text-danger">
                            Error: {error}
                          </li>
                        ) : (
                          <>
                            <li className="dropdown-item text-center">
                              <strong>{userData.username}</strong>
                              <p>{roleMap[userData.role]}</p>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li className="dropdown-item" onClick={() => handleNavigation('/settings')}>
                              <i className="bi bi-gear me-2"></i>设置
                            </li>

                            {/* Conditionally render the "Create Tender" button based on permissions */}
                            {userData && hasPermission('createTender') && (
                              <li className="dropdown-item" onClick={() => handleNavigation('/create-tender')}>
                                <i className="bi bi-plus-square me-2"></i>创建招标
                              </li>
                            )}

                            {userData && hasPermission('manageTenders') && (
                              <li className="dropdown-item" onClick={() => handleNavigation('/manage-tenders')}>
                                <i className="bi bi-layout-text-window-reverse me-2"></i>招标管理
                              </li>
                            )}

                            {userData && hasPermission('modifyBackend') && (
                              <li className="dropdown-item" onClick={() => handleNavigation('/admin-settings')}>
                                <i className="bi bi-tools me-2"></i>后台管理
                              </li>
                            )}
                            <li><hr className="dropdown-divider" /></li>
                            <li className="dropdown-item text-danger" onClick={handleLogoutClick}>
                              <i className="bi bi-box-arrow-right me-2"></i>退出</li>
                          </>
                        )}
                      </ul>
                    )}
                  </li>
                </div>
              )}

              {/* Show sign up and login if user is not authenticated */}
              {!authUser && (
                <div className="d-flex">
                  <li className="nav-item">
                    <button className="btn btn-link nav-link" onClick={() => navigate('/signup')}>供应商报名</button>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-link nav-link" onClick={() => navigate('/login')}>登录</button>
                  </li>
                </div>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

