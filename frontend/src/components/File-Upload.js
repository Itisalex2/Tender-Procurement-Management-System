import { useState } from 'react';

const FileUpload = ({ onFilesChange, required = false }) => {
  const [relatedFiles, setRelatedFiles] = useState([]);
  const [fileInputs, setFileInputs] = useState([0]);

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedFiles = [...relatedFiles];
      updatedFiles[index] = file;
      setRelatedFiles(updatedFiles);

      // Trigger the callback to inform the parent component
      onFilesChange(updatedFiles);

      // Add a new file input if this was the last one
      if (index === fileInputs.length - 1) {
        setFileInputs([...fileInputs, fileInputs.length]);
      }
    }
  };

  return (
    <div className="mb-3">
      <label className="form-label">相关文件{required &&
        (<span className="text-danger">*</span>)}
      </label>
      {fileInputs.map((inputIndex) => (
        <div key={inputIndex} className="mb-2">
          <input
            type="file"
            className="form-control"
            onChange={(e) => handleFileChange(e, inputIndex)}
            required={required}
          />
          {relatedFiles[inputIndex] && <p>选择了: {relatedFiles[inputIndex].name}</p>}
        </div>
      ))}
    </div>
  );
};

export default FileUpload;
