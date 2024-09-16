import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../hooks/use-auth-context';
import useFetchUser from '../hooks/use-fetch-user';
import BidEvaluations from '../components/Bid-Evaluations';
import { permissionRoles } from '../utils/permissions';
import useLocalize from '../hooks/use-localize'; // Import localization hook

const ViewBid = () => {
  const { tenderId, bidId } = useParams();
  const { userData, loading: userLoading, error: userError } = useFetchUser();
  const { user } = useAuthContext();
  const [bid, setBid] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { localize } = useLocalize(); // Use localization hook

  useEffect(() => {
    const fetchBid = async () => {
      try {
        const response = await fetch(`/api/bid/${bidId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error(localize('unableToFetchBid'));
        }

        const data = await response.json();
        setBid(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBid();
  }, [tenderId, bidId, user, localize]);

  const handleEvaluationAdded = (newEvaluation) => {
    setBid((prevBid) => ({
      ...prevBid,
      evaluations: [...prevBid.evaluations, newEvaluation],
    }));
  };

  if (userError || error) {
    return <div className="alert alert-danger">{userError || error}</div>;
  }

  if (userLoading || !bid) {
    return <div>{localize('loading')}</div>;
  }

  const isBidder = bid.bidder._id === userData._id; // Check if the user is the bidder
  const canViewPage = isBidder || permissionRoles.viewBids.includes(userData.role);
  const canViewEvaluations =
    !isBidder && permissionRoles.viewAndEditBidEvaluations.includes(userData.role); // Non-bidders can view evaluations

  if (!canViewPage) {
    return <div>{localize('noPermissionToViewBid')}</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">{localize('bidDetails')}</h1>
      <div className="card">
        <div className="card-header">
          <strong>
            {localize('supplier')}: {bid.bidder.username}
          </strong>
        </div>
        <div className="card-body">
          <h5 className="card-title">
            {localize('bidAmount')}: {bid.amount}
          </h5>
          <p className="card-text">
            {localize('bidContent')}: {bid.content || localize('none')}
          </p>
          <p className="card-text">
            {localize('status')}: {localize(bid.status)}
          </p>

          {/* Render files if any are present, otherwise show a message */}
          {bid.files && bid.files.length > 0 ? (
            <div>
              <h5 className="card-title">{localize('bidFiles')}:</h5>
              <ul className="list-group">
                {bid.files.map((file, index) => (
                  <li key={index} className="list-group-item">
                    <a
                      href={`${process.env.REACT_APP_BACKEND_URL}${file.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {file.fileName} - {localize('uploadedOn')}: {new Date(file.dateUploaded).toLocaleString()}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="card-text">{localize('noBidFiles')}</p>
          )}

          {/* Only show evaluations if the user is not the bidder and has permission */}
          {canViewEvaluations && (
            <BidEvaluations
              user={user}
              evaluations={bid.evaluations}
              bidId={bidId}
              tenderId={tenderId}
              canAddEvaluations={canViewEvaluations}
              onEvaluationAdded={handleEvaluationAdded}
            />
          )}

          <div className="mt-4">
            <button className="btn btn-secondary" onClick={() => navigate(`/tender/${tenderId}`)}>
              {localize('viewTender')}
            </button>
          </div>
        </div>
        <div className="card-footer text-muted">
          {localize('submittedAt')}: {new Date(bid.submittedAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default ViewBid;
