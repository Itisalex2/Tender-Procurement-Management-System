import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useFetchUserById from '../hooks/use-fetch-user-by-id';
import useUpdateUser from '../hooks/use-update-user';

const ViewTenderer = () => {
  const { id } = useParams(); // Get the tenderer ID from the route parameters
  const { userData, loading, error, setUserData } = useFetchUserById(id); // Added setUserData to update comments in real-time
  const { updateUserById, isLoading: isSubmitting, error: submitError } = useUpdateUser(); // Hook for updating user

  const [newComment, setNewComment] = useState(''); // State to track new comment

  if (loading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">无法加载供应商: {error}</div>;
  }

  if (!userData) {
    return <div className="alert alert-warning">未找到供应商详情。</div>;
  }

  const {
    username,
    email,
    number,
    bids = [], // Default to an empty array if no bids
    tendererDetails,
  } = userData;

  const backendUrl = process.env.REACT_APP_BACKEND_URL; // Fetch backend URL from environment variables

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return; // Do not allow empty comments

    // Prepare the new comment object
    const commentData = {
      commenter: userData._id,
      comment: newComment,
      timestamp: new Date(), // Add the current timestamp
    };

    const updatedTendererDetails = {
      ...tendererDetails,
      newComment: commentData // Add the new comment
    };

    const updatedUserData = { tendererDetails: updatedTendererDetails };
    const updatedUser = await updateUserById(id, updatedUserData);

    if (updatedUser) {
      setNewComment(''); // Clear the comment input after successful submission
      setUserData((prevUserData) => ({
        ...prevUserData,
        tendererDetails: {
          ...prevUserData.tendererDetails,
          comments: [...prevUserData.tendererDetails.comments, { ...commentData, commenter: { _id: userData._id, username: userData.username } }],
        },
      }));
    }
  };

  // Handle tenderer verification toggle
  const handleVerifyToggle = async () => {
    const updatedTendererDetails = {
      ...tendererDetails,
      verified: !tendererDetails.verified, // Toggle the verified status
    };

    const updatedUserData = { tendererDetails: updatedTendererDetails };
    const updatedUser = await updateUserById(id, updatedUserData);

    if (updatedUser) {
      setUserData((prevUserData) => ({
        ...prevUserData,
        tendererDetails: {
          ...prevUserData.tendererDetails,
          verified: !prevUserData.tendererDetails.verified, // Toggle local state
        },
      }));
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">供应商详情</h1>
      <div className="card p-4 shadow-sm">
        <h2>{username}</h2>

        {/* Display basic details */}
        <div className="mb-3">
          <strong>电邮</strong> {email || '未提供'}
        </div>

        <div className="mb-3">
          <strong>电话</strong> {number || '未提供'}
        </div>

        {/* Display Bids */}
        <div className="mt-3">
          <h5>投标</h5>
          {bids.length === 0 ? (
            <p>暂无投标。</p>
          ) : (
            <ul className="list-group">
              {bids.map((bid) => (
                <li key={bid._id} className="list-group-item border-0 p-2">
                  <Link
                    to={`/tender/${bid.tender?._id}/bid/${bid._id}`}
                    style={{ textDecoration: 'none', outline: 'none' }}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <strong>标:</strong> {bid.tender?.title || '未提供'}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!tendererDetails && <strong>未交企业资料，无法评论</strong>}

        {tendererDetails && (
          <>
            <div className="mb-3">
              <strong>企业类型:</strong> {tendererDetails.businessType || '未提供'}
            </div>

            <div className="mb-3">
              <strong>法定代表人:</strong> {tendererDetails.legalRepresentative || '未提供'}
            </div>

            <div className="mb-3">
              <strong>成立日期:</strong> {tendererDetails.dateOfEstablishment
                ? new Date(tendererDetails.dateOfEstablishment).toLocaleDateString()
                : '未提供'}
            </div>

            <div className="mb-3">
              <strong>国家:</strong> {tendererDetails.country || '未提供'}
            </div>

            <div className="mb-3">
              <strong>办公地址:</strong> {tendererDetails.officeAddress || '未提供'}
            </div>

            <div className="mb-3">
              <strong>统一社会信用代码:</strong> {tendererDetails.unifiedSocialCreditCode || '未提供'}
            </div>

            <div className="mb-3">
              <strong>验证状态:</strong> {tendererDetails.verified ? '已验证' : '未验证'}
            </div>

            {/* Button to toggle verification status */}
            <button
              onClick={handleVerifyToggle}
              className={`btn ${tendererDetails.verified ? 'btn-danger' : 'btn-success'}`}
              style={{ width: '130px', display: 'inline-block' }} // Set a fixed width and use inline-block
            >
              {isSubmitting ? '处理中...' : tendererDetails.verified ? '取消验证' : '验证供应商'}
            </button>


            {/* Download Links for Files */}
            {tendererDetails.businessLicense && (
              <div className="mb-3">
                <strong>营业执照:</strong>
                <a href={`${backendUrl}/uploads/${tendererDetails.businessLicense}`} target="_blank" rel="noopener noreferrer">
                  下载
                </a>
              </div>
            )}

            {tendererDetails.legalRepresentativeBusinessCard && (
              <div className="mb-3">
                <strong>法人名片:</strong>
                <a href={`${backendUrl}/uploads/${tendererDetails.legalRepresentativeBusinessCard}`} target="_blank" rel="noopener noreferrer">
                  下载
                </a>
              </div>
            )}

            {/* Display Comments */}
            <div className="mt-5">
              <h3>评论</h3>
              {tendererDetails.comments.length === 0 ? (
                <p>暂无评论。</p>
              ) : (
                <ul className="list-group">
                  {tendererDetails.comments.map((comment) => (
                    <li key={comment._id} className="list-group-item">
                      <p>
                        <strong>{comment.commenter?.username || '未知用户'}</strong> ({new Date(comment.timestamp).toLocaleString()})
                      </p>
                      <p>{comment.comment}</p>
                    </li>
                  ))}
                </ul>
              )}

              {/* Add Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mt-3">
                <div className="mb-3">
                  <label htmlFor="newComment" className="form-label">添加评论</label>
                  <textarea
                    id="newComment"
                    className="form-control"
                    rows="3"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  />
                </div>
                {submitError && <div className="alert alert-danger">{submitError}</div>}
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? '提交中...' : '提交评论'}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewTenderer;
