const validatePhoneNumber = (contactPhone, setError, localize) => {
  const phoneRegex = /^[0-9]{10,15}$/; // Allows only numbers between 10 and 15 digits
  if (!phoneRegex.test(contactPhone)) {
    setError(localize('invalidPhoneNumber')); // You can define an appropriate localized message
  } else {
    setError(''); // Clear error if the phone number is valid
  }
};

export default validatePhoneNumber