import { useState, useEffect } from 'react';
import { useAuthContext } from './use-auth-context';

/* Fetch the authenticated user's info, with an option to include bids */
const useFetchUser = (includeBids = false) => {
  const { user: authUser } = useAuthContext();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!authUser) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/user/me${includeBids ? '?includeBids=true' : ''}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authUser.token}`, // Pass token in headers for authentication
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data); // Set the user data in state
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authUser, includeBids]);

  return { userData, loading, error };
};

export default useFetchUser;
