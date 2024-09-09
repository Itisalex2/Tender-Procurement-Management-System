import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/use-auth-context';
import { useFetchAllUsers } from '../hooks/use-fetch-all-users';
import permissionRoles from '../utils/permissions';

const EditTender = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [closingDate, setClosingDate] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [otherRequirements, setOtherRequirements] = useState('');
  const [relatedFiles, setRelatedFiles] = useState([]); // Existing files
  const [newFiles, setNewFiles] = useState([]); // New files to add
  const [targetedUsers, setTargetedUsers] = useState([]);
  // Use the permissions list to get the roles
  const roles = permissionRoles.includeInTenderTargetedUsers.join(','); // Get the roles for targeted users
  const { users, usersLoading, usersError } = useFetchAllUsers(roles);

  // Fetch the tender data by ID when the component mounts
  useEffect(() => {
    const fetchTender = async () => {
      try {
        const response = await fetch(`/api/tender/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch tender');
        }

        // Set the fetched tender and populate form fields
        setTitle(data.title);
        setDescription(data.description);
        setIssueDate(data.issueDate);
        setClosingDate(data.closingDate);
        setContactName(data.contactInfo.name);
        setContactEmail(data.contactInfo.email);
        setContactPhone(data.contactInfo.phone);
        setOtherRequirements(data.otherRequirements);
        setRelatedFiles(data.relatedFiles); // Existing files
        setTargetedUsers(data.targetedUsers.map(user => user._id)); // Populate targetedUsers
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTender();
  }, [id, user.token]);

  // Handle file selection for new files
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewFiles(files);
  };

  const handleUserCheckboxChange = (userId) => {
    setTargetedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId) // Deselect if already selected
        : [...prev, userId] // Add to selected if not already
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const updatedTender = {
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
    };

    try {
      const formData = new FormData();
      // Add each field to FormData
      Object.keys(updatedTender).forEach((key) => {
        if (key === 'contactInfo' || key === 'targetedUsers') {
          formData.append(key, JSON.stringify(updatedTender[key]));
        } else {
          formData.append(key, updatedTender[key]);
        }
      });

      // Append new files to FormData (existing files are not overwritten)
      newFiles.forEach((file) => {
        formData.append('relatedFiles', file);
      });

      const response = await fetch(`/api/tender/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update tender');
      }

      navigate('/manage-tenders'); // Redirect to the tender management page after successful update
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading || usersLoading) {
    return <div></div>;
  }

  if (error || usersError) {
    return <div>Error: {error || usersError}</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">编辑招标</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Form fields for tender details */}
        <div className="mb-3">
          <label htmlFor="title" className="form-label">标题</label>
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
          <label htmlFor="description" className="form-label">描述</label>
          <textarea
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="issueDate" className="form-label">发布日期</label>
          <input
            type="datetime-local"
            className="form-control"
            id="issueDate"
            value={issueDate.slice(0, 16)}
            onChange={(e) => setIssueDate(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="closingDate" className="form-label">截止日期</label>
          <input
            type="datetime-local"
            className="form-control"
            id="closingDate"
            value={closingDate.slice(0, 16)}
            onChange={(e) => setClosingDate(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="contactName" className="form-label">联系人姓名</label>
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
          <label htmlFor="contactEmail" className="form-label">联系人邮箱</label>
          <input
            type="email"
            className="form-control"
            id="contactEmail"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="contactPhone" className="form-label">联系人电话</label>
          <input
            type="tel"
            className="form-control"
            id="contactPhone"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="otherRequirements" className="form-label">其他要求</label>
          <textarea
            className="form-control"
            id="otherRequirements"
            value={otherRequirements}
            onChange={(e) => setOtherRequirements(e.target.value)}
          ></textarea>
        </div>

        {/* Section to display existing files */}
        <div className="mb-3">
          <label className="form-label">现有文件</label>
          <ul>
            {relatedFiles.map((file, index) => (
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
              </li>
            ))}
          </ul>
        </div>

        {/* Section to add new files */}
        <div className="mb-3">
          <label htmlFor="relatedFiles" className="form-label">添加新文件</label>
          <input
            type="file"
            className="form-control"
            id="relatedFiles"
            multiple
            onChange={handleFileChange}
          />
        </div>

        {/* Targeted Users */}
        <div className="mb-3">
          <label htmlFor="targetedUsers" className="form-label">选择目标用户</label>
          {users.map((user) => (
            <div key={user._id}>
              <input
                type="checkbox"
                value={user._id}
                checked={targetedUsers.includes(user._id)}
                onChange={() => handleUserCheckboxChange(user._id)}
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
