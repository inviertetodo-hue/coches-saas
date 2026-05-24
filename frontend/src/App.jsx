import { useEffect, useState } from "react";

function App() {

  const [dashboard, setDashboard] = useState(null);

  const [search, setSearch] = useState("");

  const [onlyHotDeals, setOnlyHotDeals] = useState(false);

  useEffect(() => {

    fetch("http://127.0.0.1:8000/cars/dashboard")
      .then((response) => response.json())
      .then((data) => {
        setDashboard(data);
      });

  }, []);

  if (!dashboard) {

    return (
      <div style={loadingStyle}>
        Cargando dashboard...
      </div>
    );
  }

  let filteredDeals = dashboard.top_deals.filter((car) => {

    const text = (
      car.brand +
      " " +
      car.model
    ).toLowerCase();

    return text.includes(search.toLowerCase());

  });

  if (onlyHotDeals) {

    filteredDeals = filteredDeals.filter(
      (car) => car.is_hot_deal
    );
  }

  return (

    <div style={layoutStyle}>

      {/* SIDEBAR */}

      <div style={sidebarStyle}>

        <h1 style={logoStyle}>
          🚗 Coches SaaS
        </h1>

        <button
          style={menuButtonStyle}
        >
          Dashboard
        </button>

        <button
          style={menuButtonStyle}
        >
          Top Deals
        </button>

        <button
          style={menuButtonStyle}
        >
          Hot Deals
        </button>

        <button
          style={menuButtonStyle}
        >
          Importaciones
        </button>

      </div>

      {/* CONTENIDO */}

      <div style={contentStyle}>

        <h1
          style={{
            fontSize: "42px",
            marginBottom: "30px"
          }}
        >
          🔥 Marketplace Dashboard
        </h1>

        {/* BUSCADOR */}

        <input
          type="text"
          placeholder="Buscar BMW, Audi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchStyle}
        />

        {/* FILTRO */}

        <button
          onClick={() => setOnlyHotDeals(!onlyHotDeals)}
          style={{
            ...hotButtonStyle,

            background: onlyHotDeals
              ? "gold"
              : "#1e293b",

            color: onlyHotDeals
              ? "black"
              : "white"
          }}
        >
          🔥 Solo HOT DEALS
        </button>

        {/* STATS */}

        <div style={statsGridStyle}>

          <div style={cardStyle}>
            <h2>Total coches</h2>

            <p style={numberStyle}>
              {dashboard.stats.total_cars}
            </p>
          </div>

          <div style={cardStyle}>
            <h2>Score medio</h2>

            <p style={numberStyle}>
              {dashboard.stats.avg_score}
            </p>
          </div>

          <div style={cardStyle}>
            <h2>Hot deals</h2>

            <p style={numberStyle}>
              {dashboard.stats.hot_deals_count}
            </p>
          </div>

        </div>

        {/* DEALS */}

        <div style={dealsGridStyle}>

          {filteredDeals.map((car) => (

            <div
              key={car.id}
              style={{
                ...dealCardStyle,

                border: car.is_hot_deal
                  ? "2px solid gold"
                  : "1px solid #334155"
              }}
            >

              <h2 style={{ fontSize: "28px" }}>
                {car.brand} {car.model}
              </h2>

              <p>📅 Año: {car.year}</p>

              <p>🛣️ KM: {car.km}</p>

              <p>💰 Precio: {car.price}€</p>

              <p>📈 Score: {car.score}</p>

              <p>🏷️ {car.label}</p>

              <p>
                💵 Beneficio:
                {" "}
                {car.estimated_net_profit}€
              </p>

              {car.is_premium_brand && (
                <p>⭐ Premium</p>
              )}

              {car.is_hot_deal && (

                <div style={hotDealStyle}>
                  🔥 HOT DEAL
                </div>

              )}

            </div>

          ))}

        </div>

      </div>

    </div>

  );
}

/* ESTILOS */

const layoutStyle = {
  display: "flex",
  minHeight: "100vh",
  background: "#0f172a",
  color: "white",
  fontFamily: "Arial"
};

const sidebarStyle = {
  width: "250px",
  background: "#111827",
  padding: "30px",
  borderRight: "1px solid #1e293b"
};

const logoStyle = {
  fontSize: "30px",
  marginBottom: "40px"
};

const menuButtonStyle = {
  width: "100%",
  padding: "15px",
  marginBottom: "15px",
  borderRadius: "12px",
  border: "none",
  background: "#1e293b",
  color: "white",
  fontSize: "16px",
  cursor: "pointer"
};

const contentStyle = {
  flex: 1,
  padding: "40px"
};

const searchStyle = {
  width: "100%",
  padding: "18px",
  borderRadius: "14px",
  border: "1px solid #334155",
  background: "#1e293b",
  color: "white",
  fontSize: "18px",
  marginBottom: "20px"
};

const hotButtonStyle = {
  padding: "14px 20px",
  borderRadius: "12px",
  border: "none",
  fontWeight: "bold",
  fontSize: "16px",
  cursor: "pointer",
  marginBottom: "40px"
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginBottom: "50px"
};

const dealsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "25px"
};

const cardStyle = {
  background: "#1e293b",
  borderRadius: "20px",
  padding: "25px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
};

const dealCardStyle = {
  background: "#1e293b",
  borderRadius: "20px",
  padding: "25px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
};

const hotDealStyle = {
  marginTop: "15px",
  background: "gold",
  color: "black",
  padding: "12px",
  borderRadius: "12px",
  fontWeight: "bold",
  textAlign: "center",
  fontSize: "18px"
};

const numberStyle = {
  fontSize: "42px",
  fontWeight: "bold",
  marginTop: "10px"
};

const loadingStyle = {
  background: "#0f172a",
  minHeight: "100vh",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "30px"
};

export default App;

