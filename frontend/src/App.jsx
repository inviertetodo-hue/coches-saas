import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [dashboard, setDashboard] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("score");
  const [loadingImport, setLoadingImport] = useState(false);

  useEffect(() => {
    loadDashboard();

    const saved = localStorage.getItem("favorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
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

  if (!dashboard) {
    return <div style={loadingStyle}>Cargando Auto Intelligence...</div>;
  }

  let cars = dashboard.top_deals || [];

  cars = cars.filter((car) => {
    const text = `${car.brand} ${car.model}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  if (filter === "HOT") {
    cars = cars.filter((car) => car.is_hot_deal);
  }

  if (filter === "PREMIUM") {
    cars = cars.filter((car) => car.is_premium_brand);
  }

  if (filter === "FAVORITES") {
    cars = cars.filter((car) => favorites.includes(car.id));
  }

  cars = [...cars].sort((a, b) => {
    if (sortBy === "score") return b.score - a.score;
    if (sortBy === "profit") return b.estimated_net_profit - 
a.estimated_net_profit;
    if (sortBy === "price") return b.price - a.price;
    if (sortBy === "year") return b.year - a.year;
    return 0;
  });

  const totalProfit = cars.reduce(
    (acc, car) => acc + car.estimated_net_profit,
    0
  );

  const avgROI =
    cars.length > 0
      ? Math.round(
          cars.reduce((acc, car) => {
            return acc + (car.estimated_net_profit / car.price) * 100;
          }, 0) / cars.length
        )
      : 0;

  const bestDeals = [...cars].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <div style={appStyle}>
      <aside style={sidebarStyle}>
        <h1 style={logoStyle}>🚗 Auto Intelligence</h1>
        <p style={sidebarSubStyle}>Enterprise Marketplace</p>

        <button onClick={() => setFilter("ALL")} style={sidebarButtonStyle}>
          📊 Dashboard
        </button>

        <button onClick={() => setFilter("HOT")} style={sidebarButtonStyle}>
          🔥 Hot Deals
        </button>

        <button onClick={() => setFilter("PREMIUM")} 
style={sidebarButtonStyle}>
          ⭐ Premium
        </button>

        <button onClick={() => setFilter("FAVORITES")} 
style={sidebarButtonStyle}>
          ❤️ Favoritos ({favorites.length})
        </button>

        <button onClick={() => setFavorites([])} style={resetButtonStyle}>
          🧹 Reset favoritos
        </button>
      </aside>

      <main style={contentStyle}>
        <div style={heroStyle}>
          <div>
            <h1 style={titleStyle}>Automotive Intelligence</h1>
            <p style={subtitleStyle}>
              Motor profesional para detectar oportunidades de compra y 
reventa
            </p>
          </div>

          <button onClick={importMobile} style={importButtonStyle}>
            {loadingImport ? "Importando..." : "📥 Importar Mobile.de"}
          </button>
        </div>

        <div style={controlsStyle}>
          <input
            type="text"
            placeholder="Buscar BMW, Audi, Porsche..."
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
            <option value="year">Año más nuevo</option>
          </select>
        </div>

        <section style={kpiGridStyle}>
          <div style={glassCardStyle}>
            <p>Total coches</p>
            <h2>{dashboard.stats.total_cars}</h2>
          </div>

          <div style={glassCardStyle}>
            <p>🔥 Hot Deals</p>
            <h2>{dashboard.stats.hot_deals_count}</h2>
          </div>

          <div style={glassCardStyle}>
            <p>⭐ Score medio</p>
            <h2>{dashboard.stats.avg_score}</h2>
          </div>

          <div style={glassCardStyle}>
            <p>💰 Beneficio visible</p>
            <h2 style={{ color: "#22c55e" }}>{Math.round(totalProfit)}€</h2>
          </div>

          <div style={glassCardStyle}>
            <p>📈 ROI medio</p>
            <h2 style={{ color: "gold" }}>{avgROI}%</h2>
          </div>
        </section>

        <section style={analyticsGridStyle}>
          <div style={leaderboardStyle}>
            <h2>🏆 Top oportunidades</h2>

            {bestDeals.map((car, index) => (
              <div key={car.id} style={leaderboardRowStyle}>
                <div style={rankStyle}>#{index + 1}</div>

                <div>
                  <strong>
                    {car.brand} {car.model}
                  </strong>
                  <p style={mutedStyle}>Score {car.score}</p>
                </div>

                <strong style={{ color: "#22c55e" }}>
                  {car.estimated_net_profit}€
                </strong>
              </div>
            ))}
          </div>

          <div style={aiPanelStyle}>
            <h2>🧠 AI Alerts</h2>

            <div style={alertStyle}>🔥 Buscar unidades premium con ROI 
alto</div>
            <div style={alertStyle}>📈 Priorizar coches con score superior a 
70</div>
            <div style={alertStyle}>⚠️ Revisar kilometraje alto antes de 
comprar</div>
            <div style={alertStyle}>💰 Enfocar capital en oportunidades con 
beneficio positivo</div>
          </div>
        </section>

        {cars.length === 0 && (
          <div style={emptyStyle}>No hay coches con estos filtros</div>
        )}

        <section style={gridStyle}>
          {cars.map((car) => {
            const favorite = favorites.includes(car.id);

            const roi = Math.round(
              (car.estimated_net_profit / car.price) * 100
            );

            return (
              <div
                key={car.id}
                style={{
                  ...cardStyle,
                  border: favorite
                    ? "2px solid #ef4444"
                    : car.is_hot_deal
                    ? "2px solid gold"
                    : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <img src={car.image_url} alt={car.brand} style={imageStyle} 
/>

                <div style={badgeRowStyle}>
                  {car.is_hot_deal && <span style={hotBadgeStyle}>🔥 
HOT</span>}
                  {car.is_premium_brand && (
                    <span style={premiumBadgeStyle}>⭐ PREMIUM</span>
                  )}
                </div>

                <h2>
                  {car.brand} {car.model}
                </h2>

                <div style={miniGridStyle}>
                  <div style={miniCardStyle}>
                    <small>PRECIO</small>
                    <strong>{car.price}€</strong>
                  </div>

                  <div style={miniCardStyle}>
                    <small>SCORE</small>
                    <strong>{car.score}</strong>
                  </div>

                  <div style={miniCardStyle}>
                    <small>ROI</small>
                    <strong style={{ color: roi > 15 ? "#22c55e" : "gold" 
}}>
                      {roi}%
                    </strong>
                  </div>

                  <div style={miniCardStyle}>
                    <small>BENEFICIO</small>
                    <strong style={{ color: "#22c55e" }}>
                      {car.estimated_net_profit}€
                    </strong>
                  </div>
                </div>

                <div style={recommendationStyle}>🧠 
{car.recommendation}</div>

                <button
                  onClick={() => toggleFavorite(car.id)}
                  style={{
                    ...favoriteButtonStyle,
                    background: favorite ? "#dc2626" : "#ef4444",
                  }}
                >
                  {favorite ? "❤️ Guardado" : "🤍 Favorito"}
                </button>

                <button onClick={() => deleteCar(car.id)} 
style={deleteButtonStyle}>
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
  width: "280px",
  background: "rgba(15,23,42,0.96)",
  padding: "25px",
  borderRight: "1px solid rgba(255,255,255,0.08)",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const logoStyle = {
  fontSize: "34px",
  marginBottom: "5px",
};

const sidebarSubStyle = {
  color: "#94a3b8",
  marginBottom: "25px",
};

const sidebarButtonStyle = {
  padding: "16px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(30,41,59,0.8)",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
};

const resetButtonStyle = {
  ...sidebarButtonStyle,
  background: "#334155",
};

const contentStyle = {
  flex: 1,
  padding: "40px",
};

const heroStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
  flexWrap: "wrap",
  gap: "20px",
};

const titleStyle = {
  fontSize: "58px",
  marginBottom: "6px",
};

const subtitleStyle = {
  color: "#94a3b8",
  fontSize: "18px",
};

const importButtonStyle = {
  padding: "18px 26px",
  borderRadius: "18px",
  border: "none",
  background: "linear-gradient(135deg,gold,#f59e0b)",
  color: "black",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "16px",
};

const controlsStyle = {
  display: "flex",
  gap: "15px",
  flexWrap: "wrap",
  marginBottom: "30px",
};

const searchStyle = {
  flex: 1,
  minWidth: "280px",
  padding: "18px",
  borderRadius: "18px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(30,41,59,0.85)",
  color: "white",
};

const selectStyle = {
  padding: "18px",
  borderRadius: "18px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(30,41,59,0.85)",
  color: "white",
};

const kpiGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
  gap: "20px",
  marginBottom: "35px",
};

const glassCardStyle = {
  background: "rgba(30,41,59,0.75)",
  padding: "25px",
  borderRadius: "24px",
  border: "1px solid rgba(255,255,255,0.08)",
};

const analyticsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
  gap: "25px",
  marginBottom: "35px",
};

const leaderboardStyle = {
  background: "rgba(30,41,59,0.75)",
  padding: "25px",
  borderRadius: "24px",
};

const aiPanelStyle = {
  background: "rgba(30,41,59,0.75)",
  padding: "25px",
  borderRadius: "24px",
};

const leaderboardRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px",
  borderRadius: "14px",
  background: "#0f172a",
  marginBottom: "12px",
};

const rankStyle = {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  background: "gold",
  color: "black",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
};

const mutedStyle = {
  color: "#94a3b8",
  margin: 0,
};

const alertStyle = {
  background: "#0f172a",
  padding: "16px",
  borderRadius: "14px",
  marginBottom: "12px",
};

const emptyStyle = {
  background: "#1e293b",
  padding: "25px",
  borderRadius: "20px",
  textAlign: "center",
  marginBottom: "30px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(360px,1fr))",
  gap: "25px",
};

const cardStyle = {
  background: "rgba(30,41,59,0.75)",
  padding: "24px",
  borderRadius: "28px",
  boxShadow: "0 10px 35px rgba(0,0,0,0.35)",
};

const imageStyle = {
  width: "100%",
  height: "230px",
  objectFit: "cover",
  borderRadius: "18px",
  marginBottom: "18px",
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
  gridTemplateColumns: "repeat(2,1fr)",
  gap: "12px",
  marginTop: "20px",
  marginBottom: "20px",
};

const miniCardStyle = {
  background: "#0f172a",
  padding: "14px",
  borderRadius: "14px",
  display: "flex",
  flexDirection: "column",
  gap: "5px",
};

const recommendationStyle = {
  background: "linear-gradient(135deg,#1d4ed8,#2563eb)",
  padding: "16px",
  borderRadius: "14px",
  marginBottom: "18px",
  fontWeight: "bold",
};

const favoriteButtonStyle = {
  width: "100%",
  marginTop: "10px",
  padding: "14px",
  borderRadius: "14px",
  border: "none",
  color: "white",
  fontWeight: "bold",
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
  fontWeight: "bold",
  cursor: "pointer",
};

const loadingStyle = {
  background: "#020617",
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontSize: "34px",
};

export default App;

