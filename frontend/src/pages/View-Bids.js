import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/use-auth-context';
import useFetchUser from '../hooks/use-fetch-user';
import { useFetchTender } from "../hooks/use-fetch-tender";
import { permissionRoles } from '../utils/permissions';
import useLocalize from '../hooks/use-localize';

const ViewBids = () => {
  const { id } = useParams(); // Get tender id from URL
  const [bids, setBids] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const { userData, error: userError } = useFetchUser();
  const { tender, loading: tenderLoading, error: tenderError } = useFetchTender(id);
  const navigate = useNavigate();
  const { localize } = useLocalize();

  // Function to handle selecting a winning bid
  const handleSelectWinningBid = async (bidId) => {
    try {
      const response = await fetch(`/api/tender/${id}/bid/${bidId}/select-winning-bid`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(localize('unableToSelectWinningBid'));
      }

      alert(localize('winningBidSelected'));
      window.location.reload(); // Reload the page to reflect the change
    } catch (err) {
      console.error(err);
      alert(localize('failedToSelectWinningBid'));
    }
  };

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await fetch(`/api/tender/${id}/bids`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (response.status === 403) {
          throw new Error(localize('noPermissionToViewBids'));
        }

        if (!response.ok) {
          throw new Error(localize('unableToFetchBids'));
        }

        const data = await response.json();
        setBids(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBids();
  }, [id, user, localize]);

  if (error || tenderError || userError) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!userData || !bids || tenderLoading) {
    return <div>{localize('loading')}</div>;
  }

  const canSelectWinningBid = permissionRoles.selectWinningBid.includes(userData.role) && !tender.winningBid;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">{localize('bidList')}</h1>
      {bids.length === 0 ? (
        <div className="alert alert-info">{localize('noBids')}</div>
      ) : (
        <div className="row">
          {bids.map((bid) => (
            <div
              key={bid._id}
              className="col-12 mb-4"
              onClick={() => navigate(`/tender/${id}/bid/${bid._id}`)} // Navigate to specific bid
              style={{ cursor: 'pointer' }}
            >
              <div className="card">
                <div className="card-header">
                  <strong>{localize('supplier')}: {bid.bidder.username}</strong>
                </div>
                <div className="card-body">
                  <h5 className="card-title">{localize('bidAmount')}: {bid.amount}</h5>
                  <p className="card-text">{localize('bidContent')}: {bid.content || localize('none')}</p>
                  <p className="card-text">
                    <strong>{localize('status')}:</strong>{' '}
                    {localize(bid.status)}
                  </p>

                  {/* Show select winning bid button only for users with permission */}
                  {canSelectWinningBid && (
                    <button
                      className="btn btn-success"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent navigating to bid detail page
                        handleSelectWinningBid(bid._id);
                      }}
                    >
                      {localize('selectAsWinningBid')}
                    </button>
                  )}
                </div>
                <div className="card-footer text-muted">
                  {localize('submittedAt')}: {new Date(bid.submittedAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewBids;
