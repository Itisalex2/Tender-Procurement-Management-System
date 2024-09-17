import { useState, useEffect } from 'react';
import { useAuthContext } from './use-auth-context';

/* Fetch a specific user's info by ID */
const useFetchUserById = (userId) => {
  const { user: authUser } = useAuthContext();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!authUser || !userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/user/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authUser.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authUser, userId]); // Fetch user data whenever authUser or userId changes

  return { userData, loading, error, setUserData };
};

export default useFetchUserById;
