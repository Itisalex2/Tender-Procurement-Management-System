import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/use-auth-context';
import useFetchUser from '../hooks/use-fetch-user';
import { useFetchTender } from '../hooks/use-fetch-tender';
import { permissionRoles } from '../utils/permissions';
import useUpdateUser from '../hooks/use-update-user';
import FileUpload from '../components/File-Upload';
import useLocalize from '../hooks/use-localize';

const SubmitBid = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authUserLoading } = useAuthContext();
  const { userData, loading: userLoading, error: userError } = useFetchUser();
  const { tender, loading: tenderLoading, error: tenderError } = useFetchTender(id);
  const { updateUserById } = useUpdateUser();
  const { localize } = useLocalize();

  const [amount, setAmount] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const hasPermissionToSubmitBid = () => {
    return userData && permissionRoles.submitBid.includes(userData.role);
  };

  const handleAddBidToTenderer = (bidId) => {
    updateUserById(userData._id, { newBidId: bidId });
  };

  const handleSubmitBid = (e) => {
    e.preventDefault();

    if (errorMsg) {
      return;
    }

    if (!hasPermissionToSubmitBid()) {
      setErrorMsg(localize('noPermissionToSubmitBid'));
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setErrorMsg('');
    setSuccess(false);

    // Create form data to include files
    const formData = new FormData();
    formData.append('amount', amount);
    formData.append('content', content);
    files.forEach((file) => {
      formData.append('files', file);
    });

    const xhr = new XMLHttpRequest();

    xhr.open('POST', `/api/tender/${id}/bid`, true);
    xhr.setRequestHeader('Authorization', `Bearer ${user.token}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      setIsUploading(false);
      if (xhr.status === 200 || xhr.status === 201) {
        const data = JSON.parse(xhr.responseText);
        // Update the tenderer's bid list
        handleAddBidToTenderer(data._id);

        setSuccess(true);
        setErrorMsg('');
        setTimeout(() => {
          navigate(`/tender/${id}`);
        }, 2000);
      } else {
        const response = JSON.parse(xhr.responseText);
        setErrorMsg(response.error || localize('submitBidFailed'));
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
      setErrorMsg(localize('submitBidFailed'));
    };

    xhr.send(formData);
  };

  const handleFilesChange = (updatedFiles) => {
    setFiles(updatedFiles); // Update files state when the user selects files
  };

  if (userLoading || tenderLoading || authUserLoading) {
    return <div>{localize('loading')}</div>;
  }

  if (userError || tenderError) {
    return <div>{localize('error')}: {userError || tenderError}</div>;
  }

  // Check if userData.tendererDetails is null, meaning the user has not updated their details
  if (!userData.tendererDetails) {
    return (
      <div className="container mt-5">
        <h1>{localize('submitBid')}</h1>
        <div className="alert alert-warning">
          {localize('updateCompanyInfoToBid')}
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/settings')}
        >
          {localize('updateCompanyInfo')}
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1>{localize('submitBid')} - {tender.title}</h1>

      {success && <div className="alert alert-success">{localize('bidSubmittedSuccess')}</div>}
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <form onSubmit={handleSubmitBid} encType="multipart/form-data">
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">
            {localize('bidAmount')}
            <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            className="form-control"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            disabled={isUploading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="content" className="form-label">
            {localize('additionalInformation')}
          </label>
          <textarea
            className="form-control"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isUploading}
          ></textarea>
        </div>

        <FileUpload
          onFilesChange={handleFilesChange}
          files={files}
          setError={setErrorMsg}
          isUploading={isUploading}
        />

        {/* Display the upload progress bar */}
        {isUploading && (
          <div className="progress mt-2">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${uploadProgress}%` }}
              aria-valuenow={uploadProgress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {Math.round(uploadProgress)}%
            </div>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isUploading}
        >
          {isUploading ? localize('uploading') : localize('submitBid')}
        </button>
      </form>
    </div>
  );
};

export default SubmitBid;
