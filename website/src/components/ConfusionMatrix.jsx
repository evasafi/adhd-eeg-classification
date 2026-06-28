export default function ConfusionMatrix({ data, modelName }) {
  if (!data) return null

  const { TN, FP, FN, TP } = data
  const total = TN + FP + FN + TP
  const accuracy = ((TN + TP) / total * 100).toFixed(1)

  const cells = [
    { label: 'TN', value: TN, desc: 'True Negative',  bg: '#DBEAFE', text: '#1D4ED8' },
    { label: 'FP', value: FP, desc: 'False Positive', bg: '#FEE2E2', text: '#991B1B' },
    { label: 'FN', value: FN, desc: 'False Negative', bg: '#FEF3C7', text: '#92400E' },
    { label: 'TP', value: TP, desc: 'True Positive',  bg: '#D1FAE5', text: '#065F46' },
  ]

  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.5rem',
        maxWidth: '280px',
      }}>
        {cells.map(cell => (
          <div key={cell.label} style={{
            background: cell.bg,
            borderRadius: '4px',
            padding: '1rem',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '1.6rem',
              fontWeight: '500',
              color: cell.text,
              lineHeight: 1,
            }}>
              {cell.value}
            </div>
            <div style={{
              fontSize: '0.7rem',
              color: cell.text,
              marginTop: '0.3rem',
              opacity: 0.75,
              fontFamily: 'Inter, sans-serif',
            }}>
              {cell.desc}
            </div>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: '0.75rem',
        fontSize: '0.78rem',
        color: '#6B7280',
        fontFamily: 'JetBrains Mono, monospace',
      }}>
        Accuracy (out-of-fold): {accuracy}%
      </div>
    </div>
  )
}