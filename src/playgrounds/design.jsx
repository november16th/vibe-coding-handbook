import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Shell, EventLog, useEventLog, Slider, Segmented, Toggle } from '../components/kit'
import { C, Icon, Check } from '../demos/parts'

const EASE_OUT = [0.22, 1, 0.36, 1]

// 명도 대비 (WCAG)
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}
const isHex = (v) => /^#[0-9a-fA-F]{6}$/.test(v)

/* ───────── Padding / Margin ───────── */

function PaddingMarginPG() {
  const [pad, setPad] = useState(12)
  const [gap, setGap] = useState(6)
  const [guide, setGuide] = useState(true)
  const { logs, push, clear } = useEventLog()
  const presets = [
    { label: '답답하게', p: 6, g: 2 },
    { label: '보통', p: 16, g: 12 },
    { label: '여유 있게', p: 28, g: 20 },
  ]
  const prompt = `카드 안쪽 여백(padding)은 ${pad}px, 카드끼리 간격(margin/gap)은 ${gap}px로 맞춰줘. 모든 카드에 같은 값을 써서 간격이 들쭉날쭉하지 않게.`

  return (
    <Shell
      hint="슬라이더로 여백을 바꿔보세요"
      stage={
        <div className={'pgd-pm' + (guide ? ' guide' : '')}>
          {['오늘의 할 일', '장보기 목록', '읽을 책'].map((t, i) => (
            <div key={t}>
              {i > 0 && (
                <motion.div className="pgd-pm-gap" animate={{ height: gap }} transition={{ duration: 0.3, ease: EASE_OUT }}>
                  {guide && gap >= 14 && <span>margin {gap}</span>}
                </motion.div>
              )}
              <motion.div className="pgd-pm-card" animate={{ padding: pad }} transition={{ duration: 0.3, ease: EASE_OUT }}>
                <div className="pgd-pm-inner">
                  <b>{t}</b>
                  <span>항목 {3 - i}개</span>
                </div>
                {guide && i === 0 && pad >= 14 && <span className="pgd-pm-tag">padding {pad}</span>}
              </motion.div>
            </div>
          ))}
        </div>
      }
      controls={
        <>
          <div className="presets">
            {presets.map((p) => (
              <button
                key={p.label}
                className={'chip-btn' + (p.p === pad && p.g === gap ? ' on' : '')}
                onClick={() => {
                  setPad(p.p)
                  setGap(p.g)
                  push('option', `프리셋 '${p.label}' · padding ${p.p}px, margin ${p.g}px`)
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
          <Slider label="안쪽 여백 (padding)" value={pad} min={0} max={40} step={2} unit="px" onChange={setPad} />
          <Slider label="바깥 간격 (margin)" value={gap} min={0} max={40} step={2} unit="px" onChange={setGap} />
          <Toggle
            label="여백 영역 색으로 보기"
            value={guide}
            onChange={(v) => {
              setGuide(v)
              push('option', v ? '초록 = padding, 주황 = margin' : '여백 표시 끔')
            }}
          />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Color · HEX ───────── */

const SWATCHES = ['#FF6B2C', '#4D9CFF', '#2EC4A0', '#8B5CF6', '#FFC43D', '#1F1F24']

function ColorHexPG() {
  const [hex, setHex] = useState('#FF6B2C')
  const [draft, setDraft] = useState('#FF6B2C')
  const [text, setText] = useState('#1F1F24')
  const { logs, push, clear } = useEventLog()
  const ratio = contrast(hex, '#FFFFFF')
  const pick = (v) => {
    setHex(v)
    setDraft(v)
    const r = contrast(v, '#FFFFFF')
    push(r >= 3 ? 'open' : 'option', `대표 색 ${v} · 흰 글자 대비 ${r.toFixed(1)}:1${r < 3 ? ' (버튼 글자가 잘 안 보여요)' : ''}`)
  }
  const prompt = `사이트 대표 색(Primary)을 ${hex}로 정하고, 버튼 배경·링크·배지·강조 표시에 모두 이 색만 써줘. 본문 글자색은 ${text}로 통일.`

  return (
    <Shell
      hint="색을 바꾸면 사이트 전체가 바뀌어요"
      stage={
        <div className="pg-card pgd-color" style={{ '--p': hex, '--t': text }}>
          <div className="pgd-color-top">
            <b>MyShop</b>
            <span className="pgd-color-badge">NEW</span>
          </div>
          <h3>여름 신상품 모음</h3>
          <p>
            지금 가입하면 첫 구매 10% 할인. <a>자세히 보기</a>
          </p>
          <div className="pgd-color-row">
            <button className="pgd-color-btn">장바구니 담기</button>
            <button className="pgd-color-btn ghost">찜하기</button>
          </div>
          <div className="pgd-color-meta">
            <span className="mono">{hex}</span>
            <span className={ratio >= 3 ? 'ok' : 'err'}>흰 글자 대비 {ratio.toFixed(1)}:1</span>
          </div>
        </div>
      }
      controls={
        <>
          <div className="ctl">
            <span className="ctl-top">
              <span>대표 색 (Primary)</span>
            </span>
            <div className="pgd-swatches">
              {SWATCHES.map((s) => (
                <button key={s} className={hex === s ? 'on' : ''} style={{ background: s }} onClick={() => pick(s)} aria-label={s} />
              ))}
              <label className="pgd-picker">
                <input type="color" value={hex} onChange={(e) => pick(e.target.value.toUpperCase())} />
                직접
              </label>
            </div>
          </div>
          <label className="ctl">
            <span className="ctl-top">
              <span>HEX 코드 직접 입력</span>
            </span>
            <input
              className={'pg-input mono' + (isHex(draft) ? '' : ' err')}
              value={draft}
              maxLength={7}
              onChange={(e) => {
                const v = e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value
                setDraft(v.toUpperCase())
                if (isHex(v)) pick(v.toUpperCase())
              }}
            />
          </label>
          <Segmented label="본문 글자색" value={text} onChange={(v) => { setText(v); push('option', `글자색 ${v}`) }} options={[{ value: '#1F1F24', label: '진한 회색' }, { value: '#000000', label: '완전 검정' }, { value: '#6E6A62', label: '연한 회색' }]} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Typography ───────── */

const FONTS = {
  sans: { label: '고딕', css: "'Pretendard Variable', Pretendard, sans-serif", ko: 'Pretendard(고딕체)' },
  serif: { label: '명조', css: "'Noto Serif KR', 'Nanum Myeongjo', serif", ko: '명조체(Noto Serif KR)' },
  mono: { label: '코딩체', css: 'var(--mono)', ko: '고정폭 코딩 글꼴' },
}

function TypographyPG() {
  const [font, setFont] = useState('sans')
  const [h, setH] = useState(28)
  const [weight, setWeight] = useState(800)
  const [body, setBody] = useState(15)
  const [lh, setLh] = useState(1.7)
  const { logs, push, clear } = useEventLog()
  const prompt = `글꼴은 ${FONTS[font].ko}로 통일하고, 제목은 ${h}px·굵기 ${weight}, 본문은 ${body}px·줄 간격 ${lh}로 맞춰줘. 제목과 본문 사이는 12px 띄워서.`

  return (
    <Shell
      hint="글자 설정을 바꿔보세요"
      stage={
        <div className="pg-card pgd-type" style={{ fontFamily: FONTS[font].css }}>
          <span className="pgd-type-cap">매거진 · 3분 읽기</span>
          <motion.h3 animate={{ fontSize: h }} style={{ fontWeight: weight }} transition={{ duration: 0.25 }}>
            처음 만드는 나만의 웹사이트
          </motion.h3>
          <motion.p animate={{ fontSize: body, lineHeight: lh }} transition={{ duration: 0.25 }}>
            코드를 몰라도 괜찮아요. 원하는 화면을 정확한 이름으로 말하면 AI가 대신 만들어 줍니다. 글자 크기와 줄 간격만 바꿔도 같은 글이 훨씬 읽기 편해져요.
          </motion.p>
          <div className="pgd-type-spec mono">
            제목 {h}px / {weight} · 본문 {body}px / {lh}
          </div>
        </div>
      }
      controls={
        <>
          <Segmented label="글꼴 (font-family)" value={font} onChange={(v) => { setFont(v); push('option', `글꼴 → ${FONTS[v].ko}`) }} options={Object.entries(FONTS).map(([value, f]) => ({ value, label: f.label }))} />
          <Slider label="제목 크기" value={h} min={18} max={44} step={1} unit="px" onChange={setH} />
          <Segmented label="제목 굵기 (font-weight)" value={weight} onChange={(v) => { setWeight(v); push('option', `제목 굵기 ${v}`) }} options={[{ value: 400, label: '400 보통' }, { value: 600, label: '600 약간' }, { value: 800, label: '800 굵게' }]} />
          <Slider label="본문 크기" value={body} min={12} max={20} step={1} unit="px" onChange={setBody} />
          <Slider label="줄 간격 (line-height)" value={lh} min={1.1} max={2.2} step={0.1} onChange={setLh} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Border Radius · Shadow ───────── */

const SHADOWS = {
  none: { label: '없음', css: 'none', hover: '0 2px 6px rgba(31,31,36,0.08)', ko: '그림자 없이' },
  soft: { label: '옅게', css: '0 2px 8px rgba(31,31,36,0.06)', hover: '0 8px 22px rgba(31,31,36,0.12)', ko: '아주 옅은 그림자로' },
  mid: { label: '보통', css: '0 6px 18px rgba(31,31,36,0.12)', hover: '0 14px 32px rgba(31,31,36,0.18)', ko: '보통 그림자로' },
  deep: { label: '진하게', css: '0 14px 34px rgba(31,31,36,0.22)', hover: '0 22px 48px rgba(31,31,36,0.28)', ko: '진한 그림자로 확 떠 보이게' },
}

function RadiusShadowPG() {
  const [r, setR] = useState(16)
  const [sh, setSh] = useState('soft')
  const [lift, setLift] = useState(true)
  const [hover, setHover] = useState(null)
  const { logs, push, clear } = useEventLog()
  const s = SHADOWS[sh]
  const prompt = `카드 모서리는 ${r}px로 둥글게(border-radius), ${s.ko} 떠 보이게 해줘(box-shadow).${lift ? ' 마우스를 올리면 그림자가 조금 진해지고 2px 위로 떠오르게.' : ''} 버튼과 입력칸도 같은 둥글기를 써서 통일.`

  return (
    <Shell
      hint="카드에 마우스를 올려보세요"
      stage={
        <div className="pgd-rs">
          {['카드', '카드'].map((t, i) => (
            <motion.div
              key={i}
              className="pgd-rs-card"
              animate={{ borderRadius: r, boxShadow: lift && hover === i ? s.hover : s.css, y: lift && hover === i ? -2 : 0 }}
              transition={{ duration: 0.25 }}
              onHoverStart={() => {
                setHover(i)
                push('open', `카드 ${i + 1} hover${lift ? ' → 그림자 진하게' : ''}`)
              }}
              onHoverEnd={() => setHover(null)}
            >
              <motion.div className="pgd-rs-img" animate={{ borderRadius: Math.max(0, r - 6) }} />
              <b>{i ? '캠핑 의자' : '머그컵 세트'}</b>
              <span>{i ? '42,000원' : '18,000원'}</span>
            </motion.div>
          ))}
          <div className="pgd-rs-row">
            <motion.input className="pg-input" placeholder="이메일" animate={{ borderRadius: r }} />
            <motion.button className="btn" animate={{ borderRadius: r }}>
              구독
            </motion.button>
          </div>
        </div>
      }
      controls={
        <>
          <Slider label="모서리 둥글기 (border-radius)" value={r} min={0} max={32} step={2} unit="px" onChange={setR} />
          <Segmented label="그림자 (box-shadow)" value={sh} onChange={(v) => { setSh(v); push('option', `그림자 '${SHADOWS[v].label}'`) }} options={Object.entries(SHADOWS).map(([value, x]) => ({ value, label: x.label }))} />
          <Toggle label="마우스 올리면 떠오르기" value={lift} onChange={setLift} />
          <div className="pgd-code mono">
            border-radius: {r}px;
            <br />
            box-shadow: {s.css};
          </div>
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Icon ───────── */

const NAV = [
  ['home', '홈'],
  ['search', '검색'],
  ['heart', '찜'],
  ['bell', '알림'],
  ['user', '내 정보'],
]

function IconPG() {
  const [size, setSize] = useState(22)
  const [w, setW] = useState(2)
  const [label, setLabel] = useState(true)
  const [cur, setCur] = useState(0)
  const { logs, push, clear } = useEventLog()
  const prompt = `화면 아래 탭 바에 ${NAV.map((n) => n[1]).join('·')} 아이콘을 넣어줘. lucide-react 아이콘을 쓰고 크기 ${size}px, 선 굵기 ${w}로 통일.${label ? ' 아이콘 아래에 작은 글자도 함께.' : ' 글자 없이 아이콘만, 대신 aria-label은 꼭 넣어서.'} 선택된 탭은 주황색.`

  return (
    <Shell
      hint="탭을 눌러보세요"
      stage={
        <div className="pg-card pgd-icon">
          <div className="pgd-icon-grid">
            {['mail', 'folder', 'image', 'lock', 'gear', 'cloud', 'pen', 'plus'].map((n) => (
              <span key={n}>
                <Icon n={n} size={size} w={w} />
              </span>
            ))}
          </div>
          <nav className="pgd-icon-nav">
            {NAV.map(([n, l], i) => (
              <button
                key={n}
                className={cur === i ? 'on' : ''}
                aria-label={l}
                onClick={() => {
                  setCur(i)
                  push('open', `'${l}' 탭 선택`)
                }}
              >
                <motion.span animate={{ scale: cur === i ? 1.1 : 1 }} transition={{ type: 'spring', stiffness: 500, damping: 24 }}>
                  <Icon n={n} size={size} w={w} />
                </motion.span>
                {label && <small>{l}</small>}
              </button>
            ))}
          </nav>
        </div>
      }
      controls={
        <>
          <Slider label="아이콘 크기" value={size} min={14} max={32} step={1} unit="px" onChange={setSize} />
          <Slider label="선 굵기 (stroke-width)" value={w} min={1} max={3} step={0.25} onChange={setW} />
          <Toggle label="아이콘 아래 글자 함께" value={label} onChange={(v) => { setLabel(v); push('option', v ? '글자 보이기' : '아이콘만 (뜻이 헷갈릴 수 있어요)') }} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Interaction States ───────── */

const STATES = { live: '직접 해보기', hover: 'hover', pressed: 'pressed', focus: 'focus', disabled: 'disabled' }

function InteractionStatesPG() {
  const [force, setForce] = useState('live')
  const [scale, setScale] = useState(0.96)
  const [ring, setRing] = useState(true)
  const [h, setH] = useState(false)
  const [p, setP] = useState(false)
  const [f, setF] = useState(false)
  const [count, setCount] = useState(0)
  const { logs, push, clear } = useEventLog()
  const st = force === 'live' ? { hover: h, pressed: p, focus: f, disabled: false } : { hover: force === 'hover', pressed: force === 'pressed', focus: force === 'focus', disabled: force === 'disabled' }
  const bg = st.disabled ? '#D6D2C8' : st.pressed ? '#D9541B' : st.hover ? '#F05E20' : C.acc
  const now = st.disabled ? 'disabled' : st.pressed ? 'pressed' : st.focus ? 'focus' : st.hover ? 'hover' : 'default'
  const prompt = `버튼 상태를 모두 만들어줘. 기본은 주황 배경, hover는 조금 더 진하게, pressed(누르는 동안)는 크기 ${scale}배로 살짝 작아지게, ${ring ? 'focus(키보드 Tab으로 선택)는 바깥에 주황 테두리 링, ' : ''}disabled는 회색에 클릭 안 되게. 상태가 바뀔 때 0.15초로 부드럽게.`

  return (
    <Shell
      hint="마우스 올리기 · 누르기 · Tab 키"
      stage={
        <div className="pgd-is">
          <motion.button
            className="pgd-is-btn"
            disabled={st.disabled}
            animate={{ background: bg, scale: st.pressed ? scale : 1, boxShadow: st.focus && ring ? '0 0 0 4px rgba(255,107,44,0.3)' : '0 0 0 0px rgba(255,107,44,0)' }}
            transition={{ duration: 0.15 }}
            onHoverStart={() => { setH(true); force === 'live' && push('open', 'hover · 마우스가 올라옴') }}
            onHoverEnd={() => { setH(false); setP(false) }}
            onPointerDown={() => { setP(true); force === 'live' && push('move', 'pressed · 누르는 중') }}
            onPointerUp={() => setP(false)}
            onFocus={() => { setF(true); force === 'live' && push('child', 'focus · 키보드로 선택됨') }}
            onBlur={() => setF(false)}
            onClick={() => { setCount((c) => c + 1); push('end', `클릭 완료 (${count + 1}번째)`) }}
          >
            결제하기
          </motion.button>
          <div className="pgd-is-now">
            지금 상태 <b className="mono">{now}</b>
          </div>
          <div className="pgd-is-row">
            {['default', 'hover', 'pressed', 'focus', 'disabled'].map((x) => (
              <span key={x} className={now === x ? 'on' : ''}>
                {x}
              </span>
            ))}
          </div>
        </div>
      }
      controls={
        <>
          <Segmented label="상태 고정해서 보기" value={force} onChange={(v) => { setForce(v); push('option', v === 'live' ? '직접 조작 모드' : `${v} 상태로 고정`) }} options={Object.entries(STATES).map(([value, label]) => ({ value, label }))} />
          <Slider label="누를 때 크기 (pressed scale)" value={scale} min={0.85} max={1} step={0.01} unit="x" onChange={setScale} />
          <Toggle label="focus 테두리 링" value={ring} onChange={(v) => { setRing(v); push('option', v ? 'focus 링 켬' : 'focus 링 끔 (키보드 사용자가 길을 잃어요)') }} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Dark Mode ───────── */

function DarkModePG() {
  const [dark, setDark] = useState(false)
  const [start, setStart] = useState('system')
  const [remember, setRemember] = useState(true)
  const [dur, setDur] = useState(0.3)
  const { logs, push, clear } = useEventLog()
  const t = dark ? { bg: '#18181C', card: '#24242A', ink: '#F2F0EB', muted: '#9C978C', line: '#33333A' } : { bg: '#FAFAF7', card: '#FFFFFF', ink: '#1F1F24', muted: '#6E6A62', line: '#ECE8E0' }
  const flip = () => {
    setDark(!dark)
    push(dark ? 'close' : 'open', `${dark ? '라이트' : '다크'} 모드로 전환${remember ? ' · 선택 기억함' : ''}`)
  }
  const startKo = { system: '휴대폰·컴퓨터 설정(prefers-color-scheme)을 따라가게', light: '항상 라이트 모드로 시작하게', dark: '항상 다크 모드로 시작하게' }[start]
  const prompt = `다크 모드를 추가해줘. 오른쪽 위 토글로 바꿀 수 있고, 처음 들어오면 ${startKo}.${remember ? ' 사용자가 고른 값은 로컬 스토리지에 저장해서 다음에도 유지.' : ''} 배경 #18181C, 카드 #24242A, 글자 #F2F0EB로 하고 ${dur}초 동안 부드럽게 색이 바뀌게.`

  return (
    <Shell
      hint="오른쪽 위 토글을 눌러보세요"
      stage={
        <motion.div className="pgd-dm" animate={{ background: t.bg, color: t.ink, borderColor: t.line }} transition={{ duration: dur }}>
          <div className="pgd-dm-top">
            <b>MyNotes</b>
            <button className="pgd-dm-toggle" onClick={flip} aria-label="다크 모드 전환">
              <motion.span animate={{ x: dark ? 24 : 0, background: dark ? '#F2F0EB' : C.acc }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
              <small>{dark ? '다크' : '라이트'}</small>
            </button>
          </div>
          {['회의 메모', '여행 준비물', '읽고 싶은 책'].map((x, i) => (
            <motion.div key={x} className="pgd-dm-card" animate={{ background: t.card, borderColor: t.line }} transition={{ duration: dur }}>
              <b>{x}</b>
              <motion.span animate={{ color: t.muted }} transition={{ duration: dur }}>
                {['오늘', '어제', '3일 전'][i]} 수정
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
      }
      controls={
        <>
          <Segmented label="처음 들어왔을 때" value={start} onChange={(v) => { setStart(v); push('option', `시작 모드: ${{ system: '기기 설정 따라감', light: '라이트', dark: '다크' }[v]}`) }} options={[{ value: 'system', label: '기기 설정' }, { value: 'light', label: '라이트' }, { value: 'dark', label: '다크' }]} />
          <Toggle label="고른 값 기억하기" value={remember} onChange={setRemember} />
          <Slider label="색 바뀌는 시간" value={dur} min={0} max={1} step={0.05} unit="s" onChange={setDur} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Breakpoint · Viewport ───────── */

const DEVICES = [
  ['휴대폰', 375],
  ['태블릿', 820],
  ['노트북', 1280],
]

function BreakpointPG() {
  const [vw, setVw] = useState(375)
  const [bpT, setBpT] = useState(768)
  const [bpD, setBpD] = useState(1024)
  const { logs, push, clear } = useEventLog()
  const cols = vw >= bpD ? 3 : vw >= bpT ? 2 : 1
  const name = ['', '모바일', '태블릿', '데스크톱'][cols]
  const prev = useRef(cols)
  useEffect(() => {
    if (prev.current !== cols) push('move', `${vw}px · 기준선을 넘어 ${name} 배치(${cols}열)로 바뀜`)
    prev.current = cols
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cols])
  const prompt = `반응형으로 만들어줘. 화면 폭 ${bpT}px 미만은 카드 1열, ${bpT}px 이상은 2열, ${bpD}px 이상은 3열. 모바일에서는 메뉴를 햄버거 버튼으로 접고, 좌우 여백은 16px.`
  const W = 340

  return (
    <Shell
      hint="화면 폭을 바꿔보세요"
      stage={
        <div className="pgd-bp">
          <div className="pgd-bp-ruler">
            <span style={{ left: (bpT / 1440) * 100 + '%' }}>{bpT}</span>
            <span style={{ left: (bpD / 1440) * 100 + '%' }}>{bpD}</span>
            <motion.i animate={{ left: (vw / 1440) * 100 + '%' }} transition={{ duration: 0.2 }} />
          </div>
          <motion.div className="pgd-bp-frame" animate={{ width: Math.max(120, (vw / 1440) * W * 1.25) }} transition={{ duration: 0.3, ease: EASE_OUT }}>
            <div className="pgd-bp-bar">
              <b />
              {cols === 1 ? <span className="pgd-bp-burger">≡</span> : <span className="pgd-bp-menu"><i /><i /><i /></span>}
            </div>
            <motion.div layout className="pgd-bp-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
              {Array.from({ length: 6 }, (_, i) => (
                <motion.span layout key={i} transition={{ duration: 0.3, ease: EASE_OUT }} />
              ))}
            </motion.div>
          </motion.div>
          <div className="pgd-bp-now">
            뷰포트 <b className="mono">{vw}px</b> → {name} · {cols}열
          </div>
        </div>
      }
      controls={
        <>
          <div className="presets">
            {DEVICES.map(([l, w]) => (
              <button key={l} className={'chip-btn' + (vw === w ? ' on' : '')} onClick={() => setVw(w)}>
                {l} {w}
              </button>
            ))}
          </div>
          <Slider label="화면 폭 (viewport)" value={vw} min={320} max={1440} step={5} unit="px" onChange={setVw} />
          <Slider label="태블릿 기준선" value={bpT} min={560} max={900} step={8} unit="px" onChange={(v) => setBpT(Math.min(v, bpD - 40))} />
          <Slider label="데스크톱 기준선" value={bpD} min={900} max={1400} step={8} unit="px" onChange={(v) => setBpD(Math.max(v, bpT + 40))} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Accessibility ───────── */

const A11Y = [
  ['contrast', '글자 대비 충분히'],
  ['alt', '사진에 대체 텍스트(alt)'],
  ['focus', '키보드 포커스 표시'],
  ['size', '글자 크기 16px 이상'],
]

function AccessibilityPG() {
  const [on, setOn] = useState({ contrast: false, alt: false, focus: false, size: false })
  const [sr, setSr] = useState(false)
  const { logs, push, clear } = useEventLog()
  const fg = on.contrast ? '#1F1F24' : '#B8B3A8'
  const ratio = contrast(fg, '#FFFFFF')
  const passed = Object.values(on).filter(Boolean).length
  const set = (k, v) => {
    setOn({ ...on, [k]: v })
    push(v ? 'open' : 'close', `${A11Y.find((a) => a[0] === k)[1]} ${v ? '적용' : '해제'}`)
  }
  const read = on.alt ? '이미지, 바닷가에서 노을을 보는 두 사람. 제목, 여름 여행 후기.' : '이미지, IMG_2041.jpg. 제목, 여름 여행 후기.'
  const missing = A11Y.filter(([k]) => !on[k]).map((a) => a[1])
  const prompt = `접근성을 점검해서 고쳐줘. ${missing.length ? missing.join(', ') + '이(가) 빠져 있어.' : '지금 기준은 모두 지켜졌는지 다시 확인해줘.'} 글자와 배경 대비는 4.5:1 이상, 모든 이미지에 내용을 설명하는 alt, Tab 키로 이동할 때 포커스 테두리, 본문은 16px 이상으로.`

  return (
    <Shell
      hint="오른쪽 항목을 하나씩 켜보세요"
      stage={
        <div className="pgd-a11y">
          <div className="pg-card pgd-a11y-card">
            <div className="pgd-a11y-img">{sr && <span>{on.alt ? 'alt="바닷가에서 노을을 보는 두 사람"' : 'alt 없음'}</span>}</div>
            <b style={{ color: fg, fontSize: on.size ? 18 : 14 }}>여름 여행 후기</b>
            <p style={{ color: fg, fontSize: on.size ? 16 : 12 }}>바다 앞 숙소에서 보낸 3일. 매일 저녁 노을을 봤어요.</p>
            <button className={'pgd-a11y-btn' + (on.focus ? ' ring' : '')}>더 읽기</button>
          </div>
          <div className="pgd-a11y-score">
            <span>
              점검 통과 <b className="mono">{passed} / 4</b>
            </span>
            <span className={ratio >= 4.5 ? 'ok' : 'err'}>대비 {ratio.toFixed(1)}:1</span>
          </div>
          <AnimatePresence>
            {sr && (
              <motion.p className="pgd-a11y-sr" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                스크린리더: “{read}”
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      }
      controls={
        <>
          {A11Y.map(([k, l]) => (
            <Toggle key={k} label={l} value={on[k]} onChange={(v) => set(k, v)} />
          ))}
          <Toggle label="스크린리더가 읽는 내용 보기" value={sr} onChange={setSr} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Design System · Token ───────── */

function DesignSystemPG() {
  const [primary, setPrimary] = useState('#FF6B2C')
  const [radius, setRadius] = useState(12)
  const [space, setSpace] = useState(12)
  const [font, setFont] = useState(15)
  const { logs, push, clear } = useEventLog()
  const changed = (name, v) => push('child', `${name} = ${v} → 버튼·칩·입력칸·카드 4곳 한 번에 바뀜`)
  const vars = { '--ds-p': primary, '--ds-r': radius + 'px', '--ds-s': space + 'px', '--ds-f': font + 'px' }
  const prompt = `디자인 토큰을 CSS 변수로 한곳에 정리해줘. --color-primary: ${primary}, --radius: ${radius}px, --space: ${space}px, --font-size: ${font}px. 버튼·칩·입력칸·카드가 모두 이 토큰만 쓰게 바꾸고, 숫자를 직접 쓴 곳은 없애줘.`

  return (
    <Shell
      hint="토큰 하나를 바꾸면 전부 바뀌어요"
      stage={
        <div className="pgd-ds" style={vars}>
          <div className="pgd-ds-tokens mono">
            <span><i style={{ background: primary }} />--color-primary: {primary}</span>
            <span>--radius: {radius}px</span>
            <span>--space: {space}px</span>
            <span>--font-size: {font}px</span>
          </div>
          <div className="pgd-ds-comp">
            <div className="pgd-ds-card">
              <b>회원 등급 안내</b>
              <div className="pgd-ds-chips">
                <span className="on">골드</span>
                <span>실버</span>
                <span>브론즈</span>
              </div>
              <input className="pgd-ds-input" placeholder="쿠폰 코드" />
              <button className="pgd-ds-btn">적용하기</button>
            </div>
          </div>
        </div>
      }
      controls={
        <>
          <Segmented label="--color-primary" value={primary} onChange={(v) => { setPrimary(v); changed('색', v) }} options={[{ value: '#FF6B2C', label: '주황' }, { value: '#4D9CFF', label: '파랑' }, { value: '#2EC4A0', label: '초록' }, { value: '#1F1F24', label: '검정' }]} />
          <Slider label="--radius" value={radius} min={0} max={24} step={2} unit="px" onChange={(v) => { setRadius(v) }} />
          <Slider label="--space" value={space} min={4} max={24} step={2} unit="px" onChange={setSpace} />
          <Slider label="--font-size" value={font} min={12} max={18} step={1} unit="px" onChange={setFont} />
          <div className="presets">
            <button className="chip-btn" onClick={() => { setPrimary('#FF6B2C'); setRadius(12); setSpace(12); setFont(15); push('option', '기본 토큰으로 되돌림') }}>
              기본값으로
            </button>
          </div>
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Wireframe · Prototype ───────── */

function WireframePrototypePG() {
  const [mode, setMode] = useState('wire')
  const [page, setPage] = useState('home')
  const [notes, setNotes] = useState(true)
  const { logs, push, clear } = useEventLog()
  const wire = mode === 'wire'
  const go = (p, why) => {
    if (mode !== 'proto') return push('option', '프로토타입 단계에서만 눌러서 이동할 수 있어요')
    setPage(p)
    push('move', why)
  }
  const modeKo = { wire: '회색 상자로 자리만 표시한 와이어프레임', mock: '색과 글자를 입힌 디자인 시안', proto: '버튼을 누르면 실제로 화면이 넘어가는 프로토타입' }[mode]
  const prompt = `메인 화면을 바로 완성하지 말고 먼저 ${modeKo}으로 보여줘. 위에서부터 상단 메뉴, 큰 배너, 상품 카드 2개, 아래 탭 바 순서로. 확인받은 다음에 다음 단계로 넘어가.`

  return (
    <Shell
      hint={mode === 'proto' ? '상품 카드를 눌러보세요' : '단계를 바꿔보세요'}
      stage={
        <div className={'pgd-wp ' + mode}>
          <AnimatePresence mode="wait">
            {page === 'home' ? (
              <motion.div key="home" className="pgd-wp-screen" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
                <div className="pgd-wp-top">{wire ? <i /> : <b>MyShop</b>}</div>
                <div className="pgd-wp-hero">{wire ? (notes ? <small>배너</small> : null) : <b>여름 세일 30%</b>}</div>
                <div className="pgd-wp-cards">
                  {['머그컵', '캠핑 의자'].map((x, i) => (
                    <button key={x} className="pgd-wp-card" onClick={() => go('detail', `'${x}' 카드 클릭 → 상세 화면으로`)}>
                      <span className="pgd-wp-thumb" style={wire ? undefined : { background: i ? '#CFE3FF' : '#FFE1CF' }} />
                      {wire ? <i /> : <b>{x}</b>}
                    </button>
                  ))}
                </div>
                {wire && notes && <small className="pgd-wp-note">상품 카드 2열 · 누르면 상세로</small>}
              </motion.div>
            ) : (
              <motion.div key="detail" className="pgd-wp-screen" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.25 }}>
                <div className="pgd-wp-top">
                  <button className="link" onClick={() => go('home', '← 뒤로 → 메인 화면')}>← 뒤로</button>
                </div>
                <div className="pgd-wp-hero tall" style={{ background: '#FFE1CF' }} />
                <b>머그컵 세트</b>
                <button className="btn" onClick={() => push('end', '장바구니 담기 (프로토타입이라 실제 저장은 없어요)')}>장바구니 담기</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      }
      controls={
        <>
          <Segmented
            label="단계"
            value={mode}
            onChange={(v) => {
              setMode(v)
              setPage('home')
              push('option', { wire: '와이어프레임 · 자리만 잡기', mock: '디자인 시안 · 색과 글자 입히기', proto: '프로토타입 · 눌러서 이동해 보기' }[v])
            }}
            options={[{ value: 'wire', label: '와이어프레임' }, { value: 'mock', label: '시안' }, { value: 'proto', label: '프로토타입' }]}
          />
          <Toggle label="설명 메모 보이기" value={notes} onChange={setNotes} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── UX / UI ───────── */

const FLOWS = {
  5: ['장바구니', '로그인', '배송지 입력', '결제 수단', '최종 확인'],
  3: ['장바구니', '배송지 · 결제', '최종 확인'],
  1: ['원클릭 결제'],
}

function UxUiPG() {
  const [steps, setSteps] = useState(5)
  const [polish, setPolish] = useState(false)
  const [at, setAt] = useState(0)
  const [taps, setTaps] = useState(0)
  const t0 = useRef(null)
  const { logs, push, clear } = useEventLog()
  const flow = FLOWS[steps]
  const done = at >= flow.length
  const next = () => {
    if (done) return
    if (at === 0) t0.current = performance.now()
    setTaps((x) => x + 1)
    if (at === flow.length - 1) push('end', `주문 완료! 총 ${taps + 1}번 누름 · ${((performance.now() - t0.current) / 1000).toFixed(1)}초`)
    else push('move', `${flow[at]} → ${flow[at + 1]}`)
    setAt(at + 1)
  }
  const reset = () => {
    setAt(0)
    setTaps(0)
  }
  const prompt = `결제 과정을 UX 관점에서 다듬어줘. 지금 ${FLOWS[5].length}단계(${FLOWS[5].join(' → ')})인데 ${steps}단계${steps === 1 ? '(저장된 배송지·카드로 원클릭 결제)' : `(${flow.join(' → ')})`}로 줄여줘.${polish ? ' UI도 다듬어서 버튼은 크고 둥글게, 진행 단계 표시 막대도 넣어줘.' : ''}`

  return (
    <Shell
      hint="다음 버튼을 끝까지 눌러보세요"
      stage={
        <div className={'pg-card pgd-ux' + (polish ? ' polish' : '')}>
          {polish && (
            <div className="pgd-ux-bar">
              <motion.i animate={{ width: (Math.min(at, flow.length) / flow.length) * 100 + '%' }} />
            </div>
          )}
          <span className="pgd-ux-step mono">{done ? '완료' : `${at + 1} / ${flow.length}`}</span>
          <AnimatePresence mode="wait">
            <motion.b key={at + '-' + steps} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              {done ? '주문이 완료됐어요' : flow[at]}
            </motion.b>
          </AnimatePresence>
          {done ? (
            <button className="pgd-ux-btn ghost" onClick={reset}>
              처음부터
            </button>
          ) : (
            <button className="pgd-ux-btn" onClick={next}>
              {at === flow.length - 1 ? '결제하기' : '다음'}
            </button>
          )}
          <div className="pgd-ux-meta">
            <span>
              누른 횟수 <b className="mono">{taps}</b>
            </span>
            <span>UX = 단계 수 · UI = 모양</span>
          </div>
        </div>
      }
      controls={
        <>
          <Segmented label="UX · 결제까지 단계 수" value={steps} onChange={(v) => { setSteps(v); reset(); push('option', `UX 변경: ${v}단계`) }} options={[{ value: 5, label: '5단계' }, { value: 3, label: '3단계' }, { value: 1, label: '1단계' }]} />
          <Toggle label="UI 다듬기 (모양만 바뀜)" value={polish} onChange={(v) => { setPolish(v); push('option', v ? 'UI 변경: 버튼·진행 막대 · 누르는 횟수는 그대로' : 'UI 기본') }} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Form Validation ───────── */

function FormValidationPG() {
  const [vals, setVals] = useState({ name: '', email: '', pw: '' })
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [when, setWhen] = useState('blur')
  const [minPw, setMinPw] = useState(8)
  const [lock, setLock] = useState(false)
  const { logs, push, clear } = useEventLog()

  const errs = {
    name: !vals.name.trim() ? '이름을 입력해 주세요' : '',
    email: !vals.email ? '이메일을 입력해 주세요' : !/^\S+@\S+\.\S+$/.test(vals.email) ? '이메일 형식이 아니에요 (예: me@mail.com)' : '',
    pw: vals.pw.length < minPw ? `비밀번호는 ${minPw}자 이상이에요 (지금 ${vals.pw.length}자)` : '',
  }
  const valid = !errs.name && !errs.email && !errs.pw
  const show = (k) => submitted || (when === 'input' && vals[k]) || (when === 'blur' && touched[k])

  const submit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (valid) push('end', '검사 통과 → 가입 완료')
    else push('close', `가입 막힘 · 고칠 칸 ${Object.values(errs).filter(Boolean).length}개`)
  }
  const whenKo = { input: '글자를 입력할 때마다 바로', blur: '그 칸을 벗어날 때(blur)', submit: '가입 버튼을 눌렀을 때' }[when]
  const prompt = `회원가입 폼(이름·이메일·비밀번호)에 입력값 검사를 넣어줘. ${whenKo} 검사해서, 틀린 칸은 빨간 테두리와 아래 빨간 글씨로 이유를 알려줘. 이메일은 형식 확인, 비밀번호는 ${minPw}자 이상.${lock ? ' 모든 칸이 올바르기 전에는 가입 버튼을 회색으로 비활성화.' : ''} 올바른 칸은 초록 테두리로.`

  const field = (k, label, type, ph) => (
    <label className="pgd-fv-field">
      <span className="pg-label">{label}</span>
      <input
        className={'pg-input' + (show(k) ? (errs[k] ? ' err' : ' ok') : '')}
        type={type}
        placeholder={ph}
        value={vals[k]}
        onChange={(e) => setVals({ ...vals, [k]: e.target.value })}
        onBlur={() => {
          setTouched({ ...touched, [k]: true })
          if (when === 'blur') push(errs[k] ? 'close' : 'open', `${label} 검사: ${errs[k] || '통과'}`)
        }}
      />
      <AnimatePresence>
        {show(k) && errs[k] && (
          <motion.span className="pg-help err" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            {errs[k]}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  )

  return (
    <Shell
      hint="빈 칸으로 가입을 눌러보세요"
      stage={
        <form className="pg-card pgd-fv" onSubmit={submit} noValidate>
          {field('name', '이름', 'text', '홍길동')}
          {field('email', '이메일', 'email', 'me@mail.com')}
          {field('pw', '비밀번호', 'password', `${minPw}자 이상`)}
          <button className="pgd-fv-btn" disabled={lock && !valid}>
            가입하기
          </button>
        </form>
      }
      controls={
        <>
          <Segmented label="언제 검사할까" value={when} onChange={(v) => { setWhen(v); setSubmitted(false); setTouched({}); push('option', `검사 시점: ${{ input: '입력할 때', blur: '칸 벗어날 때', submit: '제출할 때' }[v]}`) }} options={[{ value: 'input', label: '입력할 때' }, { value: 'blur', label: '칸 벗어날 때' }, { value: 'submit', label: '제출할 때' }]} />
          <Slider label="비밀번호 최소 글자" value={minPw} min={4} max={12} step={1} unit="자" onChange={setMinPw} />
          <Toggle label="다 맞기 전엔 버튼 막기" value={lock} onChange={setLock} />
          <div className="presets">
            <button className="chip-btn" onClick={() => { setVals({ name: '', email: '', pw: '' }); setTouched({}); setSubmitted(false); push('option', '폼 비움') }}>
              비우기
            </button>
            <button className="chip-btn" onClick={() => { setVals({ name: '지윤', email: 'me@mail.com', pw: 'a'.repeat(minPw) }); push('option', '올바른 예시로 채움') }}>
              올바른 예시 채우기
            </button>
          </div>
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── File Upload ───────── */

function FileUploadPG() {
  const [files, setFiles] = useState([])
  const [over, setOver] = useState(false)
  const [maxMb, setMaxMb] = useState(5)
  const [accept, setAccept] = useState('image')
  const [multi, setMulti] = useState(true)
  const input = useRef(null)
  const { logs, push, clear } = useEventLog()

  useEffect(() => () => files.forEach((f) => f.url && URL.revokeObjectURL(f.url)), [files])

  const add = (list) => {
    let next = multi ? [...files] : []
    for (const f of list) {
      const mb = f.size / 1024 / 1024
      if (accept === 'image' && !f.type.startsWith('image/')) {
        push('close', `'${f.name}' 거절 · 이미지 파일만 받아요`)
        continue
      }
      if (mb > maxMb) {
        push('close', `'${f.name}' 거절 · ${mb.toFixed(1)}MB (최대 ${maxMb}MB)`)
        continue
      }
      const id = Math.random()
      const url = f.type?.startsWith('image/') && f instanceof Blob ? URL.createObjectURL(f) : null
      next.push({ id, name: f.name, mb, url, color: f.color, p: 0 })
      push('start', `'${f.name}' 업로드 시작 (${mb.toFixed(1)}MB)`)
      if (!multi) break
    }
    setFiles(next)
  }

  // 업로드 진행률 흉내
  useEffect(() => {
    if (!files.some((f) => f.p < 100)) return
    const id = setTimeout(() => {
      setFiles((fs) =>
        fs.map((f) => {
          if (f.p >= 100) return f
          const p = Math.min(100, f.p + Math.max(8, 40 / Math.max(1, f.mb)))
          if (p === 100) push('end', `'${f.name}' 업로드 완료`)
          return { ...f, p }
        }),
      )
    }, 160)
    return () => clearTimeout(id)
  }, [files, push])

  const sample = (name, mb, type, color) => ({ name, size: mb * 1024 * 1024, type, color })
  const acceptKo = accept === 'image' ? '이미지(jpg, png)만' : '모든 파일을'
  const prompt = `파일 업로드 칸(드롭존)을 만들어줘. 점선 상자에 ${acceptKo} 끌어다 놓거나 눌러서 고를 수 있게, 최대 ${maxMb}MB${multi ? ', 여러 개 한 번에' : ', 한 개만'}. 파일을 끌고 들어오면 상자가 주황색으로 바뀌고, 올리는 동안 진행률 막대, 다 올리면 미리보기 썸네일과 삭제(X) 버튼. 조건에 안 맞으면 이유를 알려줘.`

  return (
    <Shell
      hint="사진을 끌어다 놓거나 예시 파일을 넣어보세요"
      stage={
        <div className="pgd-fu">
          <motion.div
            className={'pgd-fu-zone' + (over ? ' over' : '')}
            animate={{ scale: over ? 1.02 : 1 }}
            onClick={() => input.current?.click()}
            onDragOver={(e) => {
              e.preventDefault()
              if (!over) {
                setOver(true)
                push('drag', '파일이 상자 위로 들어옴')
              }
            }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setOver(false)
              add([...e.dataTransfer.files])
            }}
          >
            <Icon n="cloud" size={28} color={over ? C.acc : '#A8A398'} />
            <b>{over ? '여기에 놓으세요' : '파일을 끌어다 놓거나 눌러서 선택'}</b>
            <small>
              {accept === 'image' ? '이미지만' : '모든 파일'} · 최대 {maxMb}MB
            </small>
            <input ref={input} type="file" hidden multiple={multi} accept={accept === 'image' ? 'image/*' : undefined} onChange={(e) => { add([...e.target.files]); e.target.value = '' }} />
          </motion.div>
          <div className="pgd-fu-list">
            <AnimatePresence initial={false}>
              {files.map((f) => (
                <motion.div key={f.id} className="pgd-fu-item" layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <span className="pgd-fu-thumb" style={{ background: f.url ? `center/cover url(${f.url})` : f.color || '#ECE8E0' }}>
                    {!f.url && !f.color && <Icon n="file" size={16} color="#A8A398" />}
                  </span>
                  <div>
                    <b>{f.name}</b>
                    <div className="pgd-fu-bar">
                      <motion.i animate={{ width: f.p + '%', background: f.p >= 100 ? C.mint : C.acc }} />
                    </div>
                  </div>
                  {f.p >= 100 ? <Check size={14} color={C.mint} /> : <small className="mono">{Math.round(f.p)}%</small>}
                  <button className="pgd-fu-x" onClick={() => { setFiles(files.filter((x) => x.id !== f.id)); push('close', `'${f.name}' 삭제`) }} aria-label="삭제">
                    <Icon n="x" size={12} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      }
      controls={
        <>
          <div className="presets">
            <button className="chip-btn" onClick={() => add([sample('바다.jpg', 2.4, 'image/jpeg', '#CFE3FF')])}>바다.jpg 2.4MB</button>
            <button className="chip-btn" onClick={() => add([sample('여행영상.mp4', 48, 'video/mp4')])}>여행영상.mp4 48MB</button>
            <button className="chip-btn" onClick={() => add([sample('견적서.pdf', 0.8, 'application/pdf')])}>견적서.pdf 0.8MB</button>
          </div>
          <Slider label="최대 크기" value={maxMb} min={1} max={50} step={1} unit="MB" onChange={setMaxMb} />
          <Segmented label="받을 파일 종류" value={accept} onChange={(v) => { setAccept(v); push('option', v === 'image' ? '이미지만 받기' : '모든 파일 받기') }} options={[{ value: 'image', label: '이미지만' }, { value: 'all', label: '모든 파일' }]} />
          <Toggle label="여러 개 한 번에" value={multi} onChange={setMulti} />
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

/* ───────── Drag & Drop ───────── */

const COLS = [
  ['todo', '할 일'],
  ['doing', '하는 중'],
  ['done', '완료'],
]
const TASKS0 = [
  { id: 1, t: '로고 고르기', col: 'todo' },
  { id: 2, t: '메뉴 이름 정하기', col: 'todo' },
  { id: 3, t: '첫 화면 만들기', col: 'doing' },
  { id: 4, t: '도메인 사기', col: 'done' },
]

function DragDropPG() {
  const [tasks, setTasks] = useState(TASKS0)
  const [tilt, setTilt] = useState(4)
  const [ghost, setGhost] = useState(true)
  const [hot, setHot] = useState(null)
  const [dragging, setDragging] = useState(null)
  const refs = useRef({})
  const { logs, push, clear } = useEventLog()

  const colAt = (x, y) => COLS.find(([id]) => {
    const r = refs.current[id]?.getBoundingClientRect()
    return r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom
  })?.[0]
  const name = (id) => COLS.find((c) => c[0] === id)[1]

  const prompt = `할 일 목록을 칸반 보드(${COLS.map((c) => c[1]).join(' / ')})로 만들어줘. 카드를 마우스나 손가락으로 끌어서(drag) 다른 칸에 놓으면(drop) 그 칸으로 옮겨지게. 끄는 동안 카드는 ${tilt}도 기울고 그림자가 진해지게${ghost ? ', 놓을 칸은 주황 점선으로 표시' : ''}. 칸 밖에 놓으면 원래 자리로 돌아가게. dnd-kit 라이브러리 사용.`

  return (
    <Shell
      hint="카드를 다른 칸으로 끌어보세요"
      stage={
        <div className="pgd-dd">
          {COLS.map(([id, label]) => (
            <div key={id} ref={(el) => (refs.current[id] = el)} className={'pgd-dd-col' + (ghost && hot === id && dragging ? ' hot' : '')}>
              <span className="pgd-dd-head">
                {label} <small className="mono">{tasks.filter((t) => t.col === id).length}</small>
              </span>
              {tasks
                .filter((t) => t.col === id)
                .map((t) => (
                  <motion.div
                    key={t.id}
                    layout
                    layoutId={'dd' + t.id}
                    className="pgd-dd-card"
                    drag
                    dragSnapToOrigin
                    dragElastic={1}
                    whileDrag={{ rotate: tilt, scale: 1.05, boxShadow: '0 14px 30px rgba(31,31,36,0.18)', zIndex: 5, cursor: 'grabbing' }}
                    onDragStart={() => {
                      setDragging(t.id)
                      push('drag', `'${t.t}' 잡음`)
                    }}
                    onDrag={(e, info) => setHot(colAt(info.point.x - window.scrollX, info.point.y - window.scrollY) ?? null)}
                    onDragEnd={(e, info) => {
                      const to = colAt(info.point.x - window.scrollX, info.point.y - window.scrollY)
                      setDragging(null)
                      setHot(null)
                      if (!to) return push('release', '칸 밖에 놓음 → 원래 자리로')
                      if (to === t.col) return push('release', '같은 칸에 놓음')
                      setTasks((ts) => ts.map((x) => (x.id === t.id ? { ...x, col: to } : x)))
                      push(to === 'done' ? 'end' : 'settle', `'${t.t}' ${name(t.col)} → ${name(to)}`)
                    }}
                    style={{ position: 'relative' }}
                  >
                    {t.col === 'done' && <Check size={12} color={C.mint} />}
                    {t.t}
                  </motion.div>
                ))}
            </div>
          ))}
        </div>
      }
      controls={
        <>
          <Slider label="끄는 동안 기울기" value={tilt} min={0} max={12} step={1} unit="°" onChange={setTilt} />
          <Toggle label="놓을 칸 점선 표시" value={ghost} onChange={setGhost} />
          <div className="presets">
            <button className="chip-btn" onClick={() => { setTasks(TASKS0); push('option', '처음 상태로') }}>
              처음 상태로
            </button>
          </div>
        </>
      }
      log={<EventLog logs={logs} onClear={clear} />}
      prompt={prompt}
    />
  )
}

export const DESIGN_PGS = {
  'padding-margin': PaddingMarginPG,
  'color-hex': ColorHexPG,
  typography: TypographyPG,
  'radius-shadow': RadiusShadowPG,
  icon: IconPG,
  'interaction-states': InteractionStatesPG,
  'dark-mode': DarkModePG,
  breakpoint: BreakpointPG,
  accessibility: AccessibilityPG,
  'design-system': DesignSystemPG,
  'wireframe-prototype': WireframePrototypePG,
  'ux-ui': UxUiPG,
  'form-validation': FormValidationPG,
  'file-upload': FileUploadPG,
  'drag-drop': DragDropPG,
}
