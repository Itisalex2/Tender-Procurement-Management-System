import { useEffect, useState } from 'react';
import { useAuthContext } from '../hooks/use-auth-context';

const Home = () => {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();


  useEffect(() => {
    const fetchTenders = async () => {
      try {
        // Only get open tenders
        const response = await fetch('/api/tender?status=Open', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }); // Fetch tenders from backend
        const data = await response.json();

        if (!response.ok) {
          throw new Error('Failed to fetch tenders');
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

  if (loading) {
    return <div></div>;
  }

  if (error) {
    return <div>错误: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">招标列表</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>标题</th>
            <th>描述</th>
            <th>发布日期</th>
            <th>截止日期</th>
            <th>状态</th>
            <th>相关文件</th>
          </tr>
        </thead>
        <tbody>
          {tenders.map((tender) => (
            <tr key={tender._id}>
              <td>{tender.title}</td>
              <td>{tender.description}</td>
              <td>{new Date(tender.issueDate).toLocaleString()}</td>
              <td>{new Date(tender.closingDate).toLocaleString()}</td>
              <td>{tender.status === 'Open' ? '开放' : tender.status === 'Closed' ? '关闭' : '已授予'}</td>
              <td>
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
                  '无相关文件'
                )}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
