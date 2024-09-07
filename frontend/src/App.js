import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import PageNotFound from './pages/Page-Not-Found'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route
              path='/'
              element={<Home />} // if logged in, display homepage. If not logged in, display login page
            />
            <Route
              path='/login'
              element={<Login />} // if logged in, display homepage. If not logged in, display login page
            />
            <Route
              path='/signup'
              element={<SignUp />} // if logged in, display homepage. If not logged in, display signup page
            />
            <Route
              path='/pageNotFound'
              element={<PageNotFound />}
            />
            {/* Catch-all route */}
            <Route path='*' element={<Navigate to='/pageNotFound' />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
