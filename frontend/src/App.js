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
  const { user: authUser } = useAuthContext(); // Get token from auth context
  const { userData, loading, error, fetchUserData } = useFetchUser(); // Fetch user data with the token

  // Fetch user data when authUser changes or upon component mount
  useEffect(() => {
    if (authUser) {
      fetchUserData(); // Fetch user data on mount or when the user logs in
    }
  }, [authUser]);

  if (loading || !userData) {
    return <div>Loading...</div>; // Display loading state until user data is fully loaded
  }

  if (error) {
    return <div>Error: {error}</div>; // Handle error state
  }

  console.log(userData?.role);

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route path='/' element={userData ? <Home /> : <Navigate to='/login' />} />
            <Route path='/login' element={userData ? <Navigate to='/' /> : <Login />} />
            <Route path='/signup' element={userData ? <Navigate to='/' /> : <SignUp />} />
            <Route path='/settings' element={userData ? <Settings /> : <Navigate to='/' />} />
            <Route path='/pageNotFound' element={<PageNotFound />} />
            <Route path='/admin-settings'
              element={userData?.role === 'admin' ? <AdminSettings /> : <Navigate to='/' />} />
            <Route path='*' element={<Navigate to='/pageNotFound' />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
