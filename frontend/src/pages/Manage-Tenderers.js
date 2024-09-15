import React, { useState } from 'react';
import useFetchTenderers from '../hooks/use-fetch-tenderers';

const ManageTenderers = () => {
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
    return <div>加载中...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">无法获取供应商列表: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">供应商库</h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="搜索企业名称..."
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
          全部
        </button>
        <button
          className={`btn ${verifiedFilter === true ? 'btn-primary' : 'btn-outline-primary'} mx-2`}
          onClick={() => handleFilterChange(true)}
        >
          已验证
        </button>
        <button
          className={`btn ${verifiedFilter === false ? 'btn-primary' : 'btn-outline-primary'} mx-2`}
          onClick={() => handleFilterChange(false)}
        >
          未验证
        </button>
      </div>

      {/* Tenderers Table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>企业名称</th>
            <th>企业类型</th>
            <th>法定代表人</th>
            <th>国家</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredTenderers.length > 0 ? (
            filteredTenderers.map((tenderer) => (
              <tr key={tenderer._id}>
                <td>{tenderer.username || '未提供'}</td>
                <td>{tenderer.tendererDetails?.businessType || '未提供'}</td>
                <td>{tenderer.tendererDetails?.legalRepresentative || '未提供'}</td>
                <td>{tenderer.tendererDetails?.country || '未提供'}</td>
                <td>{tenderer.tendererDetails?.verified ? '已验证' : '未验证'}</td>
                <td>
                  <a href={`/tenderer/${tenderer._id}`} className="btn btn-primary">
                    查看详情
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                未找到符合条件的供应商
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageTenderers;
