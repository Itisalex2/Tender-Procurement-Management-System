export const useLoginWithCode = () => {
  const [error, setError] = useState(null);
  const { dispatch } = useAuthContext();

  const loginWithSMS = async (phoneNumber, code) => {
    setError(null);

    const response = await fetch('/api/sms/verify', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, code }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.message);
    }

    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(json.user));
      dispatch({ type: 'LOGIN', payload: json.user });
    }
  };

  return { loginWithSMS, error };
};
