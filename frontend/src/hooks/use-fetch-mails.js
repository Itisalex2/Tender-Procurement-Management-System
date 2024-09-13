import { useState, useEffect } from 'react';
import { useAuthContext } from './use-auth-context';

const useFetchMails = (unreadOnly = false, reverse = false) => {
  const { user } = useAuthContext();
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMails = async () => {
    setLoading(true);
    setError('');

    try {
      // Build the query string
      const query = `?unreadOnly=${unreadOnly}&reverse=${reverse}`;
      const response = await fetch(`/api/mail/getAllMails${query}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch mails');
      }

      const data = await response.json();
      setMails(data);
    } catch (err) {
      setError('Failed to load mails');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMails();
    // eslint-disable-next-line
  }, [user, unreadOnly, reverse]);

  return { mails, loading, error, refetchMails: fetchMails };
};

export default useFetchMails;
