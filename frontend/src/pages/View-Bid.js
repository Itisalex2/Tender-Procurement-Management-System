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

  const isBidder = bid.bidder._id === userData._id; // Check if the user is the bidder
  const canViewPage = isBidder || permissionRoles.canViewBids.includes(userData.role);
  const canViewEvaluations = !isBidder && permissionRoles.canViewBids.includes(userData.role); // Non-bidders can view evaluations

  if (!canViewPage) {
    return (
      <div>您没有权限看见这个投标</div>
    );
  }

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

          {/* Render files if any are present, otherwise show a message */}
          {bid.files && bid.files.length > 0 ? (
            <div>
              <h5 className="card-title">投标文件:</h5>
              <ul className="list-group">
                {bid.files.map((file, index) => (
                  <li key={index} className="list-group-item">
                    <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                      {file.fileName} - 上传时间: {new Date(file.dateUploaded).toLocaleDateString()}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="card-text">无投标文件</p>
          )}


          {/* Only show evaluations if the user is not the bidder and has permission */}
          {canViewEvaluations && (
            <BidEvaluations
              user={user}
              evaluations={bid.evaluations}
              bidId={bidId}
              tenderId={tenderId}
              canAddEvaluations={canViewEvaluations}
              onEvaluationAdded={handleEvaluationAdded}
            />
          )}
        </div>
        <div className="card-footer text-muted">
          提交时间: {new Date(bid.submittedAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default ViewBid;
