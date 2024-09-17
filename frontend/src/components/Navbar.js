import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/use-logout';
import useFetchUser from '../hooks/use-fetch-user';
import { useAuthContext } from '../hooks/use-auth-context';
import useFetchMails from '../hooks/use-fetch-mails';
import { permissionRoles } from '../utils/permissions';
import useLocalize from '../hooks/use-localize';
import '../css-components/navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const { user: authUser, language, changeLanguage } = useAuthContext();
  const { userData, loading, error } = useFetchUser();
  const [profileOpen, setProfileOpen] = useState(false);
  const { mails, loading: mailLoading } = useFetchMails(true, false);
  const { localize } = useLocalize(); // Use localize hook

  const hasPermission = (permission) => {
    return userData && permissionRoles[permission]?.includes(userData.role);
  };

  const handleLogoutClick = async () => {
    await logout();
    navigate('/');
    setProfileOpen(false); // Close dropdown after logout
  };

  const handleProfileClick = () => {
    setProfileOpen((prevState) => !prevState); // Toggle dropdown
  };

  const handleNavigation = (path) => {
    navigate(path);
    setProfileOpen(false); // Close dropdown after navigation
  };

  // Handle language change
  const handleLanguageChange = (newLanguage) => {
    changeLanguage(newLanguage);
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-mediumgray">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            {/* System Title */}
            <Link className="navbar-brand" to="/">{localize('procurementManagement')}</Link>

            {/* Language Switcher */}
            <button
              className="btn btn-link nav-link"
              onClick={() => handleLanguageChange(language === 'en' ? 'zh' : 'en')}
              style={{ color: '#000000', paddingLeft: '0', paddingRight: '0', marginLeft: '10px', marginTop: '2px' }}
            >
              {language === 'en' ? 'English' : '中文'}
            </button>
          </div>

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
              {/* Show navigation options if the user is authenticated */}
              {authUser && (
                <div className="d-flex align-items-center">
                  <li className="nav-item me-3">
                    <button className="btn btn-link nav-link" onClick={() => handleNavigation('/')}>
                      {localize('home')}
                    </button>
                  </li>

                  {/* Core Actions: Create Tender, Manage Tenders, View Own Bids */}
                  {hasPermission('createTender') && (
                    <li className="nav-item me-3">
                      <button className="btn btn-link nav-link" onClick={() => handleNavigation('/create-tender')}>
                        {localize('createTender')}
                      </button>
                    </li>
                  )}

                  {hasPermission('manageTenders') && (
                    <li className="nav-item me-3">
                      <button className="btn btn-link nav-link" onClick={() => handleNavigation('/manage-tenders')}>
                        {localize('manageTenders')}
                      </button>
                    </li>
                  )}

                  {hasPermission('viewOwnBids') && (
                    <li className="nav-item me-3">
                      <button className="btn btn-link nav-link" onClick={() => handleNavigation('/view-own-bids')}>
                        {localize('viewOwnBids')}
                      </button>
                    </li>
                  )}

                  {/* Manage tenderers */}
                  {hasPermission('viewTenderers') && (
                    <li className="nav-item me-3">
                      <button className="btn btn-link nav-link" onClick={() => handleNavigation('/manage-tenderers')}>
                        {localize('tenderersDatabase')}
                      </button>
                    </li>
                  )}

                  {/* Admin Management */}
                  {hasPermission('modifyBackend') && (
                    <li className="nav-item me-3">
                      <button className="btn btn-link nav-link" onClick={() => handleNavigation('/admin-settings')}>
                        {localize('adminSettings')}
                      </button>
                    </li>
                  )}

                  {/* Create Tenderer button */}
                  {userData && permissionRoles.onlyAddTenderers.includes(userData.role) && (
                    <li className="nav-item me-3">
                      <button className="btn btn-link nav-link" onClick={() => handleNavigation('/add-tenderer')}>
                        {localize('createTenderer')}
                      </button>
                    </li>
                  )}

                  {/* Mail Icon */}
                  <li className="nav-item me-3">
                    <button className="btn btn-link nav-link" onClick={() => handleNavigation('/inbox')}>
                      <i className="bi bi-envelope-fill" style={{ fontSize: '1.5rem' }}></i>
                      {/* Display unread mail count */}
                      {userData && !mailLoading && mails.length > 0 && (
                        <span className="badge bg-danger rounded-pill">{userData.inbox.length}</span>
                      )}
                    </button>
                  </li>

                  {/* Profile Dropdown for User Settings and Logout */}
                  <li className="nav-item dropdown">
                    <button
                      className="btn btn-link nav-link p-0"
                      aria-expanded={profileOpen}
                      onClick={handleProfileClick}
                    >
                      <i className="bi bi-person-circle" style={{ fontSize: '1.5rem' }}></i>
                    </button>

                    {profileOpen && (
                      <ul className="dropdown-menu dropdown-menu-end dropdown-menu-center show" aria-labelledby="profileDropdown">
                        {loading ? (
                          <>
                            <li className="dropdown-item text-center">
                              <strong>{'\u00A0'}</strong>
                              <p>{'\u00A0'}</p>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li className="dropdown-item" onClick={() => handleNavigation('/settings')}>
                              <i className="bi bi-gear me-2"></i>{localize('settings')}
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li className="dropdown-item text-danger" onClick={handleLogoutClick}>
                              <i className="bi bi-box-arrow-right me-2"></i>{localize('logout')}
                            </li>
                          </>
                        ) : error ? (
                          <li className="dropdown-item text-center text-danger">
                            Error: {error}
                          </li>
                        ) : (
                          <>
                            <li className="dropdown-item text-center">
                              <strong>{userData.username}</strong>
                              <p>{localize(userData.role)}</p>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li className="dropdown-item" onClick={() => handleNavigation('/settings')}>
                              <i className="bi bi-gear me-2"></i>{localize('settings')}
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li className="dropdown-item text-danger" onClick={handleLogoutClick}>
                              <i className="bi bi-box-arrow-right me-2"></i>{localize('logout')}
                            </li>
                          </>
                        )}
                      </ul>
                    )}
                  </li>
                </div>
              )}

              {/* Show login/signup options if user is not authenticated */}
              {!authUser && (
                <div className="d-flex">
                  <li className="nav-item">
                    <button className="btn btn-link nav-link" onClick={() => navigate('/signup')}>
                      {localize('signup')}
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-link nav-link" onClick={() => navigate('/login')}>
                      {localize('login')}
                    </button>
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
