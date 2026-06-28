import Plot from 'react-plotly.js'

export default function SHAPWaterfall({ data }) {
  if (!data) return null

  const features = [...data.features].reverse()
  const names    = features.map(f => f.feature)
  const values   = features.map(f => f.shap_value)

  const colors = values.map(v => v > 0 ? '#E07B7B' : '#7BB8E0')

  const trace = {
    type: 'bar',
    orientation: 'h',
    x: values,
    y: names,
    marker: { color: colors },
    hovertemplate: '<b>%{y}</b><br>SHAP: %{x:.4f}<extra></extra>',
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        marginBottom: '0.75rem',
        fontSize: '0.8rem',
        color: '#6B7280',
        fontFamily: 'JetBrains Mono, monospace',
      }}>
        <span>Predicted probability: <strong style={{ color: '#1A1A1A' }}>{data.predicted_prob.toFixed(3)}</strong></span>
        <span>Base value: <strong style={{ color: '#1A1A1A' }}>{data.base_value.toFixed(3)}</strong></span>
      </div>
      <Plot
        data={[trace]}
        layout={{
          paper_bgcolor: 'transparent',
          plot_bgcolor:  '#FAFAF8',
          margin: { t: 8, r: 24, b: 40, l: 130 },
          xaxis: {
            title: { text: 'SHAP value (impact on prediction)', font: { size: 11, color: '#6B7280' } },
            gridcolor: '#E5E7EB',
            zeroline: true,
            zerolinecolor: '#9CA3AF',
            zerolinewidth: 1.5,
            tickfont: { family: 'JetBrains Mono', size: 10, color: '#6B7280' },
          },
          yaxis: {
            tickfont: { family: 'JetBrains Mono', size: 10, color: '#1A1A1A' },
            gridcolor: 'transparent',
          },
          font: { family: 'Inter' },
          shapes: [{
            type: 'line',
            x0: 0, x1: 0, y0: -0.5, y1: features.length - 0.5,
            line: { color: '#6B7280', width: 1, dash: 'dot' },
          }],
        }}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: '100%', height: '360px' }}
        useResizeHandler
      />
      <div style={{
        display: 'flex',
        gap: '1.25rem',
        fontSize: '0.75rem',
        color: '#6B7280',
        fontFamily: 'Inter, sans-serif',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: '#E07B7B', display: 'inline-block' }} />
          Pushes toward ADHD
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: '#7BB8E0', display: 'inline-block' }} />
          Pushes toward Control
        </span>
      </div>
    </div>
  )
}