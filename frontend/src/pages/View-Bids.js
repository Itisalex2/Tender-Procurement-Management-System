import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/use-auth-context';
import useFetchUser from '../hooks/use-fetch-user';
import { useFetchTender } from "../hooks/use-fetch-tender";
import { permissionRoles, permissionStatus } from '../utils/permissions';
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

  // Function to handle selecting a NegotiationCandidate bid
  const handleSelectNegotiationCandidateBid = async (bidId) => {
    try {
      const response = await fetch(`/api/tender/${id}/bid/${bidId}/select-negotiation-candidate-bid`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(localize('unableToSelectNegotiationCandidateBid'));
      }

      alert(localize('negotiationCandidateBidSelected'));
      window.location.reload(); // Reload the page to reflect the change
    } catch (err) {
      console.error(err);
      alert(localize('failedToSelectNegotiationCandidateBid'));
    }
  };

  // Function to handle removing a NegotiationCandidate bid
  const handleRemoveNegotiationCandidateBid = async (bidId) => {
    try {
      const response = await fetch(`/api/tender/${id}/bid/${bidId}/remove-negotiation-candidate-bid`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(localize('unableToRemoveNegotiationCandidateBid'));
      }

      alert(localize('negotiationCandidateBidRemoved'));
    } catch (err) {
      console.error(err);
      alert(localize('failedToRemoveNegotiationCandidateBid'));
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

  const canSelectNegotiationCandidateBid = permissionRoles.selectNegotiationCandidateBid.includes(userData.role) && permissionStatus.selectNegotiationCandidateBid.includes(tender.status);

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

                  {/* Show select NegotiationCandidate bid button only for users with permission */}
                  {canSelectNegotiationCandidateBid && bid.status !== 'negotiationCandidate' && (
                    <button
                      className="btn btn-success"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent navigating to bid detail page
                        handleSelectNegotiationCandidateBid(bid._id);
                      }}
                    >
                      {localize('selectAsNegotiationCandidateBid')}
                    </button>
                  )}
                  {/* Show remove NegotiationCandidate bid button only for users with permission */}
                  {canSelectNegotiationCandidateBid && bid.status === 'negotiationCandidate' && (
                    <button
                      className="btn btn-danger"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent navigating to bid detail page
                        handleRemoveNegotiationCandidateBid(bid._id);
                      }}
                    >
                      {localize('removeFromNegotiationCandidateList')}
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
