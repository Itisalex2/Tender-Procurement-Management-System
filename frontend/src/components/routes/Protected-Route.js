import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/use-auth-context';

const ProtectedRoute = ({ children }) => {
  const { user: authUser } = useAuthContext();

  return authUser ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
