import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/use-auth-context';
import useFetchUser from '../hooks/use-fetch-user';
import { useFetchTender } from '../hooks/use-fetch-tender';
import permissionRoles from '../utils/permissions';
import useUpdateUser from '../hooks/use-update-user';

const SubmitBid = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { userData, loading: userLoading, error: userError } = useFetchUser();
  const { tender, loading: tenderLoading, error: tenderError } = useFetchTender(id);
  const { updateUserById } = useUpdateUser();

  const [amount, setAmount] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const hasPermissionToSubmitBid = () => {
    return userData && permissionRoles.submitBid.includes(userData.role);
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleAddBidToTenderer = (bidId) => {
    updateUserById(userData._id, { newBidId: bidId });
  }

  const handleSubmitBid = async (e) => {
    e.preventDefault();

    if (!hasPermissionToSubmitBid()) {
      setErrorMsg('您没有权限提交投标。');
      return;
    }

    // Create form data to include files
    const formData = new FormData();
    formData.append('amount', amount);
    formData.append('content', content);
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

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
        throw new Error(data.error || '提交投标失败');
      }

      const data = await response.json();
      // Update the tenderers bid list
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

  if (userLoading || tenderLoading) {
    return <div>加载中...</div>;
  }

  if (userError || tenderError) {
    return <div>错误: {userError || tenderError}</div>;
  }

  return (
    <div className="container mt-5">
      <h1>提交投标 - {tender.title}</h1>

      {success && <div className="alert alert-success">投标提交成功！</div>}
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <form onSubmit={handleSubmitBid} encType="multipart/form-data">
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">投标金额</label>
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
          <label htmlFor="content" className="form-label">附加信息（可选）</label>
          <textarea
            className="form-control"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="files" className="form-label">上传文件</label>
          <input
            type="file"
            className="form-control"
            id="files"
            multiple
            onChange={handleFileChange} // Handle file selection
          />
        </div>

        <button type="submit" className="btn btn-primary">提交投标</button>
      </form>
    </div>
  );
};

export default SubmitBid;
