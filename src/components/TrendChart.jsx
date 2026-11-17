import { useLayoutEffect, useRef, useState } from 'react'

// 관리자 화면의 최근 14일 꺾은선 그래프. 왼쪽이 오래된 날, 오른쪽이 오늘.
// 색은 색각 이상 검사를 통과한 순서 고정 팔레트. 정확한 숫자는 아래 표와 마우스를 올렸을 때의 툴팁으로 본다.

export const SERIES = [
  { key: 'visits', label: '방문', color: '#2a78d6' },
  { key: 'returning', label: '재방문', color: '#eb6834' },
  { key: 'copies', label: '복사', color: '#1baf7a' },
  { key: 'searches', label: '검색', color: '#eda100' },
]

const H = 220
const PAD = { top: 12, right: 12, bottom: 26, left: 34 }

// 0부터 시작하는 보기 좋은 눈금 (최대값 위로 4칸 정도)
function ticks(max) {
  const raw = Math.max(max, 4) / 4
  const mag = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 5, 10].map((m) => m * mag).find((s) => s >= raw)
  const top = Math.ceil(Math.max(max, 1) / step) * step
  return Array.from({ length: top / step + 1 }, (_, i) => i * step)
}

export default function TrendChart({ daily }) {
  const boxRef = useRef(null)
  const [width, setWidth] = useState(640)
  const [hover, setHover] = useState(null)

  useLayoutEffect(() => {
    const el = boxRef.current
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(280, e.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // 서버는 오늘부터 거꾸로 주므로 뒤집어서 왼쪽 → 오른쪽이 시간 순서가 되게 한다
  const days = [...daily].reverse()
  const max = Math.max(...days.flatMap((d) => SERIES.map((s) => d[s.key])))
  const yTicks = ticks(max)
  const yTop = yTicks.at(-1)
  const plotW = width - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const x = (i) => PAD.left + (days.length > 1 ? (i / (days.length - 1)) * plotW : plotW / 2)
  const y = (v) => PAD.top + plotH - (v / yTop) * plotH
  const step = days.length > 1 ? plotW / (days.length - 1) : plotW
  // 좁은 화면에서는 날짜 글자가 겹치지 않게 건너뛴다
  const labelEvery = width < 520 ? 3 : width < 760 ? 2 : 1

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const i = Math.round((e.clientX - rect.left - PAD.left) / step)
    setHover(Math.min(days.length - 1, Math.max(0, i)))
  }

  const hd = hover != null ? days[hover] : null
  const tipLeft = hover != null ? Math.min(Math.max(x(hover), 80), width - 80) : 0

  return (
    <div className="trend">
      <ul className="trend-legend">
        {SERIES.map((s) => (
          <li key={s.key}>
            <i style={{ background: s.color }} />
            {s.label}
          </li>
        ))}
      </ul>
      <div className="trend-plot" ref={boxRef}>
        <svg width={width} height={H} role="img" aria-label="최근 14일 방문, 재방문, 복사, 검색 추이. 정확한 숫자는 아래 표에 있어요." onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
          {yTicks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} className="trend-grid" />
              <text x={PAD.left - 8} y={y(t)} className="trend-axis" textAnchor="end" dominantBaseline="middle">
                {t}
              </text>
            </g>
          ))}
          {days.map((d, i) =>
            i % labelEvery === (days.length - 1) % labelEvery ? (
              <text key={d.day} x={x(i)} y={H - 8} className="trend-axis" textAnchor="middle">
                {d.day.slice(5).replace('-', '/')}
              </text>
            ) : null,
          )}
          {hover != null && <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + plotH} className="trend-cross" />}
          {SERIES.map((s) => (
            <polyline key={s.key} points={days.map((d, i) => `${x(i)},${y(d[s.key])}`).join(' ')} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          ))}
          {hd &&
            SERIES.map((s) => <circle key={s.key} cx={x(hover)} cy={y(hd[s.key])} r="4.5" fill={s.color} stroke="#fff" strokeWidth="2" />)}
          {/* 마우스를 받는 투명한 판 (선보다 넓게) */}
          <rect x={PAD.left - step / 2} y={0} width={plotW + step} height={H} fill="transparent" />
        </svg>
        {hd && (
          <div className="trend-tip" style={{ left: tipLeft }}>
            <b>{hd.day.slice(5).replace('-', '/')}</b>
            {SERIES.map((s) => (
              <span key={s.key}>
                <i style={{ background: s.color }} />
                {s.label}
                <em className="mono">{hd[s.key]}</em>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
