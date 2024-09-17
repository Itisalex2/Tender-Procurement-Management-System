import React from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchTenders from '../hooks/use-fetch-tenders';
import useLocalize from '../hooks/use-localize';
import DownloadLink from '../components/Download-Link';

const Home = () => {
  const { tenders, loading, error } = useFetchTenders('Open');
  const navigate = useNavigate();
  const { localize } = useLocalize();

  const handleRowClick = (tenderId) => {
    navigate(`/tender/${tenderId}`);
  };

  if (loading) {
    return <div>{localize('loading')}</div>;
  }

  if (error) {
    return <div>{localize('fetchError', error)}</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">{localize('tenderList')}</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>{localize('title')}</th>
            <th>{localize('description')}</th>
            <th>{localize('issueDate')}</th>
            <th>{localize('closingDate')}</th>
            <th>{localize('status')}</th>
            <th>{localize('relatedFiles')}</th>
          </tr>
        </thead>
        <tbody>
          {tenders.map((tender) => (
            <tr key={tender._id} onClick={() => handleRowClick(tender._id)} style={{ cursor: 'pointer' }}>
              <td>{tender.title}</td>
              <td>{tender.description}</td>
              <td>{new Date(tender.issueDate).toLocaleString()}</td>
              <td>{new Date(tender.closingDate).toLocaleString()}</td>
              <td>{localize(tender.status)}</td>
              <td>
                {tender.relatedFiles && tender.relatedFiles.length > 0 ? (
                  <ul>
                    {tender.relatedFiles.map((file, index) => (
                      <li key={index}>
                        <DownloadLink
                          file={file}
                        />
                        {file.dateUploaded && (
                          <span> - {localize('uploadedOn')}: {new Date(file.dateUploaded).toLocaleString()}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  localize('noFiles')
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
