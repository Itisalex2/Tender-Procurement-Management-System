import { useState, useEffect } from 'react';
import { useAuthContext } from './use-auth-context';

/* Fetch the authenticated user's info, with options to include bids and tendererDetails */
const useFetchUser = ({ includeBids = false, includeTendererDetails = false } = {}) => {
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
        const queryParams = [];
        if (includeBids) queryParams.push('includeBids=true');
        if (includeTendererDetails) queryParams.push('populate=tendererDetails');

        const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';

        const response = await fetch(`/api/user/me${queryString}`, {
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
  }, [authUser, includeBids, includeTendererDetails]);

  return { userData, loading, error };
};

export default useFetchUser;
