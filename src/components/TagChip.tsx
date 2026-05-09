import type { Tag } from '../types'

interface Props {
  tag: Tag
  active?: boolean
  onClick?: () => void
  small?: boolean
}

const TAG_COLORS: Record<Tag, { color: string; bg: string; activeBg: string }> = {
  DEV: { color: '#38bdf8', bg: 'rgba(14,165,233,0.08)',   activeBg: 'rgba(14,165,233,0.22)' },
  SEC: { color: '#34d399', bg: 'rgba(16,185,129,0.08)',   activeBg: 'rgba(16,185,129,0.22)' },
  AI:  { color: '#fbbf24', bg: 'rgba(245,158,11,0.08)',   activeBg: 'rgba(245,158,11,0.22)'  },
}

export function TagChip({ tag, active, onClick, small }: Props) {
  const { color, bg, activeBg } = TAG_COLORS[tag]
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center font-medium transition-all duration-150 select-none ${
        small ? 'text-[11px] px-1.5 py-0.5 rounded' : 'text-xs px-3 py-1.5 rounded-lg'
      }`}
      style={{
        color,
        background: active ? activeBg : bg,
        border: `1px solid ${active ? color + '60' : color + '25'}`,
      }}
    >
      #{tag}
    </button>
  )
}
