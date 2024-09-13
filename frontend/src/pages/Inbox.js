import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchMails from '../hooks/use-fetch-mails';
import { useAuthContext } from '../hooks/use-auth-context';

const Mail = () => {
  const { mails, loading, error, refetchMails } = useFetchMails(false, true);
  const navigate = useNavigate();
  const { user } = useAuthContext();
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
      // Reset selections after marking as read
      setSelectedMails([]);
      setSelectAll(false);
    } catch (err) {
      console.error('Error marking mail as read:', err);
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
      refetchMails(); // Refresh the mail list after deleting
      // Reset selections after marking as read
      setSelectedMails([]);
      setSelectAll(false);
    } catch (err) {
      console.error('Error deleting mails:', err);
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
        body: JSON.stringify({ mailIds, read: false }), // Mark mails as unread
      });
      refetchMails(); // Refresh the mail list after marking as unread
      // Reset selections after marking as read
      setSelectedMails([]);
      setSelectAll(false);
    } catch (err) {
      console.error('Error marking mail as unread:', err);
    }
  };


  const handleMarkAllAsRead = async () => {
    handleMarkAsRead(selectedMails);
  };

  const handleDeleteSelectedMails = async () => {
    handleDeleteMails(selectedMails);
  };

  const handleNavigate = (relatedItem, mailId) => {
    handleMarkAsRead(mailId);
    navigate(`/tender/${relatedItem}`);
  };

  const toggleMailContent = (mailId) => {
    setExpandedMail(expandedMail === mailId ? null : mailId); // Toggle mail content
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
      setSelectedMails([]); // Deselect all
    } else {
      setSelectedMails(mails.map((mail) => mail._id)); // Select all mails
    }
    setSelectAll(!selectAll);
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

      <div className="mb-4">
        <input
          type="checkbox"
          checked={selectAll}
          onChange={toggleSelectAll}
        />{' '}
        全选
        <button
          className="btn btn-secondary mx-2"
          onClick={handleMarkAllAsRead}
          disabled={selectedMails.length === 0}
        >
          标记已读
        </button>
        <button
          className="btn btn-secondary mx-2"
          onClick={() => handleMarkAsUnread(selectedMails)}
          disabled={selectedMails.length === 0}
        >
          标记未读
        </button>
        <button
          className="btn btn-danger"
          onClick={handleDeleteSelectedMails}
          disabled={selectedMails.length === 0}
        >
          删除
        </button>
      </div>

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
                  <h6 className="mb-0">主题：{mail.subject}</h6>
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
                  来源: {mail.sender.username}
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
                  <p>内容: {mail.content}</p>
                  {mail.type === 'tender' && mail.relatedItem && (
                    <button
                      className="btn btn-primary mt-3"
                      onClick={() => handleNavigate(mail.relatedItem, mail._id)}
                    >
                      查看招标
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