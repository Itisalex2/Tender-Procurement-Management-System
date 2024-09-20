import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchTenders from '../hooks/use-fetch-tenders';
import useFetchUser from '../hooks/use-fetch-user';
import { useAuthContext } from '../hooks/use-auth-context';
import { permissionRoles, permissionStatus } from '../utils/permissions';
import useLocalize from '../hooks/use-localize';
import DownloadLink from '../components/Download-Link';

const ManageTenders = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { userData } = useFetchUser();
  const [statusFilter, setStatusFilter] = useState('all'); // Default filter status is 'all'
  const { tenders, loading, error, setTenders } = useFetchTenders(statusFilter);
  const [selectedTender, setSelectedTender] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { localize } = useLocalize();

  const handleDeleteTender = async (e, tenderId) => {
    e.stopPropagation();
    if (window.confirm(localize('confirmDeleteTender'))) {
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
          throw new Error(localize('failedToDeleteTender'));
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
        throw new Error(localize('failedToConfirmBidViewing'));
      }
    } catch (error) {
      console.error(localize('errorConfirmingBidViewing'), error);
    }
  };

  const handleViewBids = (tenderId) => navigate(`/tender/${tenderId}/bids`);

  const toggleTenderDetails = (tenderId) => setSelectedTender(prevId => (prevId === tenderId ? null : tenderId));

  const hasUserApproved = (tender) => userData && tender.procurementGroupApprovals.includes(userData._id);

  const handleSearch = (e) => setSearchQuery(e.target.value.toLowerCase());

  const handleStatusChangeToNegotiationCandidatesSelected = async (tenderId) => {
    try {
      const response = await fetch(`/api/tender/${tenderId}/change-status-to-negotiation-candidates-selected`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(localize('failedToChangeStatus'));
      }

      const updatedTender = await response.json();
      setTenders(tenders.map(tender => (tender._id === tenderId ? updatedTender : tender)));
      alert(localize('statusChangedToNegotiationCandidatesSelected'));
    } catch (error) {
      console.error(localize('errorChangingStatus'), error);
    }
  };

  // Filter tenders based on search query (title or description)
  const filteredTenders = tenders.filter((tender) => {
    return (
      tender.title.toLowerCase().includes(searchQuery) ||
      tender.description.toLowerCase().includes(searchQuery)
    );
  });


  if (loading || !userData) return <div>{localize('loading')}</div>;
  if (error) return <div>{localize('error')}: {error}</div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">{localize('manageTenders')}</h1>

      {/* Status filter dropdown */}
      <div className="mb-4 d-flex gap-3">
        <div>
          <label className="form-label">{localize('filterTenderStatus')}</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ width: '200px' }}
          >
            <option value="all">{localize('allStatus')}</option>
            <option value="Open">{localize('Open')}</option>
            <option value="Closed">{localize('Closed')}</option>
            <option value="ClosedAndCanSeeBids">{localize('ClosedAndCanSeeBids')}</option>
            <option value="NegotiationCandidatesSelected">{localize('NegotiationCandidatesSelected')}</option>
            <option value="Failed">{localize('Failed')}</option>
          </select>
        </div>

        {/* Search bar */}
        <div>
          <label className="form-label">{localize('searchKeyword')}</label>
          <input
            type="text"
            className="form-control"
            placeholder={localize('searchPlaceholder')}
            value={searchQuery}
            onChange={handleSearch}
            style={{ width: '300px' }}
          />
        </div>
      </div>

      {filteredTenders.length === 0 ? (
        <div>{localize('noTenders')}</div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>{localize('title')}</th>
              <th>{localize('description')}</th>
              <th>{localize('issueDate')}</th>
              <th>{localize('closingDate')}</th>
              <th>{localize('contact')}</th>
              <th>{localize('status')}</th>
              <th>{localize('actions')}</th>
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
                  <td>{localize(tender.status)}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-2">
                      {permissionRoles.editTender.includes(userData.role) && permissionStatus.editTender.includes(tender.status) && (
                        <>
                          <button className="btn btn-primary" onClick={() => handleEditTender(tender._id)}>
                            {localize('edit')}
                          </button>
                        </>
                      )}
                      {permissionRoles.deleteTender.includes(userData.role) && (
                        <button className="btn btn-danger" onClick={(e) => handleDeleteTender(e, tender._id)}>
                          {localize('delete')}
                        </button>
                      )}
                      {/* Change status to NegotiationCandidatesSelected button */}
                      {tender.status === 'ClosedAndCanSeeBids' && (
                        <button
                          className="btn btn-success"
                          onClick={() => handleStatusChangeToNegotiationCandidatesSelected(tender._id)}
                        >
                          {localize('changeStatusToNegotiationCandidatesSelected')}
                        </button>
                      )}
                      {userData && permissionRoles.confirmAllowViewBids.includes(userData.role) && tender.status === 'Closed' && (
                        <button
                          className="btn btn-warning"
                          onClick={() => handleConfirmToSeeBids(tender._id)}
                          disabled={hasUserApproved(tender)}
                        >
                          {hasUserApproved(tender) ? localize('alreadyConfirmed') : localize('confirmToSeeBids')}
                        </button>
                      )}
                      <button className="btn btn-secondary" onClick={() => navigate(`/tender/${tender._id}`)}>
                        {localize('viewTender')}
                      </button>
                      {permissionStatus.viewBids.includes(tender.status) && (
                        <button className="btn btn-info" onClick={() => handleViewBids(tender._id)}>
                          {localize('viewBids')}
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
                          <p><strong>{localize('description')}:</strong> {tender.description}</p>
                          <p><strong>{localize('otherRequirements')}:</strong> {tender.otherRequirements}</p>
                          <p><strong>{localize('contact')}:</strong> {tender.contactInfo.name}, {tender.contactInfo.email}, {tender.contactInfo.phone}</p>
                          <p><strong>{localize('status')}:</strong> {localize(tender.status)}</p>
                          <p><strong>{localize('targetedUsers')}:</strong></p>
                          <ul>
                            {tender.targetedUsers.map(user => <li key={user._id}>{user && user.username}</li>)}
                          </ul>
                          <p><strong>{localize('bidders')}:</strong></p>
                          <ul>
                            {tender.bids.map(bid => (
                              <li key={bid._id}>
                                {bid && bid.bidder && bid.bidder.username} {new Date(bid.submittedAt).toLocaleString('en-GB', {
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
                          <p><strong>{localize('procurementGroupMembers')}:</strong></p>
                          <ul>
                            {tender.procurementGroup.map(user => <li key={user._id}>{user && user.username}</li>)}
                          </ul>
                          {tender.relatedFiles?.length > 0 && (
                            <>
                              <p><strong>{localize('relatedFiles')}:</strong></p>
                              <ul>
                                {tender.relatedFiles.map((file, index) => (
                                  <li key={index}>
                                    <DownloadLink file={file} />
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
                                {hasUserApproved(tender) ? localize('alreadyConfirmed') : localize('confirmToSeeBids')}
                              </button>
                            </div>
                          )}

                          <button className="btn btn-secondary" onClick={() => navigate(`/tender/${tender._id}`)}>
                            {localize('viewTender')}
                          </button>

                          {/* View Bids button when status is ClosedAndCanSeeBids */}
                          {permissionStatus.viewBids.includes(tender.status) && (
                            <div className="mt-4">
                              <button
                                className="btn btn-info"
                                onClick={() => handleViewBids(tender._id)}
                              >
                                {localize('viewBids')}
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
