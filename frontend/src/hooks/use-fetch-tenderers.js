import { useState, useEffect } from 'react';
import { useAuthContext } from './use-auth-context';

/* Hook to fetch tenderers with optional filters */
const useFetchTenderers = ({ verified = null } = {}) => {
  const { user: authUser } = useAuthContext();
  const [tenderers, setTenderers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTenderers = async () => {
      if (!authUser) {
        setLoading(false);
        return;
      }

      try {
        // Construct query parameters
        const queryParams = [];
        if (verified !== null) {
          queryParams.push(`verified=${verified}`);
        }

        const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';

        const response = await fetch(`/api/user/getTenderers${queryString}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authUser.token}`, // Pass token in headers for authentication
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tenderers');
        }

        const data = await response.json();
        setTenderers(data); // Set the tenderers data in state
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTenderers();
  }, [authUser, verified]);

  return { tenderers, loading, error };
};

export default useFetchTenderers;
