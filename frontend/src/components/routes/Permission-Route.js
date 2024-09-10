import { Navigate } from 'react-router-dom';
import permissionRoles from '../../utils/permissions';

const PermissionRoute = ({ children, userData, permission }) => {
  const hasPermission = userData && permissionRoles[permission]?.includes(userData.role);

  return hasPermission ? children : <Navigate to="/" />;
};

export default PermissionRoute;
