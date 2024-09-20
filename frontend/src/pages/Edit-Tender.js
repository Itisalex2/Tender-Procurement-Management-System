import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../hooks/use-auth-context';
import { useFetchAllUsers } from '../hooks/use-fetch-all-users';
import { useFetchTender } from '../hooks/use-fetch-tender';
import { permissionRoles } from '../utils/permissions';
import FileUpload from '../components/File-Upload';
import useLocalize from '../hooks/use-localize';
import DownloadLink from '../components/Download-Link';

const EditTender = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const { localize } = useLocalize();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    issueDate: '',
    closingDate: '',
    contactInfo: {
      name: '',
      email: '',
      phone: ''
    },
    otherRequirements: '',
    relatedFiles: [],
    targetedUsers: [],
    procurementGroup: []
  });

  const [newFiles, setNewFiles] = useState([]);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Use the permissions list to get the roles for targeted users
  const roles = permissionRoles.includeInTenderTargetedUsers.join(',');
  const { users, usersLoading, usersError } = useFetchAllUsers(roles);

  // Fetch all users for procurement group selection
  const { users: procurementUsers, usersLoading: procurementLoading, usersError: procurementError } = useFetchAllUsers(
    permissionRoles.confirmAllowViewBids.join(',')
  );

  // Fetch the tender data by ID
  const { tender, loading, error } = useFetchTender(id);

  // Control submitting changes
  const [submitting, setSubmitting] = useState(false);

  const formatToLocalDatetime = (dateString) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset(); // Get the timezone offset in minutes
    date.setMinutes(date.getMinutes() - offset); // Adjust to local timezone
    return date.toISOString().slice(0, 16); // Return in YYYY-MM-DDTHH:MM format
  };

  useEffect(() => {
    if (tender) {

      setFormData({
        title: tender.title,
        description: tender.description,
        issueDate: formatToLocalDatetime(tender.issueDate),
        closingDate: formatToLocalDatetime(tender.closingDate),
        contactInfo: tender.contactInfo,
        otherRequirements: tender.otherRequirements,
        relatedFiles: tender.relatedFiles || [],
        targetedUsers: tender.targetedUsers.map((user) => user._id),
        procurementGroup: tender.procurementGroup.map((user) => user._id),
      });
    }
  }, [tender]);

  // Generic handler for form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('contactInfo.')) {
      const contactField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [contactField]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle checkbox selection for targeted users
  const handleUserCheckboxChange = (userId) => {
    setFormData((prev) => ({
      ...prev,
      targetedUsers: prev.targetedUsers.includes(userId)
        ? prev.targetedUsers.filter((id) => id !== userId)
        : [...prev.targetedUsers, userId]
    }));
  };

  // Handle checkbox selection for procurement group users
  const handleProcurementGroupChange = (userId) => {
    setFormData((prev) => ({
      ...prev,
      procurementGroup: prev.procurementGroup.includes(userId)
        ? prev.procurementGroup.filter((id) => id !== userId)
        : [...prev.procurementGroup, userId]
    }));
  };

  // Handle new file selection from FileUpload component
  const handleFilesChange = (updatedFiles) => {
    setNewFiles(updatedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const updatedTender = {
      ...formData,
      contactInfo: formData.contactInfo,
      targetedUsers: formData.targetedUsers,
      procurementGroup: formData.procurementGroup,
    };

    try {
      const formDataToSend = new FormData();
      Object.keys(updatedTender).forEach((key) => {
        if (key === 'contactInfo' || key === 'targetedUsers' || key === 'procurementGroup') {
          formDataToSend.append(key, JSON.stringify(updatedTender[key]));
        } else {
          formDataToSend.append(key, updatedTender[key]);
        }
      });

      // Append new files to FormData
      newFiles.forEach((file) => {
        formDataToSend.append('relatedFiles', file);
      });

      const response = await fetch(`/api/tender/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        setFormError(data.error);
        setSubmitting(false);
        return;
      }

      // Update formData with the updated tender data from the response
      setFormData((prevFormData) => ({
        ...prevFormData,
        ...data,
        relatedFiles: data.relatedFiles,
        issueDate: formatToLocalDatetime(data.issueDate),
        closingDate: formatToLocalDatetime(data.closingDate),
      }));

      // Clear the newFiles state as they've been submitted
      setNewFiles([]);

      setSuccessMessage(localize('tenderUpdatedSuccess'));
      alert(localize('tenderUpdatedSuccess'));
    } catch (err) {
      setFormError(err.message);
      console.error(err);
    }
    setSubmitting(false);
  };


  if (loading || usersLoading || procurementLoading) {
    return <div>{localize('loading')}</div>;
  }

  if (error || usersError || procurementError) {
    return <div>{localize('fetchError', error || usersError || procurementError)}</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">{localize('editTender')}</h1>

      {/* Display error message if there's an error */}
      {formError && <div className="alert alert-danger">{formError}</div>}

      {/* Display success message if form was submitted successfully */}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            localize('title') <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            disabled={submitting}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">{localize('description')}</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
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
            name="issueDate"
            value={formData.issueDate.slice(0, 16)}
            onChange={handleInputChange}
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
            name="closingDate"
            value={formData.closingDate.slice(0, 16)}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="contactInfo.name" className="form-label">
            {localize('contactName')} <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="contactInfo.name"
            name="contactInfo.name"
            value={formData.contactInfo.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="contactInfo.email" className="form-label">{localize('contactEmail')}</label>
          <input
            type="email"
            className="form-control"
            id="contactInfo.email"
            name="contactInfo.email"
            value={formData.contactInfo.email}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="contactInfo.phone" className="form-label">
            {localize('contactPhone')} <span className="text-danger">*</span>
          </label>
          <input
            type="tel"
            className="form-control"
            id="contactInfo.phone"
            name="contactInfo.phone"
            value={formData.contactInfo.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="otherRequirements" className="form-label">{localize('otherRequirements')}</label>
          <textarea
            className="form-control"
            id="otherRequirements"
            name="otherRequirements"
            value={formData.otherRequirements}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">{localize('existingFiles')}</label>
          <ul>
            {formData.relatedFiles.map((file, index) => (
              <li key={index}>
                <DownloadLink
                  file={file}
                />
                {file.dateUploaded && (
                  <span> - {localize('uploadedOn')}: {new Date(file.dateUploaded).toLocaleString()}</span>
                )}
                {file.uploadedBy && (
                  <span> - {localize('uploadedBy')}: {file.uploadedBy.username}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Use the FileUpload component for new file uploads */}
        <FileUpload onFilesChange={handleFilesChange} files={newFiles} />

        <div className="mb-3">
          <label htmlFor="targetedUsers" className="form-label">{localize('selectTargetedUsers')}</label>
          {users.map((user) => (
            <div key={user._id}>
              <input
                type="checkbox"
                value={user._id}
                checked={formData.targetedUsers.includes(user._id)}
                onChange={() => handleUserCheckboxChange(user._id)}
              />
              <label>{user.username}</label>
            </div>
          ))}
        </div>

        <div className="mb-3">
          <label htmlFor="procurementGroup" className="form-label">
            {localize('selectProcurementGroup')} <span className="text-danger">*</span>
          </label>
          {procurementUsers.map((user) => (
            <div key={user._id}>
              <input
                type="checkbox"
                value={user._id}
                checked={formData.procurementGroup.includes(user._id)}
                onChange={() => handleProcurementGroupChange(user._id)}
              />
              <label>{user.username}</label>
            </div>
          ))}
        </div>

        <button type="submit" className="btn btn-primary">{submitting ? localize('tenderUpdating') : localize('updateTender')}</button>
      </form>
    </div>
  );
};

export default EditTender;
