import { useState, useEffect, useRef } from 'react';
import useLocalize from '../hooks/use-localize';

const FileUpload = ({ onFilesChange, files, setError }) => {
  const [fileInputs, setFileInputs] = useState([{ id: Date.now(), file: null }]); // Array to store file inputs, each with unique ID and file
  const [errorMessage, setErrorMessage] = useState('');
  const { localize } = useLocalize();

  // Refs to store file input elements
  const fileInputRefs = useRef([]);

  // Reset internal state when files prop is cleared
  useEffect(() => {
    if (files && files.length === 0) {
      setFileInputs([{ id: Date.now(), file: null }]); // Reset to only one input field

      // Clear file input elements manually
      fileInputRefs.current.forEach((fileInput) => {
        if (fileInput) fileInput.value = ''; // Reset input to clear filename
      });
    }
  }, [files]);

  // Handle file change
  const handleFileChange = (e, inputId) => {
    const file = e.target.files[0];
    if (file) {
      const allowedFileTypes = [
        'image/jpeg', 'image/png', 'application/pdf',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain', 'application/rtf', 'application/zip', 'application/x-rar',
        'application/x-rar-compressed', 'application/octet-stream', 'image/vnd.dwg', 'image/vnd.dxf',
      ];
      const maxSize = 1024 * 1024 * 1024; // 1GB

      if (!allowedFileTypes.includes(file.type)) {
        setErrorMessage(localize('invalidFileType'));
        if (setError) setError(localize('cannotSubmitBid'));
        return;
      }

      if (file.size > maxSize) {
        setErrorMessage(localize('fileTooLarge'));
        if (setError) setError(localize('cannotSubmitBid'));
        return;
      }

      setErrorMessage('');
      if (setError) setError('');

      // Update the fileInputs array with the selected file
      const updatedInputs = fileInputs.map((input) =>
        input.id === inputId ? { ...input, file } : input
      );
      setFileInputs(updatedInputs);

      // Update the files array with the selected file
      const updatedFiles = updatedInputs.map((input) => input.file).filter(Boolean);

      // Trigger the callback to inform the parent component
      onFilesChange(updatedFiles);
    }
  };

  // Handle file removal
  const handleFileRemove = (inputId) => {
    // Remove the file input with the specified ID
    const updatedInputs = fileInputs.filter((input) => input.id !== inputId);
    setFileInputs(updatedInputs);

    // Update the files array to remove the corresponding file
    const updatedFiles = updatedInputs.map((input) => input.file).filter(Boolean);
    onFilesChange(updatedFiles);

    // Clear the corresponding file input element
    if (fileInputRefs.current[inputId]) {
      fileInputRefs.current[inputId].value = ''; // Reset the input field's displayed value
    }
  };

  // Handle adding a new file input
  const handleAddFile = () => {
    setFileInputs([...fileInputs, { id: Date.now(), file: null }]); // Add a new file input with a unique ID
  };

  return (
    <div className="mb-3">
      <label className="form-label">{localize('relatedFiles')}</label>

      {/* Display error message */}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {/* File inputs */}
      {fileInputs.map((input, index) => (
        <div
          key={input.id}
          className="mb-2"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <input
            type="file"
            className="form-control"
            onChange={(e) => handleFileChange(e, input.id)}
            ref={(el) => (fileInputRefs.current[input.id] = el)} // Store a reference to each file input element
            style={{ flex: '1' }} // Make the input take up as much space as possible
          />
          <button
            type="button"
            onClick={() => handleFileRemove(input.id)}
            style={{
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '10px',
              fontSize: '16px'
            }}
          >
            &times;
          </button>
        </div>
      ))}

      {/* Add file button */}
      <button
        type="button"
        onClick={handleAddFile}
        className="btn btn-secondary mt-2"
      >
        {localize('addFile')}
      </button>
    </div>
  );
};

export default FileUpload;