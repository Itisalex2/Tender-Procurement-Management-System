import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchTenderWithConversation } from '../hooks/use-fetch-tender-with-conversation';
import { useAuthContext } from '../hooks/use-auth-context';
import useUpdateUser from '../hooks/use-update-user';
import useFetchUser from '../hooks/use-fetch-user';
import { permissionRoles } from '../utils/permissions';
import Chatbox from '../components/Chatbox';
import useLocalize from '../hooks/use-localize'; // Import localization hook

const ViewTender = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { updateUserById } = useUpdateUser();
  const { localize } = useLocalize(); // Use localization hook
  const [tenderDetails, setTenderDetails] = useState({
    title: '',
    description: '',
    issueDate: '',
    closingDate: '',
    contactInfo: {
      name: '',
      email: '',
      phone: '',
    },
    otherRequirements: '',
    relatedFiles: [],
    targetedUsers: [],
    conversations: [],
    bids: [],
  });

  const { tender, loading, error } = useFetchTenderWithConversation(id);
  const { userData, loading: userLoading, error: userError } = useFetchUser();

  useEffect(() => {
    if (tender) {
      setTenderDetails({
        title: tender.title,
        description: tender.description,
        issueDate: tender.issueDate,
        closingDate: tender.closingDate,
        contactInfo: tender.contactInfo,
        otherRequirements: tender.otherRequirements,
        relatedFiles: tender.relatedFiles || [],
        targetedUsers: tender.targetedUsers.map((user) => user._id),
        conversations: tender.conversations || [],
        bids: tender.bids || [],
      });
    }
  }, [tender]);

  const canSubmitBid = () => {
    if (!userData) return false;
    return (
      permissionRoles.submitBid.includes(userData.role) &&
      tender &&
      tender.status === 'Open'
    );
  };

  const handleBidSubmit = () => {
    navigate(`/tender/${id}/bid`);
  };

  if (loading || userLoading || !userData) {
    return <div>{localize('loading')}</div>;
  }

  if (error || userError) {
    return <div>{localize('error')}: {error || userError}</div>;
  }

  return (
    <div className="container mt-5" style={{ display: 'flex', flexDirection: 'row' }}>
      <div className="view-tender-content" style={{ flex: 1 }}>
        <h1 className="mb-4">{localize('viewTender')}</h1>

        <div className="mb-3">
          <label className="form-label">{localize('title')}</label>
          <p>{tenderDetails.title}</p>
        </div>

        <div className="mb-3">
          <label className="form-label">{localize('description')}</label>
          <p>{tenderDetails.description}</p>
        </div>

        <div className="mb-3">
          <label className="form-label">{localize('issueDate')}</label>
          <p>{new Date(tenderDetails.issueDate).toLocaleString()}</p>
        </div>

        <div className="mb-3">
          <label className="form-label">{localize('closingDate')}</label>
          <p>{new Date(tenderDetails.closingDate).toLocaleString()}</p>
        </div>

        <div className="mb-3">
          <label className="form-label">{localize('contactName')}</label>
          <p>{tenderDetails.contactInfo.name}</p>
        </div>

        <div className="mb-3">
          <label className="form-label">{localize('contactEmail')}</label>
          <p>{tenderDetails.contactInfo.email}</p>
        </div>

        <div className="mb-3">
          <label className="form-label">{localize('contactPhone')}</label>
          <p>{tenderDetails.contactInfo.phone || localize('none')}</p>
        </div>

        <div className="mb-3">
          <label className="form-label">{localize('otherRequirements')}</label>
          <p>{tenderDetails.otherRequirements || localize('none')}</p>
        </div>

        <div className="mb-3">
          <label className="form-label">{localize('existingFiles')}</label>
          <ul>
            {tenderDetails.relatedFiles.map((file, index) => (
              <li key={index}>
                <a
                  href={`${process.env.REACT_APP_BACKEND_URL}${file.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {file.fileName}
                </a>
                {file.dateUploaded && (
                  <span>
                    {' '}
                    - {localize('uploadedAt')}: {new Date(file.dateUploaded).toLocaleString()}
                  </span>
                )}
                {file.uploadedBy && (
                  <span> - {localize('uploadedBy')}: {file.uploadedBy.username}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Show the list of bidders */}
        {permissionRoles.viewBids.includes(userData.role) && (
          <div className="mb-3">
            <label className="form-label">{localize('bidders')}</label>
            <ul>
              {tenderDetails.bids.map((bid, index) => (
                <li key={index}>
                  {localize('supplier')}: {bid.bidder.username} - {localize('submittedAt')}: {new Date(bid.submittedAt).toLocaleString('en-GB', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </li>
              ))}
            </ul>
          </div>
        )}

        {canSubmitBid() && (
          <div className="mt-3">
            <button className="btn btn-primary" onClick={handleBidSubmit}>
              {localize('submitBid')}
            </button>
          </div>
        )}
      </div>

      {/* Include ChatComponent */}
      <Chatbox
        tenderDetails={tenderDetails}
        userData={userData}
        user={user}
        tender={tender}
        id={id}
        updateUserById={updateUserById}
      />
    </div>
  );
};

export default ViewTender;
