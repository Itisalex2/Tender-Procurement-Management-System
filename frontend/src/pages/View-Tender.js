import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchTenderWithConversation } from '../hooks/use-fetch-tender-with-conversation';
import { useAuthContext } from '../hooks/use-auth-context';
import useUpdateUser from '../hooks/use-update-user';
import useFetchUser from '../hooks/use-fetch-user';
import { permissionRoles } from '../utils/permissions';
import Chatbox from '../components/Chatbox';
import useLocalize from '../hooks/use-localize';
import DownloadLink from '../components/Download-Link';
import { formatDistanceToNow } from 'date-fns';

const ViewTender = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { updateUserById } = useUpdateUser();
  const { localize } = useLocalize();
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
    versions: [],
  });

  const { tender, loading, error } = useFetchTenderWithConversation(id);
  const { userData, loading: userLoading, error: userError } = useFetchUser();
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);
  const [mailSubject, setMailSubject] = useState('');
  const [mailContent, setMailContent] = useState('');

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
        targetedUsers: tender.targetedUsers || [],
        conversations: tender.conversations || [],
        bids: tender.bids || [],
        versions: tender.versions || [],
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

  const handleViewSnapshot = (snapshot) => {
    console.log(snapshot)
    setSelectedSnapshot(snapshot);
  };

  const handleRestoreToCurrentVersion = () => {
    setSelectedSnapshot(null);
  };

  const handleSendMailToSuppliers = async () => {
    if (!mailSubject || !mailContent) {
      alert(localize('fillSubjectContent'));
      return;
    }

    const supplierIds = tenderDetails.targetedUsers.map(targetedUser => targetedUser._id); // Get all targeted users

    try {
      const response = await fetch(`/api/mail/sendToSuppliers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          supplierIds,
          subject: mailSubject,
          content: mailContent,
          tenderId: id,
        }),
      });

      if (response.ok) {
        alert(localize('mailSentSuccess'));
      } else {
        alert(localize('mailSentError'));
      }

      setMailSubject('');
      setMailContent('');
    } catch (err) {
      console.error(localize('errorSendingMail'), err);
      alert(localize('mailSentError'));
    }
  };

  const renderTenderDetails = (details) => (
    <>
      <h1 className="mb-4">{localize('viewTender')}</h1>

      <div className="mb-3">
        <label className="form-label">{localize('title')}</label>
        <p>{details.title}</p>
      </div>

      <div className="mb-3">
        <label className="form-label">{localize('description')}</label>
        <p>{details.description}</p>
      </div>

      <div className="mb-3">
        <label className="form-label">{localize('issueDate')}</label>
        <p>{new Date(details.issueDate).toLocaleString()}</p>
      </div>

      <div className="mb-3">
        <label className="form-label">{localize('closingDate')}</label>
        <p>{new Date(details.closingDate).toLocaleString()}</p>
      </div>

      <div className="mb-3">
        <label className="form-label">{localize('contactName')}</label>
        <p>{details.contactInfo.name}</p>
      </div>

      <div className="mb-3">
        <label className="form-label">{localize('contactEmail')}</label>
        <p>{details.contactInfo.email}</p>
      </div>

      <div className="mb-3">
        <label className="form-label">{localize('contactPhone')}</label>
        <p>{details.contactInfo.phone || localize('none')}</p>
      </div>

      <div className="mb-3">
        <label className="form-label">{localize('otherRequirements')}</label>
        <p>{details.otherRequirements || localize('none')}</p>
      </div>

      <div className="mb-3">
        <label className="form-label">{localize('existingFiles')}</label>
        <ul>
          {details.relatedFiles.map((file, index) => (
            <li key={index}>
              <DownloadLink file={file} />
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
    </>
  );

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
        {/* If a snapshot is selected, render the snapshot's details, else render the current tender details */}
        {selectedSnapshot
          ? renderTenderDetails(selectedSnapshot.tenderSnapshot)
          : renderTenderDetails(tenderDetails)}

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

        {/* Show the list of targetedUsers */}
        {permissionRoles.viewBids.includes(userData.role) && (
          <div className="mb-3">
            <label className="form-label">{localize('targetedUsers')}</label>
            <ul>
              {tenderDetails.targetedUsers.map((targetedUser, index) => (
                <li key={index}>
                  {targetedUser.username}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mail sending section */}
        {permissionRoles.viewBids.includes(userData.role) && (
          <div className="send-mail-section mt-5">
            <h5>{localize('sendMailToSuppliers')}:</h5>
            <div className="mb-3">
              <label>{localize('subject')}</label>
              <input
                type="text"
                className="form-control"
                value={mailSubject}
                onChange={(e) => setMailSubject(e.target.value)}
                placeholder={localize('enterMailSubject')}
              />
            </div>
            <div className="mb-3">
              <label>{localize('content')}</label>
              <textarea
                className="form-control"
                value={mailContent}
                onChange={(e) => setMailContent(e.target.value)}
                placeholder={localize('enterMailContent')}
              ></textarea>
            </div>
            <button className="btn btn-primary" onClick={handleSendMailToSuppliers}>
              {localize('sendMail')}
            </button>
          </div>
        )}

        {selectedSnapshot && (
          <button className="btn btn-secondary mt-3" onClick={handleRestoreToCurrentVersion}>
            {localize('restoreCurrentVersion')}
          </button>
        )}

        {canSubmitBid() && (
          <div className="mt-3">
            <button className="btn btn-primary" onClick={handleBidSubmit}>
              {localize('submitBid')}
            </button>
          </div>
        )}

        {/* Version History Section */}
        {permissionRoles.viewTenderSnapshots.includes(userData.role) && (
          <>
            <h3 className="mt-5">{localize('versionHistory')}</h3>
            {tenderDetails.versions.length > 0 ? (
              <ul className="list-group">
                {tenderDetails.versions.slice().reverse().map((version, index) => (
                  <li key={index} className="list-group-item">
                    <strong>{localize('changeReason')}:</strong> {version.changeReason} <br />
                    <strong>{localize('changedBy')}:</strong> {version.changedBy.username} <br />
                    <strong>{localize('changedAt')}:</strong> {formatDistanceToNow(new Date(version.changedAt), { addSuffix: true })} <br />
                    <button className="btn btn-link" onClick={() => handleViewSnapshot(version)}>
                      {localize('viewSnapshot')}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>{localize('noVersions')}</p>
            )}
          </>
        )}
      </div>

      {/* Include ChatComponent */}
      {!selectedSnapshot && (<Chatbox
        tenderDetails={tenderDetails}
        userData={userData}
        user={user}
        tender={tender}
        id={id}
        updateUserById={updateUserById}
      />)}
    </div>
  );
};

export default ViewTender;
