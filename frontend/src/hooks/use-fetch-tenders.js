import { useEffect, useState } from 'react';
import { useAuthContext } from './use-auth-context';

const useFetchTenders = (status = 'all') => { // Fetch all the tenders
  const { user } = useAuthContext();
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const response = await fetch(`/api/tender?status=${status}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error('Failed to fetch tenders');
        }

        setTenders(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (user && user.token) {
      fetchTenders();
    }
  }, [user, status]);

  return { tenders, setTenders, loading, error };
};

export default useFetchTenders;
