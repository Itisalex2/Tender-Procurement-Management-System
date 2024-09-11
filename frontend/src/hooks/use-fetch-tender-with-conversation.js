import { useState, useEffect } from 'react';
import { useAuthContext } from './use-auth-context';

const useFetchTenderWithConversation = (id) => {
  const { user } = useAuthContext();
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTenderWithConversation = async () => {
      try {
        const response = await fetch(`/api/tender/${id}?populate=conversations`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch tender with conversations');
        }

        setTender(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTenderWithConversation();
  }, [id, user.token]);

  return { tender, loading, error };
};

export { useFetchTenderWithConversation };
