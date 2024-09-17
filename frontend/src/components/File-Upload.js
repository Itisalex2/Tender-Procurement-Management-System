import { useState } from 'react';
import useLocalize from '../hooks/use-localize';

const FileUpload = ({ onFilesChange, setError }) => {
  const [relatedFiles, setRelatedFiles] = useState([]);
  const [fileInputs, setFileInputs] = useState([0]);
  const [errorMessage, setErrorMessage] = useState('');
  const { localize } = useLocalize();

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      // Define allowed file types and maximum size (1GB)
      const allowedFileTypes = [
        'image/jpeg',
        'image/png',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'application/rtf',
        'application/zip',
        'application/x-rar-compressed',
        'image/vnd.dwg',
        'image/vnd.dxf',
      ];
      const maxSize = 1024 * 1024 * 1024; // 1GB

      // Check file type and size
      if (!allowedFileTypes.includes(file.type)) {
        if (setError) {
          setError(localize('cannotSubmitBid'))
        }
        setErrorMessage(localize('invalidFileType'));
        return;
      }

      if (file.size > maxSize) {
        if (setError) {
          setError(localize('cannotSubmitBid'))
        }
        setErrorMessage(localize('fileTooLarge'));
        return;
      }

      // Clear error message if file is valid
      setErrorMessage('');
      if (setError) {
        setError('');
      }

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
      <label className="form-label">{localize('relatedFiles')}</label>

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
          {relatedFiles[inputIndex] && (
            <p>
              {localize('selected')}: {relatedFiles[inputIndex].name}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default FileUpload;
