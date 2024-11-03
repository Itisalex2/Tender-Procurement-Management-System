import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/use-auth-context';
import { useFetchAllUsers } from '../hooks/use-fetch-all-users';
import { permissionRoles } from '../utils/permissions';
import FileUpload from '../components/File-Upload';
import useLocalize from '../hooks/use-localize';
import validatePhoneNumber from '../utils/validate-phone-number';

const CreateTender = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useAuthContext();
  const { localize } = useLocalize();

  const targetedUserRoles = permissionRoles.includeInTenderTargetedUsers.join(',');
  const procurementGroupRoles = permissionRoles.confirmAllowViewBids.join(',');

  const { users: targetedUsersList, usersLoading, usersError } = useFetchAllUsers(targetedUserRoles);
  const { users: procurementGroupList, usersLoading: procurementGroupLoading, usersError: procurementGroupError } = useFetchAllUsers(procurementGroupRoles);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [closingDate, setClosingDate] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [otherRequirements, setOtherRequirements] = useState('');
  const [relatedFiles, setRelatedFiles] = useState([]);
  const [targetedUsers, setTargetedUsers] = useState([]);
  const [procurementGroup, setProcurementGroup] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFilesChange = (files) => {
    setRelatedFiles(files);
  };

  // Show confirmation modal
  const handleConfirm = () => {
    if (error) {
      return;
    }
    setShowConfirm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsUploading(true);
    setUploadProgress(0);

    const tenderData = {
      title,
      description,
      issueDate,
      closingDate,
      contactInfo: {
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
      },
      otherRequirements,
      targetedUsers,
      procurementGroup,
    };

    const formData = new FormData();
    Object.keys(tenderData).forEach((key) => {
      if (
        key === 'contactInfo' ||
        key === 'targetedUsers' ||
        key === 'procurementGroup'
      ) {
        formData.append(key, JSON.stringify(tenderData[key]));
      } else {
        formData.append(key, tenderData[key]);
      }
    });

    relatedFiles.forEach((file) => {
      formData.append('relatedFiles', file);
    });

    const xhr = new XMLHttpRequest();

    xhr.open('POST', '/api/tender/create', true);
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
        setSuccess(true);
        setShowConfirm(false);
        navigate('/');
      } else {
        const response = JSON.parse(xhr.responseText);
        setError(response.error || localize('createTenderError'));
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
      setError(localize('createTenderError'));
    };

    xhr.send(formData);
  };

  // Handle checkbox selection for targeted users
  const handleUserCheckboxChange = (userId, setArrayState) => {
    setArrayState((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId) // Deselect if already selected
        : [...prev, userId] // Add to selected if not already
    );
  };

  if (usersLoading || procurementGroupLoading || userLoading) return <div>{localize('loading')}</div>;
  if (usersError || procurementGroupError) return <div>{localize('fetchUsersError', usersError || procurementGroupError)}</div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">{localize('createTender')}</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && (
        <div className="alert alert-success">{localize('tenderCreated')}</div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{localize('confirmCreateTender')}</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowConfirm(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>{localize('confirmCreateTenderBody')}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowConfirm(false)}
                  disabled={isUploading}
                >
                  {localize('cancel')}
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={isUploading}
                >
                  {isUploading ? localize('uploading') : localize('confirm')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} encType="multipart/form-data">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            {localize('title')} <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">{localize('description')}</label>
          <textarea
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="issueDate" className="form-label">
            {localize('issueDate')} <span className="text-danger">*</span>
          </label>
          <input
            type="datetime-local"
            className="form-control"
            id="issueDate"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="closingDate" className="form-label">
            {localize('closingDate')} <span className="text-danger">*</span>
          </label>
          <input
            type="datetime-local"
            className="form-control"
            id="closingDate"
            value={closingDate}
            onChange={(e) => setClosingDate(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="contactName" className="form-label">
            {localize('contactName')} <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="contactName"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="contactEmail" className="form-label">{localize('contactEmail')}</label>
          <input
            type="email"
            className="form-control"
            id="contactEmail"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="contactPhone" className="form-label">
            {localize('contactPhone')} <span className="text-danger">*</span>
          </label>
          <input
            type="tel"
            className="form-control"
            id="contactPhone"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            onBlur={() => validatePhoneNumber(contactPhone, setError, localize)}
            required
          />
        </div>


        <div className="mb-3">
          <label htmlFor="otherRequirements" className="form-label">{localize('otherRequirements')}</label>
          <textarea
            className="form-control"
            id="otherRequirements"
            value={otherRequirements}
            onChange={(e) => setOtherRequirements(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="targetedUsers" className="form-label">{localize('selectTargetedUsers')}</label>
          {targetedUsersList.map((user) => (
            <div key={user._id}>
              <input
                type="checkbox"
                value={user._id}
                checked={targetedUsers.includes(user._id)}
                onChange={() => handleUserCheckboxChange(user._id, setTargetedUsers)}
              />
              <label>{user.username}</label>
            </div>
          ))}
        </div>

        <div className="mb-3">
          <label htmlFor="procurementGroup" className="form-label">
            {localize('selectProcurementGroup')} <span className="text-danger">*</span>
          </label>
          {procurementGroupList.map((user) => (
            <div key={user._id}>
              <input
                type="checkbox"
                value={user._id}
                checked={procurementGroup.includes(user._id)}
                onChange={() => handleUserCheckboxChange(user._id, setProcurementGroup)}
              />
              <label>{user.username}</label>
            </div>
          ))}
        </div>

        <FileUpload onFilesChange={handleFilesChange} files={relatedFiles} setError={setError} />

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

        {/* Submit button */}
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleConfirm}
          disabled={isUploading}
        >
          {isUploading ? localize('uploading') : localize('createTender')}
        </button>
      </form>
    </div>
  );
};

export default CreateTender;
