import { useState, useEffect } from 'react';
import { permissionRoles } from '../utils/permissions';

const Chatbox = ({
  tenderDetails,
  userData,
  user,
  tender,
  id,
  updateUserById,
}) => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatError, setChatError] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isSending, setIsSending] = useState(false); // State for handling message sending

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

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageContent.trim() || isSending) return; // Prevent sending empty or multiple messages

    setIsSending(true); // Start sending process

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

      const newMail = {
        sender: userData._id,
        recipient: userData.role === 'tenderer' ? tender.procurementGroup : tendererId,
        type: 'tender',
        subject: `${tender.title}`,
        content: messageContent,
        relatedItem: tender._id,
      };



      if (userData.role === 'tenderer') {
        await Promise.all(
          tender.procurementGroup.map(async (procurementMember) => {
            newMail.recipient = procurementMember._id;
            await updateUserById(procurementMember._id, { newMail });
          })
        );
      } else if (permissionRoles.messageOnAllTenders.includes(userData.role)) {
        await updateUserById(tendererId, { newMail });
      }

      setChatMessages([...chatMessages, newMessage]);
      setMessageContent('');
      setChatError('');
    } catch (error) {
      setChatError(error.message);
    } finally {
      setIsSending(false); // Reset the sending state
    }
  };

  return (
    <>
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
        {isChatOpen ? '关闭招标答疑' : '打开招标答疑'}
      </button>

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
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSending} // Disable button while sending
                  >
                    {isSending ? '发送中...' : '发送'}
                  </button>
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
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSending} // Disable button while sending
                >
                  {isSending ? '发送中...' : '发送'}
                </button>
              </form>
            </div>
          )}
          {chatError && <div className="alert alert-danger mt-3">{chatError}</div>}
        </div>
      )}
    </>
  );
};

export default Chatbox;
