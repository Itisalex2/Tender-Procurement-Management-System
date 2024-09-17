import { useState } from "react"
import { useAuthContext } from "../hooks/use-auth-context"
import useLocalize from "./use-localize"

export const useSignup = () => {
    const [error, setError] = useState(null)
    const { dispatch } = useAuthContext()
    const { localize } = useLocalize()

    const signup = async (username, email, password, number) => {
        setError(null)

        const response = await fetch('/api/user/signup', {
            method: 'POST',
            body: JSON.stringify({ username, email, password, number }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json()

        if (!response.ok) {
            setError(localize(json.error))
        }

        if (response.ok) {
            // save the user to local storage
            localStorage.setItem('user', JSON.stringify(json))

            // update the auth context
            dispatch({ type: 'LOGIN', payload: json })
        }
    }
    return { signup, error }
}