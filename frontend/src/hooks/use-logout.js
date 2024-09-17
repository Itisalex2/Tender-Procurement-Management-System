import { useAuthContext } from "./use-auth-context";
import useLocalize from "./use-localize";

export const useLogout = () => {
    const { dispatch, user } = useAuthContext();
    const { localize } = useLocalize();

    const logout = async () => {
        try {
            // Call the logout API to record the event
            const response = await fetch('/api/user/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                }
            });

            if (!response.ok) {
                throw new Error(localize('failedToLogout'));
            }

            // Remove the user token from local storage
            localStorage.removeItem('user');

            // Dispatch logout action to update state
            dispatch({ type: 'LOGOUT' });

        } catch (error) {
            console.log(localize('failedToLogout'), error);
        }
    };

    return { logout };
};
