// Animated EEG waveform — the signature hero element.
// Draws a realistic multi-channel EEG trace across the full width.
// Pure SVG, no dependencies.

export default function EEGWave() {
  const width  = 900
  const height = 80
  const points = 600

  const generateWave = (offset, freqMix) => {
    let d = `M 0 ${height / 2}`
    for (let i = 1; i <= points; i++) {
      const x = (i / points) * width
      const t = (i / points) * Math.PI * 2
      const y =
        height / 2 +
        Math.sin(t * 1.2 + offset)       * 6  +
        Math.sin(t * 5.5 + offset * 1.3) * 10 +
        Math.sin(t * 9.8 + offset * 0.7) * 7  +
        Math.sin(t * 22  + offset * 2.1) * 4  +
        Math.sin(t * freqMix + offset)   * 3
      d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`
    }
    return d
  }

  const channels = [
    { offset: 0,    freq: 31,  opacity: 0.55, color: '#2563EB' },
    { offset: 1.2,  freq: 17,  opacity: 0.30, color: '#6B7280' },
    { offset: 2.5,  freq: 43,  opacity: 0.18, color: '#6B7280' },
  ]

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="hero-wave"
      aria-hidden="true"
    >
      <defs>
        <style>{`
          @keyframes eeg-scroll {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          .eeg-track {
            animation: eeg-scroll 18s linear infinite;
          }
          .eeg-track-slow {
            animation: eeg-scroll 28s linear infinite;
          }
        `}</style>
        <clipPath id="wave-clip">
          <rect x="0" y="0" width={width} height={height} />
        </clipPath>
      </defs>
      <g clipPath="url(#wave-clip)">
        {channels.map((ch, i) => {
          const d1 = generateWave(ch.offset, ch.freq)
          const d2 = generateWave(ch.offset + 0.05, ch.freq + 1)
          return (
            <g
              key={i}
              className={i === 0 ? 'eeg-track' : 'eeg-track-slow'}
            >
              <path
                d={d1}
                fill="none"
                stroke={ch.color}
                strokeWidth={i === 0 ? 1.5 : 1}
                opacity={ch.opacity}
              />
              <path
                d={d2}
                fill="none"
                stroke={ch.color}
                strokeWidth={i === 0 ? 1.5 : 1}
                opacity={ch.opacity * 0.6}
                transform={`translate(${width}, 0)`}
              />
            </g>
          )
        })}
      </g>
    </svg>
  )
}