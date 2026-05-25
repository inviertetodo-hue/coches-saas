import { useState } from "react"
import { API_URL } from "./config"

export default function Auth({ onLogin }) {

  const [isLogin, setIsLogin] = useState(true)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const submit = async () => {

    const endpoint =
      isLogin ? "login" : "register"

    const response = await fetch(
      `${API_URL}/${endpoint}`,
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      }
    )

    const data = await response.json()

    if(data.token){

      localStorage.setItem(
        "token",
        data.token
      )

      localStorage.setItem(
        "email",
        data.email
      )

      onLogin(data.email)

    } else {

      alert(data.message)
    }
  }

  return (
    <div className="auth-container">

      <h1>
        🔐 Coches SaaS Login
      </h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button onClick={submit}>
        {isLogin ? "Entrar" : "Crear cuenta"}
      </button>

      <p
        onClick={()=>setIsLogin(!isLogin)}
        style={{
          cursor:"pointer"
        }}
      >
        {
          isLogin
          ? "Crear cuenta"
          : "Ya tengo cuenta"
        }
      </p>

    </div>
  )
}
