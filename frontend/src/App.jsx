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

      {/* BUSCADOR */}

      <input
        type="text"
        placeholder="Buscar BMW, Audi..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "18px",
          borderRadius: "14px",
          border: "1px solid #334155",
          background: "#1e293b",
          color: "white",
          fontSize: "18px",
          marginBottom: "20px"
        }}
      />

      {/* FILTRO HOT DEALS */}

      <button
        onClick={() => setOnlyHotDeals(!onlyHotDeals)}
        style={{
          padding: "14px 20px",
          borderRadius: "12px",
          border: "none",
          background: onlyHotDeals
            ? "gold"
            : "#1e293b",
          color: onlyHotDeals
            ? "black"
            : "white",
          fontWeight: "bold",
          fontSize: "16px",
          cursor: "pointer",
          marginBottom: "40px"
        }}
      >
        🔥 Solo HOT DEALS
      </button>

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

        {filteredDeals.map((car) => (

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

