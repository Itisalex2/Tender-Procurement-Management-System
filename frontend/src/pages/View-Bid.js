import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../hooks/use-auth-context';
import useFetchUser from '../hooks/use-fetch-user';
import BidEvaluations from '../components/BidEvaluations';
import { bidStatusMap } from '../utils/english-to-chinese-map';
import permissionRoles from '../utils/permissions';

const ViewBid = () => {
  const { tenderId, bidId } = useParams();
  const { userData, loading: userLoading, error: userError } = useFetchUser();
  const { user } = useAuthContext();
  const [bid, setBid] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBid = async () => {
      try {
        const response = await fetch(`/api/bid/${bidId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('无法获取投标。');
        }

        const data = await response.json();
        setBid(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBid();
  }, [tenderId, bidId, user]);

  const handleEvaluationAdded = (newEvaluation) => {
    setBid((prevBid) => ({
      ...prevBid,
      evaluations: [...prevBid.evaluations, newEvaluation],
    }));
  };

  if (userError || error) {
    return <div className="alert alert-danger">{userError || error}</div>;
  }

  if (userLoading || !bid) {
    return <div>加载中...</div>;
  }

  const canAddEvaluations = userData?.role && permissionRoles.canViewAndEditBidEvaluations.includes(userData.role);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">投标详情</h1>
      <div className="card">
        <div className="card-header">
          <strong>供应商: {bid.bidder.username}</strong>
        </div>
        <div className="card-body">
          <h5 className="card-title">投标金额: {bid.amount}</h5>
          <p className="card-text">投标信息: {bid.content || '无'}</p>
          <p className="card-text">状态: {bidStatusMap[bid.status]}</p>

          <BidEvaluations
            user={user}
            evaluations={bid.evaluations}
            bidId={bidId}
            tenderId={tenderId}
            canAddEvaluations={canAddEvaluations}
            onEvaluationAdded={handleEvaluationAdded}
          />
        </div>
        <div className="card-footer text-muted">
          提交时间: {new Date(bid.submittedAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default ViewBid;
