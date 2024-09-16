import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchTenders from '../hooks/use-fetch-tenders';
import useFetchUser from '../hooks/use-fetch-user';
import { useAuthContext } from '../hooks/use-auth-context';
import { permissionRoles, permissionStatus } from '../utils/permissions';
import { statusMap } from '../utils/english-to-chinese-map';

const ManageTenders = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { userData } = useFetchUser();
  const [statusFilter, setStatusFilter] = useState('all'); // Default filter status is 'all'
  const { tenders, loading, error, setTenders } = useFetchTenders(statusFilter); // Fetch tenders based on filter
  const [selectedTender, setSelectedTender] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDeleteTender = async (e, tenderId) => {
    e.stopPropagation();
    if (window.confirm('您确定要删除这个招标吗？')) {
      try {
        const response = await fetch(`/api/tender/${tenderId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (response.ok) {
          setTenders(tenders.filter(tender => tender._id !== tenderId));
        } else {
          throw new Error('Failed to delete tender');
        }
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  const handleEditTender = (tenderId) => navigate(`/tender/edit/${tenderId}`);

  const handleConfirmToSeeBids = async (tenderId) => {
    try {
      const response = await fetch(`/api/tender/${tenderId}/approveBidViewing`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const updatedTender = await response.json();
        setTenders(tenders.map(tender => (tender._id === tenderId ? updatedTender : tender)));
      } else {
        throw new Error('Failed to confirm bid viewing');
      }
    } catch (error) {
      console.error('Error confirming bid viewing:', error);
    }
  };

  const handleViewBids = (tenderId) => navigate(`/tender/${tenderId}/bids`);

  const toggleTenderDetails = (tenderId) => setSelectedTender(prevId => (prevId === tenderId ? null : tenderId));

  const hasUserApproved = (tender) => userData && tender.procurementGroupApprovals.includes(userData._id);

  const handleSearch = (e) => setSearchQuery(e.target.value.toLowerCase());

  // Filter tenders based on search query (title or description)
  const filteredTenders = tenders.filter((tender) => {
    return (
      tender.title.toLowerCase().includes(searchQuery) ||
      tender.description.toLowerCase().includes(searchQuery)
    );
  });

  if (loading || !userData) return <div>下载中...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">招标管理</h1>

      {/* Status filter dropdown */}
      <div className="mb-4 d-flex gap-3">
        <div>
          <label className="form-label">筛选招标状态</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ width: '200px' }}
          >
            <option value="all">所有状态</option>
            <option value="Open">开放</option>
            <option value="Closed">关闭</option>
            <option value="ClosedAndCanSeeBids">关闭可查看投标</option>
            <option value="Awarded">已授予</option>
            <option value="Failed">流标</option> {/* New "Failed" option */}
          </select>
        </div>

        {/* Search bar */}
        <div>
          <label className="form-label">搜索关键字</label>
          <input
            type="text"
            className="form-control"
            placeholder="搜索标题或描述..."
            value={searchQuery}
            onChange={handleSearch}
            style={{ width: '300px' }}
          />
        </div>
      </div>

      {filteredTenders.length === 0 ? (
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
            {filteredTenders.slice().reverse().map(tender => (
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
                    <div className="d-flex flex-wrap gap-2">
                      {permissionRoles.editTender.includes(userData.role) && permissionStatus.editTender.includes(tender.status) && (
                        <>
                          <button className="btn btn-primary" onClick={() => handleEditTender(tender._id)}>
                            编辑
                          </button>
                        </>
                      )}
                      {permissionRoles.deleteTender.includes(userData.role) && (
                        <button className="btn btn-danger" onClick={(e) => handleDeleteTender(e, tender._id)}>
                          删除
                        </button>)
                      }
                      {userData && permissionRoles.confirmAllowViewBids.includes(userData.role) && tender.status === 'Closed' && (
                        <button
                          className="btn btn-warning"
                          onClick={() => handleConfirmToSeeBids(tender._id)}
                          disabled={hasUserApproved(tender)}
                        >
                          {hasUserApproved(tender) ? '已确认' : '确认查看投标'}
                        </button>
                      )}
                      <button className="btn btn-secondary" onClick={() => navigate(`/tender/${tender._id}`)}>
                        查看招标
                      </button>
                      {permissionStatus.viewBids.includes(tender.status) && (
                        <button className="btn btn-info" onClick={() => handleViewBids(tender._id)}>
                          查看投标
                        </button>
                      )}
                    </div>
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
                          <p><strong>状态:</strong> {statusMap[tender.status]}</p>
                          <p><strong>目标用户:</strong></p>
                          <ul>
                            {tender.targetedUsers.map(user => <li key={user._id}>{user.username}</li>)}
                          </ul>
                          <p><strong>投标者:</strong></p>
                          <ul>
                            {tender.bids.map(bid => (
                              <li key={bid._id}>
                                {bid.bidder.username} {new Date(bid.submittedAt).toLocaleString('en-GB', {
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
                          <p><strong>采购组成员:</strong></p>
                          <ul>
                            {tender.procurementGroup.map(user => <li key={user._id}>{user.username}</li>)}
                          </ul>
                          {tender.relatedFiles?.length > 0 && (
                            <>
                              <p><strong>相关文件:</strong></p>
                              <ul>
                                {tender.relatedFiles.map((file, index) => (
                                  <li key={index}>
                                    <a href={`${process.env.REACT_APP_BACKEND_URL}${file.fileUrl}`} target="_blank" rel="noopener noreferrer">
                                      {file.fileName}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </>
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

                          <button className="btn btn-secondary" onClick={() => navigate(`/tender/${tender._id}`)}>
                            查看招标
                          </button>

                          {/* View Bids button when status is ClosedAndCanSeeBids */}
                          {permissionStatus.viewBids.includes(tender.status) && (
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
