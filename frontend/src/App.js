import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Settings from './pages/Settings';
import PageNotFound from './pages/Page-Not-Found';
import AdminSettings from './pages/Admin-Settings';
import CreateTender from './pages/Create-Tender';
import Navbar from './components/Navbar';
import ManageTenders from "./pages/Manage-Tendors";
import EditTender from "./pages/Edit-Tender";

import { useAuthContext } from './hooks/use-auth-context';
import useFetchUser from './hooks/use-fetch-user';
import permissionRoles from './utils/permissions';
import { useEffect } from 'react';

function App() {
  const { user: authUser, loading: authLoading } = useAuthContext(); // Get auth token and loading state from context
  const { userData, loading: userLoading, error, fetchUserData } = useFetchUser(); // Fetch user data with the token

  // Helper function to check if the user has permission to certain pages
  const hasPermission = (permission) => {
    return userData && permissionRoles[permission]?.includes(userData.role);
  };

  // Fetch user data when authUser changes or upon component mount
  useEffect(() => {
    if (authUser) {
      fetchUserData(); // Fetch user data on mount or when the user logs in
    }
    // eslint-disable-next-line
  }, [authUser]);

  // Wait for both the auth context and user data to be fully loaded
  if (authLoading || userLoading) {
    return <div></div>; // Display loading state while fetching auth state or user data
  }

  if (error) {
    return <div>Error: {error}</div>; // Handle error state
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            {/* Routes for logged-in users or those not logged in */}
            <Route path='/' element={authUser ? <Home /> : <Navigate to='/login' />} />
            <Route path='/login' element={authUser ? <Navigate to='/' /> : <Login />} />
            <Route path='/signup' element={authUser ? <Navigate to='/' /> : <SignUp />} />

            {/* Prevent redirect until userData is fully loaded */}
            <Route path='/settings' element={authUser && userData ? <Settings /> : <Navigate to='/login' />} />

            {/* Only load admin-settings if userData is loaded and role is admin */}
            <Route path='/admin-settings'
              element={authUser && userData && hasPermission('modifyBackend') ? <AdminSettings /> : <Navigate to='/' />} />

            {/* Only allow access to create-tender if user has the proper permissions */}
            <Route path='/create-tender'
              element={authUser && userData && hasPermission('createTender') ? <CreateTender /> : <Navigate to='/' />} />

            {/* Only allow access to manage-tenders if user has proper permissions*/}
            <Route path='/manage-tenders'
              element={authUser && userData && hasPermission('manageTenders') ? <ManageTenders /> : <Navigate to='/' />} />

            {/* Only allow access to edit-tenders if user has proper permissions*/}
            <Route path='/tender/edit/:id' element={authUser && userData && hasPermission('editTender') ? <EditTender /> : <Navigate to='/' />} />

            <Route path='/pageNotFound' element={<PageNotFound />} />
            <Route path='*' element={<Navigate to='/pageNotFound' />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
