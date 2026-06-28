import Plot from 'react-plotly.js'

const TYPE_COLORS = {
  'Delta':           '#FECACA',
  'Theta':           '#BFDBFE',
  'Alpha':           '#A7F3D0',
  'Beta':            '#DDD6FE',
  'Theta/Beta Ratio':'#FDE68A',
  'Statistical':     '#E5E7EB',
}

const TYPE_BORDER = {
  'Delta':           '#EF4444',
  'Theta':           '#3B82F6',
  'Alpha':           '#10B981',
  'Beta':            '#8B5CF6',
  'Theta/Beta Ratio':'#F59E0B',
  'Statistical':     '#9CA3AF',
}

export default function FeatureImportanceChart({ data, title, valueKey }) {
  if (!data) return null

  const top15 = data.slice(0, 15)

  const trace = {
    x: top15.map(d => d[valueKey]),
    y: top15.map(d => d.feature),
    type: 'bar',
    orientation: 'h',
    marker: {
      color: top15.map(d => TYPE_COLORS[d.type] || '#E5E7EB'),
      line: {
        color: top15.map(d => TYPE_BORDER[d.type] || '#9CA3AF'),
        width: 1,
      },
    },
    hovertemplate: '<b>%{y}</b><br>Value: %{x:.5f}<extra></extra>',
  }

  const legendTraces = Object.entries(TYPE_COLORS).map(([type, color]) => ({
    x: [null],
    y: [null],
    type: 'bar',
    name: type,
    marker: { color, line: { color: TYPE_BORDER[type], width: 1 } },
    showlegend: true,
  }))

  return (
    <Plot
      data={[trace, ...legendTraces]}
      layout={{
        paper_bgcolor: 'transparent',
        plot_bgcolor:  '#FAFAF8',
        margin: { t: 16, r: 16, b: 48, l: 130 },
        xaxis: {
          title: { text: title, font: { size: 12, color: '#6B7280' } },
          gridcolor: '#E5E7EB',
          zeroline: false,
          tickfont: { family: 'JetBrains Mono', size: 10, color: '#6B7280' },
        },
        yaxis: {
          autorange: 'reversed',
          tickfont: { family: 'JetBrains Mono', size: 10.5, color: '#1A1A1A' },
          gridcolor: 'transparent',
        },
        legend: {
          orientation: 'h',
          x: 0, y: -0.18,
          font: { family: 'Inter', size: 11 },
        },
        font: { family: 'Inter' },
        barmode: 'overlay',
      }}
      config={{ displayModeBar: false, responsive: true }}
      style={{ width: '100%', height: '420px' }}
      useResizeHandler
    />
  )
}