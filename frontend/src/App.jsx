import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [dashboard, setDashboard] = useState(null);

  const [favorites, setFavorites] = useState([]);

  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] =
    useState("score");

  useEffect(() => {
    loadDashboard();

    const saved =
      localStorage.getItem(
        "favorites"
      );

    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  const loadDashboard = () => {
    fetch(`${API_URL}/cars/dashboard`)
      .then((res) => res.json())
      .then((data) =>
        setDashboard(data)
      );
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(
        favorites.filter(
          (fav) => fav !== id
        )
      );
    } else {
      setFavorites([
        ...favorites,
        id,
      ]);
    }
  };

  if (!dashboard) {
    return (
      <div style={loadingStyle}>
        Cargando marketplace...
      </div>
    );
  }

  let cars =
    dashboard.top_deals || [];

  cars = cars.filter((car) => {
    const text =
      `${car.brand} ${car.model}`.toLowerCase();

    return text.includes(
      search.toLowerCase()
    );
  });

  cars = [...cars].sort((a, b) => {
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

  const totalProfit =
    cars.reduce(
      (acc, car) =>
        acc +
        car.estimated_net_profit,
      0
    );

  return (
    <div style={appStyle}>
      <aside style={sidebarStyle}>
        <h1 style={logoStyle}>
          🚗 Auto Intelligence
        </h1>

        <p style={subLogoStyle}>
          Enterprise Marketplace
        </p>

        <button
          style={sidebarButtonStyle}
        >
          📊 Dashboard
        </button>

        <button
          style={sidebarButtonStyle}
        >
          🔥 Hot Deals
        </button>

        <button
          style={sidebarButtonStyle}
        >
          ⭐ Premium
        </button>

        <button
          style={sidebarButtonStyle}
        >
          ❤️ Favoritos (
          {favorites.length})
        </button>
      </aside>

      <main style={contentStyle}>
        <h1 style={titleStyle}>
          Marketplace Dashboard
        </h1>

        <p style={subtitleStyle}>
          Inteligencia profesional
          para compra y reventa
        </p>

        <div style={controlsStyle}>
          <input
            placeholder="Buscar BMW, Audi..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            style={searchStyle}
          />

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value
              )
            }
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
        </div>

        <div style={statsGridStyle}>
          <div style={glassCardStyle}>
            <p>Total coches</p>

            <h2>
              {
                dashboard.stats
                  .total_cars
              }
            </h2>
          </div>

          <div style={glassCardStyle}>
            <p>🔥 Hot Deals</p>

            <h2>
              {
                dashboard.stats
                  .hot_deals_count
              }
            </h2>
          </div>

          <div style={glassCardStyle}>
            <p>
              💰 Beneficio total
            </p>

            <h2
              style={{
                color: "#22c55e",
              }}
            >
              {Math.round(
                totalProfit
              )}
              €
            </h2>
          </div>
        </div>

        <section style={gridStyle}>
          {cars.map((car) => {
            const favorite =
              favorites.includes(
                car.id
              );

            const roi =
              Math.round(
                (car.estimated_net_profit /
                  car.price) *
                  100
              );

            return (
              <div
                key={car.id}
                style={{
                  ...cardStyle,
                  border:
                    favorite
                      ? "2px solid red"
                      : car.is_hot_deal
                      ? "2px solid gold"
                      : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <img
                  src={car.image_url}
                  alt={car.brand}
                  style={imageStyle}
                />

                <div
                  style={
                    badgeRowStyle
                  }
                >
                  {car.is_hot_deal && (
                    <span
                      style={
                        hotBadgeStyle
                      }
                    >
                      🔥 HOT
                    </span>
                  )}

                  {car.is_premium_brand && (
                    <span
                      style={
                        premiumBadgeStyle
                      }
                    >
                      ⭐ PREMIUM
                    </span>
                  )}
                </div>

                <h2>
                  {car.brand}{" "}
                  {car.model}
                </h2>

                <div
                  style={
                    miniGridStyle
                  }
                >
                  <div
                    style={
                      miniCardStyle
                    }
                  >
                    <small>
                      PRECIO
                    </small>

                    <strong>
                      {car.price}€
                    </strong>
                  </div>

                  <div
                    style={
                      miniCardStyle
                    }
                  >
                    <small>
                      SCORE
                    </small>

                    <strong>
                      {car.score}
                    </strong>
                  </div>

                  <div
                    style={
                      miniCardStyle
                    }
                  >
                    <small>
                      ROI
                    </small>

                    <strong
                      style={{
                        color:
                          roi > 15
                            ? "#22c55e"
                            : "gold",
                      }}
                    >
                      {roi}%
                    </strong>
                  </div>

                  <div
                    style={
                      miniCardStyle
                    }
                  >
                    <small>
                      BENEFICIO
                    </small>

                    <strong
                      style={{
                        color:
                          "#22c55e",
                      }}
                    >
                      {
                        car.estimated_net_profit
                      }
                      €
                    </strong>
                  </div>
                </div>

                <div
                  style={
                    recommendationStyle
                  }
                >
                  🧠{" "}
                  {
                    car.recommendation
                  }
                </div>

                <button
                  onClick={() =>
                    toggleFavorite(
                      car.id
                    )
                  }
                  style={{
                    ...favoriteButtonStyle,
                    background:
                      favorite
                        ? "#dc2626"
                        : "#ef4444",
                  }}
                >
                  {favorite
                    ? "❤️ Guardado"
                    : "🤍 Favorito"}
                </button>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}

const appStyle = {
  display: "flex",
  minHeight: "100vh",
  background: "#020617",
  color: "white",
  fontFamily: "Arial",
};

const sidebarStyle = {
  width: "280px",
  background: "#0f172a",
  padding: "25px",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const logoStyle = {
  fontSize: "32px",
};

const subLogoStyle = {
  color: "#94a3b8",
  marginBottom: "25px",
};

const sidebarButtonStyle = {
  padding: "16px",
  borderRadius: "16px",
  border: "none",
  background: "#1e293b",
  color: "white",
  cursor: "pointer",
  fontSize: "16px",
};

const contentStyle = {
  flex: 1,
  padding: "40px",
};

const titleStyle = {
  fontSize: "56px",
};

const subtitleStyle = {
  color: "#94a3b8",
  fontSize: "18px",
  marginBottom: "25px",
};

const controlsStyle = {
  display: "flex",
  gap: "15px",
  marginBottom: "30px",
};

const searchStyle = {
  flex: 1,
  padding: "18px",
  borderRadius: "18px",
  border: "none",
  background: "#1e293b",
  color: "white",
};

const selectStyle = {
  padding: "18px",
  borderRadius: "18px",
  border: "none",
  background: "#1e293b",
  color: "white",
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: "20px",
  marginBottom: "35px",
};

const glassCardStyle = {
  background:
    "rgba(30,41,59,0.8)",
  padding: "25px",
  borderRadius: "24px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(360px,1fr))",
  gap: "25px",
};

const cardStyle = {
  background: "#1e293b",
  padding: "22px",
  borderRadius: "28px",
};

const imageStyle = {
  width: "100%",
  height: "220px",
  objectFit: "cover",
  borderRadius: "18px",
  marginBottom: "15px",
};

const badgeRowStyle = {
  display: "flex",
  gap: "10px",
  marginBottom: "14px",
};

const hotBadgeStyle = {
  background: "gold",
  color: "black",
  padding: "8px 12px",
  borderRadius: "10px",
  fontWeight: "bold",
};

const premiumBadgeStyle = {
  background: "#334155",
  color: "white",
  padding: "8px 12px",
  borderRadius: "10px",
  fontWeight: "bold",
};

const miniGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(2,1fr)",
  gap: "12px",
  marginTop: "20px",
  marginBottom: "20px",
};

const miniCardStyle = {
  background: "#0f172a",
  padding: "14px",
  borderRadius: "14px",
};

const recommendationStyle = {
  background:
    "linear-gradient(135deg,#1d4ed8,#2563eb)",
  padding: "16px",
  borderRadius: "14px",
  marginBottom: "18px",
};

const favoriteButtonStyle = {
  width: "100%",
  marginTop: "10px",
  padding: "14px",
  borderRadius: "14px",
  border: "none",
  color: "white",
  cursor: "pointer",
};

const loadingStyle = {
  minHeight: "100vh",
  background: "#020617",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontSize: "34px",
};

export default App;

