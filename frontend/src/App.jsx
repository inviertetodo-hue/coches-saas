import { useEffect, useMemo, useState } from "react"
import "./App.css"

import Analytics from "./components/Analytics"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
 YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts"

const API_URL = "http://127.0.0.1:8000"

function App() {

  const [cars, setCars] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("score")
  const [onlyHotDeals, setOnlyHotDeals] = useState(false)

  const [formData, setFormData] = useState({
    brand:"",
    model:"",
    year:"",
    km:"",
    price:"",
    image_url:""
  })

  const loadDashboard = async () => {

    const response =
      await fetch(`${API_URL}/cars/dashboard`)

    const data = await response.json()

    setCars(data.top_deals || [])
    setStats(data.stats || {})
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const analyzeCar = async () => {

    setLoading(true)

    await fetch(`${API_URL}/cars/analyze`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        ...formData,
        year:Number(formData.year),
        km:Number(formData.km),
        price:Number(formData.price)
      })
    })

    await loadDashboard()

    setLoading(false)

    setFormData({
      brand:"",
      model:"",
      year:"",
      km:"",
      price:"",
      image_url:""
    })
  }

  const deleteCar = async(id)=>{

    await fetch(`${API_URL}/cars/${id}`,{
      method:"DELETE"
    })

    await loadDashboard()
  }

  const toggleFavorite = async(id)=>{

    await fetch(`${API_URL}/cars/${id}/favorite`,{
      method:"PATCH"
    })

    await loadDashboard()
  }

  const toggleSold = async(id)=>{

    await fetch(`${API_URL}/cars/${id}/sold`,{
      method:"PATCH"
    })

    await loadDashboard()
  }

  const deleteAllCars = async () => {

    const confirmDelete =
      window.confirm(
        "¿Eliminar TODOS los coches?"
      )

    if(!confirmDelete){
      return
    }

    await fetch(`${API_URL}/cars`,{
      method:"DELETE"
    })

    await loadDashboard()
  }

  const exportCSV = () => {
    const rows = [
      ["Marca","Modelo","Año","KM","Precio","Mercado","Gastos","Beneficio","ROI","Score","Recomendacion"]
    ]

    filteredCars.forEach((car) => {
      rows.push([
        car.brand,
        car.model,
        car.year,
        car.km,
        car.price,
        car.estimated_market_price,
        car.estimated_expenses,
        car.estimated_net_profit,
        car.roi,
        car.score,
        car.recommendation
      ])
    })

    const csv = rows.map(row => row.join(";")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "coches-saas-informe.csv"
    a.click()
  }

  const filteredCars = useMemo(()=>{

    let result=[...cars]

    if(search){

      result=result.filter((car)=>
        `${car.brand} ${car.model}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    }

    if(onlyHotDeals){
      result=result.filter((car)=>car.is_hot_deal)
    }

    result.sort((a,b)=>{

      if(sortBy==="score"){
        return b.score-a.score
      }

      if(sortBy==="profit"){
        return b.estimated_net_profit-a.estimated_net_profit
      }

      if(sortBy==="roi"){
        return b.roi-a.roi
      }

      return 0
    })

    return result

  },[
    cars,
    search,
    sortBy,
    onlyHotDeals
  ])

  const profitData =
    filteredCars.map((car)=>({
      name:car.brand,
      profit:car.estimated_net_profit
    }))

  const scoreData=[
    {
      name:"Hot Deals",
      value:
        filteredCars.filter(c=>c.is_hot_deal).length
    },
    {
      name:"Normales",
      value:
        filteredCars.filter(c=>!c.is_hot_deal).length
    }
  ]

  return(

    <div className="app">

      <div className="hero">

        <div className="hero-top">

          <h1>
            🚘 Coches SaaS
          </h1>

          <div className="hero-badge">
            🔥 MOTOR AUTOMOTRIZ IA
          </div>

        </div>

        <p>
          Inteligencia artificial para
          compraventa profesional
        </p>

      </div>

      <div className="form-grid">

        <input
          placeholder="Marca"
          value={formData.brand}
          onChange={(e)=>
            setFormData({
              ...formData,
              brand:e.target.value
            })
          }
        />

        <input
          placeholder="Modelo"
          value={formData.model}
          onChange={(e)=>
            setFormData({
              ...formData,
              model:e.target.value
            })
          }
        />

        <input
          placeholder="Año"
          value={formData.year}
          onChange={(e)=>
            setFormData({
              ...formData,
              year:e.target.value
            })
          }
        />

        <input
          placeholder="KM"
          value={formData.km}
          onChange={(e)=>
            setFormData({
              ...formData,
              km:e.target.value
            })
          }
        />

        <input
          placeholder="Precio"
          value={formData.price}
          onChange={(e)=>
            setFormData({
              ...formData,
              price:e.target.value
            })
          }
        />

        <input
          placeholder="URL imagen"
          value={formData.image_url}
          onChange={(e)=>
            setFormData({
              ...formData,
              image_url:e.target.value
            })
          }
        />

      </div>

      <button
        className="analyze-btn"
        onClick={analyzeCar}
      >
        {
          loading
            ? "ANALIZANDO..."
            : "🚀 ANALIZAR COCHE"
        }
      </button>

      <div className="stats-grid">

        <div className="stat-card">
          <h3>🚗 Coches</h3>
          <h2>{stats.total_cars}</h2>
        </div>

        <div className="stat-card">
          <h3>🔥 Hot Deals</h3>
          <h2>{stats.hot_deals_count}</h2>
        </div>

        <div className="stat-card">
          <h3>💰 Profit</h3>
          <h2>{stats.total_profit} €</h2>
        </div>

        <div className="stat-card">
          <h3>📈 IA Score</h3>
          <h2>{stats.avg_score}</h2>
        </div>

      </div>

      <Analytics cars={filteredCars} />

      <div className="toolbar">

        <input
          className="search-input"
          placeholder="Buscar marca o modelo..."
          value={search}
          onChange={(e)=>
            setSearch(e.target.value)
          }
        />

        <select
          className="sort-select"
          value={sortBy}
          onChange={(e)=>
            setSortBy(e.target.value)
          }
        >

          <option value="score">
            Ordenar por puntuación
          </option>

          <option value="profit">
            Ordenar por beneficio
          </option>

          <option value="roi">
            Ordenar por ROI
          </option>

        </select>

        <button
          className="export-btn"
          onClick={exportCSV}
        >
          📤 Exportar CSV
        </button>

        <button
          className="delete-btn"
          onClick={deleteAllCars}
        >
          🧨 Reset DB
        </button>

        <button
          className={`hot-filter ${
            onlyHotDeals ? "active" : ""
          }`}
          onClick={()=>
            setOnlyHotDeals(!onlyHotDeals)
          }
        >
          🔥 Hot Deals
        </button>

      </div>

      <div className="charts-grid">

        <div className="chart-card">

          <h2>
            📈 Beneficio por coche
          </h2>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <BarChart data={profitData}>

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="profit"
                fill="#59e65c"
                radius={[10,10,0,0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        <div className="chart-card">

          <h2>
            🔥 Hot Deals IA
          </h2>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <PieChart>

              <Pie
                data={scoreData}
                dataKey="value"
                outerRadius={120}
                label
              >

                <Cell fill="#59e65c" />

                <Cell fill="#ff6666" />

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      <div className="cars-grid">

        {filteredCars.map((car)=>(

          <div
            key={car.id}
            className={`car-card ${
              car.is_hot_deal ? "hot" : ""
            }`}
          >

            <img
              src={car.image_url}
              alt=""
            />

            <div className="car-content">

              <div className="card-top">

                <h2>
                  {car.brand} {car.model}
                </h2>

                {car.is_favorite &&(

                  <div className="favorite-badge">
                    ⭐ FAVORITO
                  </div>

                )}

              </div>

              {car.is_sold &&(

                <div className="sold-badge">
                  VENDIDO
                </div>

              )}

              <p>📅 {car.year}</p>

              <p>🛣️ {car.km} km</p>

              <p>💶 {car.price} €</p>

              <hr />

              <p>
                🏪 Mercado:
                {" "}
                {car.estimated_market_price} €
              </p>

              <p>
                🛠️ Gastos:
                {" "}
                {car.estimated_expenses} €
              </p>

              <h3 className="profit">
                💰 {car.estimated_net_profit} €
              </h3>

              <p>
                📈 ROI:
                {" "}
                {car.roi} %
              </p>

              <div className="score-box">
                ⭐ {car.score}
              </div>

              <div className="recommendation">
                {car.recommendation}
              </div>

              <div className="card-buttons">

                <button
                  className="favorite-btn"
                  onClick={()=>
                    toggleFavorite(car.id)
                  }
                >
                  ⭐ Favorito
                </button>

                <button
                  className="sold-btn"
                  onClick={()=>
                    toggleSold(car.id)
                  }
                >
                  ✅ Vendido
                </button>

              </div>

              <button
                className="delete-btn"
                onClick={()=>
                  deleteCar(car.id)
                }
              >
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
