import useFetchUser from '../hooks/use-fetch-user';
import { Link } from 'react-router-dom';
import { bidStatusMap } from '../utils/english-to-chinese-map';

const ViewOwnBids = () => {
  const { userData, loading, error } = useFetchUser(true); // Fetch user data along with bids

  if (loading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!userData.bids || userData.bids.length === 0) {
    return <div>您没有提交任何投标。</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">我的投标</h1>
      <div className="row">
        {userData.bids.slice().reverse().map((bid) => {
          // Ensure we return JSX when `bid` and `bid.tender` exist
          if (bid && bid.tender) {
            return (
              <div className="col-12 mb-4" key={bid._id}>
                <Link to={`/tender/${bid.tender._id}/bid/${bid._id}`} className="text-decoration-none">
                  <div className="card h-100">
                    <div className="card-header">
                      <h4 className="mb-0">{bid.tender.title}</h4> {/* Large title */}
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">金额: {bid.amount}</h5>
                      <p className="card-text">状态: {bidStatusMap[bid.status]}</p>
                      {bid.content && <p className="card-text">投标信息: {bid.content}</p>}
                    </div>
                    <div className="card-footer text-muted">
                      提交时间: {new Date(bid.submittedAt).toLocaleString()}
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
