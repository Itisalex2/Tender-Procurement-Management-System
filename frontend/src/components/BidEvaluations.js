import { useState } from 'react';

const BidEvaluations = ({ user, evaluations, bidId, tenderId, canAddEvaluations, onEvaluationAdded }) => {
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('score', score);
    formData.append('feedback', feedback);
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const response = await fetch(`/api/bid/${bidId}/evaluation`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('无法提交评估');
      }

      const data = await response.json();
      setSuccess('评估成功提交！');
      setScore('');
      setFeedback('');
      setFiles([]);
      onEvaluationAdded(data.evaluation); // Callback to parent to update the evaluations
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="mt-4">
      <h6>评估:</h6>
      {evaluations && evaluations.length > 0 ? (
        <div className="row">
          {evaluations.map((evaluation, index) => (
            <div key={index} className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <p>
                    <strong>评估者:</strong> {evaluation.evaluator.username}
                  </p>
                  <p>
                    <strong>评分:</strong> {evaluation.score}
                  </p>
                  <p>
                    <strong>反馈:</strong> {evaluation.feedback || '无'}
                  </p>
                  {evaluation.relatedFiles && evaluation.relatedFiles.length > 0 && (
                    <>
                      <h6>相关文件:</h6>
                      <ul className="list-group">
                        {evaluation.relatedFiles.map((file, fileIndex) => (
                          <li key={fileIndex} className="list-group-item">
                            <a
                              href={`${process.env.REACT_APP_BACKEND_URL}${file.fileUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {file.fileName}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>无评估</p>
      )}

      {canAddEvaluations && (
        <div className="mt-4">
          <h5>添加评估</h5>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="score" className="form-label">评分</label>
              <input
                type="number"
                className="form-control"
                id="score"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                required
                min="1"
                max="100"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="feedback" className="form-label">反馈</label>
              <textarea
                className="form-control"
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="files" className="form-label">相关文件</label>
              <input
                type="file"
                className="form-control"
                id="files"
                multiple
                onChange={handleFileChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">提交评估</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default BidEvaluations;
