import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [logged, setLogged] = useState(false);
  const [password, setPassword] = useState("");
  const [dashboard, setDashboard] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("score");
  const [loadingImport, setLoadingImport] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("logged") === "true") {
      setLogged(true);
    }

    const saved = localStorage.getItem("favorites");

    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (logged) {
      loadDashboard();
    }
  }, [logged]);

  const login = () => {
    if (password === "admin123") {
      localStorage.setItem("logged", "true");
      setLogged(true);
    } else {
      alert("Password incorrecta");
    }
  };

  const logout = () => {
    localStorage.removeItem("logged");
    setLogged(false);
  };

  const loadDashboard = () => {
    fetch(`${API_URL}/cars/dashboard`)
      .then((res) => res.json())
      .then((data) => setDashboard(data));
  };

  const importMobile = async () => {
    setLoadingImport(true);

    await fetch(`${API_URL}/cars/import-mobile`, {
      method: "POST",
    });

    loadDashboard();

    setLoadingImport(false);
  };

  const deleteCar = async (id) => {
    await fetch(`${API_URL}/cars/${id}`, {
      method: "DELETE",
    });

    loadDashboard();
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((fav) => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  if (!logged) {
    return (
      <div style={loginPageStyle}>
        <div style={loginCardStyle}>
          <h1>🚗 Auto Intelligence</h1>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={loginInputStyle}
          />

          <button onClick={login} style={loginButtonStyle}>
            Entrar
          </button>

          <p style={mutedStyle}>
            admin123
          </p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div style={loadingStyle}>
        Cargando...
      </div>
    );
  }

  let cars = dashboard.top_deals || [];

  cars = cars.filter((car) => {
    const text =
      `${car.brand} ${car.model}`.toLowerCase();

    return text.includes(
      search.toLowerCase()
    );
  });

  if (filter === "HOT") {
    cars = cars.filter(
      (car) => car.is_hot_deal
    );
  }

  if (filter === "PREMIUM") {
    cars = cars.filter(
      (car) =>
        car.is_premium_brand
    );
  }

  if (filter === "FAVORITES") {
    cars = cars.filter((car) =>
      favorites.includes(car.id)
    );
  }

  cars = [...cars].sort((a, b) => {
    const roiA =
      (a.estimated_net_profit /
        a.price) *
      100;

    const roiB =
      (b.estimated_net_profit /
        b.price) *
      100;

    if (sortBy === "score")
      return b.score - a.score;

    if (sortBy === "profit")
      return (
        b.estimated_net_profit -
        a.estimated_net_profit
      );

    if (sortBy === "roi")
      return roiB - roiA;

    return 0;
  });

  const totalProfit =
    cars.reduce(
      (acc, car) =>
        acc +
        car.estimated_net_profit,
      0
    );

  const avgROI =
    cars.length > 0
      ? Math.round(
          cars.reduce(
            (acc, car) =>
              acc +
              (car.estimated_net_profit /
                car.price) *
                100,
            0
          ) / cars.length
        )
      : 0;

  const bestCar = cars[0];

  return (
    <div style={appStyle}>
      <aside style={sidebarStyle}>
        <h1 style={logoStyle}>
          🚗 Auto Intelligence
        </h1>

        <button
          onClick={() =>
            setFilter("ALL")
          }
          style={sidebarButtonStyle}
        >
          📊 Todos
        </button>

        <button
          onClick={() =>
            setFilter("HOT")
          }
          style={sidebarButtonStyle}
        >
          🔥 Hot Deals
        </button>

        <button
          onClick={() =>
            setFilter("PREMIUM")
          }
          style={sidebarButtonStyle}
        >
          ⭐ Premium
        </button>

        <button
          onClick={() =>
            setFilter(
              "FAVORITES"
            )
          }
          style={sidebarButtonStyle}
        >
          ❤️ Favoritos
        </button>

        <button
          onClick={logout}
          style={logoutButtonStyle}
        >
          🚪 Logout
        </button>
      </aside>

      <main style={contentStyle}>
        <div style={topBarStyle}>
          <div>
            <h1 style={titleStyle}>
              Analytics Dashboard
            </h1>

            <p style={subtitleStyle}>
              Executive automotive AI
            </p>
          </div>

          <button
            onClick={importMobile}
            style={importButtonStyle}
          >
            {loadingImport
              ? "Importando..."
              : "📥 Importar"}
          </button>
        </div>

        <div style={kpiGridStyle}>
          <div style={kpiCardStyle}>
            <p>Total coches</p>

            <h2>
              {cars.length}
            </h2>
          </div>

          <div style={kpiCardStyle}>
            <p>💰 Profit</p>

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

          <div style={kpiCardStyle}>
            <p>📈 ROI medio</p>

            <h2
              style={{
                color: "gold",
              }}
            >
              {avgROI}%
            </h2>
          </div>

          <div style={kpiCardStyle}>
            <p>🔥 Hot deals</p>

            <h2>
              {
                dashboard.stats
                  .hot_deals_count
              }
            </h2>
          </div>
        </div>

        {bestCar && (
          <div style={bestDealStyle}>
            <div>
              <h2>
                🏆 Mejor oportunidad
              </h2>

              <h1>
                {bestCar.brand}{" "}
                {bestCar.model}
              </h1>

              <p>
                Profit:
                {" "}
                {
                  bestCar.estimated_net_profit
                }
                €
              </p>

              <p>
                ROI:
                {" "}
                {Math.round(
                  (bestCar.estimated_net_profit /
                    bestCar.price) *
                    100
                )}
                %
              </p>
            </div>

            <img
              src={bestCar.image_url}
              alt=""
              style={bestDealImageStyle}
            />
          </div>
        )}

        <div style={controlsStyle}>
          <input
            placeholder="Buscar..."
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
              Mayor profit
            </option>

            <option value="roi">
              Mayor ROI
            </option>
          </select>
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

                <h2>
                  {car.brand}{" "}
                  {car.model}
                </h2>

                <div style={progressContainerStyle}>
                  <div
                    style={{
                      ...progressBarStyle,
                      width: `${Math.min(
                        roi,
                        100
                      )}%`,
                    }}
                  />
                </div>

                <p>
                  ROI {roi}%
                </p>

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
                      PROFIT
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

                <button
                  onClick={() =>
                    deleteCar(
                      car.id
                    )
                  }
                  style={
                    deleteButtonStyle
                  }
                >
                  🗑️ Eliminar
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
  width: "260px",
  background: "#0f172a",
  padding: "25px",
};

const logoStyle = {
  fontSize: "30px",
  marginBottom: "30px",
};

const sidebarButtonStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "16px",
  border: "none",
  background: "#1e293b",
  color: "white",
  cursor: "pointer",
  marginBottom: "12px",
};

const logoutButtonStyle = {
  ...sidebarButtonStyle,
  background: "#dc2626",
};

const contentStyle = {
  flex: 1,
  padding: "40px",
};

const topBarStyle = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
};

