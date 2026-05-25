import { useEffect, useState } from "react"
import "./App.css"
import Auth from "./Auth"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar
} from "recharts"

const API_URL = "http://127.0.0.1:8000"

export default function App() {

  const [user, setUser] = useState(
    localStorage.getItem("email")
  )

  const [cars, setCars] = useState([])

  const [url, setUrl] = useState("")

  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState("")

  const [onlyDeals, setOnlyDeals] =
    useState(false)

  const [sortBy, setSortBy] =
    useState("roi")

  const loadCars = async () => {

    const res = await fetch(
      `${API_URL}/cars/dashboard`
    )

    const data = await res.json()

    setCars(data.top_deals || [])
  }

  useEffect(() => {

    if(user){
      loadCars()
    }

  }, [user])

  const logout = () => {

    localStorage.clear()

    setUser(null)
  }

  const runRadar = async () => {
    setLoading(true)

    await fetch(`${API_URL}/cars/radar-demo`, {
      method: "POST"
    })

    await loadCars()

    setLoading(false)
  }

  const importCar = async () => {

    if(!url){
      return
    }

    setLoading(true)

    await fetch(
      `${API_URL}/cars/import-url`,
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          url
        })
      }
    )

    setUrl("")

    await loadCars()

    setLoading(false)
  }

  const toggleFavorite = (id) => {

    setCars(
      cars.map(car =>
        car.id === id
          ? {
              ...car,
              favorite: !car.favorite
            }
          : car
      )
    )
  }

  const deleteCar = async(id) => {

    await fetch(
      `${API_URL}/cars/${id}`,
      {
        method:"DELETE"
      }
    )

    await loadCars()
  }

  if(!user){
    return (
      <Auth onLogin={setUser} />
    )
  }

  const filteredCars =
    cars
      .filter(car =>
        `${car.brand} ${car.model}`
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
      )
      .filter(car =>
        onlyDeals
          ? car.roi >= 15
          : true
      )
      .sort((a,b)=>{

        if(sortBy === "roi"){
          return b.roi - a.roi
        }

        if(sortBy === "profit"){
          return (
            (b.estimated_net_profit || 0)
            -
            (a.estimated_net_profit || 0)
          )
        }

        if(sortBy === "price"){
          return b.price - a.price
        }

        return 0
      })

  return (

    <div className="app">

      <aside className="sidebar">

        <h1>
          🚘 Coches SaaS
        </h1>

        <button>
          📊 Dashboard
        </button>

        <button>
          🔥 Chollos IA
        </button>

        <button>
          🔗 Importador
        </button>

        <button>
          💰 ROI
        </button>

        <button>
          ⚙️ Ajustes
        </button>

        <button
          className="logout"
          onClick={logout}
        >
          Cerrar sesión
        </button>

      </aside>

      <main className="main">

        <div className="hero">

          <h2>
            Motor IA profesional
          </h2>

          <p>
            Detecta oportunidades
            automáticas de compraventa
          </p>

        </div>

        <div className="kpi-grid">

          <div className="kpi-card">
            <span>Total coches</span>
            <h3>{cars.length}</h3>
          </div>

          <div className="kpi-card">
            <span>Chollos IA</span>
            <h3>
              {
                cars.filter(
                  car => car.roi >= 15
                ).length
              }
            </h3>
          </div>

          <div className="kpi-card">
            <span>Profit total</span>
            <h3>
              {
                cars.reduce(
                  (s,car)=>
                    s +
                    (
                      car.estimated_net_profit
                      || 0
                    ),
                  0
                )
              } €
            </h3>
          </div>

          <div className="kpi-card">
            <span>ROI medio</span>
            <h3>
              {
                cars.length
                ? (
                    cars.reduce(
                      (s,car)=>
                        s + (car.roi || 0),
                      0
                    )
                    /
                    cars.length
                  ).toFixed(1)
                : 0
              }%
            </h3>
          </div>

        </div>

        <div className="charts-grid">

          <div className="chart-card">

            <h2>
              📈 ROI
            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <LineChart data={cars}>

                <XAxis dataKey="brand" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="roi"
                  stroke="#22c55e"
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

          <div className="chart-card">

            <h2>
              💰 Profit
            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <BarChart data={cars}>

                <XAxis dataKey="brand" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="estimated_net_profit"
                  fill="#3b82f6"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        <div className="ranking-box">

          <h2>
            🏆 TOP 5 Chollos IA
          </h2>

          {
            [...cars]
              .sort(
                (a,b)=>b.roi-a.roi
              )
              .slice(0,5)
              .map(car => (

                <div
                  className="ranking-item"
                  key={car.id}
                >

                  <span>
                    {car.brand} {car.model}
                  </span>

                  <span>
                    ROI {car.roi}%
                  </span>

                </div>
              ))
          }

        </div>

        <button
          className="analyze-btn"
          onClick={runRadar}
        >
          🚨 EJECUTAR RADAR IA
        </button>

        
        <div className="alert-panel">
          <h2>🚨 Radar IA de oportunidades</h2>

          <div className="alert-grid">
            <div className="alert-card">
              <span>Mejor ROI</span>
              <strong>
                {cars.length ? Math.max(...cars.map(car => car.roi || 0)) : 0}%
              </strong>
            </div>

            <div className="alert-card">
              <span>Mayor beneficio</span>
              <strong>
                {cars.length ? Math.max(...cars.map(car => car.estimated_net_profit || 0)) : 0} €
              </strong>
            </div>

            <div className="alert-card">
              <span>Chollos fuertes</span>
              <strong>
                {cars.filter(car => (car.roi || 0) >= 20).length}
              </strong>
            </div>

            <div className="alert-card">
              <span>Estado IA</span>
              <strong>
                {cars.some(car => (car.roi || 0) >= 20) ? "🔥 Comprar ya" : "Buscando..."}
              </strong>
            </div>
          </div>
        </div>

        <div className="import-box">

          <input
            value={url}
            onChange={(e)=>
              setUrl(e.target.value)
            }
            placeholder="
            Pega URL Mobile.de
            o AutoScout24
            "
          />

          <button onClick={importCar}>

            {
              loading
                ? "Importando..."
                : "Importar URL"
            }

          </button>

        </div>

        <div className="filter-bar">

          <input
            placeholder="
            Buscar marca o modelo...
            "
            value={search}
            onChange={(e)=>
              setSearch(e.target.value)
            }
          />

          <button
            className={
              onlyDeals
                ? "active"
                : ""
            }
            onClick={()=>
              setOnlyDeals(!onlyDeals)
            }
          >
            🔥 Solo chollos
          </button>

          <select
            className="sort-select"
            value={sortBy}
            onChange={(e)=>
              setSortBy(e.target.value)
            }
          >
            <option value="roi">
              ROI
            </option>

            <option value="profit">
              Profit
            </option>

            <option value="price">
              Precio
            </option>

          </select>

        </div>

        <div className="cars-grid">

          {
            filteredCars.map(car => (

              <div
                key={car.id}
                className={
                  car.favorite
                    ? "car-card favorite"
                    : car.roi >= 20
                    ? "car-card super-hot"
                    : car.roi >= 10
                    ? "car-card good-deal"
                    : "car-card normal-deal"
                }
              >

                <img
                  src={car.image_url}
                />

                <h3>
                  {car.brand}
                  {" "}
                  {car.model}
                </h3>

                <p>
                  📅 {car.year}
                </p>

                <p>
                  🛣️ {car.km} km
                </p>

                <p>
                  💶 {car.price} €
                </p>

                <p>
                  🏪 Mercado:
                  {" "}
                  {
                    car.estimated_market_price
                  } €
                </p>

                <h2>
                  💰
                  {" "}
                  {
                    car.estimated_net_profit
                  } €
                </h2>

                <div className="roi">
                  ROI:
                  {" "}
                  {car.roi}%
                </div>

                <div
                  className={
                    car.score >= 85
                      ? "score-ring score-green"
                      : car.score >= 65
                      ? "score-ring score-yellow"
                      : "score-ring score-red"
                  }
                >
                  IA SCORE {car.score}
                </div>

                <div className="decision-badge">
                  {car.recommendation}
                </div>

                <div className="badges-row">

                  {(car.roi || 0) >= 20 && (
                    <div className="ai-badge badge-green">
                      🔥 SUPER CHOLLO
                    </div>
                  )}

                  {(car.km || 0) <= 80000 && (
                    <div className="ai-badge badge-blue">
                      🛣️ LOW KM
                    </div>
                  )}

                  {(car.price || 0) >= 50000 && (
                    <div className="ai-badge badge-purple">
                      👑 PREMIUM
                    </div>
                  )}

                  {(car.score || 0) >= 85 && (
                    <div className="ai-badge badge-orange">
                      🚀 HIGH SCORE
                    </div>
                  )}

                </div>

                <button
                  className="favorite-btn"
                  onClick={()=>{
                    alert("⭐ Añadido a favoritos")
                  }}
                >
                  ⭐ Favorito
                </button>

                <button
                  className="favorite-btn"
                  onClick={()=>
                    toggleFavorite(car.id)
                  }
                >
                  {
                    car.favorite
                      ? "⭐ Favorito"
                      : "☆ Añadir favorito"
                  }
                </button>

                <button
                  className="delete-btn"
                  onClick={()=>
                    deleteCar(car.id)
                  }
                >
                  🗑 Eliminar
                </button>

              </div>
            ))
          }

        </div>

      

<div className="cars-grid">
  {cars.map((car, index) => (
    <div className="car-card" key={index}>

      <img
        src={car.image_url}
        className="car-image"
      />

      <div className="car-body">

        <div className="car-title">
          {car.brand} {car.model}
        </div>

        <div className="car-year">
          {car.year} · {car.km} km
        </div>

        <div className="price-row">
          <span>{car.price} €</span>
          <span className="roi-badge">
            ROI {car.roi}%
          </span>
        </div>

        <div className="profit-box">
          💰 Beneficio estimado:
          <strong>
            {car.profit} €
          </strong>
        </div>

        <div className="recommendation">
          🔥 {car.recommendation}
        </div>

        <button
          className="favorite-btn"
          onClick={async () => {
            await fetch(`${API_URL}/cars/favorite/${index}`, {
              method: "POST"
            })

            alert("⭐ Añadido a favoritos")
          }}
        >
          ⭐ Favorito
        </button>

      </div>

    </div>
  ))}
</div>




<div className="cars-grid">
  {cars.map((car, index) => (
    <div className="car-card" key={index}>

      <img
        src={car.image_url}
        className="car-image"
      />

      <div className="car-body">

        <div className="car-title">
          {car.brand} {car.model}
        </div>

        <div className="car-year">
          {car.year} · {car.km} km
        </div>

        <div className="price-row">
          <span>{car.price} €</span>

          <span className="roi-badge">
            ROI {car.roi}%
          </span>
        </div>

        <div className="profit-box">
          💰 Beneficio estimado:
          <strong>
            {car.profit} €
          </strong>
        </div>

        <div className="recommendation">
          🔥 {car.recommendation}
        </div>

        <button
          className="favorite-btn"
          onClick={async () => {
            await fetch(`${API_URL}/cars/favorite/${index}`, {
              method: "POST"
            })

            alert("⭐ Añadido a favoritos")
          }}
        >
          ⭐ Favorito
        </button>

      </div>

    </div>
  ))}
</div>


</main>

    </div>
  )
}
