import { motion, AnimatePresence } from 'motion/react'
import { C, PALETTE, ease, useStep, useTick, L, Icon, Check, Cursor } from './parts'

const sp = { type: 'spring', stiffness: 320, damping: 26 }
const Cap = ({ children, style }) => (
  <span className="chip" style={{ position: 'absolute', left: 0, right: 0, margin: '0 auto', width: 'fit-content', ...style }}>
    {children}
  </span>
)

/* ───────── 디자인 재료 ───────── */

export function PaddingMargin() {
  const s = useStep(4, 1300)
  const pad = s === 1 ? 22 : 8
  const gap = s === 3 ? 34 : 10
  return (
    <>
      <div className="center row" style={{ top: -14 }}>
        {[0, 1].map((i) => (
          <div key={i} className="row">
            {i === 1 && <motion.span className="pm-gap" initial={false} animate={{ width: gap, background: s === 3 ? 'rgba(77,156,255,.28)' : 'rgba(77,156,255,0)' }} transition={{ duration: 0.5, ease }} />}
            <motion.div className="pm-box" initial={false} animate={{ padding: pad, background: s === 1 ? '#FFE3D5' : '#ffffff' }} transition={{ duration: 0.5, ease }}>
              <div className="pm-content">
                <L w={46} h={5} c={C.ink} />
                <L w={36} h={4} />
              </div>
            </motion.div>
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={s < 2 ? 'p' : 'm'} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <Cap style={{ top: 164, color: s < 2 ? C.acc : '#2a6fd6' }}>{s < 2 ? 'padding · 상자 안쪽 여백' : 'margin · 상자 바깥 간격'}</Cap>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

const BRAND = [
  ['#FF6B2C', '오렌지'],
  ['#2EC4A0', '민트'],
  ['#4D9CFF', '블루'],
]
export function ColorHex() {
  const i = useStep(3, 1600)
  const [hex, name] = BRAND[i]
  return (
    <>
      <div className="row" style={{ position: 'absolute', left: 0, right: 0, top: 26, justifyContent: 'center', gap: 8 }}>
        {BRAND.map(([h], j) => (
          <motion.span key={h} className="ch-swatch" style={{ background: h }} initial={false} animate={{ scale: j === i ? 1.18 : 1, boxShadow: j === i ? `0 0 0 3px #fff, 0 0 0 5px ${h}` : '0 0 0 0 rgba(0,0,0,0)' }} />
        ))}
      </div>
      <div className="center col" style={{ top: 18, gap: 10 }}>
        <motion.span className="btn-mini" style={{ color: '#fff', padding: '9px 18px', fontSize: 12 }} initial={false} animate={{ background: hex }}>
          예약하기
        </motion.span>
        <motion.span className="ch-badge" initial={false} animate={{ color: hex, borderColor: hex }}>
          Primary · {name}
        </motion.span>
      </div>
      <AnimatePresence mode="wait">
        <motion.span key={hex} className="ch-hex mono" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {hex}
        </motion.span>
      </AnimatePresence>
    </>
  )
}

const TYPO = [
  [400, 18, 1.3, '보통 18'],
  [800, 26, 1.3, '굵게 26'],
  [600, 22, 1.8, '줄 간격 넓게'],
]
export function Typography() {
  const i = useStep(3, 1500)
  const [w, size, lh, label] = TYPO[i]
  return (
    <>
      <div style={{ position: 'absolute', left: 30, right: 30, top: 34, display: 'grid', gap: 8 }}>
        <motion.b initial={false} animate={{ fontSize: size, fontWeight: w }} transition={{ duration: 0.4, ease }} style={{ display: 'block', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          소금빵집
        </motion.b>
        <motion.div initial={false} animate={{ gap: lh === 1.8 ? 9 : 4 }} style={{ display: 'grid' }}>
          <L w="92%" h={4} />
          <L w="80%" h={4} />
          <L w="66%" h={4} />
        </motion.div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Cap style={{ top: 160 }}>
            <span className="mono">
              굵기 {w} · 크기 {size} · 줄 간격 {lh}
            </span>
          </Cap>
        </motion.div>
      </AnimatePresence>
      <span className="ty-tag">{label}</span>
    </>
  )
}

export function RadiusShadow() {
  const s = useStep(3, 1500)
  const r = [0, 18, 18][s]
  const sh = ['0 0 0 rgba(0,0,0,0)', '0 0 0 rgba(0,0,0,0)', '0 14px 28px rgba(40,30,10,.18)'][s]
  return (
    <>
      <div className="center" style={{ top: -12 }}>
        <motion.div className="rs-card" initial={false} animate={{ borderRadius: r, boxShadow: sh, y: s === 2 ? -6 : 0 }} transition={{ duration: 0.5, ease }}>
          <motion.span initial={false} animate={{ borderRadius: Math.max(0, r - 8) }} style={{ display: 'block', height: 52, background: PALETTE[1] }} />
          <L w={70} h={6} c={C.ink} />
          <L w={50} h={4} />
        </motion.div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={s} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Cap style={{ top: 164 }}>{['각진 모서리 · 그림자 없음', 'border-radius · 둥근 모서리', 'box-shadow · 떠 있는 그림자'][s]}</Cap>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

const ICON_SET = ['home', 'search', 'heart', 'user', 'bell', 'mail', 'gear', 'image']
export function IconDemo() {
  const k = useTick(3400)
  const hi = (k * 3) % ICON_SET.length
  return (
    <div key={k}>
      <div className="ic-grid">
        {ICON_SET.map((n, i) => (
          <motion.span key={n} className={'ic-cell' + (i === hi ? ' on' : '')} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07, ...sp }}>
            <Icon n={n} size={20} color={i === hi ? '#fff' : C.ink} />
          </motion.span>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <Cap style={{ top: 168 }}>
          <span className="mono">{ICON_SET[hi]}</span> · 말 대신 그림으로 뜻을 전해요
        </Cap>
      </motion.div>
    </div>
  )
}

/* ───────── 화면 상태 ───────── */

const STATES = [
  ['기본', { background: C.acc, scale: 1, boxShadow: '0 0 0 0 rgba(255,107,44,0)', opacity: 1 }],
  ['hover · 마우스 올림', { background: '#E85A1F', scale: 1.04, boxShadow: '0 0 0 0 rgba(255,107,44,0)', opacity: 1 }],
  ['pressed · 누르는 중', { background: '#C94A15', scale: 0.94, boxShadow: '0 0 0 0 rgba(255,107,44,0)', opacity: 1 }],
  ['focus · 키보드 선택', { background: C.acc, scale: 1, boxShadow: '0 0 0 4px rgba(255,107,44,.35)', opacity: 1 }],
  ['disabled · 누를 수 없음', { background: '#cfcac0', scale: 1, boxShadow: '0 0 0 0 rgba(255,107,44,0)', opacity: 0.7 }],
]
export function InteractionStates() {
  const s = useStep(5, 1100)
  return (
    <>
      <div className="center" style={{ top: -10 }}>
        <motion.span className="btn-mini" style={{ color: '#fff', padding: '11px 22px', fontSize: 13 }} initial={false} animate={STATES[s][1]} transition={{ duration: 0.25 }}>
          주문하기
        </motion.span>
      </div>
      <Cursor animate={{ x: s === 1 || s === 2 ? 150 : 214, y: s === 1 || s === 2 ? 110 : 160, scale: s === 2 ? 0.88 : 1, opacity: s === 0 || s === 4 ? 0 : s === 3 ? 0 : 1 }} transition={{ duration: 0.3 }} />
      <div className="is-dots">
        {STATES.map(([n], i) => (
          <motion.i key={n} initial={false} animate={{ background: i === s ? C.ink : '#d6d2c8', width: i === s ? 16 : 6 }} />
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={s} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <Cap style={{ top: 150 }}>{STATES[s][0]}</Cap>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export function DarkMode() {
  const dark = useStep(2, 1700) === 1
  const t = { duration: 0.45, ease }
  return (
    <motion.div className="win" style={{ inset: '18px 26px', padding: 14, display: 'grid', gap: 9, alignContent: 'start' }} initial={false} animate={{ background: dark ? '#17171b' : '#ffffff', borderColor: dark ? '#2a2a30' : '#e7e3da' }} transition={t}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <motion.b initial={false} animate={{ color: dark ? '#f2f0eb' : C.ink }} style={{ fontSize: 12 }}>
          소금빵집
        </motion.b>
        <motion.span className="dm-toggle" initial={false} animate={{ background: dark ? '#3a3a42' : '#f1eee8' }}>
          <motion.span initial={false} animate={{ x: dark ? 20 : 0, background: dark ? '#ffc43d' : C.acc }} transition={sp} />
        </motion.span>
      </div>
      <L w="80%" h={9} c={dark ? '#f2f0eb' : C.ink} style={{ transition: 'background .45s' }} />
      <L w="92%" h={4} c={dark ? '#5a5a62' : '#dcd8ce'} style={{ transition: 'background .45s' }} />
      <L w="70%" h={4} c={dark ? '#5a5a62' : '#dcd8ce'} style={{ transition: 'background .45s' }} />
      <motion.div className="cell" initial={false} animate={{ background: dark ? '#22222a' : '#ffffff', borderColor: dark ? '#2f2f37' : '#e7e3da' }} transition={t} style={{ height: 48, alignItems: 'center' }}>
        <span className="sq" style={{ background: C.acc }} />
        <L w={70} h={4} c={dark ? '#5a5a62' : '#dcd8ce'} />
      </motion.div>
      <motion.span className="mono" initial={false} animate={{ color: dark ? '#9a958b' : '#8a857b' }} style={{ fontSize: 8.5, justifySelf: 'end' }}>
        {dark ? '다크 모드' : '라이트 모드'}
      </motion.span>
    </motion.div>
  )
}

const BP = [
  [236, 3, '데스크톱 · 1024px 이상'],
  [168, 2, '태블릿 · 768px'],
  [96, 1, '모바일 · 390px'],
]
export function Breakpoint() {
  const i = useStep(3, 1600)
  const [w, cols, label] = BP[i]
  const t = { duration: 0.6, ease: [0.65, 0, 0.35, 1] }
  return (
    <>
      <div className="center" style={{ top: -16 }}>
        <motion.div className="win" style={{ position: 'relative', height: 132, padding: 8 }} initial={false} animate={{ width: w }} transition={t}>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 6 }}>
            {[0, 1, 2].map((j) => (
              <motion.div key={j} layout transition={t} className="cell" style={{ height: cols === 1 ? 32 : 100 }}>
                <span className="sq" style={{ background: PALETTE[j] }} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Cap style={{ top: 172 }}>
            <span className="mono">{label}</span>
          </Cap>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export function Accessibility() {
  const good = useStep(2, 1800) === 1
  return (
    <>
      <div className="win" style={{ inset: '20px 30px auto', height: 120, padding: 14, display: 'grid', gap: 8, alignContent: 'start' }}>
        <motion.b initial={false} animate={{ color: good ? '#1f1f24' : '#cfcac0' }} style={{ fontSize: 13 }}>
          오늘의 빵 나왔어요
        </motion.b>
        <motion.span initial={false} animate={{ color: good ? '#45423c' : '#dcd8ce' }} style={{ fontSize: 10 }}>
          오전 8시부터 소금빵 30개 한정
        </motion.span>
        <div className="row" style={{ gap: 6 }}>
          <span className="ac-img">
            <Icon n="image" size={14} color="#bdb8ad" />
          </span>
          <AnimatePresence>
            {good && (
              <motion.span className="chip mono" style={{ fontSize: 8.5 }} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                alt="갓 구운 소금빵 사진"
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.span key={good ? 'g' : 'b'} className={'cors-msg' + (good ? ' ok' : '')} style={{ top: 158 }} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {good ? '글자 대비 7.2 : 1 · 누구나 읽을 수 있어요' : '글자 대비 1.6 : 1 · 잘 안 보여요'}
        </motion.span>
      </AnimatePresence>
    </>
  )
}

/* ───────── 디자인 과정 ───────── */

const TOKEN_SETS = [
  [C.acc, 12],
  ['#4D9CFF', 4],
]
export function DesignSystem() {
  const i = useStep(2, 2000)
  const [color, radius] = TOKEN_SETS[i]
  const t = { duration: 0.45, ease }
  return (
    <>
      <div className="dsys-tokens">
        <span className="mini-cap">디자인 토큰</span>
        <div className="row" style={{ gap: 5, fontSize: 9, fontWeight: 700 }}>
          <motion.i className="ch-swatch" style={{ width: 14, height: 14 }} initial={false} animate={{ background: color }} />
          <span className="mono">primary</span>
        </div>
        <div className="row" style={{ gap: 5, fontSize: 9, fontWeight: 700 }}>
          <motion.i initial={false} animate={{ borderRadius: radius }} style={{ width: 14, height: 14, border: `2px solid ${C.ink}`, display: 'block' }} />
          <span className="mono">radius {radius}</span>
        </div>
      </div>
      <span className="st-arr" style={{ position: 'absolute', left: 116, top: 96 }}>
        →
      </span>
      <div className="dsys-comps">
        <motion.span className="btn-mini" style={{ color: '#fff', justifyContent: 'center' }} initial={false} animate={{ background: color, borderRadius: radius }} transition={t}>
          버튼
        </motion.span>
        <motion.div className="cell" style={{ height: 34, alignItems: 'center' }} initial={false} animate={{ borderRadius: radius, borderColor: color }} transition={t}>
          <motion.span className="sq" initial={false} animate={{ background: color }} />
          <L w={50} h={4} />
        </motion.div>
        <motion.span className="chip" initial={false} animate={{ color, borderColor: color, borderRadius: radius }} transition={t} style={{ justifySelf: 'start' }}>
          칩
        </motion.span>
      </div>
      <Cap style={{ top: 176 }}>규칙 하나만 바꾸면 모든 부품이 함께 바뀌어요</Cap>
    </>
  )
}

export function WireframePrototype() {
  const s = useStep(3, 1700)
  const designed = s >= 1
  return (
    <>
      <div className="row" style={{ position: 'absolute', left: 0, right: 0, top: 12, justifyContent: 'center', gap: 5 }}>
        {['와이어프레임', '디자인', '프로토타입'].map((n, i) => (
          <motion.span key={n} className="hcj-tag" initial={false} animate={{ background: s === i ? C.ink : '#ffffff', color: s === i ? '#ffffff' : '#6b665d' }}>
            <b>{n}</b>
          </motion.span>
        ))}
      </div>
      <motion.div className="win" style={{ left: 50, right: 50, top: 46, height: 132, padding: 10, display: 'grid', gap: 7, alignContent: 'start' }} initial={false} animate={{ borderStyle: designed ? 'solid' : 'dashed', borderColor: designed ? '#e7e3da' : '#bdb8ad' }}>
        <AnimatePresence mode="wait">
          {s === 2 ? (
            <motion.div key="p2" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.5 }} style={{ display: 'grid', gap: 6 }}>
              <b style={{ fontSize: 10 }}>예약 완료!</b>
              <L w="80%" h={4} />
              <L w="60%" h={4} />
              <span className="ag-ok" style={{ marginTop: 6 }}>
                <Check size={9} color="#fff" width={4} />
              </span>
            </motion.div>
          ) : (
            <motion.div key="p1" exit={{ x: -30, opacity: 0 }} style={{ display: 'grid', gap: 7 }}>
              <motion.div initial={false} animate={{ background: designed ? C.ink : '#ebe8e1' }} style={{ height: 8, width: '60%', borderRadius: designed ? 99 : 2 }} />
              <motion.div initial={false} animate={{ background: designed ? '#FFE3D5' : '#f3f1ec' }} style={{ height: 42, borderRadius: designed ? 8 : 2, border: designed ? 'none' : '1.5px dashed #cfcac0' }} />
              <motion.span className="btn-mini" initial={false} animate={{ background: designed ? C.acc : '#ffffff', color: designed ? '#ffffff' : '#8a857b', borderRadius: designed ? 99 : 3 }} style={{ justifySelf: 'start', border: designed ? 'none' : '1.5px dashed #bdb8ad' }}>
                예약하기
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <Cursor animate={{ x: s === 2 ? 92 : 220, y: s === 2 ? 126 : 190, opacity: s === 2 ? 1 : 0 }} transition={{ duration: 0.35 }} />
    </>
  )
}

export function UxUi() {
  const better = useStep(2, 2000) === 1
  return (
    <>
      <div className="uxui-col" style={{ left: 16 }}>
        <span className="mini-cap">UI · 보이는 모양</span>
        <motion.span className="btn-mini" initial={false} animate={{ background: better ? C.acc : '#e7e3da', color: better ? '#ffffff' : '#6b665d', borderRadius: better ? 99 : 4 }} style={{ padding: '8px 14px', justifySelf: 'start' }}>
          결제하기
        </motion.span>
        <span style={{ fontSize: 8.5, color: '#8a857b' }}>색·모양·글꼴</span>
      </div>
      <div className="uxui-col" style={{ right: 16 }}>
        <span className="mini-cap">UX · 쓰는 경험</span>
        <div className="row" style={{ gap: 4 }}>
          {[0, 1, 2, 3].map((i) => (
            <motion.span key={i} className="uxui-step" initial={false} animate={{ opacity: better && i > 0 && i < 3 ? 0.15 : 1, scale: better && i > 0 && i < 3 ? 0.7 : 1, background: i === 3 ? '#2ec4a0' : '#ffffff' }} />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.span key={better ? 'b' : 'a'} style={{ fontSize: 8.5, color: better ? '#158a6c' : '#8a857b', fontWeight: 700 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {better ? '1번 만에 결제 완료' : '4번 눌러야 결제 완료'}
          </motion.span>
        </AnimatePresence>
      </div>
      <Cap style={{ top: 170 }}>UI는 보기 좋게, UX는 쓰기 편하게</Cap>
    </>
  )
}

/* ───────── UI · 모션 추가 ───────── */

export function FormValidation() {
  const s = useStep(4, 1200)
  const err = s === 1
  const ok = s >= 2
  return (
    <div style={{ position: 'absolute', left: 50, right: 50, top: 22, display: 'grid', gap: 5 }}>
      {['이름', '이메일'].map((f, i) => (
        <div key={f} style={{ display: 'grid', gap: 3 }}>
          <span className="fl-label">{f}</span>
          <motion.div className="tf" style={{ height: 28, justifyContent: 'space-between' }} initial={false} animate={{ borderColor: err && i === 1 ? '#ff4d4f' : ok ? '#2ec4a0' : '#e2ded5', x: err && i === 1 ? [0, -5, 5, -3, 3, 0] : 0 }} transition={{ duration: 0.4 }}>
            <span style={{ fontSize: 10 }}>{i === 0 ? '김바이브' : ok ? 'vibe@mail.com' : ''}</span>
            {ok && (
              <span className="ag-ok" style={{ width: 14, height: 14 }}>
                <Check size={8} color="#fff" width={4} />
              </span>
            )}
          </motion.div>
          {i === 1 && <span className="tf-help" style={{ color: err ? '#e5484d' : 'transparent', fontWeight: 700 }}>이메일을 입력해 주세요</span>}
        </div>
      ))}
      <motion.span className="btn-mini" style={{ justifyContent: 'center', padding: 8, marginTop: 4, color: '#fff' }} initial={false} animate={{ background: s === 3 ? '#2ec4a0' : C.acc, scale: s === 1 || s === 3 ? [1, 0.94, 1] : 1 }} transition={{ duration: 0.3 }}>
        {s === 3 ? '가입 완료!' : '가입하기'}
      </motion.span>
    </div>
  )
}

export function FileUpload() {
  const k = useTick(4000)
  return (
    <div key={k}>
      <motion.div className="fu-zone" initial={{ borderColor: '#cfcac0', background: '#ffffff' }} animate={{ borderColor: ['#cfcac0', C.acc, C.acc], background: ['#ffffff', '#FFF3EA', '#FFF3EA'] }} transition={{ delay: 0.7, duration: 0.5 }}>
        <Icon n="image" size={20} color="#bdb8ad" />
        <span>사진을 여기로 끌어다 놓으세요</span>
      </motion.div>
      <motion.div className="fu-file" initial={{ x: 210, y: 150, rotate: 8, opacity: 0 }} animate={{ x: [210, 120, 120], y: [150, 66, 66], rotate: [8, -4, 0], opacity: [0, 1, 0] }} transition={{ duration: 1.4, times: [0, 0.6, 1] }}>
        <span style={{ background: PALETTE[3] }} />
        <b className="mono">bread.jpg</b>
      </motion.div>
      <Cursor initial={{ x: 236, y: 172 }} animate={{ x: [236, 146, 146], y: [172, 88, 88], opacity: [1, 1, 0] }} transition={{ duration: 1.4, times: [0, 0.6, 1] }} />
      <motion.div className="fu-done" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}>
        <span className="fu-thumb" style={{ background: PALETTE[3] }} />
        <div style={{ display: 'grid', gap: 4, flex: 1 }}>
          <span className="mono" style={{ fontSize: 9, fontWeight: 700 }}>bread.jpg · 2.1MB</span>
          <div className="pb-track" style={{ height: 6 }}>
            <motion.span initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ delay: 1.5, duration: 1.2, ease: 'easeInOut' }} />
          </div>
        </div>
        <motion.span className="ag-ok" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.7, ...sp }}>
          <Check size={9} color="#fff" width={4} />
        </motion.span>
      </motion.div>
    </div>
  )
}

export function DragDrop() {
  const k = useTick(3600)
  return (
    <div key={k}>
      {['할 일', '완료'].map((t, i) => (
        <div key={t} className="dd-col" style={{ left: i ? 146 : 16 }}>
          <span className="mini-cap">{t}</span>
          {(i ? [2] : [0, 1]).map((j) => (
            <div key={j} className="cell" style={{ height: 28, alignItems: 'center' }}>
              <span className="sq" style={{ background: PALETTE[j], width: 10, height: 10 }} />
              <L w={[56, 44, 50][j]} h={4} />
            </div>
          ))}
          {i === 1 && <motion.span className="dd-slot" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ delay: 0.6, duration: 1.2, times: [0, 0.5, 1] }} />}
        </div>
      ))}
      <motion.div className="cell dd-card" initial={{ x: 24, y: 123 }} animate={{ x: [24, 24, 154, 154], y: [123, 117, 89, 89], rotate: [0, -4, -4, 0], boxShadow: ['0 0 0 rgba(0,0,0,0)', '0 12px 22px rgba(0,0,0,.16)', '0 12px 22px rgba(0,0,0,.16)', '0 1px 2px rgba(0,0,0,.05)'] }} transition={{ duration: 1.8, times: [0, 0.2, 0.75, 1], ease: 'easeInOut' }}>
        <span className="sq" style={{ background: C.coral, width: 10, height: 10 }} />
        <L w={52} h={4} c={C.ink} />
      </motion.div>
      <Cursor initial={{ x: 70, y: 135 }} animate={{ x: [70, 70, 200, 200], y: [135, 129, 101, 115], opacity: [1, 1, 1, 0] }} transition={{ duration: 1.8, times: [0, 0.2, 0.75, 1], ease: 'easeInOut' }} />
    </div>
  )
}
