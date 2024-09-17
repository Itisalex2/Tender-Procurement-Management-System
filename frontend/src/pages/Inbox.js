import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchMails from '../hooks/use-fetch-mails';
import { useAuthContext } from '../hooks/use-auth-context';
import useLocalize from '../hooks/use-localize';

const Mail = () => {
  const { mails, loading, error, refetchMails } = useFetchMails(false, true);
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { localize } = useLocalize();
  const [expandedMail, setExpandedMail] = useState(null); // State to track expanded mail
  const [selectedMails, setSelectedMails] = useState([]); // Track selected emails
  const [selectAll, setSelectAll] = useState(false); // State for select all checkbox

  const handleMarkAsRead = async (mailIds) => {
    try {
      await fetch(`/api/mail/markAsRead`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ mailIds, read: true }),
      });
      refetchMails(); // Refresh the mail list after marking as read
      setSelectedMails([]);
      setSelectAll(false);
    } catch (err) {
      console.error(localize('errorMarkingMail'), err);
    }
  };

  const handleDeleteMails = async (mailIds) => {
    try {
      await fetch(`/api/mail/deleteMails`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ mailIds }),
      });
      refetchMails();
      setSelectedMails([]);
      setSelectAll(false);
    } catch (err) {
      console.error(localize('errorDeletingMail'), err);
    }
  };

  const handleMarkAsUnread = async (mailIds) => {
    try {
      await fetch(`/api/mail/markAsRead`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ mailIds, read: false }),
      });
      refetchMails();
      setSelectedMails([]);
      setSelectAll(false);
    } catch (err) {
      console.error(localize('errorMarkingUnread'), err);
    }
  };

  const handleMarkAllAsRead = async () => {
    handleMarkAsRead(selectedMails);
  };

  const handleDeleteSelectedMails = async () => {
    handleDeleteMails(selectedMails);
  };

  const handleNavigateTenderType = (relatedItem, mailId) => {
    handleMarkAsRead([mailId]);
    navigate(`/tender/${relatedItem}`);
  };

  const handleNavigateBidType = async (relatedItem, mailId) => {
    handleMarkAsRead([mailId]);

    try {
      const response = await fetch(`/api/bid/${relatedItem}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(localize('errorFetchingTender'));
      }

      const bid = await response.json();
      navigate(`/tender/${bid.tender}/bid/${bid._id}`);
    } catch (err) {
      console.error(localize('errorFetchingTender'), err);
    }
  };

  const toggleMailContent = (mailId) => {
    setExpandedMail(expandedMail === mailId ? null : mailId);
  };

  const toggleSelectMail = (mailId) => {
    setSelectedMails((prevSelected) =>
      prevSelected.includes(mailId)
        ? prevSelected.filter((id) => id !== mailId)
        : [...prevSelected, mailId]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedMails([]);
    } else {
      setSelectedMails(mails.map((mail) => mail._id));
    }
    setSelectAll(!selectAll);
  };

  if (loading) {
    return <div className="text-center my-5">{localize('loading')}</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">{localize('mails')}</h2>

      <div className="mb-4">
        <input
          type="checkbox"
          checked={selectAll}
          onChange={toggleSelectAll}
        />{' '}
        {localize('selectAll')}
        <button
          className="btn btn-secondary mx-2"
          onClick={handleMarkAllAsRead}
          disabled={selectedMails.length === 0}
        >
          {localize('markAsRead')}
        </button>
        <button
          className="btn btn-secondary mx-2"
          onClick={() => handleMarkAsUnread(selectedMails)}
          disabled={selectedMails.length === 0}
        >
          {localize('markAsUnread')}
        </button>
        <button
          className="btn btn-danger"
          onClick={handleDeleteSelectedMails}
          disabled={selectedMails.length === 0}
        >
          {localize('delete')}
        </button>
      </div>

      {mails.length === 0 ? (
        <div className="alert alert-info">{localize('noMails')}</div>
      ) : (
        <div className="list-group">
          {mails.map((mail) => (
            <div
              key={mail._id}
              className={`list-group-item list-group-item-action mb-3 ${mail.read ? 'bg-light' : ''}`}
              style={{ borderRadius: '8px' }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <input
                  type="checkbox"
                  checked={selectedMails.includes(mail._id)}
                  onChange={() => toggleSelectMail(mail._id)}
                />
                <div
                  className="mail-subject"
                  style={{
                    flexBasis: '20%',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  onClick={() => toggleMailContent(mail._id)}
                >
                  <h6 className="mb-0">{localize('subject')}: {mail.subject}</h6>
                </div>
                <div
                  className="mail-sender text-muted"
                  style={{
                    flexBasis: '20%',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  onClick={() => toggleMailContent(mail._id)}
                >
                  {localize('sender')}: {mail.sender.username}
                </div>
                <div
                  className="mail-snippet text-muted"
                  style={{
                    flexBasis: '60%',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  onClick={() => toggleMailContent(mail._id)}
                >
                  {mail.content}
                </div>
                <small className="text-muted" style={{ marginLeft: 'auto' }}>
                  {new Date(mail.timestamp).toLocaleString()}
                </small>
              </div>

              {expandedMail === mail._id && (
                <div>
                  <p>{localize('content')}: {mail.content}</p>
                  {mail.type === 'tender' && mail.relatedItem && (
                    <button
                      className="btn btn-primary mt-3"
                      onClick={() => handleNavigateTenderType(mail.relatedItem, mail._id)}
                    >
                      {localize('viewTender')}
                    </button>
                  )}
                  {mail.type === 'bid' && mail.relatedItem && (
                    <button
                      className="btn btn-primary mt-3"
                      onClick={() => handleNavigateBidType(mail.relatedItem, mail._id)}
                    >
                      {localize('viewBid')}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Mail;
