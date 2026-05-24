import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [logged, setLogged] = useState(false);

  const [password, setPassword] =
    useState("");

  const [dashboard, setDashboard] =
    useState(null);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    if (
      localStorage.getItem("logged") ===
      "true"
    ) {
      setLogged(true);
    }
  }, []);

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
    }
  };

  const logout = () => {
    localStorage.removeItem("logged");

    setLogged(false);
  };

  const loadDashboard = () => {
    fetch(`${API_URL}/cars/dashboard`)
      .then((res) => res.json())
      .then((data) =>
        setDashboard(data)
      );
  };

  if (!logged) {
    return (
      <div style={loginPageStyle}>
        <div style={loginCardStyle}>
          <h1>
            🚗 Auto Intelligence
          </h1>

          <input
            type="password"
            placeholder="Password"
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

  let cars =
    dashboard.top_deals || [];

  cars = cars.filter((car) => {
    const text =
      `${car.brand} ${car.model}`.toLowerCase();

    return text.includes(
      search.toLowerCase()
    );
  });

  const chartData = cars.map(
    (car) => ({
      name:
        car.brand +
        " " +
        car.model,
      profit:
        car.estimated_net_profit,
      score: car.score,
    })
  );

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
              Charts Dashboard
            </h1>

            <p style={subtitleStyle}>
              AI Automotive Analytics
            </p>
          </div>
        </div>

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

        <div style={chartCardStyle}>
          <h2>
            💰 Profit Analytics
          </h2>

          <div
            style={{
              width: "100%",
              height: 400,
            }}
          >
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar dataKey="profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <section style={gridStyle}>
          {cars.map((car) => (
            <div
              key={car.id}
              style={cardStyle}
            >
              <img
                src={car.image_url}
                alt=""
                style={imageStyle}
              />

              <h2>
                {car.brand}{" "}
                {car.model}
              </h2>

              <p>
                💰 Profit:
                {" "}
                {
                  car.estimated_net_profit
                }
                €
              </p>

              <p>
                📈 Score:
                {" "}
                {car.score}
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
            </div>
          ))}
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

const chartCardStyle = {
  background:
    "rgba(30,41,59,0.8)",
  padding: "30px",
  borderRadius: "28px",
  marginBottom: "35px",
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

const recommendationStyle = {
  background:
    "linear-gradient(135deg,#1d4ed8,#2563eb)",
  padding: "16px",
  borderRadius: "14px",
  marginTop: "18px",
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
