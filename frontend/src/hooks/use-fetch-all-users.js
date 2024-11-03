import { useState, useEffect } from 'react';
import { useAuthContext } from './use-auth-context';
import useLocalize from '../hooks/use-localize';

const useFetchAllUsers = (roles = '') => {
  const { user } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { localize } = useLocalize();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Add query parameter for roles if provided
        const query = roles ? `?role=${roles}` : '';

        const response = await fetch(`/api/user/getAll${query}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || localize('failedToFetchUsers'));
        }

        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user.token, roles]);

  return { users, loading, error };
};

export { useFetchAllUsers };
