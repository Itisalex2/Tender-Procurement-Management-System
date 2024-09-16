import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchTenderWithConversation } from '../hooks/use-fetch-tender-with-conversation';
import { useAuthContext } from '../hooks/use-auth-context';
import useUpdateUser from '../hooks/use-update-user';
import useFetchUser from '../hooks/use-fetch-user';
import { permissionRoles } from '../utils/permissions';
import Chatbox from '../components/Chatbox';

const ViewTender = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { updateUserById } = useUpdateUser();
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
    bids: [], // Include bids here
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
        bids: tender.bids || [], // Populate the bids here
      });
    }
  }, [tender]);

  const canSubmitBid = () => {
    if (!userData) return false;
    return permissionRoles.submitBid.includes(userData.role) && tender && tender.status === 'Open';
  };

  const handleBidSubmit = () => {
    navigate(`/tender/${id}/bid`);
  };

  if (loading || userLoading || !userData) {
    return <div>下载中...</div>;
  }

  if (error || userError) {
    return <div>Error: {error || userError}</div>;
  }

  return (
    <div className="container mt-5" style={{ display: 'flex', flexDirection: 'row' }}>
      <div className="view-tender-content" style={{ flex: 1 }}>
        <h1 className="mb-4">查看招标</h1>

        <div className="mb-3">
          <label className="form-label">标题</label>
          <p>{tenderDetails.title}</p>
        </div>

        <div className="mb-3">
          <label className="form-label">描述</label>
          <p>{tenderDetails.description}</p>
        </div>

        <div className="mb-3">
          <label className="form-label">发布日期</label>
          <p>{new Date(tenderDetails.issueDate).toLocaleString()}</p>
        </div>

        <div className="mb-3">
          <label className="form-label">截止日期</label>
          <p>{new Date(tenderDetails.closingDate).toLocaleString()}</p>
        </div>

        <div className="mb-3">
          <label className="form-label">联系人姓名</label>
          <p>{tenderDetails.contactInfo.name}</p>
        </div>

        <div className="mb-3">
          <label className="form-label">联系人邮箱</label>
          <p>{tenderDetails.contactInfo.email}</p>
        </div>

        <div className="mb-3">
          <label className="form-label">联系人电话</label>
          <p>{tenderDetails.contactInfo.phone || '无'}</p>
        </div>

        <div className="mb-3">
          <label className="form-label">其他要求</label>
          <p>{tenderDetails.otherRequirements || '无'}</p>
        </div>

        <div className="mb-3">
          <label className="form-label">现有文件</label>
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
                  <span> - 上传时间: {new Date(file.dateUploaded).toLocaleString()}</span>
                )}
                {file.uploadedBy && (
                  <span> - 上传者: {file.uploadedBy.username}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Show the list of bidders */}
        {permissionRoles.viewBids.includes(userData.role) && (
          <div className="mb-3">
            <label className="form-label">投标者</label>
            <ul>
              {tenderDetails.bids.map((bid, index) => (
                <li key={index}>
                  供应商: {bid.bidder.username} - 提交时间: {new Date(bid.submittedAt).toLocaleString('en-GB', {
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
              提交投标
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
