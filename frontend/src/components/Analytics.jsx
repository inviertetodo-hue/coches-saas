function Analytics({ cars }) {

  const favorites =
    cars.filter(c => c.is_favorite).length

  const sold =
    cars.filter(c => c.is_sold).length

  const topProfit =
    Math.max(
      ...cars.map(c => c.estimated_net_profit || 0),
      0
    )

  const topROI =
    Math.max(
      ...cars.map(c => c.roi || 0),
      0
    )

  return (

    <>

      <div className="analytics-grid">

        <div className="analytics-card">
          <h2>⭐ Favoritos</h2>
          <h1>{favorites}</h1>
        </div>

        <div className="analytics-card">
          <h2>✅ Vendidos</h2>
          <h1>{sold}</h1>
        </div>

        <div className="analytics-card">
          <h2>💰 Top Profit</h2>
          <h1>{topProfit} €</h1>
        </div>

        <div className="analytics-card">
          <h2>📈 Top ROI</h2>
          <h1>{topROI}%</h1>
        </div>

      </div>

      <div className="insight-box">

        <h2>
          🤖 Insight IA
        </h2>

        <p>
          El sistema detecta automáticamente
          oportunidades de compraventa con
          mayor probabilidad de beneficio,
          utilizando ROI, depreciación,
          kilometraje, demanda y margen estimado.
        </p>

      </div>

    </>

  )
}

export default Analytics
