// ProtectedTenderRoute.js
import { useParams, Navigate } from 'react-router-dom';
import { useGetTender } from '../../hooks/use-get-tender';
import permissionRoles from '../../utils/permissions'; // Import permission roles
import ViewTender from '../../pages/View-Tender'; // Import the ViewTender component

const ProtectedTenderRoute = ({ userData }) => {
  const { id } = useParams(); // Extract tender ID from URL. e.g. path='/tender/:id'
  const { tender, loading, error } = useGetTender(id);

  if (loading) return <div>下载中...</div>;
  if (error) return <div>Error: {error}</div>;

  // Check if user has 'viewAllTenders' permission or is in the targetedUsers list
  const hasAccess =
    permissionRoles.viewAllTenders.includes(userData.role) ||
    tender.targetedUsers.some((targetedUser) => targetedUser._id === userData._id);

  return hasAccess ? <ViewTender tender={tender} /> : <Navigate to='/' />;
};

export default ProtectedTenderRoute;
