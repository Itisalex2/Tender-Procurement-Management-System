import React from 'react';
import { useAuthContext } from '../hooks/use-auth-context';

const DownloadLink = ({ file }) => {
  const { user } = useAuthContext();

  const handleDownload = async (file) => {
    try {
      // Log the download event on the backend
      const response = await fetch(`/api/user/download-file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          fileName: file.fileName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to log the download');
      }

      // After logging, open the file in a new tab

      window.open(`${window.location.origin}${file.fileUrl}`, '_blank');
    } catch (error) {
      console.error('Error logging the download:', error);
    }
  };

  return (
    <button
      onClick={() => handleDownload(file)} // Trigger the handleDownload function
      style={{ background: 'none', color: 'blue', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline' }} // Style it like a link
      rel="noopener noreferrer" // Ensure security attributes
    >
      {file.fileName}
    </button>
  );
};

export default DownloadLink;
