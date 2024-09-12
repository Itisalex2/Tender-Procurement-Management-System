import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchTenderWithConversation } from '../hooks/use-fetch-tender-with-conversation';
import { useAuthContext } from '../hooks/use-auth-context';
import useFetchUser from '../hooks/use-fetch-user';
import permissionRoles from '../utils/permissions';

const ViewTender = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
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
  });

  const { tender, loading, error } = useFetchTenderWithConversation(id);
  const { userData, loading: userLoading, error: userError } = useFetchUser();

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatError, setChatError] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);

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
      });
    }
  }, [tender]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setChatMessages(conversation.messages);
  };

  const canViewAllConversations = () => {
    if (!userData) return false;
    return permissionRoles.messageOnAllTenders.includes(userData.role);
  };

  useEffect(() => {
    if (userData && !canViewAllConversations() && tenderDetails.conversations.length > 0) {
      const conversation = tenderDetails.conversations.find(
        (conv) => conv.user._id === userData._id
      );
      if (conversation) {
        setChatMessages(conversation.messages);
      }
    }
    // eslint-disable-next-line
  }, [tenderDetails.conversations, userData]);

  const canSubmitBid = () => {
    if (!userData) return false;
    return permissionRoles.submitBid.includes(userData.role);
  };

  const handleBidSubmit = () => {
    navigate(`/tender/${id}/bid`);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageContent.trim()) return;

    try {
      const tendererId = selectedConversation ? selectedConversation.user._id : null;

      const response = await fetch(`/api/tender/${id}/conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ content: messageContent, tendererId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '发送消息失败');
      }

      const newMessage = await response.json();
      setChatMessages([...chatMessages, newMessage]);
      setMessageContent('');
      setChatError('');
    } catch (error) {
      setChatError(error.message);
    }
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

        {canSubmitBid() && (
          <div className="mt-3">
            <button className="btn btn-primary" onClick={handleBidSubmit}>
              提交投标
            </button>
          </div>
        )}
      </div>

      {/* Chat toggle button */}
      <button
        className="btn btn-secondary"
        style={{
          position: 'fixed',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: '1000',
        }}
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        {isChatOpen ? '关闭聊天' : '打开聊天'}
      </button>

      {/* Chat Container on the right */}
      {isChatOpen && (
        <div
          className="chat-container"
          style={{
            flex: '0 0 300px',
            position: 'sticky',
            height: 'calc(100vh - 112px)',
            backgroundColor: '#f8f9fa',
            border: '3px solid #ddd',
            padding: '10px',
            overflowY: 'auto',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            zIndex: '999',
          }}
        >

          {canViewAllConversations() ? (
            <div>
              <h2>选择会话</h2>
              <ul>
                {tenderDetails.conversations.map((conversation) => (
                  <li key={conversation._id} onClick={() => handleSelectConversation(conversation)}>
                    <button className="btn btn-link">{conversation.user.username}</button>
                  </li>
                ))}
              </ul>
              {selectedConversation && (
                <>
                  <h3>会话与: {selectedConversation.user.username}</h3>
                  <div className="chat-box border p-3" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    {chatMessages.length > 0 ? (
                      chatMessages.map((msg, index) => (
                        <div key={index} className="chat-message mb-2">
                          <strong>{msg.sender.username}:</strong> {msg.content}
                          <span className="text-muted float-end" style={{ fontSize: '0.9rem' }}>
                            {new Date(msg.timestamp).toLocaleString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p>暂无讨论</p>
                    )}
                  </div>
                </>
              )}
              {selectedConversation && (
                <form onSubmit={handleSendMessage} className="mt-3">
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      placeholder="输入您的解答..."
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      rows="3"
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">发送</button>
                </form>
              )}
            </div>
          ) : (
            <div>
              <h2>问题与讨论</h2>
              <div className="chat-box border p-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {chatMessages.length > 0 ? (
                  chatMessages.map((msg, index) => (
                    <div key={index} className="chat-message mb-2">
                      <strong>{msg.sender.username}:</strong> {msg.content}
                      <span className="text-muted float-end" style={{ fontSize: '0.9rem' }}>
                        {new Date(msg.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p>暂无讨论</p>
                )}
              </div>
              <form onSubmit={handleSendMessage} className="mt-3">
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    placeholder="输入您的问题..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    rows="3"
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">发送</button>
              </form>
            </div>
          )}
          {chatError && <div className="alert alert-danger mt-3">{chatError}</div>}
        </div>
      )}
    </div>
  );


};

export default ViewTender;