const titleStyle = {
  fontSize: "56px",
};

const subtitleStyle = {
  color: "#94a3b8",
};

const importButtonStyle = {
  padding: "16px 24px",
  borderRadius: "16px",
  border: "none",
  background:
    "linear-gradient(135deg,gold,#f59e0b)",
  color: "black",
  fontWeight: "bold",
  cursor: "pointer",
};

const kpiGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: "20px",
  marginTop: "30px",
  marginBottom: "30px",
};

const kpiCardStyle = {
  background:
    "rgba(30,41,59,0.8)",
  padding: "25px",
  borderRadius: "24px",
};

const bestDealStyle = {
  background:
    "linear-gradient(135deg,#1e293b,#0f172a)",
  padding: "30px",
  borderRadius: "28px",
  marginBottom: "30px",
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
};

const bestDealImageStyle = {
  width: "320px",
  height: "180px",
  objectFit: "cover",
  borderRadius: "18px",
};

const controlsStyle = {
  display: "flex",
  gap: "14px",
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

const gridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(340px,1fr))",
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

const progressContainerStyle = {
  width: "100%",
  height: "12px",
  background: "#0f172a",
  borderRadius: "999px",
  overflow: "hidden",
  marginTop: "14px",
};

const progressBarStyle = {
  height: "100%",
  background:
    "linear-gradient(90deg,#22c55e,gold)",
};

const recommendationStyle = {
  background:
    "linear-gradient(135deg,#1d4ed8,#2563eb)",
  padding: "16px",
  borderRadius: "14px",
  marginTop: "18px",
  marginBottom: "18px",
};

const miniGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(2,1fr)",
  gap: "12px",
};

const miniCardStyle = {
  background: "#0f172a",
  padding: "14px",
  borderRadius: "14px",
};

const favoriteButtonStyle = {
  width: "100%",
  marginTop: "16px",
  padding: "14px",
  borderRadius: "14px",
  border: "none",
  color: "white",
  cursor: "pointer",
};

const deleteButtonStyle = {
  width: "100%",
  marginTop: "10px",
  padding: "14px",
  borderRadius: "14px",
  border: "none",
  background: "#334155",
  color: "white",
  cursor: "pointer",
};

const loginPageStyle = {
  minHeight: "100vh",
  background: "#020617",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
};

const loginCardStyle = {
  background: "#1e293b",
  padding: "40px",
  borderRadius: "24px",
  width: "360px",
};

const loginInputStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "14px",
  border: "none",
  background: "#0f172a",
  color: "white",
  marginTop: "20px",
  marginBottom: "20px",
};

const loginButtonStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "14px",
  border: "none",
  background: "gold",
  color: "black",
  fontWeight: "bold",
  cursor: "pointer",
};

const mutedStyle = {
  color: "#94a3b8",
  marginTop: "18px",
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
