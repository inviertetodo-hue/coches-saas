import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [logged, setLogged] = useState(false);
  const [password, setPassword] = useState("");
  const [dashboard, setDashboard] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [aiLoading, setAiLoading] = useState(null);
  const [aiResponses, setAiResponses] = useState({});

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

  const analyzeAI = async (id) => {
    setAiLoading(id);

    const res = await fetch(
      `${API_URL}/cars/${id}/ai`
    );

    const data = await res.json();

    setAiResponses((prev) => ({
      ...prev,
      [id]: data.analysis,
    }));

    setAiLoading(null);
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(
        favorites.filter((fav) => fav !== id)
      );
    } else {
      setFavorites([...favorites, id]);
    }

    localStorage.setItem(
      "favorites",
      JSON.stringify(
        favorites.includes(id)
          ? favorites.filter((fav) => fav !== id)
          : [...favorites, id]
      )
    );
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
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={loginInputStyle}
          />

          <button
            onClick={login}
            style={loginButtonStyle}
          >
            Entrar
          </button>
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

  return (
    <div style={appStyle}>
      <aside style={sidebarStyle}>
        <h1 style={logoStyle}>
          🚗 Auto Intelligence
        </h1>

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
              AI Marketplace
            </h1>

            <p style={subtitleStyle}>
              Inteligencia artificial para compraventa
            </p>
          </div>
        </div>

        <input
          placeholder="Buscar..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={searchStyle}
        />

        <section style={gridStyle}>
          {cars.map((car) => {
            const favorite =
              favorites.includes(car.id);

            return (
              <div
                key={car.id}
                style={{
                  ...cardStyle,
                  border: favorite
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
                  {car.brand} {car.model}
                </h2>

                <p>
                  💰 Profit:
                  {" "}
                  {car.estimated_net_profit}€
                </p>

                <p>
                  📈 Score:
                  {" "}
                  {car.score}
                </p>

                <button
                  onClick={() =>
                    toggleFavorite(car.id)
                  }
                  style={{
                    ...favoriteButtonStyle,
                    background: favorite
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
                    analyzeAI(car.id)
                  }
                  style={aiButtonStyle}
                >
                  {aiLoading === car.id
                    ? "Analizando..."
                    : "🧠 Analizar IA"}
                </button>

                {aiResponses[car.id] && (
                  <div style={aiBoxStyle}>
                    <strong>
                      GPT Analysis
                    </strong>

                    <p>
                      {
                        aiResponses[
                          car.id
                        ]
                      }
                    </p>
                  </div>
                )}
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
  width: "240px",
  background: "#0f172a",
  padding: "25px",
};

const logoStyle = {
  fontSize: "30px",
};

const logoutButtonStyle = {
  width: "100%",
  marginTop: "30px",
  padding: "16px",
  borderRadius: "16px",
  border: "none",
  background: "#dc2626",
  color: "white",
  cursor: "pointer",
};

const contentStyle = {
  flex: 1,
  padding: "40px",
};

const topBarStyle = {
  marginBottom: "30px",
};

const titleStyle = {
  fontSize: "56px",
};

const subtitleStyle = {
  color: "#94a3b8",
};

const searchStyle = {
  width: "100%",
  padding: "18px",
  borderRadius: "18px",
  border: "none",
  background: "#1e293b",
  color: "white",
  marginBottom: "30px",
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

const favoriteButtonStyle = {
  width: "100%",
  marginTop: "16px",
  padding: "14px",
  borderRadius: "14px",
  border: "none",
  color: "white",
  cursor: "pointer",
};

const aiButtonStyle = {
  width: "100%",
  marginTop: "10px",
  padding: "14px",
  borderRadius: "14px",
  border: "none",
  background:
    "linear-gradient(135deg,#2563eb,#7c3aed)",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const aiBoxStyle = {
  marginTop: "16px",
  background: "#0f172a",
  padding: "18px",
  borderRadius: "16px",
  border: "1px solid #334155",
};

const loginPageStyle = {
  minHeight: "100vh",
  background: "#020617",
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
