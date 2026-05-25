import { useEffect, useMemo, useState } from "react"
import "./App.css"

const API_URL = "http://127.0.0.1:8000"

function App() {
  const [cars, setCars] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState("")
  const [onlyHotDeals, setOnlyHotDeals] = useState(false)

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    km: "",
    price: "",
    image_url: ""
  })

  const loadDashboard = async () => {
    const response = await fetch(`${API_URL}/cars/dashboard`)
    const data = await response.json()
    setCars(data.top_deals || [])
    setStats(data.stats || {})
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const analyzeCar = async () => {
    setLoading(true)

    await fetch(`${API_URL}/cars/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        year: Number(formData.year),
        km: Number(formData.km),
        price: Number(formData.price)
      })
    })

    await loadDashboard()
    setLoading(false)

    setFormData({
      brand: "",
      model: "",
      year: "",
      km: "",
      price: "",
      image_url: ""
    })
  }

  const importUrl = async () => {
    const url = prompt("Pega URL del coche")

    if (!url) return

    await fetch(`${API_URL}/cars/import-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    })

    await loadDashboard()
  }

  const deleteCar = async (id) => {
    await fetch(`${API_URL}/cars/${id}`, { method: "DELETE" })
    await loadDashboard()
  }

  const filteredCars = useMemo(() => {
    let result = [...cars]

    if (search) {
      result = result.filter(car =>
        `${car.brand} ${car.model}`.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (onlyHotDeals) {
      result = result.filter(car => car.roi >= 15)
    }

    return result
  }, [cars, search, onlyHotDeals])

  return (
    <div className="app">
      <div className="hero">
        <div className="hero-top">
          <h1>🚘 Coches SaaS</h1>
          <div className="hero-badge">🔥 MOTOR AUTOMOTRIZ IA</div>
        </div>
        <p>Inteligencia artificial para compraventa profesional</p>
      </div>

      <button className="import-btn" onClick={importUrl}>
        🔗 Importar URL
      </button>

      <div className="form-grid">
        <input placeholder="Marca" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
        <input placeholder="Modelo" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} />
        <input placeholder="Año" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} />
        <input placeholder="KM" value={formData.km} onChange={(e) => setFormData({ ...formData, km: e.target.value })} />
        <input placeholder="Precio" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
        <input placeholder="URL imagen" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} />
      </div>

      <button className="analyze-btn" onClick={analyzeCar}>
        {loading ? "ANALIZANDO..." : "🚀 ANALIZAR COCHE"}
      </button>

      <div className="stats-grid">
        <div className="stat-card"><h3>🚗 Coches</h3><h2>{stats.total_cars || 0}</h2></div>
        <div className="stat-card"><h3>🔥 Hot Deals</h3><h2>{stats.hot_deals_count || 0}</h2></div>
        <div className="stat-card"><h3>💰 Profit</h3><h2>{stats.total_profit || 0} €</h2></div>
        <div className="stat-card"><h3>📈 IA Score</h3><h2>{stats.avg_score || 0}</h2></div>
      </div>

      <div className="filters-row">
        <input className="search-input" placeholder="Buscar marca o modelo..." value={search} onChange={(e) => setSearch(e.target.value)} />

        <button className={`filter-chip ${onlyHotDeals ? "active" : ""}`} onClick={() => setOnlyHotDeals(!onlyHotDeals)}>
          🔥 Solo chollos IA
        </button>
      </div>

      <div className="cars-grid">
        {filteredCars.map(car => (
          <div
            key={car.id}
            className={
              car.roi >= 20
                ? "car-card super-hot"
                : car.roi >= 10
                ? "car-card good-deal"
                : "car-card normal-deal"
            }
          >
            <img src={car.image_url} alt="" />

            <div className="car-content">
              <h2>{car.brand} {car.model}</h2>

              <p>📅 {car.year}</p>
              <p>🛣️ {car.km} km</p>
              <p>💶 {car.price} €</p>

              <hr />

              <p>🏪 Mercado: {car.estimated_market_price} €</p>
              <p>🛠️ Gastos: {car.estimated_expenses} €</p>

              <h3 className="profit">💰 {car.estimated_net_profit} €</h3>

              <p>📈 ROI: {car.roi} %</p>

              <div className="score-box">⭐ {car.score}</div>

              <div className="recommendation">{car.recommendation}</div>

              <button className="delete-btn" onClick={() => deleteCar(car.id)}>
                🗑 Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
