interface BreakdownViewProps {
  text: string
  isStreaming: boolean
  error: string | null
}

export function BreakdownView({ text, isStreaming, error }: BreakdownViewProps) {
  if (error) {
    return (
      <div
        style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: 12,
          padding: 20,
        }}
      >
        <p style={{ color: '#DC2626', fontSize: 14, margin: 0 }}>{error}</p>
      </div>
    )
  }

  if (!text && isStreaming) {
    return (
      <div
        style={{
          background: 'white',
          border: '1px solid #E5E7EB',
          borderRadius: 12,
          padding: 40,
          textAlign: 'center',
        }}
      >
        <p style={{ color: '#9CA3AF', fontSize: 14, margin: 0 }}>Thinking…</p>
      </div>
    )
  }

  const sections = text.split(/(?=^## )/m).filter(Boolean)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {sections.map((section, i) => {
        const lines = section.split('\n')
        const heading = lines[0].replace(/^## /, '')
        const body = lines.slice(1).join('\n').trim()
        return (
          <div
            key={i}
            style={{
              background: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: 12,
              padding: 20,
            }}
          >
            <h3
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#3C3489',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 10,
                margin: '0 0 10px',
              }}
            >
              {heading}
            </h3>
            <p
              style={{
                fontSize: 14,
                color: '#374151',
                lineHeight: 1.75,
                whiteSpace: 'pre-wrap',
                margin: 0,
              }}
            >
              {body}
            </p>
          </div>
        )
      })}

      {isStreaming && (
        <div
          style={{
            height: 3,
            background: '#EEEDFE',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: '40%',
              background: '#3C3489',
              borderRadius: 2,
              animation: 'stream-pulse 1.2s ease-in-out infinite',
            }}
          />
        </div>
      )}
    </div>
  )
}
