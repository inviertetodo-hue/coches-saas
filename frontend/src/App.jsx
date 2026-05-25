import { useEffect, useState } from "react";
import { API_URL } from "./config";

function App() {

  const [data, setData] = useState(null);

  const [form, setForm] = useState({
    brand: "",
    model: "",
    year: "",
    km: "",
    price: "",
    image_url: ""
  });

  const loadDashboard = () => {
    fetch(`${API_URL}/cars/dashboard`)
      .then((res) => res.json())
      .then((json) => setData(json));
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const addCar = async () => {

    await fetch(`${API_URL}/cars/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...form,
        year: Number(form.year),
        km: Number(form.km),
        price: Number(form.price)
      })
    });

    setForm({
      brand: "",
      model: "",
      year: "",
      km: "",
      price: "",
      image_url: ""
    });

    loadDashboard();
  };

  if (!data) return <div style={loadingStyle}>Cargando IA...</div>;

  const cars = data.top_deals || [];
  const stats = data.stats || {};

  return (
    <div style={pageStyle}>

      <h1 style={titleStyle}>🚗 Coches SaaS</h1>
      <p style={subtitleStyle}>IA profesional de compraventa</p>

      <div style={formStyle}>

        <input
          placeholder="Marca"
          value={form.brand}
          onChange={(e) => setForm({...form, brand: e.target.value})}
          style={inputStyle}
        />

        <input
          placeholder="Modelo"
          value={form.model}
          onChange={(e) => setForm({...form, model: e.target.value})}
          style={inputStyle}
        />

        <input
          placeholder="Año"
          value={form.year}
          onChange={(e) => setForm({...form, year: e.target.value})}
          style={inputStyle}
        />

        <input
          placeholder="KM"
          value={form.km}
          onChange={(e) => setForm({...form, km: e.target.value})}
          style={inputStyle}
        />

        <input
          placeholder="Precio"
          value={form.price}
          onChange={(e) => setForm({...form, price: e.target.value})}
          style={inputStyle}
        />

        <input
          placeholder="URL imagen"
          value={form.image_url}
          onChange={(e) => setForm({...form, image_url: e.target.value})}
          style={inputStyle}
        />

        <button onClick={addCar} style={buttonStyle}>
          🚀 ANALIZAR COCHE
        </button>

      </div>

      <div style={statsStyle}>
        <div style={statStyle}>🚘 Coches: {stats.total_cars}</div>
        <div style={statStyle}>🔥 Hot Deals: {stats.hot_deals_count}</div>
        <div style={statStyle}>💰 Profit: {stats.total_profit} €</div>
        <div style={statStyle}>📈 Score medio: {stats.avg_score}</div>
      </div>

      <div style={gridStyle}>
        {cars.map((car) => (
          <div key={car.id} style={cardStyle}>

            {car.is_hot_deal && (
              <div style={hotStyle}>
                🔥 HOT DEAL IA
              </div>
            )}

            <img src={car.image_url} style={imageStyle} />

            <h2>{car.brand} {car.model}</h2>

            <p>📅 {car.year}</p>
            <p>🛣 {car.km} km</p>
            <p>💵 {car.price} €</p>

            <hr />

            <p>🏷 Mercado: {car.estimated_market_price} €</p>
            <p>💸 Gastos: {car.estimated_expenses} €</p>

            <h3 style={profitStyle}>
              🤑 Profit: {car.estimated_net_profit} €
            </h3>

            <p>📈 ROI: {car.roi}%</p>

            <div style={scoreStyle}>
              ⭐ SCORE IA: {car.score}
            </div>

            <h2 style={recommendationStyle}>
              {car.recommendation}
            </h2>

          </div>
        ))}
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg,#020617,#1e3a8a)",
  color: "white",
  padding: "40px",
  fontFamily: "Arial"
};

const titleStyle = {
  fontSize: "64px",
  fontWeight: "bold"
};

const subtitleStyle = {
  fontSize: "28px",
  marginBottom: "40px",
  color: "#cbd5e1"
};

const formStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
  gap: "15px",
  marginBottom: "40px"
};

const inputStyle = {
  padding: "15px",
  borderRadius: "12px",
  border: "none",
  fontSize: "16px"
};

const buttonStyle = {
  background: "#22c55e",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontWeight: "bold",
  fontSize: "18px",
  cursor: "pointer"
};

const statsStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: "20px",
  marginBottom: "40px"
};

const statStyle = {
  background: "rgba(255,255,255,0.1)",
  padding: "25px",
  borderRadius: "20px",
  fontSize: "22px",
  fontWeight: "bold",
  backdropFilter: "blur(10px)"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(400px,1fr))",
  gap: "30px"
};

const cardStyle = {
  background: "rgba(15,23,42,0.95)",
  borderRadius: "25px",
  padding: "25px",
  boxShadow: "0 0 30px rgba(0,0,0,0.4)"
};

const imageStyle = {
  width: "100%",
  height: "260px",
  objectFit: "cover",
  borderRadius: "20px",
  marginBottom: "20px"
};

const hotStyle = {
  background: "#ef4444",
  display: "inline-block",
  padding: "10px 18px",
  borderRadius: "12px",
  fontWeight: "bold",
  marginBottom: "20px"
};

const profitStyle = {
  color: "#22c55e"
};

const scoreStyle = {
  background: "gold",
  color: "black",
  padding: "12px",
  borderRadius: "12px",
  fontWeight: "bold",
  display: "inline-block"
};

const recommendationStyle = {
  color: "#38bdf8"
};

const loadingStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#020617",
  color: "white",
  fontSize: "40px"
};

export default App;
