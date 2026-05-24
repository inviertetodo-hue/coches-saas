import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [dashboard, setDashboard] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("score");

  useEffect(() => {
    loadDashboard();

    const savedFavorites = localStorage.getItem("favorites");

    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const loadDashboard = () => {
    fetch(`${API_URL}/cars/dashboard`)
      .then((res) => res.json())
      .then((data) => setDashboard(data));
  };

  const toggleFavorite = (carId) => {
    if (favorites.includes(carId)) {
      setFavorites(favorites.filter((id) => id !== carId));
    } else {
      setFavorites([...favorites, carId]);
    }
  };

  const deleteCar = async (carId) => {
    await fetch(`${API_URL}/cars/${carId}`, {
      method: "DELETE",
    });

    loadDashboard();
  };

  if (!dashboard) {
    return <div style={loadingStyle}>Cargando dashboard...</div>;
  }

  let cars = dashboard.top_deals || [];

  cars = cars.filter((car) => {
    const text = `${car.brand} ${car.model}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  cars = [...cars].sort((a, b) => {
    if (sortBy === "score") {
      return b.score - a.score;
    }

    if (sortBy === "profit") {
      return b.estimated_net_profit - a.estimated_net_profit;
    }

    if (sortBy === "price") {
      return b.price - a.price;
    }

    return 0;
  });

  return (
    <div style={layoutStyle}>
      <aside style={sidebarStyle}>
        <h1 style={logoStyle}>🚗 Coches SaaS</h1>

        <button style={menuButtonStyle}>Dashboard</button>

        <button style={menuButtonStyle}>
          Favoritos: {favorites.length}
        </button>

        <button onClick={() => setFavorites([])} style={menuButtonStyle}>
          Reset favoritos
        </button>
      </aside>

      <main style={contentStyle}>
        <h1 style={titleStyle}>🔥 Marketplace Premium</h1>

        <section style={statsGridStyle}>
          <div style={statsCardStyle}>
            <p>Total coches</p>
            <h2>{dashboard.stats.total_cars}</h2>
          </div>

          <div style={statsCardStyle}>
            <p>Score medio</p>
            <h2>{dashboard.stats.avg_score}</h2>
          </div>

          <div style={statsCardStyle}>
            <p>Hot Deals</p>
            <h2>{dashboard.stats.hot_deals_count}</h2>
          </div>

          <div style={statsCardStyle}>
            <p>Favoritos</p>
            <h2>{favorites.length}</h2>
          </div>
        </section>

        <section style={filtersStyle}>
          <input
            placeholder="Buscar BMW, Audi, Mercedes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchStyle}
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={selectStyle}
          >
            <option value="score">Mejor score</option>
            <option value="profit">Mayor beneficio</option>
            <option value="price">Precio más alto</option>
          </select>
        </section>

        <section style={cardsGridStyle}>
          {cars.map((car) => {
            const isFavorite = favorites.includes(car.id);

            return (
              <div
                key={car.id}
                style={{
                  ...cardStyle,
                  border: isFavorite
                    ? "2px solid #ef4444"
                    : "1px solid #334155",
                }}
              >
                <img
                  src={car.image_url}
                  alt={car.brand}
                  style={imageStyle}
                />

                <h2>
                  {car.brand} {car.model}
                </h2>

                <p>📅 Año: {car.year}</p>
                <p>🛣️ KM: {car.km}</p>
                <p>💰 Precio: {car.price}€</p>
                <p>📈 Score: {car.score}</p>
                <p>💵 Beneficio: {car.estimated_net_profit}€</p>
                <p>🏷️ {car.label}</p>

                {car.is_hot_deal && (
                  <div style={hotBadgeStyle}>🔥 HOT DEAL</div>
                )}

                {car.is_premium_brand && (
                  <div style={premiumBadgeStyle}>⭐ PREMIUM</div>
                )}

                <button
                  onClick={() => toggleFavorite(car.id)}
                  style={favoriteButtonStyle}
                >
                  {isFavorite ? "Guardado" : "Favorito"}
                </button>

                <button
                  onClick={() => deleteCar(car.id)}
                  style={deleteButtonStyle}
                >
                  Eliminar
                </button>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}

const layoutStyle = {
  display: "flex",
  minHeight: "100vh",
  background: "#020617",
  color: "white",
  fontFamily: "Arial",
};

const sidebarStyle = {
  width: "260px",
  background: "#0f172a",
  padding: "25px",
  borderRight: "1px solid #1e293b",
};

const logoStyle = {
  fontSize: "30px",
  marginBottom: "25px",
};

const menuButtonStyle = {
  width: "100%",
  padding: "15px",
  borderRadius: "14px",
  border: "none",
  background: "#1e293b",
  color: "white",
  marginBottom: "12px",
  cursor: "pointer",
  fontSize: "16px",
};

const contentStyle = {
  flex: 1,
  padding: "40px",
};

const titleStyle = {
  fontSize: "42px",
  marginBottom: "30px",
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
  gap: "20px",
  marginBottom: "30px",
};

const statsCardStyle = {
  background: "#1e293b",
  padding: "25px",
  borderRadius: "22px",
};

const filtersStyle = {
  display: "flex",
  gap: "15px",
  flexWrap: "wrap",
  marginBottom: "30px",
};

const searchStyle = {
  flex: 1,
  minWidth: "280px",
  padding: "16px",
  borderRadius: "14px",
  border: "1px solid #334155",
  background: "#1e293b",
  color: "white",
};

const selectStyle = {
  padding: "16px",
  borderRadius: "14px",
  border: "1px solid #334155",
  background: "#1e293b",
  color: "white",
};

const cardsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
  gap: "25px",
};

const cardStyle = {
  background: "#1e293b",
  borderRadius: "24px",
  padding: "24px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
};

const imageStyle = {
  width: "100%",
  height: "220px",
  objectFit: "cover",
  borderRadius: "16px",
  marginBottom: "18px",
};

const hotBadgeStyle = {
  background: "gold",
  color: "black",
  padding: "8px 12px",
  borderRadius: "10px",
  display: "inline-block",
  fontWeight: "bold",
  marginRight: "8px",
  marginBottom: "12px",
};

const premiumBadgeStyle = {
  background: "#334155",
  color: "white",
  padding: "8px 12px",
  borderRadius: "10px",
  display: "inline-block",
  fontWeight: "bold",
  marginBottom: "12px",
};

const favoriteButtonStyle = {
  marginTop: "15px",
  width: "100%",
  padding: "14px",
  borderRadius: "14px",
  border: "none",
  background: "#ef4444",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const deleteButtonStyle = {
  marginTop: "10px",
  width: "100%",
  padding: "14px",
  borderRadius: "14px",
  border: "none",
  background: "#334155",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const loadingStyle = {
  background: "#020617",
  minHeight: "100vh",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "30px",
};

export default App;

