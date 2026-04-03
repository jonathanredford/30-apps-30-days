'use client'

import { STYLES } from '@/lib/constants'

interface StyleGridProps {
  selected: string
  onSelect: (id: string) => void
}

export function StyleGrid({ selected, onSelect }: StyleGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: 12,
      }}
    >
      {STYLES.map((s) => {
        const isActive = selected === s.id
        return (
          <button
            key={s.id}
            data-style={s.id}
            onClick={() => onSelect(s.id)}
            style={{
              background: isActive ? '#EEEDFE' : 'white',
              border: isActive ? '2px solid #3C3489' : '1px solid #E5E7EB',
              borderRadius: 12,
              padding: '16px 12px',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 24 }}>{s.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#111827' }}>{s.name}</span>
            <span style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.4 }}>{s.desc}</span>
          </button>
        )
      })}
    </div>
  )
}
