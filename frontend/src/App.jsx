import { useEffect, useState } from "react";

const API_URL = "https://coches-saas.onrender.com";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/cars/dashboard`)
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  if (!data) {
    return (
      <div style={loadingStyle}>
        Cargando oportunidades...
      </div>
    );
  }

  const cars = data.top_deals || [];

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>🚗 Coches SaaS</h1>
      <p style={subtitleStyle}>Panel inteligente de compraventa</p>

      <div style={statsStyle}>
        <div style={statStyle}>🚘 Coches: {data.stats.total_cars}</div>
        <div style={statStyle}>🔥 Hot Deals: {data.stats.hot_deals_count}</div>
        <div style={statStyle}>💰 Beneficio: {data.stats.total_profit} €</div>
        <div style={statStyle}>📈 Score medio: {data.stats.avg_score}</div>
      </div>

      <div style={gridStyle}>
        {cars.map((car) => (
          <div key={car.id} style={cardStyle}>
            {car.is_hot_deal && <div style={hotStyle}>🔥 HOT DEAL</div>}

            <img src={car.image_url} style={imageStyle} />

            <h2>{car.brand} {car.model}</h2>

            <p>📅 Año: {car.year}</p>
            <p>🛣 KM: {car.km}</p>
            <p>💵 Precio: {car.price} €</p>

            <hr />

            <p>🏷 Mercado estimado: {car.estimated_market_price} €</p>
            <p>💸 Gastos: {car.estimated_expenses} €</p>
            <h3 style={profitStyle}>🤑 Beneficio: {car.estimated_net_profit} €</h3>
            <p>📈 ROI: {car.roi}%</p>

            <div style={scoreStyle}>⭐ Score: {car.score}</div>

            <h2 style={recStyle}>{car.recommendation}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #020617, #1e3a8a)",
  color: "white",
  padding: "40px",
  fontFamily: "Arial",
};

const titleStyle = { fontSize: "56px", marginBottom: "5px" };
const subtitleStyle = { fontSize: "22px", color: "#bfdbfe", marginBottom: "30px" };

const statsStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "16px",
  marginBottom: "35px",
};

const statStyle = {
  background: "rgba(255,255,255,0.14)",
  padding: "18px",
  borderRadius: "18px",
  fontWeight: "bold",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))",
  gap: "25px",
};

const cardStyle = {
  background: "rgba(15,23,42,0.95)",
  padding: "22px",
  borderRadius: "24px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
};

const imageStyle = {
  width: "100%",
  height: "230px",
  objectFit: "cover",
  borderRadius: "18px",
};

const hotStyle = {
  background: "#ef4444",
  padding: "10px 14px",
  borderRadius: "12px",
  fontWeight: "bold",
  display: "inline-block",
  marginBottom: "12px",
};

const profitStyle = { color: "#22c55e" };

const scoreStyle = {
  background: "gold",
  color: "black",
  padding: "10px 14px",
  borderRadius: "12px",
  fontWeight: "bold",
  display: "inline-block",
};

const recStyle = { color: "#38bdf8" };

const loadingStyle = {
  minHeight: "100vh",
  background: "#020617",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "30px",
};

export default App;
