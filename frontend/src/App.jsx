import { useEffect, useState } from "react";
import { API_URL } from "./config";

function App() {

  const [dashboard, setDashboard] = useState(null);

  const [form, setForm] = useState({
    brand: "",
    model: "",
    year: "",
    km: "",
    price: "",
    image_url: ""
  });

  const loadDashboard = async () => {
    const response = await fetch(`${API_URL}/cars/dashboard`);
    const data = await response.json();
    setDashboard(data);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const analyzeCar = async () => {

    await fetch(`${API_URL}/cars/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        brand: form.brand,
        model: form.model,
        year: Number(form.year),
        km: Number(form.km),
        price: Number(form.price),
        image_url: form.image_url
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

    await loadDashboard();
  };

  if (!dashboard) {
    return (
      <div style={loadingStyle}>
        Cargando IA...
      </div>
    );
  }

  const stats = dashboard.stats || {};
  const cars = dashboard.top_deals || [];

  return (
    <div style={pageStyle}>

      <h1 style={titleStyle}>🚗 Coches SaaS</h1>

      <p style={subtitleStyle}>
        IA profesional de compraventa
      </p>

      <div style={formContainerStyle}>

        <input
          style={inputStyle}
          placeholder="Marca"
          value={form.brand}
          onChange={(e) =>
            setForm({ ...form, brand: e.target.value })
          }
        />

        <input
          style={inputStyle}
          placeholder="Modelo"
          value={form.model}
          onChange={(e) =>
            setForm({ ...form, model: e.target.value })
          }
        />

        <input
          style={inputStyle}
          placeholder="Año"
          value={form.year}
          onChange={(e) =>
            setForm({ ...form, year: e.target.value })
          }
        />

        <input
          style={inputStyle}
          placeholder="KM"
          value={form.km}
          onChange={(e) =>
            setForm({ ...form, km: e.target.value })
          }
        />

        <input
          style={inputStyle}
          placeholder="Precio"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <input
          style={inputStyle}
          placeholder="URL imagen"
          value={form.image_url}
          onChange={(e) =>
            setForm({ ...form, image_url: e.target.value })
          }
        />

        <button
          style={buttonStyle}
          onClick={analyzeCar}
        >
          🚀 ANALIZAR COCHE
        </button>

      </div>

      <div style={statsGridStyle}>

        <div style={statCardStyle}>
          🚘 Coches: {stats.total_cars}
        </div>

        <div style={statCardStyle}>
          🔥 Hot Deals: {stats.hot_deals_count}
        </div>

        <div style={statCardStyle}>
          💰 Profit: {stats.total_profit} €
        </div>

        <div style={statCardStyle}>
          📈 Score medio: {stats.avg_score}
        </div>

      </div>

      <div style={carsGridStyle}>

        {cars.map((car) => (

          <div key={car.id} style={cardStyle}>

            {car.is_hot_deal && (
              <div style={hotDealStyle}>
                🔥 HOT DEAL IA
              </div>
            )}

            <img
              src={car.image_url}
              style={imageStyle}
            />

            <h2>
              {car.brand} {car.model}
            </h2>

            <p>📅 {car.year}</p>
            <p>🛣 {car.km} km</p>
            <p>💵 {car.price} €</p>

            <hr />

            <p>
              🏷 Mercado:
              {" "}
              {car.estimated_market_price} €
            </p>

            <p>
              💸 Gastos:
              {" "}
              {car.estimated_expenses} €
            </p>

            <h3 style={profitStyle}>
              🤑 Profit:
              {" "}
              {car.estimated_net_profit} €
            </h3>

            <p>
              📈 ROI:
              {" "}
              {car.roi}%
            </p>

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
  padding: "40px",
  color: "white",
  fontFamily: "Arial"
};

const loadingStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#020617",
  color: "white",
  fontSize: "40px"
};

const titleStyle = {
  fontSize: "72px",
  fontWeight: "bold"
};

const subtitleStyle = {
  fontSize: "32px",
  color: "#cbd5e1",
  marginBottom: "40px"
};

const formContainerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: "15px",
  marginBottom: "40px"
};

const inputStyle = {
  padding: "16px",
  borderRadius: "14px",
  border: "none",
  fontSize: "16px"
};

const buttonStyle = {
  background: "#22c55e",
  color: "white",
  border: "none",
  borderRadius: "14px",
  fontWeight: "bold",
  fontSize: "18px",
  cursor: "pointer"
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: "20px",
  marginBottom: "40px"
};

const statCardStyle = {
  background: "rgba(255,255,255,0.1)",
  padding: "25px",
  borderRadius: "20px",
  fontSize: "22px",
  fontWeight: "bold",
  backdropFilter: "blur(10px)"
};

const carsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(420px,1fr))",
  gap: "30px"
};

const cardStyle = {
  background: "rgba(15,23,42,0.95)",
  padding: "25px",
  borderRadius: "25px",
  boxShadow: "0 0 30px rgba(0,0,0,0.4)"
};

const imageStyle = {
  width: "100%",
  height: "260px",
  objectFit: "cover",
  borderRadius: "20px",
  marginBottom: "20px"
};

const hotDealStyle = {
  background: "#ef4444",
  padding: "10px 18px",
  borderRadius: "12px",
  display: "inline-block",
  marginBottom: "20px",
  fontWeight: "bold"
};

const profitStyle = {
  color: "#22c55e"
};

const scoreStyle = {
  background: "gold",
  color: "black",
  padding: "12px",
  borderRadius: "12px",
  display: "inline-block",
  fontWeight: "bold"
};

const recommendationStyle = {
  color: "#38bdf8"
};

export default App;
