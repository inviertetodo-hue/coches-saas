import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/cars/dashboard`)
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  if (!data) return <div style={loadingStyle}>Cargando oportunidades...</div>;

  const cars = data.top_deals || [];
  const stats = data.stats || {};

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>🚗 Coches SaaS</h1>
      <p style={subtitleStyle}>Panel inteligente de compra venta</p>

      <div style={statsStyle}>
        <div style={statStyle}>🚘 Coches: {stats.total_cars || cars.length}</div>
        <div style={statStyle}>🔥 Ofertas imperdibles: {stats.hot_deals_count || cars.filter(c => c.is_hot_deal).length}</div>
        <div style={statStyle}>💰 Beneficio: {stats.total_profit || 0} €</div>
        <div style={statStyle}>📈 Puntuación media: {stats.avg_score || 0}</div>
      </div>

      <div style={gridStyle}>
        {cars.map((car) => (
          <div key={car.id} style={cardStyle}>
            {car.is_hot_deal && <div style={hotStyle}>🔥 OFERTA INCREÍBLE</div>}

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

const pageStyle = { minHeight: "100vh", background: "linear-gradient(135deg,#0f172a,#1e3a8a)", color: "white", padding: "40px", fontFamily: "Arial" };
const titleStyle = { fontSize: "60px" };
const subtitleStyle = { fontSize: "24px", marginBottom: "30px" };
const statsStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "20px", marginBottom: "40px" };
const statStyle = { background: "rgba(255,255,255,0.12)", padding: "20px", borderRadius: "20px", fontWeight: "bold" };
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(350px,1fr))", gap: "25px" };
const cardStyle = { background: "rgba(15,23,42,0.95)", padding: "20px", borderRadius: "25px" };
const imageStyle = { width: "100%", height: "240px", objectFit: "cover", borderRadius: "18px" };
const hotStyle = { background: "#ef4444", padding: "10px", borderRadius: "12px", fontWeight: "bold", display: "inline-block", marginBottom: "10px" };
const profitStyle = { color: "#22c55e" };
const scoreStyle = { background: "gold", color: "black", padding: "10px", borderRadius: "12px", display: "inline-block", fontWeight: "bold" };
const recStyle = { color: "#38bdf8" };
const loadingStyle = { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617", color: "white", fontSize: "30px" };

export default App;
