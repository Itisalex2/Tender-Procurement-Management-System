import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/use-auth-context';
import useFetchUser from './hooks/use-fetch-user';

// Pages
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Settings from './pages/Settings';
import PageNotFound from './pages/Page-Not-Found';
import AdminSettings from './pages/Admin-Settings';
import CreateTender from './pages/Create-Tender';
import ManageTenders from './pages/Manage-Tenders';
import EditTender from './pages/Edit-Tender';
import SubmitBid from './pages/Submit-Bid';
import ViewBids from './pages/View-Bids';
import Inbox from './pages/Inbox';
import ViewBid from './pages/View-Bid';
import ViewOwnBids from './pages/View-Own-Bids';
import AddTenderer from './pages/Add-Tenderer';
import ManageTenderers from './pages/Manage-Tenderers';
import ViewTenderer from './pages/View-Tenderer';
import ProtectedTenderRoute from './components/routes/Protected-Tender-Route';
import ProtectedRoute from './components/routes/Protected-Route';


// Components
import Navbar from './components/Navbar';
import ProtectedPermissionRoute from './components/routes/Protected-Permission-Route';

function App() {
  const { user: authUser, loading: authLoading } = useAuthContext();
  const { userData, loading: userLoading, error } = useFetchUser();

  // Wait for both the auth context and user data to be fully loaded
  if (authLoading || userLoading) return <div>下载中...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
            <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
            <Route path="/signup" element={authUser ? <Navigate to="/" /> : <SignUp />} />

            {/* Protected Settings Routes */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Protected Mail Routes */}
            <Route
              path="/inbox"
              element={
                <ProtectedRoute>
                  <Inbox />
                </ProtectedRoute>
              }
            />

            {/* Protected View Bid Route */}
            <Route
              path="/tender/:tenderId/bid/:bidId"
              element={
                <ProtectedRoute>
                  <ViewBid />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes + Permissions */}
            <Route
              path="/admin-settings"
              element={
                <ProtectedPermissionRoute userData={userData} permission="modifyBackend">
                  <AdminSettings />
                </ProtectedPermissionRoute>
              }
            />

            <Route
              path="/create-tender"
              element={
                <ProtectedPermissionRoute userData={userData} permission="createTender">
                  <CreateTender />
                </ProtectedPermissionRoute>
              }
            />

            <Route
              path="/manage-tenders"
              element={
                <ProtectedPermissionRoute userData={userData} permission="manageTenders">
                  <ManageTenders />
                </ProtectedPermissionRoute>
              }
            />

            <Route
              path="/tender/edit/:id"
              element={
                <ProtectedPermissionRoute userData={userData} permission="editTender">
                  <EditTender />
                </ProtectedPermissionRoute>
              }
            />

            {/* Protected Tender Route */}
            <Route
              path="/tender/:id"
              element={
                <ProtectedRoute>
                  <ProtectedTenderRoute userData={userData} />
                </ProtectedRoute>
              }
            />

            {/* New Bid Submission Route */}
            <Route
              path="/tender/:id/bid"
              element={
                <ProtectedPermissionRoute userData={userData} permission="submitBid">
                  <SubmitBid />
                </ProtectedPermissionRoute>
              }
            />

            {/* View Bids Route */}
            <Route
              path="/tender/:id/bids"
              element={
                <ProtectedPermissionRoute userData={userData} permission="viewBids">
                  <ViewBids />
                </ProtectedPermissionRoute>
              }
            />

            <Route
              path="/view-own-bids"
              element={
                <ProtectedPermissionRoute userData={userData} permission="viewOwnBids">
                  <ViewOwnBids />
                </ProtectedPermissionRoute>
              }
            />

            {/* Create tenderer Route */}
            <Route
              path="/add-tenderer"
              element={
                <ProtectedPermissionRoute userData={userData} permission="onlyAddTenderers">
                  <AddTenderer />
                </ProtectedPermissionRoute>
              }
            />

            {/* Mananage tenderers Route */}
            <Route
              path="/manage-tenderers"
              element={
                <ProtectedPermissionRoute userData={userData} permission="viewTenderers">
                  <ManageTenderers />
                </ProtectedPermissionRoute>
              }
            />

            {/* View tenderer Route */}
            <Route
              path="/tenderer/:id"
              element={
                <ProtectedPermissionRoute userData={userData} permission="viewTenderers">
                  <ViewTenderer />
                </ProtectedPermissionRoute>
              }
            />


            {/* Page Not Found */}
            <Route path="/pageNotFound" element={<PageNotFound />} />
            <Route path="*" element={<Navigate to="/pageNotFound" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
