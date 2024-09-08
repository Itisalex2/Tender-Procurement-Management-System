import { useState } from 'react';
import { useAuthContext } from './use-auth-context'; // Assuming you already have this context

const useFetchUser = () => {
  const { user: authUser } = useAuthContext(); // Get the token from the context
  const [userData, setUserData] = useState(null); // To store user data from MongoDB
  const [loading, setLoading] = useState(false); // Default to not loading
  const [error, setError] = useState(null); // Error state

  const fetchUserData = async () => {
    if (!authUser || !authUser.token) {
      setError('No authentication token found');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authUser.token}`, // Pass the token for authorization
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user data');
      }

      setUserData(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return { userData, loading, error, fetchUserData };
};

export default useFetchUser;
