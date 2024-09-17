import useFetchUser from '../hooks/use-fetch-user';
import { Link } from 'react-router-dom';
import useLocalize from '../hooks/use-localize';

const ViewOwnBids = () => {
  const { userData, loading, error } = useFetchUser({ includeBids: true });
  const { localize } = useLocalize();

  if (loading) {
    return <div>{localize('loading')}</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!userData.bids || userData.bids.length === 0) {
    return <div>{localize('noBidsSubmitted')}</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">{localize('myBids')}</h1>
      <div className="row">
        {userData.bids.slice().reverse().map((bid) => {
          // Ensure we return JSX when `bid` and `bid.tender` exist
          if (bid && bid.tender) {
            return (
              <div className="col-12 mb-4" key={bid._id}>
                <Link to={`/tender/${bid.tender._id}/bid/${bid._id}`} className="text-decoration-none">
                  <div className="card h-100">
                    <div className="card-header">
                      <h4 className="mb-0">{bid.tender.title}</h4>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">
                        {localize('amount')}: {bid.amount}
                      </h5>
                      <p className="card-text">
                        {localize('status')}: {localize(bid.status)}
                      </p>
                      {bid.content && (
                        <p className="card-text">
                          {localize('bidInformation')}: {bid.content}
                        </p>
                      )}
                    </div>
                    <div className="card-footer text-muted">
                      {localize('submittedAt')}: {new Date(bid.submittedAt).toLocaleString()}
                    </div>
                  </div>
                </Link>
              </div>
            );
          }
          // Return null for bids that do not have `bid` or `bid.tender`
          return null;
        })}
      </div>
    </div>
  );
};

export default ViewOwnBids;
