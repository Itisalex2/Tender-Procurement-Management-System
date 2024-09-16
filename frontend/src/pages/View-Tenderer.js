import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useFetchUserById from '../hooks/use-fetch-user-by-id';
import useUpdateUser from '../hooks/use-update-user';
import useLocalize from '../hooks/use-localize'; // Import localization hook

const ViewTenderer = () => {
  const { id } = useParams(); // Get the tenderer ID from the route parameters
  const { userData, loading, error, setUserData } = useFetchUserById(id); // Added setUserData to update comments in real-time
  const { updateUserById, isLoading: isSubmitting, error: submitError } = useUpdateUser(); // Hook for updating user
  const { localize } = useLocalize(); // Use localization hook

  const [newComment, setNewComment] = useState(''); // State to track new comment

  if (loading) {
    return <div>{localize('loading')}</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{localize('unableToLoadTenderer')}: {error}</div>;
  }

  if (!userData) {
    return <div className="alert alert-warning">{localize('tendererDetailsNotFound')}</div>;
  }

  if (userData.role !== 'tenderer') {
    return <div className="alert alert-danger">{localize('cannotViewNonTenderer')}</div>;
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
      newComment: commentData, // Add the new comment
    };

    const updatedUserData = { tendererDetails: updatedTendererDetails };
    const updatedUser = await updateUserById(id, updatedUserData);

    if (updatedUser) {
      setNewComment(''); // Clear the comment input after successful submission
      setUserData((prevUserData) => ({
        ...prevUserData,
        tendererDetails: {
          ...prevUserData.tendererDetails,
          comments: [
            ...prevUserData.tendererDetails.comments,
            {
              ...commentData,
              commenter: { _id: userData._id, username: userData.username },
            },
          ],
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
      <h1 className="mb-4">{localize('tendererDetails')}</h1>
      <div className="card p-4 shadow-sm">
        <h2>{username}</h2>

        {/* Display basic details */}
        <div className="mb-3">
          <strong>{localize('email')}</strong> {email || localize('notProvided')}
        </div>

        <div className="mb-3">
          <strong>{localize('phone')}</strong> {number || localize('notProvided')}
        </div>

        {/* Display Bids */}
        <div className="mt-3">
          <h5>{localize('bids')}</h5>
          {bids.length === 0 ? (
            <p>{localize('noBids')}</p>
          ) : (
            <ul className="list-group">
              {bids.map((bid) => (
                <li key={bid._id} className="list-group-item border-0 p-2">
                  <Link
                    to={`/tender/${bid.tender?._id}/bid/${bid._id}`}
                    style={{ textDecoration: 'none', outline: 'none' }}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <strong>{localize('tender')}:</strong> {bid.tender?.title || localize('notProvided')}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!tendererDetails && <strong>{localize('noCompanyDetailsCannotComment')}</strong>}

        {tendererDetails && (
          <>
            <div className="mb-3">
              <strong>{localize('businessType')}:</strong> {tendererDetails.businessType || localize('notProvided')}
            </div>

            <div className="mb-3">
              <strong>{localize('legalRepresentative')}:</strong> {tendererDetails.legalRepresentative || localize('notProvided')}
            </div>

            <div className="mb-3">
              <strong>{localize('dateOfEstablishment')}:</strong>{' '}
              {tendererDetails.dateOfEstablishment
                ? new Date(tendererDetails.dateOfEstablishment).toLocaleDateString()
                : localize('notProvided')}
            </div>

            <div className="mb-3">
              <strong>{localize('country')}:</strong> {tendererDetails.country || localize('notProvided')}
            </div>

            <div className="mb-3">
              <strong>{localize('officeAddress')}:</strong> {tendererDetails.officeAddress || localize('notProvided')}
            </div>

            <div className="mb-3">
              <strong>{localize('unifiedSocialCreditCode')}:</strong> {tendererDetails.unifiedSocialCreditCode || localize('notProvided')}
            </div>

            <div className="mb-3">
              <strong>{localize('verificationStatus')}:</strong>{' '}
              {tendererDetails.verified ? localize('verified') : localize('nonVerified')}
            </div>

            {/* Button to toggle verification status */}
            <button
              onClick={handleVerifyToggle}
              className={`btn ${tendererDetails.verified ? 'btn-danger' : 'btn-success'}`}
              style={{ width: '130px', display: 'inline-block' }} // Set a fixed width and use inline-block
            >
              {isSubmitting
                ? localize('processing')
                : tendererDetails.verified
                  ? localize('unverifyTenderer')
                  : localize('verifyTenderer')}
            </button>

            {/* Download Links for Files */}
            {tendererDetails.businessLicense && (
              <div className="mb-3">
                <strong>{localize('businessLicense')}:</strong>{' '}
                <a
                  href={`${backendUrl}/uploads/${tendererDetails.businessLicense}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {localize('download')}
                </a>
              </div>
            )}

            {tendererDetails.legalRepresentativeBusinessCard && (
              <div className="mb-3">
                <strong>{localize('legalRepresentativeBusinessCard')}:</strong>{' '}
                <a
                  href={`${backendUrl}/uploads/${tendererDetails.legalRepresentativeBusinessCard}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {localize('download')}
                </a>
              </div>
            )}

            {/* Display Comments */}
            <div className="mt-5">
              <h3>{localize('comments')}</h3>
              {tendererDetails.comments.length === 0 ? (
                <p>{localize('noComments')}</p>
              ) : (
                <ul className="list-group">
                  {tendererDetails.comments.map((comment) => (
                    <li key={comment._id} className="list-group-item">
                      <p>
                        <strong>{comment.commenter?.username || localize('unknownUser')}</strong> (
                        {new Date(comment.timestamp).toLocaleString()})
                      </p>
                      <p>{comment.comment}</p>
                    </li>
                  ))}
                </ul>
              )}

              {/* Add Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mt-3">
                <div className="mb-3">
                  <label htmlFor="newComment" className="form-label">
                    {localize('addComment')}
                  </label>
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
                  {isSubmitting ? localize('submitting') : localize('submitComment')}
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
