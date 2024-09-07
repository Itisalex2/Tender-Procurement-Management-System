import { useState } from "react"

const SignUp = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [number, setNumber] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault() // Don't refresh the page by default
  }

  return (
    <div className="signUp">
      <h1>Sign up</h1>
    </div>
  )
}

export default SignUp