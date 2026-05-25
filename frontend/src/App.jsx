import { useEffect, useMemo, useState } from "react"
import "./App.css"

const API_URL = "http://127.0.0.1:8000"

function App() {
  const [cars, setCars] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState("")

  const [importUrl,setImportUrl] =
    useState("")

  const [sortBy, setSortBy] = useState("score")
  const [onlyHotDeals, setOnlyHotDeals] = useState(false)
  const [onlyPremium, setOnlyPremium] = useState(false)
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [hideSold, setHideSold] = useState(false)

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

  const importFromUrl = async () => {

    if(!importUrl){
      return
    }

    await fetch(
      `${API_URL}/cars/import-url`,
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          url:importUrl
        })
      }
    )

    setImportUrl("")

    await loadDashboard()
  }

  const analyzeCar = async () => {
    setLoading(true)

    await fetch(`${API_URL}/cars/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
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

  const deleteCar = async (id) => {
    await fetch(`${API_URL}/cars/${id}`, { method: "DELETE" })
    await loadDashboard()
  }

  const toggleFavorite = async (id) => {
    await fetch(`${API_URL}/cars/${id}/favorite`, { method: "PATCH" })
    await loadDashboard()
  }

  const toggleSold = async (id) => {
    await fetch(`${API_URL}/cars/${id}/sold`, { method: "PATCH" })
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

    if (onlyHotDeals) result = result.filter((car) => car.is_hot_deal)
    if (onlyPremium) result = result.filter((car) => car.is_premium_brand)
    if (onlyFavorites) result = result.filter((car) => car.is_favorite)
    if (hideSold) result = result.filter((car) => !car.is_sold)

    result.sort((a, b) => {
      if (sortBy === "score") return b.score - a.score
      if (sortBy === "profit") return b.estimated_net_profit - a.estimated_net_profit
      if (sortBy === "roi") return b.roi - a.roi
      return 0
    })

    return result
  }, [cars, search, sortBy, onlyHotDeals, onlyPremium, onlyFavorites, hideSold])

  const adminStats = {
    avgRoi: cars.length
      ? (cars.reduce((sum, car) => sum + (car.roi || 0), 0) / cars.length).toFixed(2)
      : 0,
    sold: cars.filter(car => car.is_sold).length,
    favorites: cars.filter(car => car.is_favorite).length,
    hotPercent: cars.length
      ? ((cars.filter(car => car.is_hot_deal).length / cars.length) * 100).toFixed(1)
      : 0,
    premium: cars.filter(car => car.is_premium_brand).length,
    bestProfit: cars.length
      ? Math.max(...cars.map(car => car.estimated_net_profit || 0))
      : 0
  }

  return (
    <div className="app">
      <div className="hero">
        <div className="hero-top">
          <h1>🚘 Coches SaaS</h1>
          <div className="hero-badge">🔥 MOTOR AUTOMOTRIZ IA</div>
        </div>
        <p>Inteligencia artificial para compraventa profesional</p>
      </div>

      <div className="import-box">

        <h2>
          🔗 Importador automático IA
        </h2>

        <div className="import-row">

          <input
            className="import-input"
            placeholder="Pega URL AutoScout24 / Mobile.de"
            value={importUrl}
            onChange={(e)=>
              setImportUrl(e.target.value)
            }
          />

          <button
            className="import-btn"
            onClick={importFromUrl}
          >
            🚀 Importar
          </button>

        </div>

      </div>

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

      <div className="admin-panel">
        <h2>📊 Panel Admin IA</h2>

        <div className="admin-grid">
          <div className="admin-card">
            <span>ROI medio</span>
            <strong>{adminStats.avgRoi}%</strong>
          </div>

          <div className="admin-card">
            <span>Vendidos</span>
            <strong>{adminStats.sold}</strong>
          </div>

          <div className="admin-card">
            <span>Favoritos</span>
            <strong>{adminStats.favorites}</strong>
          </div>

          <div className="admin-card">
            <span>% Hot Deals</span>
            <strong>{adminStats.hotPercent}%</strong>
          </div>

          <div className="admin-card">
            <span>Premium</span>
            <strong>{adminStats.premium}</strong>
          </div>

          <div className="admin-card">
            <span>Mejor profit</span>
            <strong>{adminStats.bestProfit} €</strong>
          </div>
        </div>
      </div>

      <div className="filters-row">
        <button className={`filter-chip ${onlyHotDeals ? "active" : ""}`} onClick={() => setOnlyHotDeals(!onlyHotDeals)}>🔥 Gangas</button>
        <button className={`filter-chip ${onlyPremium ? "active" : ""}`} onClick={() => setOnlyPremium(!onlyPremium)}>👑 Premium</button>
        <button className={`filter-chip ${onlyFavorites ? "active" : ""}`} onClick={() => setOnlyFavorites(!onlyFavorites)}>⭐ Favoritos</button>
        <button className={`filter-chip ${hideSold ? "active" : ""}`} onClick={() => setHideSold(!hideSold)}>🚫 Ocultar vendidos</button>
      </div>

      <div className="toolbar">
        <input className="search-input" placeholder="Buscar marca o modelo..." value={search} onChange={(e) => setSearch(e.target.value)} />

        <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="score">Ordenar por puntuación</option>
          <option value="profit">Ordenar por beneficio</option>
          <option value="roi">Ordenar por ROI</option>
        </select>
      </div>

      <div className="cars-grid">
        {filteredCars.map((car) => (
          <div key={car.id} className={`car-card ${car.is_hot_deal ? "hot" : ""}`}>
            <img src={car.image_url} alt="" />

            <div className="car-content">
              <div className="card-top">
                <h2>{car.brand} {car.model}</h2>
                {car.is_favorite && <div className="favorite-badge">⭐ FAVORITO</div>}
              </div>

              {car.is_sold && <div className="sold-badge">VENDIDO</div>}

              <p>📅 {car.year}</p>
              <p>🛣️ {car.km} km</p>
              <p>💶 {car.price} €</p>

              <hr />

              <p>🏪 Mercado: {car.estimated_market_price} €</p>
              <p>🛠️ Gastos: {car.estimated_expenses} €</p>

              <h3 className="profit">💰 {car.estimated_net_profit} €</h3>

              <p>📈 ROI: {car.roi} %</p>

              <div className="score-box">
                ⭐ {car.score}
              </div>

              <div className="recommendation">
                {car.recommendation}
              </div>

              <div className="visual-box">

                <h4>
                  🧠 IA VISUAL
                </h4>

                <div className="visual-grid">

                  <div className="visual-item">
                    🎨 {car.visual_color}
                  </div>

                  <div className="visual-item">
                    🔍 {car.visual_status}
                  </div>

                  <div className="visual-item">
                    ⚠️ {car.visual_risk}
                  </div>

                  <div className="visual-item">
                    👁️ Imagen analizada
                  </div>

                </div>

                <div className="visual-score">
                  {car.visual_score}/100
                </div>

              </div>

              <div className="card-buttons">
                <button className="favorite-btn" onClick={() => toggleFavorite(car.id)}>⭐ Favorito</button>
                <button className="sold-btn" onClick={() => toggleSold(car.id)}>✅ Vendido</button>
              </div>

              <button className="delete-btn" onClick={() => deleteCar(car.id)}>🗑 Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
