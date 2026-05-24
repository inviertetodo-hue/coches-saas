import { useEffect, useState } from "react";

const API_URL = "https://coches-saas.onrender.com";

function App() {
  const [cars, setCars] = useState([]);

  const loadCars = async () => {
    const res = await fetch(`${API_URL}/cars/`);
    const data = await res.json();
    setCars(data);
  };

  useEffect(() => {
    loadCars();
  }, []);

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>🚗 Coches SaaS</h1>

      <p style={subtitleStyle}>
        Mercado inteligente de oportunidades
      </p>

      <div style={gridStyle}>
        {cars.map((car) => (
          <div key={car.id} style={cardStyle}>
            <img src={car.image_url} style={imageStyle} />

            <h2>
              {car.brand} {car.model}
            </h2>

            <p>📅 Año: {car.year}</p>
            <p>🛣️ KM: {car.km}</p>
            <p>💰 Precio: {car.price} €</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#0f172a",
  color: "white",
  padding: "40px",
  fontFamily: "Arial",
};

const titleStyle = {
  fontSize: "52px",
};

const subtitleStyle = {
  color: "#94a3b8",
  marginBottom: "40px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "25px",
};

const cardStyle = {
  background: "#1e293b",
  borderRadius: "20px",
  padding: "20px",
};

const imageStyle = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
  borderRadius: "14px",
};

export default App;
