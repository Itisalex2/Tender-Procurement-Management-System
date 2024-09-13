import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../hooks/use-auth-context';

const ViewBids = () => {
  const { id } = useParams(); // Get tender id from URL
  const [bids, setBids] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

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

  return (
    <div>
      <h1>投标列表</h1>
      <ul>
        {bids.map((bid) => (
          <li key={bid._id}>
            <strong>{bid.bidder.username}</strong>: {bid.amount}
            <ul>
              {bid.files && bid.files.length > 0 ? (
                bid.files.map((file, index) => (
                  <li key={index}>
                    <a href={`${process.env.REACT_APP_BACKEND_URL}${file.fileUrl}`} target="_blank" rel="noopener noreferrer">
                      {file.fileName}
                    </a>
                  </li>
                ))
              ) : (
                <li>无文件</li>
              )}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewBids;
