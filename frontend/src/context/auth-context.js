import { jwtDecode } from 'jwt-decode';
import { createContext, useReducer, useEffect, useState } from 'react';

export const AuthContext = createContext();

// Reducer function to manage auth and language state
export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, user: action.payload };
        case 'LOGOUT':
            return { ...state, user: null };
        case 'CHANGE_LANGUAGE':
            return { ...state, language: action.payload };
        default:
            return state;
    }
};

// Function to check if the token is expired
const isTokenExpired = (token) => {
    if (!token) return true;

    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds
        return decodedToken.exp < currentTime;  // Check if token expiration time is in the past
    } catch (error) {
        return true; // Return true if the token can't be decoded or is invalid
    }
};

// AuthContextProvider component
export const AuthContextProvider = ({ children }) => {
    // Reducer with initial state including user and language
    const [state, dispatch] = useReducer(authReducer, {
        user: JSON.parse(localStorage.getItem('user')),
        language: localStorage.getItem('language') || 'zh', // Default to Chinese
    });

    const [loading, setLoading] = useState(true); // Manage loading state

    useEffect(() => {
        // Fetch user from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        const language = localStorage.getItem('language') || 'zh'; // Check if language is in localStorage

        if (user) {
            const token = user.token;

            // Check if the token is expired
            if (isTokenExpired(token)) {
                // If the token is expired, log out the user and remove from local storage
                localStorage.removeItem('user');
                dispatch({ type: 'LOGOUT' });
            } else {
                // If the token is valid, log in the user
                dispatch({ type: 'LOGIN', payload: user });
            }
        }

        // Set the language in state
        dispatch({ type: 'CHANGE_LANGUAGE', payload: language });

        setLoading(false); // Stop loading once user and language data is fetched
    }, []);

    // Function to change language
    const changeLanguage = (language) => {
        dispatch({ type: 'CHANGE_LANGUAGE', payload: language });
        localStorage.setItem('language', language);
    };

    return (
        <AuthContext.Provider value={{ ...state, dispatch, loading, changeLanguage }}>
            {children}
        </AuthContext.Provider>
    );
};
