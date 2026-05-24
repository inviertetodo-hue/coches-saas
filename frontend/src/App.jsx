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

  const [loadingImport, setLoadingImport] =
    useState(false);

  const [showModal, setShowModal] =
    useState(false);

  const [newCar, setNewCar] =
    useState({
      brand: "",
      model: "",
      year: "",
      km: "",
      price: "",
      image_url: "",
    });

  useEffect(() => {
    if (
      localStorage.getItem("logged") ===
      "true"
    ) {
      setLogged(true);
    }

    const saved =
      localStorage.getItem("favorites");

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

  useEffect(() => {
    if (logged) {
      loadDashboard();
    }
  }, [logged]);

  const login = () => {
    if (password === "admin123") {
      localStorage.setItem(
        "logged",
        "true"
      );

      setLogged(true);
    } else {
      alert("Password incorrecta");
    }
  };

  const logout = () => {
    localStorage.removeItem("logged");

    setLogged(false);

    setDashboard(null);
  };

  const loadDashboard = () => {
    fetch(`${API_URL}/cars/dashboard`)
      .then((res) => res.json())
      .then((data) =>
        setDashboard(data)
      );
  };

  const createCar = async () => {
    await fetch(`${API_URL}/cars/`, {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        ...newCar,
        year: Number(newCar.year),
        km: Number(newCar.km),
        price: Number(newCar.price),
      }),
    });

    setShowModal(false);

    setNewCar({
      brand: "",
      model: "",
      year: "",
      km: "",
      price: "",
      image_url: "",
    });

    loadDashboard();
  };

  const importMobile = async () => {
    setLoadingImport(true);

    await fetch(
      `${API_URL}/cars/import-mobile`,
      {
        method: "POST",
      }
    );

    loadDashboard();

    setLoadingImport(false);
  };

  const deleteCar = async (id) => {
    await fetch(
      `${API_URL}/cars/${id}`,
      {
        method: "DELETE",
      }
    );

    loadDashboard();
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

  if (!logged) {
    return (
      <div style={loginPageStyle}>
        <div style={loginCardStyle}>
          <h1>
            🚗 Auto Intelligence
          </h1>

          <p style={mutedStyle}>
            Panel privado enterprise
          </p>

          <input
            type="password"
            placeholder="Password admin"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            style={loginInputStyle}
          />

          <button
            onClick={login}
            style={loginButtonStyle}
          >
            Entrar
          </button>

          <p style={mutedStyle}>
            Password: admin123
          </p>
        </div>
      </div>
    );
  }

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

    if (sortBy === "price")
      return b.price - a.price;

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
          ❤️ Favoritos (
          {favorites.length})
        </button>

        <button
          onClick={() =>
            setShowModal(true)
          }
          style={greenButtonStyle}
        >
          ➕ Crear coche
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
              Marketplace Dashboard
            </h1>

            <p style={subtitleStyle}>
              Inteligencia profesional
              para compra y reventa
            </p>
          </div>

          <div style={headerButtonsStyle}>
            <button
              onClick={importMobile}
              style={importButtonStyle}
            >
              {loadingImport
                ? "Importando..."
                : "📥 Importar"}
            </button>
          </div>
        </div>

        <div style={kpiGridStyle}>
          <div style={kpiCardStyle}>
            <p>Total coches</p>

            <h2>
              {
                dashboard.stats
                  .total_cars
              }
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

          <div style={kpiCardStyle}>
            <p>💰 Profit total</p>

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
            <p>⭐ Score medio</p>

            <h2>
              {
                dashboard.stats
                  .avg_score
              }
            </h2>
          </div>
        </div>

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

            <option value="roi">
              Mayor ROI
            </option>

            <option value="price">
              Precio más alto
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

                <div style={badgeRowStyle}>
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

        {showModal && (
          <div style={modalOverlayStyle}>
            <div style={modalStyle}>
              <h2>
                ➕ Crear coche
              </h2>

              <input
                placeholder="Marca"
                value={newCar.brand}
                onChange={(e) =>
                  setNewCar({
                    ...newCar,
                    brand:
                      e.target.value,
                  })
                }
                style={modalInputStyle}
              />

              <input
                placeholder="Modelo"
                value={newCar.model}
                onChange={(e) =>
                  setNewCar({
                    ...newCar,
                    model:
                      e.target.value,
                  })
                }
                style={modalInputStyle}
              />

              <input
                placeholder="Año"
                value={newCar.year}
                onChange={(e) =>
                  setNewCar({
                    ...newCar,
                    year:
                      e.target.value,
                  })
                }
                style={modalInputStyle}
              />

              <input
                placeholder="KM"
                value={newCar.km}
                onChange={(e) =>
                  setNewCar({
                    ...newCar,
                    km: e.target.value,
                  })
                }
                style={modalInputStyle}
              />

              <input
                placeholder="Precio"
                value={newCar.price}
                onChange={(e) =>
                  setNewCar({
                    ...newCar,
                    price:
                      e.target.value,
                  })
                }
                style={modalInputStyle}
              />

              <input
                placeholder="URL imagen"
                value={
                  newCar.image_url
                }
                onChange={(e) =>
                  setNewCar({
                    ...newCar,
                    image_url:
                      e.target.value,
                  })
                }
                style={modalInputStyle}
              />

              <div style={modalButtonsStyle}>
                <button
                  onClick={createCar}
                  style={
                    createButtonStyle
                  }
                >
                  Crear
                </button>

                <button
                  onClick={() =>
                    setShowModal(
                      false
                    )
                  }
                  style={
                    cancelButtonStyle
                  }
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
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
};

const logoStyle = {
  fontSize: "32px",
};

const subLogoStyle = {
  color: "#94a3b8",
  marginBottom: "25px",
};

const sidebarButtonStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "16px",
  border: "none",
  background: "#1e293b",
  color: "white",
  cursor: "pointer",
  fontSize: "16px",
  marginBottom: "12px",
};

const greenButtonStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "16px",
  border: "none",
  background: "#16a34a",
  color: "white",
  cursor: "pointer",
  fontSize: "16px",
  marginBottom: "12px",
};

const logoutButtonStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "16px",
  border: "none",
  background: "#dc2626",
  color: "white",
  cursor: "pointer",
  fontSize: "16px",
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

const headerButtonsStyle = {
  display: "flex",
  gap: "12px",
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
  marginTop: "35px",
  marginBottom: "35px",
};

const kpiCardStyle = {
  background:
    "rgba(30,41,59,0.8)",
  padding: "25px",
  borderRadius: "24px",
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

const modalOverlayStyle = {
  position: "fixed",
  inset: 0,
  background:
    "rgba(0,0,0,0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalStyle = {
  background: "#0f172a",
  padding: "30px",
  borderRadius: "24px",
  width: "420px",
  display: "grid",
  gap: "14px",
};

const modalInputStyle = {
  padding: "16px",
  borderRadius: "14px",
  border: "none",
  background: "#1e293b",
  color: "white",
};

const modalButtonsStyle = {
  display: "flex",
  gap: "12px",
};

const createButtonStyle = {
  flex: 1,
  padding: "16px",
  borderRadius: "14px",
  border: "none",
  background: "#16a34a",
  color: "white",
  cursor: "pointer",
};

const cancelButtonStyle = {
  flex: 1,
  padding: "16px",
  borderRadius: "14px",
  border: "none",
  background: "#334155",
  color: "white",
  cursor: "pointer",
};

const loginPageStyle = {
  minHeight: "100vh",
  background: "#020617",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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
  marginTop: "18px",
  marginBottom: "18px",
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
