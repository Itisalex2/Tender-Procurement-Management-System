import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/use-auth-context';
import { permissionRoles } from '../../utils/permissions';

const ProtectedPermissionRoute = ({ userData, permission, children }) => {
  const { user: authUser } = useAuthContext();

  // If not authenticated, redirect to login
  if (!authUser) {
    return <Navigate to="/login" />;
  }

  // If authenticated but doesn't have the required permission, redirect to home
  const hasPermission = () => {
    return userData && permissionRoles[permission]?.includes(userData.role);
  };

  if (!hasPermission()) {
    return <Navigate to="/" />;
  }

  // Render the children if both checks pass
  return children;
};

export default ProtectedPermissionRoute;
