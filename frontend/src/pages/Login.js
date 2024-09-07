import { useState } from "react"

const Login = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault() // Don't refresh the page by default
  }

  return (
    <div className="login">
      <h2>Login</h2>
    </div>
  )
}

export default Login