import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/use-auth-context';
import useFetchUser from '../hooks/use-fetch-user';
import permissionRoles from '../utils/permissions';
import { statusMap } from "../utils/english-to-chinese-map";
import React from 'react';

const ManageTenders = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { userData } = useFetchUser();
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTender, setSelectedTender] = useState(null);

  // Fetch all tenders from the backend
  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const response = await fetch('/api/tender', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch tenders');
        }
        setTenders(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchTenders();
  }, [user.token]);

  const handleDeleteTender = async (e, tenderId) => {
    e.stopPropagation();
    const confirmDelete = window.confirm('您确定要删除这个招标吗？');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/tender/${tenderId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete tender');
      }

      setTenders(tenders.filter((tender) => tender._id !== tenderId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditTender = (tenderId) => {
    navigate(`/tender/edit/${tenderId}`);
  };

  const toggleTenderDetails = (tenderId) => {
    setSelectedTender((prevId) => (prevId === tenderId ? null : tenderId));
  };

  const handleConfirmToSeeBids = async (tenderId) => {
    try {
      const response = await fetch(`/api/tender/${tenderId}/approveBidViewing`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to confirm');
      }
      const updatedTender = await response.json();
      setTenders(tenders.map(tender => (tender._id === tenderId ? updatedTender : tender)));
    } catch (error) {
      console.error('Error confirming bid viewing:', error);
    }
  };

  const handleViewBids = (tenderId) => {
    navigate(`/tender/${tenderId}/bids`);
  };

  const hasUserApproved = (tender) => {
    if (!userData) return false;
    return tender.procurementGroupApprovals.some((userId) => userId === userData._id);
  };

  if (loading) {
    return <div>下载中...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">招标管理</h1>

      {tenders.length === 0 ? (
        <div>无招标项目</div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>标题</th>
              <th>描述</th>
              <th>发布日期</th>
              <th>截止日期</th>
              <th>联系</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {tenders.map((tender) => (
              <React.Fragment key={tender._id}>
                <tr onClick={() => toggleTenderDetails(tender._id)} style={{ cursor: 'pointer' }}>
                  <td>{tender.title}</td>
                  <td>{tender.description}</td>
                  <td>{new Date(tender.issueDate).toLocaleString()}</td>
                  <td>{new Date(tender.closingDate).toLocaleString()}</td>
                  <td>
                    {tender.contactInfo.name} <br />
                    {tender.contactInfo.email} <br />
                    {tender.contactInfo.phone}
                  </td>
                  <td>{statusMap[tender.status]}</td>
                  <td>
                    <button className="btn btn-primary me-2" onClick={() => handleEditTender(tender._id)}>
                      编辑
                    </button>
                    <button className="btn btn-danger" onClick={(e) => handleDeleteTender(e, tender._id)}>
                      删除
                    </button>
                  </td>
                </tr>

                {selectedTender === tender._id && (
                  <tr>
                    <td colSpan="7">
                      <div className="card mb-4">
                        <div className="card-body">
                          <p><strong>描述:</strong> {tender.description}</p>
                          <p><strong>其他要求:</strong> {tender.otherRequirements}</p>
                          <p><strong>联系:</strong> {tender.contactInfo.name}, {tender.contactInfo.email}, {tender.contactInfo.phone}</p>
                          <p><strong>状态:</strong> {tender.status}</p>
                          <p><strong>目标用户:</strong></p>
                          <ul>
                            {tender.targetedUsers.map((user) => (
                              <li key={user._id}>{user.username}</li>
                            ))}
                          </ul>
                          <p><strong>采购组成员:</strong></p>
                          <ul>
                            {tender.procurementGroup.map((user) => (
                              <li key={user._id}>{user.username}</li>
                            ))}
                          </ul>
                          <p><strong>相关文件:</strong></p>
                          {tender.relatedFiles && tender.relatedFiles.length > 0 ? (
                            <ul>
                              {tender.relatedFiles.map((file, index) => (
                                <li key={index}>
                                  <a href={`${process.env.REACT_APP_BACKEND_URL}${file.fileUrl}`} target="_blank" rel="noopener noreferrer">
                                    {file.fileName}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            ''
                          )}

                          {/* Confirm to See Bids button for procurement group members */}
                          {userData && permissionRoles.confirmAllowViewBids.includes(userData.role) && tender.status === 'Closed' && (
                            <div className="mt-4">
                              <button
                                className="btn btn-warning"
                                onClick={() => handleConfirmToSeeBids(tender._id)}
                                disabled={hasUserApproved(tender)}
                              >
                                {hasUserApproved(tender) ? '已确认' : '确认查看投标'}
                              </button>
                            </div>
                          )}

                          {/* View Bids button when status is ClosedAndCanSeeBids */}
                          {tender.status === 'ClosedAndCanSeeBids' && (
                            <div className="mt-4">
                              <button
                                className="btn btn-info"
                                onClick={() => handleViewBids(tender._id)}
                              >
                                查看投标
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageTenders;
