import { useState, useEffect } from 'react';
import useLocalize from '../hooks/use-localize';
import DownloadLink from '../components/Download-Link';

const TendererDetailsForm = ({ user, tendererDetails, onSave }) => {
  const [businessLicense, setBusinessLicense] = useState(null);
  const [businessLicenseUrl, setBusinessLicenseUrl] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [legalRepresentative, setLegalRepresentative] = useState('');
  const [dateOfEstablishment, setDateOfEstablishment] = useState('');
  const [country, setCountry] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');
  const [legalRepresentativeBusinessCard, setLegalRepresentativeBusinessCard] = useState(null);
  const [legalRepresentativeBusinessCardUrl, setLegalRepresentativeBusinessCardUrl] = useState('');
  const [unifiedSocialCreditCode, setUnifiedSocialCreditCode] = useState('');
  // Validate file type and size
  const fileTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  const maxSize = 5 * 1024 * 1024; // 5MB limit

  const [errorMessage, setErrorMessage] = useState('');
  const { localize } = useLocalize();

  useEffect(() => {
    if (tendererDetails) {
      setBusinessType(tendererDetails.businessType || '');
      setLegalRepresentative(tendererDetails.legalRepresentative || '');
      setDateOfEstablishment(
        tendererDetails.dateOfEstablishment
          ? tendererDetails.dateOfEstablishment.split('T')[0]
          : ''
      );
      setCountry(tendererDetails.country || '');
      setOfficeAddress(tendererDetails.officeAddress || '');
      setUnifiedSocialCreditCode(tendererDetails.unifiedSocialCreditCode || '');

      // Set URLs for existing files
      setBusinessLicenseUrl(
        tendererDetails.businessLicense
          ? `${tendererDetails.businessLicense}`
          : ''
      );
      setLegalRepresentativeBusinessCardUrl(
        tendererDetails.legalRepresentativeBusinessCard
          ? `${tendererDetails.legalRepresentativeBusinessCard}`
          : ''
      );
    }
  }, [tendererDetails]);

  const handleImageChange = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      if (!fileTypes.includes(file.type)) {
        setErrorMessage(localize('allowedFileTypes'));
        return;
      }

      if (file.size > maxSize) {
        setErrorMessage(localize('fileSizeLimit'));
        return;
      }

      setImage(file);
      setErrorMessage(''); // Clear error if file is valid
    }
  };

  const handleSave = async () => {
    // Check if there is an error message (e.g., from file validation)
    if (errorMessage) {
      return; // Prevent form submission if there is an error
    }

    const formData = new FormData();

    formData.append('businessLicense', businessLicense);
    formData.append('legalRepresentativeBusinessCard', legalRepresentativeBusinessCard);

    // Append other form fields
    formData.append('businessType', businessType);
    formData.append('legalRepresentative', legalRepresentative);
    formData.append('dateOfEstablishment', dateOfEstablishment);
    formData.append('country', country);
    formData.append('officeAddress', officeAddress);
    formData.append('unifiedSocialCreditCode', unifiedSocialCreditCode);

    try {
      const response = await fetch(`/api/user/tenderer-details`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData, // Send the form data (including files)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || localize('failedToUpdateDetails'));
      }

      onSave(); // Optional callback to trigger after successful save
      setErrorMessage(''); // Clear error message on success
    } catch (error) {
      setErrorMessage(error.message);
      console.error('Error saving tenderer details:', error.message);
    }
  };

  return (
    <div>
      {/* Display error message */}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {/* Business License */}
      <div className="mb-3">
        <label htmlFor="businessLicense" className="form-label">
          {localize('businessLicenseLabel')} <span className="text-danger">*</span>
        </label>
        <input
          type="file"
          className="form-control"
          id="businessLicense"
          onChange={(e) => handleImageChange(e, setBusinessLicense)}
          required
        />
        {/* Show existing file with a download link if present */}
        {businessLicenseUrl && (
          <p className="mt-2">
            {localize('currentFile')}:{' '}
            <DownloadLink
              file={{ fileUrl: businessLicenseUrl, fileName: localize('downloadBusinessLicense') }}
            />
          </p>
        )}
      </div>

      {/* Business Type */}
      <div className="mb-3">
        <label htmlFor="businessType" className="form-label">
          {localize('businessType')} <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="businessType"
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          required
        />
      </div>

      {/* Legal Representative */}
      <div className="mb-3">
        <label htmlFor="legalRepresentative" className="form-label">
          {localize('legalRepresentative')} <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="legalRepresentative"
          value={legalRepresentative}
          onChange={(e) => setLegalRepresentative(e.target.value)}
          required
        />
      </div>

      {/* Date of Establishment */}
      <div className="mb-3">
        <label htmlFor="dateOfEstablishment" className="form-label">
          {localize('dateOfEstablishment')} <span className="text-danger">*</span>
        </label>
        <input
          type="date"
          className="form-control"
          id="dateOfEstablishment"
          value={dateOfEstablishment}
          onChange={(e) => setDateOfEstablishment(e.target.value)}
          required
        />
      </div>

      {/* Country */}
      <div className="mb-3">
        <label htmlFor="country" className="form-label">
          {localize('country')} <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
      </div>

      {/* Office Address */}
      <div className="mb-3">
        <label htmlFor="officeAddress" className="form-label">
          {localize('officeAddress')} <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="officeAddress"
          value={officeAddress}
          onChange={(e) => setOfficeAddress(e.target.value)}
          required
        />
      </div>

      {/* Legal Representative Business Card */}
      <div className="mb-3">
        <label htmlFor="legalRepresentativeBusinessCard" className="form-label">
          {localize('legalRepBusinessCardLabel')} <span className="text-danger">*</span>
        </label>
        <input
          type="file"
          className="form-control"
          id="legalRepresentativeBusinessCard"
          onChange={(e) => handleImageChange(e, setLegalRepresentativeBusinessCard)}
          required
        />
        {/* Show existing file with a download link if present */}
        {legalRepresentativeBusinessCardUrl && (
          <p className="mt-2">
            {localize('currentFile')}:{' '}
            <DownloadLink
              file={{ fileUrl: legalRepresentativeBusinessCardUrl, fileName: localize('downloadLegalRepBusinessCard') }}
            />
          </p>
        )}
      </div>

      {/* Unified Social Credit Code */}
      <div className="mb-3">
        <label htmlFor="unifiedSocialCreditCode" className="form-label">
          {localize('unifiedSocialCreditCode')} <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="unifiedSocialCreditCode"
          value={unifiedSocialCreditCode}
          onChange={(e) => setUnifiedSocialCreditCode(e.target.value)}
          required
        />
      </div>

      <button className="btn btn-primary" onClick={handleSave}>
        {localize('saveCompanyDetails')}
      </button>
    </div>
  );
};

export default TendererDetailsForm;
