import { useEffect, useState } from "react";

function App() {

  const [dashboard, setDashboard] = useState(null);

  const [search, setSearch] = useState("");

  const [onlyHotDeals, setOnlyHotDeals] = useState(false);

  const [sortBy, setSortBy] = useState("score");

  const [loadingImport, setLoadingImport] = useState(false);

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

  const importMobileCars = async () => {

    setLoadingImport(true);

    await fetch(
      "http://127.0.0.1:8000/cars/import-mobile",
      {
        method: "POST"
      }
    );

    loadDashboard();

    setLoadingImport(false);
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

        <div style={topActionsStyle}>

          <button
            onClick={importMobileCars}
            style={importButtonStyle}
          >
            {loadingImport
              ? "Importando..."
              : "📥 Importar Mobile.de"}
          </button>

        </div>

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

      </main>

    </div>

  );
}

const layoutStyle = {
  display: "flex",
  minHeight: "100vh",
  background: "#0f172a",
  color: "white",
  fontFamily: "Arial"
};

const sidebarStyle = {
  width: "250px",
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

const topActionsStyle = {
  marginBottom: "25px"
};

const importButtonStyle = {
  padding: "18px 24px",
  borderRadius: "14px",
  border: "none",
  background: "gold",
  color: "black",
  fontWeight: "bold",
  fontSize: "18px",
  cursor: "pointer"
};

const formCardStyle = {
  background: "#1e293b",
  padding: "25px",
  borderRadius: "20px",
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
  background: "#22c55e",
  color: "white",
  fontWeight: "bold",
  fontSize: "18px",
  cursor: "pointer"
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

