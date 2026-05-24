import { useEffect, useState } from "react";

function App() {

  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {

    fetch("http://127.0.0.1:8000/cars/dashboard")
      .then((response) => response.json())
      .then((data) => {
        setDashboard(data);
      });

  }, []);

  if (!dashboard) {

    return (
      <div
        style={{
          background: "#0f172a",
          minHeight: "100vh",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "30px"
        }}
      >
        Cargando dashboard...
      </div>
    );
  }

  return (

    <div
      style={{
        background: "#0f172a",
        minHeight: "100vh",
        padding: "40px",
        color: "white",
        fontFamily: "Arial"
      }}
    >

      <h1
        style={{
          fontSize: "48px",
          marginBottom: "40px",
          fontWeight: "bold"
        }}
      >
        🚗 Coches SaaS
      </h1>

      {/* STATS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "50px"
        }}
      >

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

      {/* TOP DEALS */}

      <h2
        style={{
          fontSize: "34px",
          marginBottom: "25px"
        }}
      >
        🔥 Top Deals
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "25px"
        }}
      >

        {dashboard.top_deals.map((car) => (

          <div
            key={car.id}
            style={{
              background: "#1e293b",
              borderRadius: "20px",
              padding: "25px",
              border: car.is_hot_deal
                ? "2px solid gold"
                : "1px solid #334155",
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
            }}
          >

            <h2
              style={{
                fontSize: "28px",
                marginBottom: "15px"
              }}
            >
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

              <div
                style={{
                  marginTop: "15px",
                  background: "gold",
                  color: "black",
                  padding: "12px",
                  borderRadius: "12px",
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: "18px"
                }}
              >
                🔥 HOT DEAL
              </div>

            )}

          </div>

        ))}

      </div>

    </div>

  );
}

const cardStyle = {
  background: "#1e293b",
  borderRadius: "20px",
  padding: "25px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
};

const numberStyle = {
  fontSize: "42px",
  fontWeight: "bold",
  marginTop: "10px"
};

export default App;

