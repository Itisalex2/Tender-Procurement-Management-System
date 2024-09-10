import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetTender } from '../hooks/use-get-tender';

const ViewTender = () => {
  const { id } = useParams();
  const [tenderDetails, setTenderDetails] = useState({
    title: '',
    description: '',
    issueDate: '',
    closingDate: '',
    contactInfo: {
      name: '',
      email: '',
      phone: '',
    },
    otherRequirements: '',
    relatedFiles: [],
    targetedUsers: [],
  });

  const { tender, loading, error } = useGetTender(id);

  // Update tenderDetails when tender data is fetched
  useEffect(() => {
    if (tender) {
      setTenderDetails({
        title: tender.title,
        description: tender.description,
        issueDate: tender.issueDate,
        closingDate: tender.closingDate,
        contactInfo: tender.contactInfo,
        otherRequirements: tender.otherRequirements,
        relatedFiles: tender.relatedFiles || [],
        targetedUsers: tender.targetedUsers.map((user) => user._id),
      });
    }
  }, [tender]);

  if (loading) {
    return <div>下载中...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">查看招标</h1>

      <div className="mb-3">
        <label className="form-label">标题</label>
        <p>{tenderDetails.title}</p>
      </div>

      <div className="mb-3">
        <label className="form-label">描述</label>
        <p>{tenderDetails.description}</p>
      </div>

      <div className="mb-3">
        <label className="form-label">发布日期</label>
        <p>{new Date(tenderDetails.issueDate).toLocaleString()}</p>
      </div>

      <div className="mb-3">
        <label className="form-label">截止日期</label>
        <p>{new Date(tenderDetails.closingDate).toLocaleString()}</p>
      </div>

      <div className="mb-3">
        <label className="form-label">联系人姓名</label>
        <p>{tenderDetails.contactInfo.name}</p>
      </div>

      <div className="mb-3">
        <label className="form-label">联系人邮箱</label>
        <p>{tenderDetails.contactInfo.email}</p>
      </div>

      <div className="mb-3">
        <label className="form-label">联系人电话</label>
        <p>{tenderDetails.contactInfo.phone || '无'}</p>
      </div>

      <div className="mb-3">
        <label className="form-label">其他要求</label>
        <p>{tenderDetails.otherRequirements || '无'}</p>
      </div>

      <div className="mb-3">
        <label className="form-label">现有文件</label>
        <ul>
          {tenderDetails.relatedFiles.map((file, index) => (
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

    </div>
  );
};

export default ViewTender;
