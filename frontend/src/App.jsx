import "./styles.css"
import { useEffect, useMemo, useState } from "react"

const API_URL = "http://127.0.0.1:8000"

export default function App() {
  const [cars, setCars] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [year, setYear] = useState("")
  const [km, setKm] = useState("")
  const [price, setPrice] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("score")

  async function loadDashboard() {
    const res = await fetch(`${API_URL}/cars/dashboard`)
    const data = await res.json()

    setCars(data.hot_deals || data.top_deals || [])
    setStats(data.stats || {})
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  async function analyzeCar() {
    setLoading(true)

    await fetch(`${API_URL}/cars/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        brand,
        model,
        year: Number(year),
        km: Number(km),
        price: Number(price),
        image_url: imageUrl,
      }),
    })

    setBrand("")
    setModel("")
    setYear("")
    setKm("")
    setPrice("")
    setImageUrl("")

    await loadDashboard()

    setLoading(false)

    window.location.reload()
  }

  async function deleteCar(id) {

    await fetch(`${API_URL}/cars/${id}`, {
      method: "DELETE",
    })

    await loadDashboard()
  }

  const filteredCars = useMemo(() => {
    let result = [...cars]

    if (search) {
      result = result.filter((car) =>
        `${car.brand} ${car.model}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    }

    if (sortBy === "score") {
      result.sort((a, b) => b.score - a.score)
    }

    if (sortBy === "profit") {
      result.sort(
        (a, b) => b.estimated_net_profit - a.estimated_net_profit
      )
    }

    if (sortBy === "roi") {
      result.sort((a, b) => b.roi - a.roi)
    }

    return result
  }, [cars, search, sortBy])

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 30,
        color: "white",
      }}
    >
      <div className="topbar">
        <div>
          <div className="logo">🚗 Coches SaaS</div>
          <div className="subtitle">
            Inteligencia artificial para compraventa profesional
          </div>
        </div>

        <div className="hot">
          🔥 IA AUTOMOTIVE ENGINE
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <input placeholder="Marca" value={brand} onChange={(e)=>setBrand(e.target.value)} />
        <input placeholder="Modelo" value={model} onChange={(e)=>setModel(e.target.value)} />
        <input placeholder="Año" value={year} onChange={(e)=>setYear(e.target.value)} />
        <input placeholder="KM" value={km} onChange={(e)=>setKm(e.target.value)} />
        <input placeholder="Precio" value={price} onChange={(e)=>setPrice(e.target.value)} />
        <input placeholder="URL imagen" value={imageUrl} onChange={(e)=>setImageUrl(e.target.value)} />
      </div>

      <button
        onClick={analyzeCar}
        disabled={loading}
        style={{
          background: "#22c55e",
          border: "none",
          padding: 20,
          borderRadius: 18,
          color: "white",
          fontSize: 24,
          fontWeight: "bold",
          cursor: "pointer",
          marginBottom: 35,
        }}
      >
        {loading ? "ANALIZANDO..." : "🚀 ANALIZAR COCHE"}
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 20,
          marginBottom: 35,
        }}
      >
        <StatCard title="🚘 Coches" value={stats.total_cars || 0} />
        <StatCard title="🔥 Hot Deals" value={stats.hot_deals_count || 0} />
        <StatCard title="💰 Beneficio" value={`${stats.total_profit || 0} €`} />
        <StatCard title="📈 Score IA" value={stats.avg_score || 0} />
      </div>

      <div
        style={{
          display: "flex",
          gap: 20,
          marginBottom: 35,
        }}
      >
        <input
          placeholder="Buscar marca o modelo..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          style={{ flex: 1 }}
        />

        <select
          value={sortBy}
          onChange={(e)=>setSortBy(e.target.value)}
        >
          <option value="score">Ordenar por score</option>
          <option value="profit">Ordenar por beneficio</option>
          <option value="roi">Ordenar por ROI</option>
        </select>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(360px,1fr))",
          gap: 30,
        }}
      >
        {filteredCars.map((car) => (
          <div
            key={car.id}
            className={`card ${car.score >= 90 ? "premium" : ""}`}
          >
            <div style={{ position: "relative" }}>
              <img
                src={car.image_url}
                alt=""
                style={{
                  width: "100%",
                  height: 240,
                  objectFit: "cover",
                }}
              />

              {car.is_hot_deal && (
                <div
                  className="hot"
                  style={{
                    position: "absolute",
                    top: 15,
                    left: 15,
                  }}
                >
                  🔥 HOT DEAL
                </div>
              )}
            </div>

            <div style={{ padding: 24 }}>
              <h2
                style={{
                  fontSize: 34,
                  marginBottom: 10,
                }}
              >
                {car.brand} {car.model}
              </h2>

              <div
                style={{
                  opacity: 0.85,
                  lineHeight: 1.9,
                  marginBottom: 20,
                }}
              >
                <div>📅 {car.year}</div>
                <div>🛣 {car.km} km</div>
                <div>💶 {car.price} €</div>
              </div>

              <hr style={{ opacity: 0.15 }} />

              <div
                style={{
                  marginTop: 20,
                  lineHeight: 2,
                }}
              >
                <div>🏪 Mercado: {car.estimated_market_price} €</div>
                <div>🛠 Gastos: {car.estimated_expenses} €</div>

                <div
                  style={{
                    fontSize: 34,
                    color: "#4ade80",
                    fontWeight: "bold",
                  }}
                >
                  💰 {car.estimated_net_profit} €
                </div>

                <div>📈 ROI: {car.roi}%</div>
              </div>

              <div
                style={{
                  marginTop: 24,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  className={`badge ${
                    car.score >= 90
                      ? "score-high"
                      : car.score >= 70
                      ? "score-medium"
                      : "score-low"
                  }`}
                >
                  ⭐ SCORE {car.score}
                </div>

                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  {car.recommendation}
                </div>
              </div>

              <button
                onClick={() => deleteCar(car.id)}
                style={{
                  marginTop: 20,
                  width: "100%",
                  background: "#ef4444",
                  border: "none",
                  padding: 16,
                  borderRadius: 14,
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                🗑 ELIMINAR
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatCard({ title, value }) {
  return (
    <div className="stat-card">
      <h3>{title}</h3>

      <p
        style={{
          fontSize: 36,
          fontWeight: "bold",
        }}
      >
        {value}
      </p>
    </div>
  )
}
