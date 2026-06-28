import Plot from 'react-plotly.js'

export default function ROCChart({ rocData }) {
  if (!rocData) return null

  const traces = Object.entries(rocData).map(([name, d]) => ({
    x: d.fpr,
    y: d.tpr,
    type: 'scatter',
    mode: 'lines',
    name: `${name} (AUC = ${d.auc.toFixed(3)})`,
    line: {
      width: 2.5,
      color: name === 'Random Forest' ? '#E07B7B' : '#7BB8E0',
    },
  }))

  traces.push({
    x: [0, 1],
    y: [0, 1],
    type: 'scatter',
    mode: 'lines',
    name: 'Random',
    line: { color: '#D1D5DB', width: 1.5, dash: 'dash' },
    showlegend: true,
  })

  return (
    <Plot
      data={traces}
      layout={{
        paper_bgcolor: 'transparent',
        plot_bgcolor:  '#FAFAF8',
        margin: { t: 16, r: 16, b: 48, l: 56 },
        xaxis: {
          title: { text: 'False Positive Rate', font: { size: 12, color: '#6B7280' } },
          range: [0, 1],
          gridcolor: '#E5E7EB',
          zeroline: false,
          tickfont: { family: 'JetBrains Mono', size: 11, color: '#6B7280' },
        },
        yaxis: {
          title: { text: 'True Positive Rate', font: { size: 12, color: '#6B7280' } },
          range: [0, 1],
          gridcolor: '#E5E7EB',
          zeroline: false,
          tickfont: { family: 'JetBrains Mono', size: 11, color: '#6B7280' },
        },
        legend: {
          x: 0.98, y: 0.02,
          xanchor: 'right', yanchor: 'bottom',
          font: { family: 'JetBrains Mono', size: 11 },
          bgcolor: 'rgba(255,255,255,0.85)',
          bordercolor: '#E5E7EB',
          borderwidth: 1,
        },
        font: { family: 'Inter' },
      }}
      config={{ displayModeBar: false, responsive: true }}
      style={{ width: '100%', height: '360px' }}
      useResizeHandler
    />
  )
}