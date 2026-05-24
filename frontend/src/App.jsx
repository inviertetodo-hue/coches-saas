import { useEffect, useState } from "react";

const API_URL = "https://coches-saas.onrender.com";

function App() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/cars/dashboard`)
      .then((res) => res.json())
      .then((data) => setDashboard(data));
  }, []);

  if (!dashboard) {
    return <div style={loadingStyle}>Cargando oportunidades...</div>;
  }

  const cars = dashboard.top_deals || [];

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>🚗 Coches SaaS</h1>
      <p style={subtitleStyle}>Dashboard inteligente de compraventa</p>

      <div style={statsStyle}>
        <div style={statCardStyle}>🚘 Coches: {dashboard.stats.total_cars}</div>
        <div style={statCardStyle}>🔥 Hot deals: {dashboard.stats.hot_deals_count}</div>
        <div style={statCardStyle}>💰 Profit: {dashboard.stats.total_profit} €</div>
        <div style={statCardStyle}>📊 Score medio: {dashboard.stats.avg_score}</div>
      </div>

      <div style={gridStyle}>
        {cars.map((car) => (
          <div key={car.id} style={cardStyle}>
            <img src={car.image_url || car.url_imagen} style={imageStyle} />

            <h2>{car.brand || car.marca} {car.model || car.modelo}</h2>

            <p>📅 Año: {car.year || car.año}</p>
            <p>🛣️ KM: {car.km}</p>
            <p>💶 Precio: {car.price || car.precio} €</p>

            <h3 style={profitStyle}>
              Beneficio: {car.estimated_net_profit || car.beneficio_neto_estimado} €
            </h3>

            <div style={scoreStyle}>
              Score: {car.score || car.puntuación}
            </div>

            <p style={recommendationStyle}>
              🧠 {car.recommendation || car.recomendación}
            </p>
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

const titleStyle = {
  fontSize: "56px",
  marginBottom: "5px",
};

const subtitleStyle = {
  color: "#bfdbfe",
  fontSize: "22px",
  marginBottom: "30px",
};

const statsStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "15px",
  marginBottom: "35px",
};

const statCardStyle = {
  background: "rgba(255,255,255,0.12)",
  padding: "18px",
  borderRadius: "18px",
  fontWeight: "bold",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "25px",
};

const cardStyle = {
  background: "rgba(30,41,59,0.92)",
  borderRadius: "24px",
  padding: "22px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
};

const imageStyle = {
  width: "100%",
  height: "220px",
  objectFit: "cover",
  borderRadius: "18px",
  marginBottom: "18px",
};

const profitStyle = {
  color: "#22c55e",
};

const scoreStyle = {
  background: "gold",
  color: "black",
  display: "inline-block",
  padding: "10px 14px",
  borderRadius: "12px",
  fontWeight: "bold",
};

const recommendationStyle = {
  color: "#bfdbfe",
  marginTop: "16px",
};

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
