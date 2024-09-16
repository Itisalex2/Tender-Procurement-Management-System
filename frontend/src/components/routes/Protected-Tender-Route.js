// ProtectedTenderRoute.js
import { useParams, Navigate } from 'react-router-dom';
import { useFetchTender } from '../../hooks/use-fetch-tender';
import { permissionRoles } from '../../utils/permissions'; // Import permission roles
import ViewTender from '../../pages/View-Tender'; // Import the ViewTender component
import useLocalize from '../../hooks/use-localize'; // Import localization hook

const ProtectedTenderRoute = ({ userData }) => {
  const { id } = useParams(); // Extract tender ID from URL. e.g. path='/tender/:id'
  const { tender, loading, error } = useFetchTender(id);
  const { localize } = useLocalize(); // Use localization

  if (loading) return <div>{localize('loading')}</div>;
  if (error) return <div>{localize('error')}: {error}</div>;

  // Check if user has 'viewAllTenders' permission or is in the targetedUsers list
  const hasAccess =
    permissionRoles.viewAllTenders.includes(userData.role) ||
    tender.targetedUsers.some((targetedUser) => targetedUser._id === userData._id);

  return hasAccess ? <ViewTender tender={tender} /> : <Navigate to='/' />;
};

export default ProtectedTenderRoute;
