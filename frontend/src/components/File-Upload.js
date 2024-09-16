import { useState } from 'react';

const FileUpload = ({ onFilesChange }) => {
  const [relatedFiles, setRelatedFiles] = useState([]);
  const [fileInputs, setFileInputs] = useState([0]);
  const [errorMessage, setErrorMessage] = useState(''); // Error message state

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      // Define allowed file types and maximum size (1GB)
      const allowedFileTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'text/plain', 'application/rtf', 'application/zip', 'application/x-rar-compressed', 'image/vnd.dwg', 'image/vnd.dxf'];
      const maxSize = 1024 * 1024 * 1024; // 1GB

      // Check file type and size
      if (!allowedFileTypes.includes(file.type)) {
        setErrorMessage('文件类型不符合. 只接受 JPEG, PNG, PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, RTF, ZIP, RAR, DWG, 和 DXF.');
        return;
      }

      if (file.size > maxSize) {
        setErrorMessage('文件超过 1GB.');
        return;
      }

      // Clear error message if file is valid
      setErrorMessage('');

      // Update the files array
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
      <label className="form-label">相关文件</label>

      {/* Display error message */}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {/* File inputs */}
      {fileInputs.map((inputIndex) => (
        <div key={inputIndex} className="mb-2">
          <input
            type="file"
            className="form-control"
            onChange={(e) => handleFileChange(e, inputIndex)}
          />
          {relatedFiles[inputIndex] && <p>选择了: {relatedFiles[inputIndex].name}</p>}
        </div>
      ))}
    </div>
  );
};

export default FileUpload;
