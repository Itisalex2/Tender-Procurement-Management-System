const Core = require('@alicloud/pop-core');

// Initialize the client with your accessKeyId and secret
const client = new Core({
  accessKeyId: 'LTAI5tSmVEDYhkpkRt2hYcwa',
  accessKeySecret: 'WeaxNkc1RrkJDZ5YMP3B0fFNRrpPeR',
  endpoint: 'https://dysmsapi.aliyuncs.com',
  apiVersion: '2017-05-25'
});

async function sendSMS(phoneNumber, signName, templateCode, templateParam) {
  const params = {
    RegionId: 'cn-hangzhou',
    PhoneNumbers: phoneNumber,
    SignName: signName,
    TemplateCode: templateCode,
    TemplateParam: JSON.stringify(templateParam)
  };

  const requestOption = {
    method: 'POST',
    timeout: 10000  // Increase timeout to 10 seconds
  };

  try {
    const response = await client.request('SendSms', params, requestOption);
    return response;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
}


module.exports = { sendSMS };
