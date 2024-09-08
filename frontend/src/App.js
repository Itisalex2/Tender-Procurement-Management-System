import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Settings from './pages/Settings';
import PageNotFound from './pages/Page-Not-Found';
import AdminSettings from './pages/Admin-Settings';
import Navbar from './components/Navbar';

import { useAuthContext } from './hooks/use-auth-context';
import useFetchUser from './hooks/use-fetch-user'; // Import the custom hook
import { useEffect } from 'react';

function App() {
  const { user: authUser, loading: authLoading } = useAuthContext(); // Get auth token and loading state from context
  const { userData, loading: userLoading, error, fetchUserData } = useFetchUser(); // Fetch user data with the token

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
            <Route path='/pageNotFound' element={<PageNotFound />} />

            {/* Only load admin-settings if userData is loaded and role is admin */}
            <Route path='/admin-settings'
              element={authUser && userData?.role === 'admin' ? <AdminSettings /> : <Navigate to='/' />} />

            <Route path='*' element={<Navigate to='/pageNotFound' />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
