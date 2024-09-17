import { useState } from 'react';
import { useAuthContext } from '../hooks/use-auth-context'

const useUpdateUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const updateUserById = async (userId, updatedUserData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(updatedUserData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user');
      }

      setIsLoading(false);
      return data;
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
      return null;
    }
  };

  return { updateUserById, isLoading, error };
};

export default useUpdateUser;
