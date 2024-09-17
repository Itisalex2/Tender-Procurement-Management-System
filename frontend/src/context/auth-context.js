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
            dispatch({ type: 'LOGIN', payload: user });
        }

        // Set the language in state
        dispatch({ type: 'CHANGE_LANGUAGE', payload: language });

        setLoading(false); // Stop loading once user and language data is fetched
    }, []);

    // Function to change language
    const changeLanguage = (language) => {
        dispatch({ type: 'CHANGE_LANGUAGE', payload: language });
        localStorage.setItem('language', language); // Persist language in localStorage
    };

    return (
        <AuthContext.Provider value={{ ...state, dispatch, loading, changeLanguage }}>
            {children}
        </AuthContext.Provider>
    );
};
