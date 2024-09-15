import { useState, useEffect } from 'react';

const TendererDetailsForm = ({ user, tendererDetails, onSave }) => {
  const [businessLicense, setBusinessLicense] = useState(null);
  const [businessLicenseUrl, setBusinessLicenseUrl] = useState(''); // URL for existing file
  const [businessType, setBusinessType] = useState('');
  const [legalRepresentative, setLegalRepresentative] = useState('');
  const [dateOfEstablishment, setDateOfEstablishment] = useState('');
  const [country, setCountry] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');
  const [legalRepresentativeBusinessCard, setLegalRepresentativeBusinessCard] = useState(null);
  const [legalRepresentativeBusinessCardUrl, setLegalRepresentativeBusinessCardUrl] = useState(''); // URL for existing file
  const [unifiedSocialCreditCode, setUnifiedSocialCreditCode] = useState('');

  useEffect(() => {
    if (tendererDetails) {
      setBusinessType(tendererDetails.businessType || '');
      setLegalRepresentative(tendererDetails.legalRepresentative || '');
      setDateOfEstablishment(tendererDetails.dateOfEstablishment ? tendererDetails.dateOfEstablishment.split('T')[0] : '');
      setCountry(tendererDetails.country || '');
      setOfficeAddress(tendererDetails.officeAddress || '');
      setUnifiedSocialCreditCode(tendererDetails.unifiedSocialCreditCode || '');

      // Set URLs for existing files
      setBusinessLicenseUrl(tendererDetails.businessLicense ? `${process.env.REACT_APP_BACKEND_URL}/uploads/${tendererDetails.businessLicense}` : '');
      setLegalRepresentativeBusinessCardUrl(tendererDetails.legalRepresentativeBusinessCard ? `${process.env.REACT_APP_BACKEND_URL}/uploads/${tendererDetails.legalRepresentativeBusinessCard}` : '');
    }
  }, [tendererDetails]);

  const handleImageChange = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();

    // Append files with the same field name 'relatedFiles'
    if (businessLicense) formData.append('relatedFiles', businessLicense);
    if (legalRepresentativeBusinessCard) formData.append('relatedFiles', legalRepresentativeBusinessCard);

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
        body: formData,  // Send the form data (including files)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update tenderer details');
      }

      onSave(); // Optional callback to trigger after successful save
    } catch (error) {
      console.error('Error saving tenderer details:', error.message);
    }
  };

  return (
    <div>
      {/* Business License */}
      <div className="mb-3">
        <label htmlFor="businessLicense" className="form-label">
          营业执照 <span className="text-danger">*</span>
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
            当前文件: <a href={businessLicenseUrl} target="_blank" rel="noopener noreferrer">下载营业执照</a>
          </p>
        )}
      </div>

      {/* Business Type */}
      <div className="mb-3">
        <label htmlFor="businessType" className="form-label">
          企业类型 <span className="text-danger">*</span>
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
          法定代表人 <span className="text-danger">*</span>
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
          成立日期 <span className="text-danger">*</span>
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
          国家 <span className="text-danger">*</span>
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
          办公地址 <span className="text-danger">*</span>
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
          法人名片 <span className="text-danger">*</span>
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
            当前文件: <a href={legalRepresentativeBusinessCardUrl} target="_blank" rel="noopener noreferrer">下载法人名片</a>
          </p>
        )}
      </div>

      {/* Unified Social Credit Code */}
      <div className="mb-3">
        <label htmlFor="unifiedSocialCreditCode" className="form-label">
          统一社会信用代码 <span className="text-danger">*</span>
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

      <button className="btn btn-primary" onClick={handleSave}>保存企业详情</button>
    </div>
  );
};

export default TendererDetailsForm;
