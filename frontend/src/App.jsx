import { useEffect, useState } from "react";

function App() {

  const [dashboard, setDashboard] = useState(null);

  const [search, setSearch] = useState("");

  const [onlyHotDeals, setOnlyHotDeals] = useState(false);

  const [sortBy, setSortBy] = useState("score");

  const [newCar, setNewCar] = useState({
    brand: "",
    model: "",
    year: "",
    km: "",
    price: ""
  });

  const loadDashboard = () => {

    fetch("http://127.0.0.1:8000/cars/dashboard")
      .then((response) => response.json())
      .then((data) => {
        setDashboard(data);
      });

  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const createCar = async () => {

    await fetch("http://127.0.0.1:8000/cars/", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        ...newCar,
        year: Number(newCar.year),
        km: Number(newCar.km),
        price: Number(newCar.price)
      })

    });

    setNewCar({
      brand: "",
      model: "",
      year: "",
      km: "",
      price: ""
    });

    loadDashboard();
  };

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

  filteredDeals.sort((a, b) => {

    if (sortBy === "score") {
      return b.score - a.score;
    }

    if (sortBy === "profit") {
      return (
        b.estimated_net_profit -
        a.estimated_net_profit
      );
    }

    if (sortBy === "price") {
      return b.price - a.price;
    }

    return 0;

  });

  return (

    <div style={layoutStyle}>

      <aside style={sidebarStyle}>

        <h1 style={logoStyle}>
          🚗 Coches SaaS
        </h1>

        <button style={menuButtonStyle}>
          Dashboard
        </button>

        <button style={menuButtonStyle}>
          Top Deals
        </button>

        <button style={menuButtonStyle}>
          Hot Deals
        </button>

      </aside>

      <main style={contentStyle}>

        <h1 style={titleStyle}>
          🔥 Marketplace Dashboard
        </h1>

        {/* FORMULARIO */}

        <div style={formCardStyle}>

          <h2>Añadir coche</h2>

          <input
            placeholder="Marca"
            value={newCar.brand}
            onChange={(e) =>
              setNewCar({
                ...newCar,
                brand: e.target.value
              })
            }
            style={inputStyle}
          />

          <input
            placeholder="Modelo"
            value={newCar.model}
            onChange={(e) =>
              setNewCar({
                ...newCar,
                model: e.target.value
              })
            }
            style={inputStyle}
          />

          <input
            placeholder="Año"
            value={newCar.year}
            onChange={(e) =>
              setNewCar({
                ...newCar,
                year: e.target.value
              })
            }
            style={inputStyle}
          />

          <input
            placeholder="KM"
            value={newCar.km}
            onChange={(e) =>
              setNewCar({
                ...newCar,
                km: e.target.value
              })
            }
            style={inputStyle}
          />

          <input
            placeholder="Precio"
            value={newCar.price}
            onChange={(e) =>
              setNewCar({
                ...newCar,
                price: e.target.value
              })
            }
            style={inputStyle}
          />

          <button
            onClick={createCar}
            style={createButtonStyle}
          >
            ➕ Crear coche
          </button>

        </div>

        {/* BUSCADOR */}

        <input
          type="text"
          placeholder="Buscar BMW, Audi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchStyle}
        />

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

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={selectStyle}
        >

          <option value="score">
            Mejor score
          </option>

          <option value="profit">
            Mayor beneficio
          </option>

          <option value="price">
            Precio más alto
          </option>

        </select>

        {/* STATS */}

        <section style={statsGridStyle}>

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

        </section>

        {/* DEALS */}

        <section style={dealsGridStyle}>

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

              <img
                src={car.image_url}
                alt={car.brand}
                style={carImageStyle}
              />

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

        </section>

      </main>

    </div>

  );
}

const isMobile = window.innerWidth < 800;

const layoutStyle = {
  display: "flex",
  flexDirection: isMobile ? "column" : "row",
  minHeight: "100vh",
  background: "#0f172a",
  color: "white",
  fontFamily: "Arial"
};

const sidebarStyle = {
  width: isMobile ? "auto" : "250px",
  background: "#111827",
  padding: "25px",
  borderRight: "1px solid #1e293b"
};

const logoStyle = {
  fontSize: "28px",
  marginBottom: "25px"
};

const menuButtonStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "12px",
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

const titleStyle = {
  fontSize: "42px",
  marginBottom: "30px"
};

const formCardStyle = {
  background: "#1e293b",
  padding: "25px",
  borderRadius: "20px",
  marginBottom: "30px",
  display: "grid",
  gap: "15px"
};

const inputStyle = {
  padding: "16px",
  borderRadius: "12px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "white",
  fontSize: "16px"
};

const createButtonStyle = {
  padding: "16px",
  borderRadius: "12px",
  border: "none",
  background: "gold",
  color: "black",
  fontWeight: "bold",
  fontSize: "18px",
  cursor: "pointer"
};

const searchStyle = {
  width: "100%",
  padding: "18px",
  borderRadius: "14px",
  border: "1px solid #334155",
  background: "#1e293b",
  color: "white",
  fontSize: "18px",
  marginBottom: "20px",
  boxSizing: "border-box"
};

const hotButtonStyle = {
  padding: "14px 20px",
  borderRadius: "12px",
  border: "none",
  fontWeight: "bold",
  fontSize: "16px",
  cursor: "pointer",
  marginBottom: "20px",
  marginRight: "15px"
};

const selectStyle = {
  padding: "14px",
  borderRadius: "12px",
  background: "#1e293b",
  color: "white",
  border: "1px solid #334155",
  fontSize: "16px",
  marginBottom: "40px"
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginBottom: "50px"
};

const dealsGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "25px"
};

const cardStyle = {
  background: "#1e293b",
  borderRadius: "20px",
  padding: "25px"
};

const dealCardStyle = {
  background: "#1e293b",
  borderRadius: "20px",
  padding: "25px"
};

const carImageStyle = {
  width: "100%",
  height: "220px",
  objectFit: "cover",
  borderRadius: "14px",
  marginBottom: "20px"
};

const hotDealStyle = {
  marginTop: "15px",
  background: "gold",
  color: "black",
  padding: "12px",
  borderRadius: "12px",
  fontWeight: "bold",
  textAlign: "center"
};

const numberStyle = {
  fontSize: "42px",
  fontWeight: "bold"
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

