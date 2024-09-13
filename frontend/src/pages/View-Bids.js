import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/use-auth-context';
import useFetchUser from '../hooks/use-fetch-user';

const ViewBids = () => {
  const { id } = useParams(); // Get tender id from URL
  const [bids, setBids] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const { userData, error: userError } = useFetchUser();
  const navigate = useNavigate(); // Use navigate for bid redirection

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await fetch(`/api/tender/${id}/bids`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (response.status === 403) {
          throw new Error('您无权查看投标，因为投标尚未公开。');
        }

        if (!response.ok) {
          throw new Error('无法获取投标。');
        }

        const data = await response.json();
        setBids(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBids();
  }, [id, user]);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!userData || !bids) {
    return <div>下载中...</div>;
  }

  if (userError || error) {
    return <div>错误: {userError}</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">投标列表</h1>
      {bids.length === 0 ? (
        <div className="alert alert-info">没有投标。</div>
      ) : (
        <div className="row">
          {bids.map((bid) => (
            <div
              key={bid._id}
              className="col-12 mb-4"
              onClick={() => navigate(`/tender/${id}/bid/${bid._id}`)} // Navigate to specific bid
              style={{ cursor: 'pointer' }}
            >
              <div className="card">
                <div className="card-header">
                  <strong>供应商: {bid.bidder.username}</strong>
                </div>
                <div className="card-body">
                  <h5 className="card-title">投标金额: {bid.amount}</h5>
                  <p className="card-text">投标信息: {bid.content || '无'}</p>


                </div>
                <div className="card-footer text-muted">
                  提交时间: {new Date(bid.submittedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewBids;
