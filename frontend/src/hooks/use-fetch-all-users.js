import { useState, useEffect } from 'react';
import { useAuthContext } from './use-auth-context';

const useFetchAllUsers = (roles = '') => {
  const { user } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          throw new Error(data.error || 'Failed to fetch users');
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
