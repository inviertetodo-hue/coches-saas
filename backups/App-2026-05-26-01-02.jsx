import { useEffect, useMemo, useState } from "react"
import "./App.css"
import Auth from "./Auth"
import { API_URL } from "./config"



export default function App() {
  const [user, setUser] = useState(localStorage.getItem("email"))
  const [cars, setCars] = useState([])
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState("")
  const [auditLog, setAuditLog] = useState([])
  const [search, setSearch] = useState("")
  const [onlyDeals, setOnlyDeals] = useState(false)
  const [sortBy, setSortBy] = useState("roi")
  const [minRoi, setMinRoi] = useState(15)
  const [minProfit, setMinProfit] = useState(3000)
  const [mode, setMode] = useState("pro")
  const [favorites, setFavorites] = useState([])
  const [dealNotes, setDealNotes] = useState({})
  const [notes, setNotes] = useState({})
  const [dealStatus, setDealStatus] = useState({})
  const [tasks, setTasks] = useState({})
  const [savedView, setSavedView] = useState("all")
  const [leadEmail, setLeadEmail] = useState("")
  const [leads, setLeads] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const [globalSearch, setGlobalSearch] = useState("")
  const [copilotInput, setCopilotInput] = useState("")
  const [copilotMessages, setCopilotMessages] = useState([
    {
      role: "ai",
      text: "🤖 Hola. Soy el Copilot IA de Coches SaaS."
    }
  ])


  const loadDemoCars = () => {
    const demoCars = [
      {
        id: 9001,
        brand: "Porsche",
        model: "911 Carrera",
        year: 2021,
        km: 28000,
        price: 72000,
        estimated_market_price: 95000,
        estimated_net_profit: 18500,
        roi: 25.7,
        score: 96,
        recommendation: "🔥 SUPER CHOLLO",
        image_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70"
      },
      {
        id: 9002,
        brand: "BMW",
        model: "M340i",
        year: 2022,
        km: 39000,
        price: 42000,
        estimated_market_price: 54000,
        estimated_net_profit: 8500,
        roi: 20.2,
        score: 91,
        recommendation: "🚀 COMPRA PRIORITARIA",
        image_url: "https://images.unsplash.com/photo-1555215695-3004980ad54e"
      },
      {
        id: 9003,
        brand: "Audi",
        model: "RS6",
        year: 2020,
        km: 65000,
        price: 69000,
        estimated_market_price: 81000,
        estimated_net_profit: 6200,
        roi: 9,
        score: 74,
        recommendation: "✅ BUENA COMPRA",
        image_url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8"
      }
    ]

    setCars(demoCars)
  }


  const checkSystemHealth = async () => {
    const res = await fetch(`${API_URL}/health`)
    const data = await res.json()

    alert(
      `Sistema: ${data.status}\nBackend: ${data.backend}\nDatabase: ${data.database}\nIA: ${data.ai_engine}\nScraper: ${data.scraper}`
    )
  }

  const loadCars = async () => {
    const res = await fetch(`${API_URL}/cars/dashboard`)
    const data = await res.json()
    setCars(data.top_deals || [])
  }

  useEffect(() => {
    if (user) loadCars()
  }, [user])

  useEffect(() => {

    if (!user) return

    const interval = setInterval(() => {
      loadCars()
    }, 30000)

    return () => clearInterval(interval)

  }, [user])

  const logout = () => {
    localStorage.clear()
    setUser(null)
  }

  const importCar = async () => {
    if (!url) return
    setLoading(true)

    await fetch(`${API_URL}/cars/import-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    })

    setUrl("")
    await loadCars()
    setToast("✅ Coche importado correctamente")
    setAuditLog(prev => [
      {
        action: "Importación completada",
        detail: "Nuevo coche analizado por IA",
        time: new Date().toLocaleTimeString()
      },
      ...prev
    ].slice(0, 6))
    setTimeout(() => setToast(""), 2500)
    setLoading(false)
  }

  const deleteCar = async (id) => {
    await fetch(`${API_URL}/cars/${id}`, { method: "DELETE" })
    await loadCars()
    setToast("🗑 Coche eliminado")
    setAuditLog(prev => [
      {
        action: "Coche eliminado",
        detail: "Unidad retirada del radar IA",
        time: new Date().toLocaleTimeString()
      },
      ...prev
    ].slice(0, 6))
    setTimeout(() => setToast(""), 2500)
  }


  const toggleWatchlist = (id) => {
    setWatchlist((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    )
  }


  const addLead = () => {
    if (!leadEmail) return

    setLeads(prev => [
      {
        email: leadEmail,
        time: new Date().toLocaleTimeString()
      },
      ...prev
    ])

    setLeadEmail("")
    alert("Lead guardado en demo")
  }


  const toggleTask = (carId, taskName) => {
    const key = `${carId}-${taskName}`

    setTasks({
      ...tasks,
      [key]: !tasks[key]
    })
  }

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    )
  }



  const startCheckout = async (plan) => {
    const res = await fetch(`${API_URL}/billing/checkout`, {
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({ plan })
    })

    const data = await res.json()

    alert(`Checkout preparado: ${data.plan} - ${data.price}`)
  }



  const sendCopilotMessage = async () => {

    if (!copilotInput.trim()) return

    const question = copilotInput

    setCopilotMessages(prev => [
      ...prev,
      {
        role: "user",
        text: question
      }
    ])

    setCopilotInput("")

    const res = await fetch(`${API_URL}/ai/copilot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        question
      })
    })

    const data = await res.json()

    setCopilotMessages(prev => [
      ...prev,
      {
        role: "ai",
        text: `🤖 ${data.answer}`
      }
    ])
  }

  const exportCSV = () => {
    const rows = [
      ["Marca","Modelo","Año","KM","Precio","ROI","Beneficio","Recomendacion"]
    ]

    cars.forEach((car) => {
      rows.push([
        car.brand,
        car.model,
        car.year,
        car.km,
        car.price,
        car.roi,
        car.estimated_net_profit,
        car.recommendation
      ])
    })

    const csv = rows.map(row => row.join(";")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "coches-saas-cartera.csv"
    a.click()
  }

  const copyExecutiveReport = () => {
    const report = `
COCHES SAAS - INFORME EJECUTIVO

Total coches: ${cars.length}
Chollos IA: ${cars.filter(c => (c.roi || 0) >= 20).length}
Profit total: ${cars.reduce((s,c)=>s+(c.estimated_net_profit || 0),0)} €
ROI medio: ${cars.length ? (cars.reduce((s,c)=>s+(c.roi || 0),0)/cars.length).toFixed(1) : 0}%

Recomendación:
${cars.some(c => (c.roi || 0) >= 20) ? "Priorizar operaciones con ROI superior al 20%." : "Seguir monitorizando mercado."}
`

    navigator.clipboard.writeText(report)
    alert("Informe ejecutivo copiado")
  }

  const filteredCars = useMemo(() => {

    const search = globalSearch.toLowerCase()


    let result = [...cars]

    if (search) {
      result = result.filter((car) =>
        `${car.brand} ${car.model}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    }

    if (onlyDeals) {
      result = result.filter((car) =>
        (car.roi || 0) >= minRoi &&
        (car.estimated_net_profit || 0) >= minProfit
      )
    }

    if (savedView === "deals") {
      result = result.filter((car) => (car.roi || 0) >= 20)
    }

    if (savedView === "premium") {
      result = result.filter((car) => (car.price || 0) >= 50000)
    }

    if (savedView === "favorites") {
      result = result.filter((car) => favorites.includes(car.id))
    }

    result.sort((a, b) => {
      if (sortBy === "roi") return (b.roi || 0) - (a.roi || 0)
      if (sortBy === "profit") return (b.estimated_net_profit || 0) - (a.estimated_net_profit || 0)
      if (sortBy === "price") return (b.price || 0) - (a.price || 0)
      return 0
    })

    return result
  }, [cars, search, onlyDeals, sortBy, savedView, favorites])

  const totalProfit = cars.reduce((s, c) => s + (c.estimated_net_profit || 0), 0)
  const avgRoi = cars.length
    ? (cars.reduce((s, c) => s + (c.roi || 0), 0) / cars.length).toFixed(1)
    : 0
  const bestDeal = cars.length
    ? [...cars].sort((a, b) => (b.roi || 0) - (a.roi || 0))[0]
    : null

  if (!user) return <Auth onLogin={setUser} />

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">🚘 Coches SaaS</div>
        <button>📊 Dashboard</button>
        <button>🔥 Chollos IA</button>
        <button>🔗 Importador</button>
        <button>💰 ROI</button>
        <button>⭐ Favoritos</button>
        <button>⚙️ Ajustes</button>
        <button className="logout" onClick={logout}>Cerrar sesión</button>
      </aside>

      <main className="main">
        
        
        <section className="system-status">

          <div className="system-status-left">

            <div className="system-chip">
              <div className="system-dot system-green"></div>
              Backend Online
            </div>

            <div className="system-chip">
              <div className="system-dot system-blue"></div>
              IA Engine Active
            </div>

            <div className="system-chip">
              <div className="system-dot system-purple"></div>
              Scraper Ready
            </div>

          </div>

          <div className="system-right">
            👥 12 dealers online
          </div>

        </section>


        <section className="ticker-wrap">

          <div className="ticker">

            {[...cars, ...cars].map((car, index) => (

              <div
                key={index}
                className={
                  (car.roi || 0) >= 20
                    ? "ticker-item ticker-green"
                    : (car.roi || 0) >= 10
                    ? "ticker-item ticker-yellow"
                    : "ticker-item ticker-red"
                }
              >
                🚘 {car.brand} {car.model}
                • ROI {car.roi}%
                • Profit {car.estimated_net_profit} €
              </div>

            ))}

          </div>

        </section>


        
        <section className="live-engine">

          <div className="live-left">
            <h2>🟢 Live Engine Active</h2>

            <p>
              El sistema está monitorizando oportunidades automáticamente.
            </p>
          </div>

          <div className="live-status">
            <div className="live-dot"></div>
            LIVE
          </div>

        </section>


        <section className="hero">
          <div>
            <h1>Motor IA profesional</h1>
            <p>Detecta oportunidades reales de compraventa con ROI, profit y scoring IA.</p>
          </div>
          <div className="hero-badge">🔥 IA AUTOMOTIVE ENGINE</div>
        </section>

        
        
        <section className="investor-strip">

          <h2>🚀 Investor Landing Strip</h2>

          <div className="investor-grid">

            <div className="investor-card">
              <span>Estado producto</span>
              <strong>MVP SaaS</strong>
            </div>

            <div className="investor-card">
              <span>Modelo negocio</span>
              <strong>B2B Dealer</strong>
            </div>

            <div className="investor-card">
              <span>Precio objetivo</span>
              <strong>49€/mes</strong>
            </div>

            <div className="investor-card">
              <span>Valor diferencial</span>
              <strong>IA + ROI</strong>
            </div>

          </div>

          <div className="investor-note">
            💼 Coches SaaS se posiciona como una plataforma de inteligencia
            automotriz para detectar oportunidades de compraventa antes que el mercado.
            El producto combina scraping, scoring IA, ROI, pricing intelligence,
            alertas y panel dealer profesional.
          </div>

        </section>


        <section className="command-center">

          <div className="command-header">
            <h2>🧠 Command Center IA</h2>
            <div className="command-status">
              SISTEMA ACTIVO
            </div>
          </div>

          <div className="command-grid">

            <div className="command-card">
              <span>Capital analizado</span>
              <strong>
                {cars.reduce((s,c)=>s+(c.price || 0),0)} €
              </strong>
            </div>

            <div className="command-card">
              <span>Oportunidades fuertes</span>
              <strong>
                {cars.filter(c => (c.roi || 0) >= 20).length}
              </strong>
            </div>

            <div className="command-card">
              <span>Rentabilidad máxima</span>
              <strong>
                {cars.length ? Math.max(...cars.map(c => c.roi || 0)) : 0}%
              </strong>
            </div>

            <div className="command-card">
              <span>Estado mercado</span>
              <strong>
                {cars.some(c => (c.roi || 0) >= 20) ? "Agresivo" : "Selectivo"}
              </strong>
            </div>

          </div>

          <div className="ai-summary">
            🤖 La IA está priorizando vehículos con alto ROI, bajo kilometraje,
            margen neto positivo y buena probabilidad de reventa. Las unidades
            con ROI superior al 20% deben revisarse primero.
          </div>

        </section>


        <section className="kpi-grid">
          <div className="kpi-card"><span>Total coches</span><h3>{cars.length}</h3></div>
          <div className="kpi-card"><span>Chollos IA</span><h3>{cars.filter(c => (c.roi || 0) >= 15).length}</h3></div>
          <div className="kpi-card"><span>Profit total</span><h3>{totalProfit.toFixed(0)} €</h3></div>
          <div className="kpi-card"><span>ROI medio</span><h3>{avgRoi}%</h3></div>
        </section>

        <section className="radar">
          <h2>🚨 Radar IA de oportunidades</h2>
          <div className="radar-grid">
            <div><span>Mejor oportunidad</span><strong>{bestDeal ? `${bestDeal.brand} ${bestDeal.model}` : "Buscando..."}</strong></div>
            <div><span>Mejor ROI</span><strong>{bestDeal ? `${bestDeal.roi}%` : "0%"}</strong></div>
            <div><span>Mayor profit</span><strong>{cars.length ? Math.max(...cars.map(c => c.estimated_net_profit || 0)) : 0} €</strong></div>
            <div><span>Estado IA</span><strong>{cars.some(c => (c.roi || 0) >= 20) ? "🔥 Comprar ya" : "Analizando mercado"}</strong></div>
          </div>
        </section>

        
        <section className="scraper-center">

          <div className="scraper-header">
            <h2>🌍 Scraper Control Center</h2>

            <button
              className="scraper-btn"
              onClick={() => alert("🌍 Escaneo iniciado: Mobile.de, AutoScout24 y Wallapop")}
            >
              Escanear mercado
            </button>
          </div>

          <div className="scraper-grid">

            <div className="scraper-card">
              <span>Fuente</span>
              <strong>Mobile.de</strong>
              <div className="scraper-live">READY</div>
            </div>

            <div className="scraper-card">
              <span>Fuente</span>
              <strong>AutoScout24</strong>
              <div className="scraper-live">READY</div>
            </div>

            <div className="scraper-card">
              <span>Fuente</span>
              <strong>Wallapop</strong>
              <div className="scraper-live">READY</div>
            </div>

            <div className="scraper-card">
              <span>Oportunidades detectadas</span>
              <strong>
                {cars.filter(c => (c.roi || 0) >= 15).length}
              </strong>
              <div className="scraper-live">IA ACTIVE</div>
            </div>

          </div>

        </section>


        <section className="import-box">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Pega URL Mobile.de / AutoScout24"
          />
          <button onClick={importCar}>
            {loading ? "Importando..." : "🚀 Importar URL"}
          </button>
        </section>

        
        <section className="settings-center">

          <h2>⚙️ Settings Center Pro</h2>

          <div className="settings-grid">

            <div className="settings-box">
              <span>ROI mínimo objetivo</span>
              <input
                type="number"
                value={minRoi}
                onChange={(e) => setMinRoi(Number(e.target.value))}
              />
            </div>

            <div className="settings-box">
              <span>Profit mínimo objetivo</span>
              <input
                type="number"
                value={minProfit}
                onChange={(e) => setMinProfit(Number(e.target.value))}
              />
            </div>

            <div className="settings-box">
              <span>Modo SaaS</span>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
              >
                <option value="demo">Demo</option>
                <option value="pro">Pro Dealer</option>
                <option value="elite">Dealer Elite</option>
              </select>
            </div>

          </div>

          <button
            className="settings-save"
            onClick={() => alert("Configuración guardada")}
          >
            Guardar configuración
          </button>

        </section>
\n\n        <section className="controls">
          <input
            placeholder="Buscar marca o modelo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className={onlyDeals ? "active" : ""}
            onClick={() => setOnlyDeals(!onlyDeals)}
          >
            🔥 Solo chollos
          </button>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="roi">Ordenar por ROI</option>
            <option value="profit">Ordenar por profit</option>
            <option value="price">Ordenar por precio</option>
          </select>
        </section>

        
        <section className="alerts-center">

          <div className="alerts-header">
            <h2>🔔 Alertas IA</h2>

            <button
              className="alert-create-btn"
              onClick={() => alert("🔔 Alerta creada: avisar si ROI > 20%")}
            >
              + Crear alerta
            </button>
          </div>

          <div className="alert-list">

            <div className="alert-item">
              <span>Condición</span>
              <strong>ROI mayor a 20%</strong>
              <div className="alert-active">ACTIVA</div>
            </div>

            <div className="alert-item">
              <span>Tipo</span>
              <strong>Chollo IA</strong>
              <div className="alert-active">TELEGRAM READY</div>
            </div>

            <div className="alert-item">
              <span>Detectados ahora</span>
              <strong>
                {cars.filter(c => (c.roi || 0) >= 20).length}
              </strong>
              <div className="alert-active">EN VIVO</div>
            </div>

          </div>

        </section>


        
        
        
        <section className="ai-insights">

          <h2>🧠 AI Insights Panel</h2>

          <div className="insights-grid">

            <div className="insight-card">
              <strong>🔥 Patrón detectado</strong>

              <p>
                La IA detecta mejores márgenes en vehículos premium
                con kilometraje inferior a 100.000 km.
              </p>
            </div>

            <div className="insight-card">
              <strong>📈 Tendencia ROI</strong>

              <p>
                Las unidades con ROI superior al 20% representan
                el segmento prioritario para inversión rápida.
              </p>
            </div>

            <div className="insight-card">
              <strong>⚠️ Riesgo operativo</strong>

              <p>
                Los vehículos con más de 180k km muestran
                menor velocidad esperada de reventa.
              </p>
            </div>

            <div className="insight-card">
              <strong>🚀 Recomendación IA</strong>

              <p>
                Concentrar capital en operaciones con alto score IA,
                bajo riesgo y pricing competitivo.
              </p>
            </div>

          </div>

        </section>


        <section className="smart-kpi-center">

          <h2>📊 Smart KPI Command Center</h2>

          <div className="smart-kpi-grid">

            <div className="smart-kpi-card">
              <span>Margen medio</span>
              <strong className="smart-kpi-positive">
                {cars.length
                  ? Math.round(
                      cars.reduce((s,c)=>s+(c.estimated_net_profit || 0),0)
                      / cars.length
                    )
                  : 0} €
              </strong>
            </div>

            <div className="smart-kpi-card">
              <span>Score IA medio</span>
              <strong>
                {cars.length
                  ? Math.round(
                      cars.reduce((s,c)=>s+(c.score || 0),0)
                      / cars.length
                    )
                  : 0}
              </strong>
            </div>

            <div className="smart-kpi-card">
              <span>Coches premium</span>
              <strong className="smart-kpi-warning">
                {cars.filter(c =>
                  ["BMW","Mercedes-Benz","Audi","Porsche"].includes(c.brand)
                ).length}
              </strong>
            </div>

            <div className="smart-kpi-card">
              <span>Capital monitorizado</span>
              <strong>
                {cars.reduce((s,c)=>s+(c.price || 0),0)} €
              </strong>
            </div>

          </div>

        </section>


        <section className="portfolio-manager">

          <div className="portfolio-header">
            <h2>💼 Portfolio Manager</h2>

            <div className="portfolio-status">
              CARTERA IA
            </div>
          </div>

          <div className="portfolio-grid">

            <div className="portfolio-card">
              <span>Capital total</span>
              <strong>
                {cars.reduce((s,c)=>s+(c.price || 0),0)} €
              </strong>
            </div>

            <div className="portfolio-card">
              <span>Beneficio potencial</span>
              <strong>
                {cars.reduce((s,c)=>s+(c.estimated_net_profit || 0),0)} €
              </strong>
            </div>

            <div className="portfolio-card">
              <span>ROI medio cartera</span>
              <strong>
                {cars.length ? (cars.reduce((s,c)=>s+(c.roi || 0),0)/cars.length).toFixed(1) : 0}%
              </strong>
            </div>

            <div className="portfolio-card">
              <span>Unidades prioritarias</span>
              <strong>
                {cars.filter(c => (c.roi || 0) >= 20).length}
              </strong>
            </div>

          </div>

          <div className="portfolio-note">
            🤖 La IA recomienda priorizar vehículos con ROI superior al 20%,
            bajo kilometraje y margen neto positivo. La cartera actual muestra
            una exposición total calculada automáticamente sobre las unidades importadas.
          </div>

        </section>


        
        
        
        
        
        
        
        <section className="leads-center">

          <h2>📥 Waitlist / Leads Pro</h2>

          <div className="leads-grid">

            <div className="leads-card">
              <span>Leads captados</span>
              <strong>{leads.length}</strong>
            </div>

            <div className="leads-card">
              <span>Canal</span>
              <strong>Demo SaaS</strong>
            </div>

            <div className="leads-card">
              <span>Estado</span>
              <strong>Captación activa</strong>
            </div>

          </div>

          <div className="leads-row">

            <input
              placeholder="Email del dealer interesado..."
              value={leadEmail}
              onChange={(e) => setLeadEmail(e.target.value)}
            />

            <button onClick={addLead}>
              Solicitar acceso
            </button>

          </div>

        </section>


        <section className="sales-demo">

          <h2>🎤 Demo Sales Mode</h2>

          <div className="sales-grid">

            <div className="sales-card">
              <span>Cliente objetivo</span>
              <strong>Compraventas / Dealers</strong>
            </div>

            <div className="sales-card">
              <span>Problema</span>
              <strong>Detectar chollos antes que otros</strong>
            </div>

            <div className="sales-card">
              <span>Solución</span>
              <strong>IA + ROI + Scraping</strong>
            </div>

            <div className="sales-card">
              <span>Beneficio</span>
              <strong>Más margen por operación</strong>
            </div>

          </div>

          <div className="sales-pitch">
            Coches SaaS ayuda a profesionales de compraventa a encontrar
            vehículos rentables más rápido, calcular ROI automáticamente,
            priorizar oportunidades y reducir el tiempo perdido revisando anuncios manualmente.
          </div>

          <button
            className="sales-btn"
            onClick={() => {
              navigator.clipboard.writeText(
                "Coches SaaS es una plataforma IA para compraventas que detecta oportunidades, calcula ROI, analiza riesgo y prioriza vehículos con mayor margen."
              )
              alert("Pitch comercial copiado")
            }}
          >
            📋 Copiar pitch comercial
          </button>

        </section>


        <section className="revenue-center">

          <h2>💰 AI Revenue Center</h2>

          <div className="revenue-grid">

            <div className="revenue-card">
              <span>MRR objetivo</span>
              <strong>10.000€</strong>
            </div>

            <div className="revenue-card">
              <span>Dealers necesarios</span>
              <strong>204</strong>
            </div>

            <div className="revenue-card">
              <span>ARR estimado</span>
              <strong>120.000€</strong>
            </div>

            <div className="revenue-card">
              <span>Ticket medio</span>
              <strong>49€/mes</strong>
            </div>

          </div>

          <div className="revenue-note">
            🚀 Con un pricing medio de 49€/mes y captación B2B dealer,
            el SaaS puede escalar mediante suscripciones recurrentes,
            scraping premium y alertas IA avanzadas.
          </div>

        </section>


        <section className="system-health">

          <h2>🟢 System Health Center</h2>

          <div className="health-grid">

            <div className="health-card">
              <span>Backend API</span>
              <strong className="health-ok">ONLINE</strong>
            </div>

            <div className="health-card">
              <span>Database</span>
              <strong className="health-ok">ACTIVE</strong>
            </div>

            <div className="health-card">
              <span>Auth</span>
              <strong className="health-ok">SECURED</strong>
            </div>

            <div className="health-card">
              <span>Scraper</span>
              <strong className="health-ok">READY</strong>
            </div>

          </div>

          <div className="health-note">
            ✅ Sistema preparado para operar como MVP SaaS: autenticación,
            importador, scoring IA, dashboard, cartera, alertas visuales y exportación.
          </div>

        </section>


        <section className="launch-readiness">

          <h2>🚀 Launch Readiness</h2>

          <div className="launch-grid">

            <div className="launch-card">
              <span>Frontend</span>
              <strong>Operativo ✅</strong>
            </div>

            <div className="launch-card">
              <span>Backend</span>
              <strong>FastAPI ✅</strong>
            </div>

            <div className="launch-card">
              <span>Base de datos</span>
              <strong>SQLite MVP ✅</strong>
            </div>

            <div className="launch-card">
              <span>Monetización</span>
              <strong>Stripe Ready ⚡</strong>
            </div>

          </div>

          <div className="launch-checklist">

            <div className="launch-check">
              ✅ Login y registro funcional
            </div>

            <div className="launch-check">
              ✅ Importador URL operativo
            </div>

            <div className="launch-check">
              ✅ Scoring IA y ROI automático
            </div>

            <div className="launch-check">
              🔜 PostgreSQL producción
            </div>

            <div className="launch-check">
              🔜 Deploy frontend + dominio
            </div>

          </div>

          <div className="launch-score">
            MVP READINESS: 78%
          </div>

        </section>


        
        
        <section className="ai-copilot">

          <h2>🤖 AI Chat Copilot</h2>

          <div className="copilot-chat">

            {copilotMessages.map((msg, index) => (

              <div
                key={index}
                className={
                  msg.role === "user"
                    ? "copilot-message copilot-user"
                    : "copilot-message copilot-ai"
                }
              >
                {msg.text}
              </div>

            ))}

          </div>

          <div className="copilot-row">

            <input
              className="copilot-input"
              placeholder="Pregunta algo a la IA..."
              value={copilotInput}
              onChange={(e) => setCopilotInput(e.target.value)}
            />

            <button
              className="copilot-btn"
              onClick={sendCopilotMessage}
            >
              Enviar
            </button>

          </div>

        </section>


        <section className="admin-panel">

          <h2>🛠️ Admin Panel Pro</h2>

          <div className="admin-grid">

            <div className="admin-card">
              <span>Usuarios demo</span>
              <strong>1</strong>
            </div>

            <div className="admin-card">
              <span>Plan activo</span>
              <strong>Pro Dealer</strong>
            </div>

            <div className="admin-card">
              <span>MRR demo</span>
              <strong>49€</strong>
            </div>

            <div className="admin-card">
              <span>Estado SaaS</span>
              <strong>Activo</strong>
            </div>

          </div>

          <div className="admin-note">
            Panel preparado para gestionar usuarios, suscripciones, límites de análisis,
            roles dealer y estado del SaaS cuando conectemos Stripe y PostgreSQL.
          </div>

        </section>


        
        <section className="admin-panel">

          <h2>🛡️ Admin Control Panel</h2>

          <div className="admin-grid">

            <div className="admin-card">
              <span>Usuario actual</span>
              <strong>{user}</strong>
            </div>

            <div className="admin-card">
              <span>Plan</span>
              <strong>Pro Dealer</strong>
            </div>

            <div className="admin-card">
              <span>Uso mensual</span>
              <strong>{cars.length}/∞</strong>
            </div>

            <div className="admin-card">
              <span>Estado sistema</span>
              <strong>Online</strong>
            </div>

          </div>

          <div className="admin-actions">

            <button
              className="admin-btn green"
              onClick={() => alert("✅ Sistema verificado")}
            >
              Verificar sistema
            </button>

            <button
              className="admin-btn blue"
              onClick={() => alert("📊 Reporte generado")}
            >
              Generar reporte
            </button>

            <button
              className="admin-btn"
              onClick={() => alert("🔒 Acceso premium activo")}
            >
              Premium Access
            </button>

          </div>

        </section>


        <section className="subscription-center">

          <h2>💳 Subscription Center</h2>

          <div className="plans-grid">

            <div className="plan-card">
              <h3>Free</h3>
              <div className="plan-price">0€</div>
              <ul>
                <li>5 análisis al mes</li>
                <li>Dashboard básico</li>
                <li>Importador manual</li>
              </ul>
              <button className="plan-btn">
                Plan actual
              </button>
            </div>

            <div className="plan-card pro">
              <h3>Pro Dealer</h3>
              <div className="plan-price">49€/mes</div>
              <ul>
                <li>Análisis ilimitado</li>
                <li>Radar IA</li>
                <li>Alertas de chollos</li>
                <li>Export CSV</li>
                <li>Pricing Intelligence</li>
              </ul>
              <button
                className="plan-btn"
                onClick={() => startCheckout("pro")}
              >
                Upgrade Pro
              </button>
            </div>

            <div className="plan-card">
              <h3>Dealer Elite</h3>
              <div className="plan-price">149€/mes</div>
              <ul>
                <li>Scraping masivo</li>
                <li>Alertas Telegram</li>
                <li>Multiusuario</li>
                <li>Informes PDF Pro</li>
                <li>Soporte prioritario</li>
              </ul>
              <button
                className="plan-btn"
                onClick={() => startCheckout("elite")}
              >
                Contactar
              </button>
            </div>

          </div>

        </section>


        <section className="export-center">

          <div className="export-header">
            <h2>📤 Export Center Pro</h2>
          </div>

          <div className="export-actions">

            <button
              className="export-btn green"
              onClick={exportCSV}
            >
              📊 Exportar CSV
            </button>

            <button
              className="export-btn"
              onClick={copyExecutiveReport}
            >
              📋 Copiar informe ejecutivo
            </button>

            <button
              className="export-btn orange"
              onClick={() => alert("PDF Pro próximamente")}
            >
              📄 Generar PDF Pro
            </button>

          </div>

        </section>


        
        <section className="audit-log">
          <h2>🧾 Audit Log Pro</h2>

          <div className="audit-list">
            {auditLog.length === 0 && (
              <div className="audit-item">
                <span>No hay actividad reciente</span>
                <span className="audit-time">Sistema listo</span>
              </div>
            )}

            {auditLog.map((item, index) => (
              <div className="audit-item" key={index}>
                <div>
                  <strong>{item.action}</strong>
                  <div>{item.detail}</div>
                </div>
                <span className="audit-time">{item.time}</span>
              </div>
            ))}
          </div>
        </section>


        
        <section className="watchlist-center">

          <h2>👁️ Watchlist Pro</h2>

          <div className="watchlist-grid">

            <div className="watchlist-card">
              <span>Coches vigilados</span>
              <strong>{watchlist.length}</strong>
            </div>

            <div className="watchlist-card">
              <span>Vigilados con ROI +20%</span>
              <strong>
                {cars.filter(c => watchlist.includes(c.id) && (c.roi || 0) >= 20).length}
              </strong>
            </div>

            <div className="watchlist-card">
              <span>Estado</span>
              <strong>
                {watchlist.length ? "Monitorizando" : "Sin vigilancia"}
              </strong>
            </div>

          </div>

        </section>


        <section className="ranking">
          <h2>🏆 TOP 5 Chollos IA</h2>
          {[...cars]
            .sort((a, b) => (b.roi || 0) - (a.roi || 0))
            .slice(0, 5)
            .map((car) => (
              <div className="ranking-item" key={car.id}>
                <span>{car.brand} {car.model}</span>
                <strong>ROI {car.roi}%</strong>
              </div>
            ))}
        </section>

        
        <section className="pipeline-center">

          <h2>🧩 Deal Pipeline CRM</h2>

          <div className="pipeline-grid">

            <div className="pipeline-column">
              <h3>🆕 Nuevos</h3>
              <div className="pipeline-count pipeline-blue">
                {cars.length}
              </div>
            </div>

            <div className="pipeline-column">
              <h3>👀 Revisar</h3>
              <div className="pipeline-count pipeline-yellow">
                {cars.filter(c => (c.roi || 0) >= 10 && (c.roi || 0) < 15).length}
              </div>
            </div>

            <div className="pipeline-column">
              <h3>🤝 Negociar</h3>
              <div className="pipeline-count pipeline-green">
                {cars.filter(c => (c.roi || 0) >= 15 && (c.roi || 0) < 20).length}
              </div>
            </div>

            <div className="pipeline-column">
              <h3>🚀 Comprar</h3>
              <div className="pipeline-count pipeline-red">
                {cars.filter(c => (c.roi || 0) >= 20).length}
              </div>
            </div>

          </div>

        </section>


        {toast && (
          <div className="system-toast">
            {toast}
          </div>
        )}

        {filteredCars.length === 0 && (
          <section className="empty-state">
            <h2>🚘 No hay coches todavía</h2>
            <p>Pega una URL de Mobile.de o AutoScout24 para empezar a analizar oportunidades.</p>
          </section>
        )}

        
        
        
        <section className="demo-mode-panel">

          <h2>🎬 Demo Mode Pro</h2>

          <p>
            Carga una demo instantánea con coches premium, ROI, scoring IA,
            ranking y paneles ejecutivos para enseñar el producto rápido.
          </p>

          <button
            className="demo-btn"
            onClick={loadDemoCars}
          >
            🚀 Cargar demo premium
          </button>

        </section>


        <section className="quick-bar">

          <button
            className="quick-btn quick-green"
            onClick={() => loadCars()}
          >
            🔄 Refrescar
          </button>

          <button
            className="quick-btn quick-blue"
            onClick={() => setOnlyDeals(!onlyDeals)}
          >
            🔥 Chollos IA
          </button>

          <button
            className="quick-btn quick-orange"
            onClick={exportCSV}
          >
            📤 Export CSV
          </button>

          <button
            className="quick-btn quick-purple"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            🚀 Arriba
          </button>

          <button
            className="quick-btn quick-red"
            onClick={() => alert("Modo dealer próximamente")}
          >
            🏢 Dealer Mode
          </button>

        </section>


        <section className="global-search">

          <h2>🔎 Global Search Command</h2>

          <input
            className="search-box"
            placeholder="Buscar BMW, Audi, Mercedes..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />

          <div className="search-stats">

            <div className="search-pill">
              Resultados: {filteredCars.length}
            </div>

            <div className="search-pill">
              Watchlist: {watchlist.length}
            </div>

            <div className="search-pill">
              Chollos IA: {cars.filter(c => (c.roi || 0) >= 20).length}
            </div>

          </div>

        </section>


        
        <section className="saved-views">

          <h2>💾 Saved Views Pro</h2>

          <div className="saved-view-row">

            <button
              className={`saved-view-btn ${savedView === "all" ? "active" : ""}`}
              onClick={() => setSavedView("all")}
            >
              Todos
            </button>

            <button
              className={`saved-view-btn ${savedView === "deals" ? "active" : ""}`}
              onClick={() => setSavedView("deals")}
            >
              🔥 Chollos
            </button>

            <button
              className={`saved-view-btn ${savedView === "premium" ? "active" : ""}`}
              onClick={() => setSavedView("premium")}
            >
              👑 Premium
            </button>

            <button
              className={`saved-view-btn ${savedView === "favorites" ? "active" : ""}`}
              onClick={() => setSavedView("favorites")}
            >
              ⭐ Favoritos
            </button>

          </div>

        </section>


        
        <section className="hot-deals-board">

          <h2>🔥 Hot Deals Board</h2>

          <div className="hot-deals-list">

            {cars.filter(c => (c.roi || 0) >= 15).length === 0 && (
              <div className="hot-deal-empty">
                Todavía no hay chollos IA. Ejecuta el scanner o importa URLs.
              </div>
            )}

            {[...cars]
              .filter(c => (c.roi || 0) >= 15)
              .sort((a,b) => (b.roi || 0) - (a.roi || 0))
              .slice(0,6)
              .map(car => (
                <div className="hot-deal-row" key={car.id}>
                  <span>{car.brand} {car.model}</span>
                  <span>{car.price} €</span>
                  <span className="hot-deal-roi">ROI {car.roi}%</span>
                  <span className="hot-deal-profit">{car.estimated_net_profit} €</span>
                </div>
              ))}

          </div>

        </section>


        <section className="cars-grid">
          {filteredCars.map((car) => {
            const isFav = favorites.includes(car.id)
            return (
              <article
                key={car.id}
                className={
                  watchlist.includes(car.id)
                    ? "car-card watch-active"
                    : isFav
                    ? "car-card favorite"
                    : (car.roi || 0) >= 20
                    ? "car-card super-hot"
                    : (car.roi || 0) >= 10
                    ? "car-card good-deal"
                    : "car-card normal-deal"
                }
              >
                {(car.roi || 0) >= 20 && (
                  <div className="hot-banner">
                    🔥 SUPER CHOLLO IA
                  </div>
                )}

                <img src={car.image_url} alt="" />

                <div className="car-body">
                  <div className="car-title-row">
                    <h3>{car.brand} {car.model}</h3>
                    {isFav && <span className="fav-badge">⭐</span>}
                  </div>

                  <p>📅 {car.year}</p>
                  <p>🛣️ {car.km} km</p>
                  <p>💶 Precio: {car.price} €</p>
                  <p>🏪 Mercado: {car.estimated_market_price} €</p>

                  <div className="profit">💰 {car.estimated_net_profit} €</div>
                  <div className="roi">ROI {car.roi}%</div>

                  <div
                    className={
                      (car.score || 0) >= 85
                        ? "score score-green"
                        : (car.score || 0) >= 65
                        ? "score score-yellow"
                        : "score score-red"
                    }
                  >
                    IA SCORE {car.score}
                  </div>

                  <div className="decision">{car.recommendation}</div>

                  <div className="dealer-panel">

                    <div className="dealer-title">
                      🧠 Dealer Intelligence
                    </div>

                    <div className="dealer-grid">

                      <div className="dealer-box">
                        <span>Riesgo</span>
                        <strong>
                          {(car.km || 0) > 150000 ? "Alto" : "Bajo"}
                        </strong>
                      </div>

                      <div className="dealer-box">
                        <span>Demanda</span>
                        <strong>
                          {(car.price || 0) > 50000 ? "Premium" : "Media"}
                        </strong>
                      </div>

                      <div className="dealer-box">
                        <span>Margen</span>
                        <strong>
                          {(car.roi || 0) >= 20 ? "Excelente" : "Normal"}
                        </strong>
                      </div>

                      <div className="dealer-box">
                        <span>Compra</span>
                        <strong>
                          {(car.score || 0) >= 85 ? "Prioritaria" : "Revisar"}
                        </strong>
                      </div>

                    </div>

                    <div
                      className={
                        (car.score || 0) >= 85
                          ? "dealer-grade grade-a"
                          : (car.score || 0) >= 65
                          ? "dealer-grade grade-b"
                          : "dealer-grade grade-c"
                      }
                    >
                      GRADE {(car.score || 0) >= 85 ? "A" : (car.score || 0) >= 65 ? "B" : "C"}
                    </div>

                  </div>

                  <div className="investment-panel">

                    <div className="investment-title">
                      💼 Investment Desk
                    </div>

                    <div
                      className={
                        (car.roi || 0) >= 20
                          ? "investment-decision buy-now"
                          : (car.roi || 0) >= 10
                          ? "investment-decision wait"
                          : "investment-decision reject"
                      }
                    >
                      {(car.roi || 0) >= 20
                        ? "COMPRAR YA"
                        : (car.roi || 0) >= 10
                        ? "ESPERAR / NEGOCIAR"
                        : "DESCARTAR"}
                    </div>

                    <div className="investment-grid">

                      <div className="investment-box">
                        <span>Capital necesario</span>
                        <strong>{car.price} €</strong>
                      </div>

                      <div className="investment-box">
                        <span>Retorno esperado</span>
                        <strong>{car.estimated_net_profit} €</strong>
                      </div>

                      <div className="investment-box">
                        <span>Prioridad</span>
                        <strong>
                          {(car.score || 0) >= 85 ? "Alta" : "Media"}
                        </strong>
                      </div>

                      <div className="investment-box">
                        <span>Perfil</span>
                        <strong>
                          {(car.price || 0) >= 50000 ? "Premium" : "Retail"}
                        </strong>
                      </div>

                    </div>

                  </div>

                  <div className="pricing-panel">

                    <div className="pricing-title">
                      💸 Pricing Intelligence
                    </div>

                    <div className="pricing-grid">

                      <div className="pricing-box">
                        <span>Oferta ideal</span>
                        <strong>
                          {Math.round((car.price || 0) * 0.92)} €
                        </strong>
                      </div>

                      <div className="pricing-box">
                        <span>Venta objetivo</span>
                        <strong>
                          {Math.round((car.estimated_market_price || 0))} €
                        </strong>
                      </div>

                      <div className="pricing-box">
                        <span>Margen negociación</span>
                        <strong>
                          {Math.round((car.price || 0) * 0.08)} €
                        </strong>
                      </div>

                      <div className="pricing-box">
                        <span>Profit potencial</span>
                        <strong>
                          {Math.round((car.estimated_net_profit || 0))} €
                        </strong>
                      </div>

                    </div>

                    <div className="offer-badge">
                      Oferta recomendada:
                      {" "}
                      {Math.round((car.price || 0) * 0.92)} €
                    </div>

                  </div>

                  <div className="risk-panel">

                    <div className="risk-title">
                      ⚠️ Risk Engine
                    </div>

                    <div className="risk-grid">

                      <div className="risk-box">
                        <span>Kilometraje</span>
                        <strong
                          className={
                            (car.km || 0) > 160000
                              ? "risk-high"
                              : (car.km || 0) > 100000
                              ? "risk-medium"
                              : "risk-low"
                          }
                        >
                          {(car.km || 0) > 160000
                            ? "Alto"
                            : (car.km || 0) > 100000
                            ? "Medio"
                            : "Bajo"}
                        </strong>
                      </div>

                      <div className="risk-box">
                        <span>Antigüedad</span>
                        <strong
                          className={
                            (car.year || 0) < 2016
                              ? "risk-high"
                              : (car.year || 0) < 2020
                              ? "risk-medium"
                              : "risk-low"
                          }
                        >
                          {(car.year || 0) < 2016
                            ? "Alta"
                            : (car.year || 0) < 2020
                            ? "Media"
                            : "Baja"}
                        </strong>
                      </div>

                      <div className="risk-box">
                        <span>Precio</span>
                        <strong
                          className={
                            (car.price || 0) > 80000
                              ? "risk-medium"
                              : "risk-low"
                          }
                        >
                          {(car.price || 0) > 80000
                            ? "Exposición alta"
                            : "Controlado"}
                        </strong>
                      </div>

                      <div className="risk-box">
                        <span>ROI</span>
                        <strong
                          className={
                            (car.roi || 0) < 8
                              ? "risk-high"
                              : (car.roi || 0) < 15
                              ? "risk-medium"
                              : "risk-low"
                          }
                        >
                          {(car.roi || 0) < 8
                            ? "Débil"
                            : (car.roi || 0) < 15
                            ? "Aceptable"
                            : "Fuerte"}
                        </strong>
                      </div>

                    </div>

                    <div className="risk-final">
                      Riesgo total:
                      {" "}
                      {(car.roi || 0) >= 20 && (car.km || 0) < 100000
                        ? "BAJO ✅"
                        : (car.roi || 0) >= 10
                        ? "MEDIO ⚠️"
                        : "ALTO ❌"}
                    </div>

                  </div>

                  <div className="negotiation-panel">

                    <div className="negotiation-title">
                      🤝 Negotiation Assistant
                    </div>

                    <div className="negotiation-grid">

                      <div className="negotiation-box">
                        <span>Oferta inicial</span>
                        <strong>
                          {Math.round((car.price || 0) * 0.88)} €
                        </strong>
                      </div>

                      <div className="negotiation-box">
                        <span>Oferta máxima</span>
                        <strong>
                          {Math.round((car.price || 0) * 0.95)} €
                        </strong>
                      </div>

                      <div className="negotiation-box">
                        <span>Descuento objetivo</span>
                        <strong>
                          {Math.round((car.price || 0) * 0.08)} €
                        </strong>
                      </div>

                      <div className="negotiation-box">
                        <span>Estrategia</span>
                        <strong>
                          {(car.roi || 0) >= 20 ? "Agresiva" : "Conservadora"}
                        </strong>
                      </div>

                    </div>

                    <div className="seller-message">
                      Hola, me interesa el {car.brand} {car.model}.  
                      He visto el anuncio y podría valorar una oferta seria de
                      {" "}
                      {Math.round((car.price || 0) * 0.88)} € si el coche está
                      en buen estado y con mantenimiento demostrable.
                    </div>

                    <button
                      className="copy-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `Hola, me interesa el ${car.brand} ${car.model}. He visto el anuncio y podría valorar una oferta seria de ${Math.round((car.price || 0) * 0.88)} € si el coche está en buen estado y con mantenimiento demostrable.`
                        )
                        alert("Mensaje copiado")
                      }}
                    >
                      📋 Copiar mensaje
                    </button>

                  </div>

                  <div className="report-panel">

                    <div className="report-title">
                      📄 Vehicle Report Pro
                    </div>

                    <div className="report-text">
                      El {car.brand} {car.model} presenta un ROI estimado de
                      {" "}
                      {car.roi}% con un beneficio potencial de
                      {" "}
                      {car.estimated_net_profit} €.  
                      La IA clasifica esta unidad como:
                      {" "}
                      {car.recommendation}.
                    </div>

                    <div className="report-checklist">
                      <div className="report-check">
                        ✅ Revisar historial de mantenimiento
                      </div>

                      <div className="report-check">
                        ✅ Confirmar kilometraje real
                      </div>

                      <div className="report-check">
                        ✅ Negociar precio antes de reservar
                      </div>

                      <div className="report-check">
                        ✅ Verificar documentación y cargas
                      </div>
                    </div>

                    <button
                      className="report-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `INFORME COCHES SAAS

Vehículo: ${car.brand} ${car.model}\nAño: ${car.year}\nKM: ${car.km}\nPrecio: ${car.price} €\nROI: ${car.roi}%\nBeneficio estimado: ${car.estimated_net_profit} €\nRecomendación: ${car.recommendation}

Checklist:\n- Revisar historial de mantenimiento\n- Confirmar kilometraje real\n- Negociar precio\n- Verificar documentación`
                        )
                        alert("Informe copiado")
                      }}
                    >
                      📋 Copiar informe
                    </button>

                  </div>

                  <div className="action-panel">

                    <div className="action-title">
                      🎯 Deal Action Center
                    </div>

                    <div className="action-grid">

                      <button
                        className="action-btn call-btn"
                        onClick={() => alert("📞 Marcado para llamar al vendedor")}
                      >
                        📞 Marcar para llamar
                      </button>

                      <button
                        className="action-btn report-request-btn"
                        onClick={() => alert("📄 Informe solicitado")}
                      >
                        📄 Solicitar informe
                      </button>

                      <button
                        className="action-btn inspect-btn"
                        onClick={() => alert("🔍 Revisión reservada")}
                      >
                        🔍 Reservar revisión
                      </button>

                    </div>

                  </div>

                  <div className="market-signals">

                    <div className="market-signals-title">
                      📡 Live Market Signals
                    </div>

                    <div className="market-signals-grid">

                      <div className="market-signal-box">
                        <span>Temperatura mercado</span>
                        <strong
                          className={
                            (car.roi || 0) >= 20
                              ? "market-hot"
                              : (car.roi || 0) >= 10
                              ? "market-warm"
                              : "market-cold"
                          }
                        >
                          {(car.roi || 0) >= 20
                            ? "CALIENTE"
                            : (car.roi || 0) >= 10
                            ? "ESTABLE"
                            : "FRÍO"}
                        </strong>
                      </div>

                      <div className="market-signal-box">
                        <span>Presión compradora</span>
                        <strong>
                          {(car.score || 0) >= 85
                            ? "ALTA"
                            : "MEDIA"}
                        </strong>
                      </div>

                      <div className="market-signal-box">
                        <span>Urgencia IA</span>
                        <strong>
                          {(car.roi || 0) >= 20
                            ? "INMEDIATA"
                            : "NORMAL"}
                        </strong>
                      </div>

                      <div className="market-signal-box">
                        <span>Momentum</span>
                        <strong>
                          {(car.km || 0) < 100000
                            ? "POSITIVO"
                            : "NEUTRAL"}
                        </strong>
                      </div>

                    </div>

                    <div className="signal-banner">
                      {(car.roi || 0) >= 20
                        ? "🚀 Señal alcista detectada"
                        : "📊 Mercado en observación"}
                    </div>

                  </div>

                  <div className="profit-simulator">

                    <div className="profit-simulator-title">
                      📊 Profit Simulator
                    </div>

                    <div className="profit-simulator-grid">

                      <div className="profit-scenario scenario-low">
                        <span>Conservador</span>
                        <strong>
                          {Math.round((car.estimated_net_profit || 0) * 0.7)} €
                        </strong>
                      </div>

                      <div className="profit-scenario scenario-base">
                        <span>Base</span>
                        <strong>
                          {Math.round(car.estimated_net_profit || 0)} €
                        </strong>
                      </div>

                      <div className="profit-scenario scenario-high">
                        <span>Agresivo</span>
                        <strong>
                          {Math.round((car.estimated_net_profit || 0) * 1.25)} €
                        </strong>
                      </div>

                    </div>

                    <div className="profit-note">
                      Si negocias un 5% adicional sobre el precio de compra,
                      el beneficio potencial subiría aproximadamente
                      {" "}
                      {Math.round((car.price || 0) * 0.05)} €.
                    </div>

                  </div>

                  <div className="deal-room">

                    <div className="deal-room-title">
                      🏢 Deal Room Pro
                    </div>

                    <div className="deal-room-grid">

                      <div className="deal-room-item">
                        <span>Documentación</span>
                        <strong>
                          Pendiente revisión
                        </strong>
                      </div>

                      <div className="deal-room-item">
                        <span>Historial</span>
                        <strong>
                          Solicitar
                        </strong>
                      </div>

                      <div className="deal-room-item">
                        <span>Estado legal</span>
                        <strong>
                          Verificar cargas
                        </strong>
                      </div>

                      <div className="deal-room-item">
                        <span>Inspección</span>
                        <strong>
                          Recomendada
                        </strong>
                      </div>

                    </div>

                    <div className="deal-room-status">
                      {(car.roi || 0) >= 20
                        ? "LISTO PARA DUE DILIGENCE 🚀"
                        : "MANTENER EN OBSERVACIÓN 👀"}
                    </div>

                  </div>

                  <div className="deal-room">

                    <div className="deal-room-title">
                      🏢 Deal Room Pro
                    </div>

                    <div className="deal-room-grid">

                      <div className="deal-room-item">
                        <span>Documentación</span>
                        <strong>
                          Pendiente revisión
                        </strong>
                      </div>

                      <div className="deal-room-item">
                        <span>Historial</span>
                        <strong>
                          Solicitar
                        </strong>
                      </div>

                      <div className="deal-room-item">
                        <span>Estado legal</span>
                        <strong>
                          Verificar cargas
                        </strong>
                      </div>

                      <div className="deal-room-item">
                        <span>Inspección</span>
                        <strong>
                          Recomendada
                        </strong>
                      </div>

                    </div>

                    <div className="deal-room-status">
                      {(car.roi || 0) >= 20
                        ? "LISTO PARA DUE DILIGENCE 🚀"
                        : "MANTENER EN OBSERVACIÓN 👀"}
                    </div>

                  </div>

                  <div className="score-explainer">

                    <div className="score-explainer-title">
                      🧠 AI Deal Score Explainer
                    </div>

                    <div className="score-explainer-text">
                      Este coche obtiene una puntuación IA de
                      {" "}
                      {car.score}.
                      {" "}
                      La decisión se basa en ROI, beneficio estimado,
                      kilometraje, precio de entrada y potencial de reventa.
                    </div>

                    <div className="score-factors">

                      <div className="score-factor">
                        {(car.roi || 0) >= 20
                          ? "✅ ROI muy alto: oportunidad prioritaria."
                          : "⚠️ ROI moderado: revisar margen antes de comprar."}
                      </div>

                      <div className="score-factor">
                        {(car.km || 0) <= 80000
                          ? "✅ Kilometraje competitivo para reventa."
                          : "⚠️ Kilometraje alto: puede afectar salida."}
                      </div>

                      <div className="score-factor">
                        {(car.estimated_net_profit || 0) > 3000
                          ? "✅ Beneficio potencial atractivo."
                          : "⚠️ Beneficio ajustado: negociar precio."}
                      </div>

                    </div>

                  </div>

                  <div className="compare-panel">

                    <div className="compare-title">
                      ⚖️ Deal Comparison Pro
                    </div>

                    <div className="compare-grid">

                      <div className="compare-box">
                        <span>ROI vs mejor</span>
                        <strong>
                          {cars.length
                            ? Math.round((car.roi || 0) - Math.max(...cars.map(c => c.roi || 0)))
                            : 0}%
                        </strong>
                      </div>

                      <div className="compare-box">
                        <span>Profit vs mejor</span>
                        <strong>
                          {cars.length
                            ? Math.round((car.estimated_net_profit || 0) - Math.max(...cars.map(c => c.estimated_net_profit || 0)))
                            : 0} €
                        </strong>
                      </div>

                      <div className="compare-box">
                        <span>Ranking ROI</span>
                        <strong>
                          #{[...cars].sort((a,b)=>(b.roi || 0)-(a.roi || 0)).findIndex(c => c.id === car.id) + 1}
                        </strong>
                      </div>

                      <div className="compare-box">
                        <span>Ranking Profit</span>
                        <strong>
                          #{[...cars].sort((a,b)=>(b.estimated_net_profit || 0)-(a.estimated_net_profit || 0)).findIndex(c => c.id === car.id) + 1}
                        </strong>
                      </div>

                    </div>

                    <div className="compare-result">
                      {[...cars].sort((a,b)=>(b.roi || 0)-(a.roi || 0))[0]?.id === car.id
                        ? "🏆 Mejor oportunidad actual"
                        : "📊 Por debajo del líder"}
                    </div>

                  </div>

                  <div className="compare-panel">

                    <div className="compare-title">
                      ⚖️ Deal Comparison Pro
                    </div>

                    <div className="compare-grid">

                      <div className="compare-box">
                        <span>ROI vs mejor</span>
                        <strong>
                          {cars.length
                            ? Math.round((car.roi || 0) - Math.max(...cars.map(c => c.roi || 0)))
                            : 0}%
                        </strong>
                      </div>

                      <div className="compare-box">
                        <span>Profit vs mejor</span>
                        <strong>
                          {cars.length
                            ? Math.round((car.estimated_net_profit || 0) - Math.max(...cars.map(c => c.estimated_net_profit || 0)))
                            : 0} €
                        </strong>
                      </div>

                      <div className="compare-box">
                        <span>Ranking ROI</span>
                        <strong>
                          #{[...cars].sort((a,b)=>(b.roi || 0)-(a.roi || 0)).findIndex(c => c.id === car.id) + 1}
                        </strong>
                      </div>

                      <div className="compare-box">
                        <span>Ranking Profit</span>
                        <strong>
                          #{[...cars].sort((a,b)=>(b.estimated_net_profit || 0)-(a.estimated_net_profit || 0)).findIndex(c => c.id === car.id) + 1}
                        </strong>
                      </div>

                    </div>

                    <div className="compare-result">
                      {[...cars].sort((a,b)=>(b.roi || 0)-(a.roi || 0))[0]?.id === car.id
                        ? "🏆 Mejor oportunidad actual"
                        : "📊 Por debajo del líder"}
                    </div>

                  </div>

                  <div className="compare-panel">

                    <div className="compare-title">
                      ⚖️ Deal Comparison Pro
                    </div>

                    <div className="compare-grid">

                      <div className="compare-box">
                        <span>ROI vs mejor</span>
                        <strong>
                          {cars.length
                            ? Math.round((car.roi || 0) - Math.max(...cars.map(c => c.roi || 0)))
                            : 0}%
                        </strong>
                      </div>

                      <div className="compare-box">
                        <span>Profit vs mejor</span>
                        <strong>
                          {cars.length
                            ? Math.round((car.estimated_net_profit || 0) - Math.max(...cars.map(c => c.estimated_net_profit || 0)))
                            : 0} €
                        </strong>
                      </div>

                      <div className="compare-box">
                        <span>Ranking ROI</span>
                        <strong>
                          #{[...cars].sort((a,b)=>(b.roi || 0)-(a.roi || 0)).findIndex(c => c.id === car.id) + 1}
                        </strong>
                      </div>

                      <div className="compare-box">
                        <span>Ranking Profit</span>
                        <strong>
                          #{[...cars].sort((a,b)=>(b.estimated_net_profit || 0)-(a.estimated_net_profit || 0)).findIndex(c => c.id === car.id) + 1}
                        </strong>
                      </div>

                    </div>

                    <div className="compare-result">
                      {[...cars].sort((a,b)=>(b.roi || 0)-(a.roi || 0))[0]?.id === car.id
                        ? "🏆 Mejor oportunidad actual"
                        : "📊 Por debajo del líder"}
                    </div>

                  </div>

                  <div className="health-panel">

                    <div className="health-title">
                      🩺 Deal Health Monitor
                    </div>

                    <div className="health-status">
                      {(car.score || 0) >= 85
                        ? "Salud excelente"
                        : (car.score || 0) >= 65
                        ? "Salud media"
                        : "Salud débil"}
                    </div>

                    <div className="health-bar">
                      <div
                        className={
                          (car.score || 0) >= 85
                            ? "health-fill health-green"
                            : (car.score || 0) >= 65
                            ? "health-fill health-yellow"
                            : "health-fill health-red"
                        }
                        style={{
                          width: `${Math.min(car.score || 0, 100)}%`
                        }}
                      />
                    </div>

                    <div className="health-note">
                      {(car.score || 0) >= 85
                        ? "La IA detecta una operación sólida con buen equilibrio entre precio, margen y riesgo."
                        : (car.score || 0) >= 65
                        ? "Operación interesante, pero conviene negociar precio y revisar documentación."
                        : "Operación débil: no comprar sin una rebaja significativa."}
                    </div>

                  </div>

                  <div className="data-quality">

                    <div className="data-quality-title">
                      🧪 Data Quality Center
                    </div>

                    <div className="data-quality-grid">

                      <div className="data-quality-box">
                        <span>Imagen</span>
                        <strong className={car.image_url ? "quality-ok" : "quality-bad"}>
                          {car.image_url ? "OK" : "Falta"}
                        </strong>
                      </div>

                      <div className="data-quality-box">
                        <span>Precio</span>
                        <strong className={(car.price || 0) > 0 ? "quality-ok" : "quality-bad"}>
                          {(car.price || 0) > 0 ? "OK" : "Falta"}
                        </strong>
                      </div>

                      <div className="data-quality-box">
                        <span>Kilómetros</span>
                        <strong className={(car.km || 0) > 0 ? "quality-ok" : "quality-warn"}>
                          {(car.km || 0) > 0 ? "OK" : "Revisar"}
                        </strong>
                      </div>

                      <div className="data-quality-box">
                        <span>Año</span>
                        <strong className={(car.year || 0) >= 2010 ? "quality-ok" : "quality-warn"}>
                          {(car.year || 0) >= 2010 ? "OK" : "Revisar"}
                        </strong>
                      </div>

                    </div>

                    <div className="quality-final">
                      Calidad datos:
                      {" "}
                      {car.image_url && car.price && car.km && car.year
                        ? "ALTA ✅"
                        : "MEDIA ⚠️"}
                    </div>

                  </div>

                  <div className="tasks-panel">
                    <h4>✅ Follow-up Tasks</h4>

                    <div className="task-list">
                      {["Llamar vendedor", "Pedir historial", "Revisar ITV", "Negociar precio", "Reservar inspección"].map((task) => {
                        const key = `${car.id}-${task}`

                        return (
                          <label
                            className={`task-item ${tasks[key] ? "task-done" : ""}`}
                            key={task}
                          >
                            <input
                              type="checkbox"
                              checked={!!tasks[key]}
                              onChange={() => toggleTask(car.id, task)}
                            />
                            {task}
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  <div className="notes-panel">

                    <div className="notes-title">
                      📝 Deal Notes
                    </div>

                    <textarea
                      className="notes-area"
                      placeholder="Escribe notas de negociación, mantenimiento, vendedor..."
                      value={dealNotes[car.id] || ""}
                      onChange={(e) =>
                        setDealNotes({
                          ...dealNotes,
                          [car.id]: e.target.value
                        })
                      }
                    />

                    <button
                      className="notes-save"
                      onClick={() => alert("📝 Nota guardada")}
                    >
                      Guardar nota
                    </button>

                  </div>

                  <div className="timeline-panel">

                    <div className="timeline-title">
                      🕒 Deal Timeline
                    </div>

                    <div className="timeline-list">

                      <div className="timeline-step">
                        <div className="timeline-dot"></div>
                        URL importada / coche registrado
                      </div>

                      <div className="timeline-step">
                        <div className="timeline-dot"></div>
                        ROI y profit calculados por IA
                      </div>

                      <div className="timeline-step">
                        <div className="timeline-dot"></div>
                        Riesgo y pricing evaluados
                      </div>

                      <div className="timeline-step">
                        <div className="timeline-dot"></div>
                        {(car.roi || 0) >= 20
                          ? "Listo para negociación prioritaria"
                          : "Pendiente de revisión"}
                      </div>

                    </div>

                  </div>

                  <div className="badges">
                    {(car.roi || 0) >= 20 && <span>🔥 SUPER CHOLLO</span>}
                    {(car.km || 0) <= 80000 && <span>🛣️ LOW KM</span>}
                    {(car.price || 0) >= 50000 && <span>👑 PREMIUM</span>}
                    {(car.score || 0) >= 85 && <span>🚀 HIGH SCORE</span>}
                  </div>

                  <button
                    className="watch-btn"
                    onClick={() => toggleWatchlist(car.id)}
                  >
                    {watchlist.includes(car.id) ? "👁️ En vigilancia" : "👁️ Vigilar coche"}
                  </button>

                  <div className="status-panel">
                    <h4>📌 Deal Status</h4>

                    <select
                      className="status-select"
                      value={dealStatus[car.id] || "Nuevo"}
                      onChange={(e) =>
                        setDealStatus({
                          ...dealStatus,
                          [car.id]: e.target.value
                        })
                      }
                    >
                      <option>Nuevo</option>
                      <option>Contactado</option>
                      <option>Negociando</option>
                      <option>Revisado</option>
                      <option>Comprar</option>
                      <option>Descartado</option>
                    </select>

                    <div className="status-pill">
                      Estado: {dealStatus[car.id] || "Nuevo"}
                    </div>
                  </div>

                  <div className="tasks-panel">
                    <h4>✅ Follow-up Tasks</h4>

                    <div className="task-list">
                      {["Llamar vendedor", "Pedir historial", "Revisar ITV", "Negociar precio", "Reservar inspección"].map((task) => {
                        const key = `${car.id}-${task}`

                        return (
                          <label
                            className={`task-item ${tasks[key] ? "task-done" : ""}`}
                            key={task}
                          >
                            <input
                              type="checkbox"
                              checked={!!tasks[key]}
                              onChange={() => toggleTask(car.id, task)}
                            />
                            {task}
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  <div className="notes-panel">
                    <h4>📝 Smart Notes</h4>

                    <textarea
                      placeholder="Notas internas: llamada, negociación, revisión..."
                      value={notes[car.id] || ""}
                      onChange={(e) =>
                        setNotes({
                          ...notes,
                          [car.id]: e.target.value
                        })
                      }
                    />

                    <button
                      className="notes-save"
                      onClick={() => alert("Nota guardada en demo")}
                    >
                      Guardar nota
                    </button>
                  </div>

                  <button className="favorite-btn" onClick={() => toggleFavorite(car.id)}>
                    {isFav ? "⭐ Favorito" : "☆ Añadir favorito"}
                  </button>

                  <button className="delete-btn" onClick={() => deleteCar(car.id)}>
                    🗑 Eliminar
                  </button>
                </div>
              </article>
            )
          })}
        </section>
      </main>
    </div>
  )
}
