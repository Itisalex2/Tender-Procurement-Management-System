import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/use-auth-context';
import { useFetchAllUsers } from '../hooks/use-fetch-all-users';
import { useFetchTender } from '../hooks/use-fetch-tender';
import { permissionRoles } from '../utils/permissions';
import FileUpload from '../components/File-Upload'; // Import the FileUpload component

const EditTender = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();

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

  // Use the permissions list to get the roles for targeted users
  const roles = permissionRoles.includeInTenderTargetedUsers.join(',');
  const { users, usersLoading, usersError } = useFetchAllUsers(roles);

  // Fetch all users for procurement group selection
  const { users: procurementUsers, usersLoading: procurementLoading, usersError: procurementError } = useFetchAllUsers(
    permissionRoles.confirmAllowViewBids.join(',')
  );

  // Fetch the tender data by ID
  const { tender, loading, error } = useFetchTender(id);

  useEffect(() => {
    if (tender) {
      const formatToLocalDatetime = (dateString) => {
        const date = new Date(dateString);
        const offset = date.getTimezoneOffset(); // Get the timezone offset in minutes
        date.setMinutes(date.getMinutes() - offset); // Adjust to local timezone
        return date.toISOString().slice(0, 16); // Return in YYYY-MM-DDTHH:MM format
      };

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

    const updatedTender = {
      ...formData,
      contactInfo: formData.contactInfo,
      targetedUsers: formData.targetedUsers,
      procurementGroup: formData.procurementGroup
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

      if (!response.ok) {
        throw new Error('Failed to update tender');
      }

      navigate('/manage-tenders');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || usersLoading || procurementLoading) {
    return <div>下载中...</div>;
  }

  if (error || usersError || procurementError) {
    return <div>Error: {error || usersError || procurementError}</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">编辑招标</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">标题
            <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">描述</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="issueDate" className="form-label">发布日期
            <span className="text-danger">*</span>
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
          <label htmlFor="closingDate" className="form-label">截止日期
            <span className="text-danger">*</span>
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
          <label htmlFor="contactInfo.name" className="form-label">联系人姓名
            <span className="text-danger">*</span>
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
          <label htmlFor="contactInfo.email" className="form-label">联系人邮箱</label>
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
          <label htmlFor="contactInfo.phone" className="form-label">联系人电话
            <span className="text-danger">*</span>
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
          <label htmlFor="otherRequirements" className="form-label">其他要求</label>
          <textarea
            className="form-control"
            id="otherRequirements"
            name="otherRequirements"
            value={formData.otherRequirements}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">现有文件</label>
          <ul>
            {formData.relatedFiles.map((file, index) => (
              <li key={index}>
                <a
                  href={`${process.env.REACT_APP_BACKEND_URL}${file.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {file.fileName}
                </a>
                {file.dateUploaded && (
                  <span> - 上传时间: {new Date(file.dateUploaded).toLocaleString()}</span>
                )}
                {file.uploadedBy && (
                  <span> - 上传者: {file.uploadedBy.username}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Use the FileUpload component for new file uploads */}
        <FileUpload onFilesChange={handleFilesChange} />

        <div className="mb-3">
          <label htmlFor="targetedUsers" className="form-label">选择目标用户</label>
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
          <label htmlFor="procurementGroup" className="form-label">选择招标小组成员
            <span className="text-danger">*</span>
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

        <button type="submit" className="btn btn-primary">更新招标</button>
      </form>
    </div>
  );
};

export default EditTender;
