import React from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchMails from '../hooks/use-fetch-mails';
import { useAuthContext } from '../hooks/use-auth-context';

const Mail = () => {
  const { mails, loading, error, refetchMails } = useFetchMails(false, true);
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const handleMarkAsRead = async (mailId) => {
    try {
      await fetch(`/api/mail/${mailId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ read: true }),
      });
      refetchMails(); // Refresh the mail list after marking as read
    } catch (err) {
      console.error('Error marking mail as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch('/api/mail/markAllRead', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });
      refetchMails(); // Refresh mails after marking all as read
    } catch (err) {
      console.error('Error marking all mails as read:', err);
    }
  };

  const handleNavigate = (relatedItem, mailId) => {
    handleMarkAsRead(mailId);
    navigate(`/tender/${relatedItem}`);
  };

  if (loading) {
    return <div className="text-center my-5">下载中...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">邮件</h2>

      <button className="btn btn-secondary mb-4" onClick={handleMarkAllAsRead}>
        标记所有为已读
      </button>

      {mails.length === 0 ? (
        <div className="alert alert-info">无邮件</div>
      ) : (
        <div className="list-group">
          {mails.map((mail) => (
            <div
              key={mail._id}
              className={`list-group-item list-group-item-action mb-3 ${mail.read ? 'bg-light' : ''}`}
              style={{ borderRadius: '8px' }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div onClick={() => handleMarkAsRead(mail._id)}>
                  <h5 className="mb-1">{mail.subject}</h5>
                  <p className="mb-1 text-muted">来源: {mail.sender.username}</p>
                  <p>{mail.content}</p>
                </div>
                <small className="text-muted">
                  {new Date(mail.timestamp).toLocaleString()}
                </small>
              </div>

              {mail.type === 'tender' && mail.relatedItem && (
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => handleNavigate(mail.relatedItem, mail._id)}
                >
                  查看招标
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Mail;
