import React, { useState } from 'react';
import useFetchTenderers from '../hooks/use-fetch-tenderers';
import useLocalize from '../hooks/use-localize'; // Import localization hook

const ManageTenderers = () => {
  const { localize } = useLocalize(); // Use localization hook
  const [verifiedFilter, setVerifiedFilter] = useState(null); // null = all, true = verified, false = non-verified
  const [searchQuery, setSearchQuery] = useState(''); // State to track the search query

  const { tenderers, loading, error } = useFetchTenderers({ verified: verifiedFilter });

  const handleFilterChange = (filter) => {
    setVerifiedFilter(filter);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query as user types
  };

  const filteredTenderers = tenderers.filter((tenderer) =>
    tenderer.username.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by name matching the search query
  );

  if (loading) {
    return <div>{localize('loading')}</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{localize('unableToFetchTenderers')}: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">{localize('tenderersDatabase')}</h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder={localize('searchCompany')}
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Filter Buttons */}
      <div className="mb-4">
        <button
          className={`btn ${verifiedFilter === null ? 'btn-primary' : 'btn-outline-primary'} mx-2`}
          onClick={() => handleFilterChange(null)}
        >
          {localize('all')}
        </button>
        <button
          className={`btn ${verifiedFilter === true ? 'btn-primary' : 'btn-outline-primary'} mx-2`}
          onClick={() => handleFilterChange(true)}
        >
          {localize('verified')}
        </button>
        <button
          className={`btn ${verifiedFilter === false ? 'btn-primary' : 'btn-outline-primary'} mx-2`}
          onClick={() => handleFilterChange(false)}
        >
          {localize('nonVerified')}
        </button>
      </div>

      {/* Tenderers Table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>{localize('companyName')}</th>
            <th>{localize('businessType')}</th>
            <th>{localize('legalRepresentative')}</th>
            <th>{localize('country')}</th>
            <th>{localize('status')}</th>
            <th>{localize('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {filteredTenderers.length > 0 ? (
            filteredTenderers.map((tenderer) => (
              <tr key={tenderer._id}>
                <td>{tenderer.username || localize('notProvided')}</td>
                <td>{tenderer.tendererDetails?.businessType || localize('notProvided')}</td>
                <td>{tenderer.tendererDetails?.legalRepresentative || localize('notProvided')}</td>
                <td>{tenderer.tendererDetails?.country || localize('notProvided')}</td>
                <td>{tenderer.tendererDetails?.verified ? localize('verified') : localize('nonVerified')}</td>
                <td>
                  <a href={`/tenderer/${tenderer._id}`} className="btn btn-primary">
                    {localize('viewDetails')}
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                {localize('noTenderersFound')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageTenderers;
