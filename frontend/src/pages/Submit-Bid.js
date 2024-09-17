import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/use-auth-context';
import useFetchUser from '../hooks/use-fetch-user';
import { useFetchTender } from '../hooks/use-fetch-tender';
import { permissionRoles } from '../utils/permissions';
import useUpdateUser from '../hooks/use-update-user';
import FileUpload from '../components/File-Upload'; // Import the FileUpload component
import useLocalize from '../hooks/use-localize'; // Import localization hook

const SubmitBid = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { userData, loading: userLoading, error: userError } = useFetchUser();
  const { tender, loading: tenderLoading, error: tenderError } = useFetchTender(id);
  const { updateUserById } = useUpdateUser();
  const { localize } = useLocalize(); // Use localization

  const [amount, setAmount] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]); // Files state
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const hasPermissionToSubmitBid = () => {
    return userData && permissionRoles.submitBid.includes(userData.role);
  };

  const handleAddBidToTenderer = (bidId) => {
    updateUserById(userData._id, { newBidId: bidId });
  };

  const handleSubmitBid = async (e) => {
    e.preventDefault();

    if (errorMsg) {
      return;
    }

    if (!hasPermissionToSubmitBid()) {
      setErrorMsg(localize('noPermissionToSubmitBid'));
      return;
    }

    // Create form data to include files
    const formData = new FormData();
    formData.append('amount', amount);
    formData.append('content', content);
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch(`/api/tender/${id}/bid`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData, // Send formData including files
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || localize('submitBidFailed'));
      }

      const data = await response.json();
      // Update the tenderer's bid list
      handleAddBidToTenderer(data._id);

      setSuccess(true);
      setErrorMsg('');
      setTimeout(() => {
        navigate(`/tender/${id}`);
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleFilesChange = (updatedFiles) => {
    setFiles(updatedFiles); // Update files state when the user selects files
  };

  if (userLoading || tenderLoading) {
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
          />
        </div>

        <div className="mb-3">
          <label htmlFor="content" className="form-label">{localize('additionalInformation')}</label>
          <textarea
            className="form-control"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>

        <FileUpload onFilesChange={handleFilesChange} setError={setErrorMsg} />

        <button type="submit" className="btn btn-primary">{localize('submitBid')}</button>
      </form>
    </div>
  );
};

export default SubmitBid;
