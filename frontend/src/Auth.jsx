import { useState } from "react"

const API_URL = "http://127.0.0.1:8000"

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const submit = async () => {
    const endpoint = mode === "login" ? "login" : "register"

    const res = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (data.token) {
      localStorage.setItem("token", data.token)
      localStorage.setItem("email", data.email || email)
      onLogin(data.email || email)
      return
    }

    alert(data.message || "No se pudo entrar")
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h1>🚘 Coches SaaS</h1>
        <p>Acceso profesional IA</p>

        <input placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} />

        <input placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button onClick={submit}>
          {mode === "login" ? "Entrar" : "Crear cuenta"}
        </button>

        <span onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Crear cuenta nueva" : "Ya tengo cuenta"}
        </span>
      </div>
    </div>
  )
}
