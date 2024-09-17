import { useState } from "react";
import { useAuthContext } from "../hooks/use-auth-context";
import useLocalization from "./use-localize";

export const useLogin = () => {
    const [error, setError] = useState(null);
    const { dispatch } = useAuthContext();
    const { localize } = useLocalization();

    const login = async (email, password) => {
        setError(null); // Reset error state before login attempt
        let success = false;

        try {
            const response = await fetch('/api/user/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const json = await response.json();

            if (!response.ok) {
                setError(localize(json.error)); // Set error if login fails
            } else {
                // Save the user to local storage
                localStorage.setItem('user', JSON.stringify(json));

                // Update the auth context
                dispatch({ type: 'LOGIN', payload: json });

                success = true;
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        }

        return success; // Return success flag
    };

    return { login, error };
};
