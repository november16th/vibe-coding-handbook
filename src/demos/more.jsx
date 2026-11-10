import { motion, AnimatePresence } from 'motion/react'
import { C, useStep, useTick, L, Icon, Check } from './parts'
import { fadeIn } from './dev'

const sp = { type: 'spring', stiffness: 320, damping: 26 }
const Bub = ({ me, children, style, ...p }) => (
  <motion.div className={'bub' + (me ? ' me' : '')} style={style} {...p}>
    {children}
  </motion.div>
)

/* ───────── 개발 상식 ───────── */

export function Diff() {
  const s = useStep(3, 1300)
  return (
    <div className="term" style={{ inset: '22px 26px' }}>
      <div className="term-top" style={{ justifyContent: 'space-between' }}>
        <span className="mono" style={{ fontSize: 8, color: '#9a958b' }}>src/style.css</span>
        <span className="mono" style={{ fontSize: 8.5 }}>
          <span style={{ color: '#7ee0c3' }}>+{s >= 2 ? 1 : 0}</span> <span style={{ color: '#ff8a8b' }}>-{s >= 1 ? 1 : 0}</span>
        </span>
      </div>
      <div className="term-body mono" style={{ fontSize: 9.5, lineHeight: 2 }}>
        <div style={{ color: '#9a958b' }}>.button {'{'}</div>
        <AnimatePresence initial={false}>
          {s >= 1 ? (
            <motion.div key="del" className="act-del" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              - background: gray;
            </motion.div>
          ) : (
            <div key="old">&nbsp;&nbsp;background: gray;</div>
          )}
          {s >= 2 && (
            <motion.div key="add" className="act-add" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}>
              + background: orange;
            </motion.div>
          )}
        </AnimatePresence>
        <div style={{ color: '#9a958b' }}>&nbsp;&nbsp;padding: 12px;</div>
        <div style={{ color: '#9a958b' }}>{'}'}</div>
      </div>
    </div>
  )
}

const RB_COMMITS = [
  ['첫 화면', C.mint],
  ['메뉴 추가', C.mint],
  ['버튼 수정', '#ff4d4f'],
]
export function RevertRollback() {
  const s = useStep(3, 1600)
  const back = s === 2
  return (
    <>
      <svg viewBox="0 0 280 210" style={{ position: 'absolute', inset: 0 }}>
        <line x1="48" y1="70" x2="232" y2="70" stroke="#d6d2c8" strokeWidth="3" strokeLinecap="round" />
        {back && <motion.path d="M 232 56 C 200 26, 166 26, 140 56" fill="none" stroke={C.acc} strokeWidth="2.5" strokeDasharray="5 5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />}
      </svg>
      {RB_COMMITS.map(([m, c], i) => (
        <div key={m} style={{ position: 'absolute', left: 48 + i * 92 - 36, top: 62, width: 72, display: 'grid', justifyItems: 'center', gap: 6 }}>
          <motion.span className="cm-dot2" initial={false} animate={{ borderColor: c, opacity: back && i === 2 ? 0.3 : 1, scale: back && i === 1 ? 1.25 : 1 }} />
          <span style={{ fontSize: 9, fontWeight: 700, opacity: back && i === 2 ? 0.35 : 1 }}>{m}</span>
        </div>
      ))}
      <motion.div className="win" style={{ left: 70, right: 70, top: 112, height: 62, padding: 9, display: 'grid', gap: 5 }} initial={false} animate={{ borderColor: s === 1 ? '#ff4d4f' : '#e7e3da' }}>
        <L w="60%" h={6} c={C.ink} />
        <AnimatePresence mode="wait">
          <motion.span key={s === 1 ? 'b' : 'g'} className="btn-mini" style={{ justifySelf: 'start', color: '#fff' }} initial={{ opacity: 0 }} animate={{ opacity: 1, background: s === 1 ? '#ff4d4f' : C.acc, rotate: s === 1 ? -6 : 0 }} exit={{ opacity: 0 }}>
            {s === 1 ? '버튼이 깨졌어요' : '예약하기'}
          </motion.span>
        </AnimatePresence>
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.span key={s} className={'cors-msg' + (s === 1 ? '' : ' ok')} style={{ top: 182, padding: 5 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {['잘 되는 상태', '마지막 수정에서 고장!', '잘 되던 지점으로 되돌림'][s]}
        </motion.span>
      </AnimatePresence>
    </>
  )
}

export function SeoMeta() {
  const k = useTick(4200)
  return (
    <div key={k}>
      <div className="seo-chat">
        <Bub me style={{ justifySelf: 'end' }} {...fadeIn(0.1)}>
          우리 가게 홈페이지야!
        </Bub>
        <motion.div className="bub me mono" style={{ justifySelf: 'end', fontSize: 9 }} {...fadeIn(0.5)}>
          my-shop.vercel.app
        </motion.div>
        <motion.div className="seo-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, ...sp }}>
          <motion.span className="seo-img" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} />
          <div style={{ padding: '6px 8px', display: 'grid', gap: 2 }}>
            <motion.b {...fadeIn(1.8)} style={{ fontSize: 10 }}>
              소금빵집 · 매일 아침 굽는 소금빵
            </motion.b>
            <motion.span {...fadeIn(2.1)} style={{ fontSize: 8.5, color: '#8a857b' }}>
              동네 수제 소금빵 전문점
            </motion.span>
          </div>
        </motion.div>
      </div>
      <motion.div className="seo-tags mono" {...fadeIn(2.5)}>
        <span>og:image</span>
        <span>og:title</span>
        <span>og:description</span>
      </motion.div>
    </div>
  )
}

export function CookieStorage() {
  const s = useStep(4, 1300)
  const closed = s === 1
  return (
    <>
      <AnimatePresence>
        {!closed && (
          <motion.div className="win" style={{ left: 18, top: 24, width: 150, height: 150 }} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <div className="navbar" style={{ height: 26, justifyContent: 'space-between' }}>
              <b style={{ fontSize: 9 }}>소금빵집</b>
              <span className="row" style={{ gap: 4, fontSize: 8.5, fontWeight: 700 }}>
                <span className="avatar" style={{ width: 14, height: 14, background: C.coral }} />
                {s >= 2 ? '로그인 유지됨' : '바이브님'}
              </span>
            </div>
            <div style={{ padding: 10, display: 'grid', gap: 6 }}>
              <L w="70%" h={6} c={C.ink} />
              <div className="row" style={{ gap: 5, fontSize: 9, fontWeight: 700 }}>
                <Icon n="heart" size={12} color={C.pink} /> 장바구니 2개
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {closed && <span className="chip" style={{ position: 'absolute', left: 30, top: 90 }}>브라우저를 닫았다 다시 열면…</span>}
      <div className="ck-box" style={{ top: 30 }}>
        <span className="mini-cap">쿠키</span>
        <span className="mono">login=바이브</span>
      </div>
      <div className="ck-box" style={{ top: 100 }}>
        <span className="mini-cap">로컬 스토리지</span>
        <span className="mono">cart=2</span>
      </div>
      <motion.span className="chip" style={{ position: 'absolute', left: 30, right: 30, top: 182, textAlign: 'center' }} initial={false} animate={{ opacity: s >= 2 ? 1 : 0 }}>
        브라우저가 기억해 둔 덕분에 그대로예요
      </motion.span>
    </>
  )
}

/* ───────── AI ───────── */

const PLAN = ['파일 구조 정하기', '메뉴 화면 만들기', '저장 버튼 연결']
export function PlanMode() {
  const k = useTick(4800)
  return (
    <div key={k} style={{ position: 'absolute', left: 18, right: 18, top: 16, display: 'grid', gap: 7 }}>
      <Bub me {...fadeIn(0)}>
        예약 기능 만들어줘. 먼저 계획부터!
      </Bub>
      <motion.div className="plan-card" {...fadeIn(0.6)}>
        <span className="mini-cap">AI의 계획 (아직 코드는 안 건드림)</span>
        {PLAN.map((p, i) => (
          <div key={p} className="row" style={{ gap: 6, fontSize: 9.5, fontWeight: 700 }}>
            <motion.span className="cb" style={{ width: 13, height: 13, borderRadius: 4 }} initial={{ background: '#ffffff', borderColor: '#cfcac0' }} animate={{ background: C.acc, borderColor: C.acc }} transition={{ delay: 2.4 + i * 0.5 }}>
              <Check size={8} color="#fff" width={4} />
            </motion.span>
            {i + 1}. {p}
          </div>
        ))}
      </motion.div>
      <Bub me style={{ marginTop: 2 }} {...fadeIn(1.8)}>
        좋아요, 진행해 주세요
      </Bub>
    </div>
  )
}

export function Multimodal() {
  const k = useTick(4600)
  return (
    <div key={k}>
      <motion.div className="mm-shot" initial={{ x: 60, y: -20, rotate: 6, opacity: 0 }} animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
        <div className="navbar" style={{ height: 18, gap: 4 }}>
          <span className="nav-dot" style={{ width: 6, height: 6 }} />
          <L w={20} h={3} />
          <L w={20} h={3} />
        </div>
        <div style={{ padding: 7, display: 'grid', gap: 4, background: '#FFF3EA' }}>
          <L w={60} h={6} c={C.ink} />
          <L w={40} h={6} c={C.acc} />
        </div>
        <motion.span className="mm-hl" style={{ top: 0, height: 18 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} />
        <motion.span className="mm-hl" style={{ top: 20, height: 40, borderColor: C.sky }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} />
      </motion.div>
      <div style={{ position: 'absolute', left: 140, right: 14, top: 26, display: 'grid', gap: 6 }}>
        <Bub me {...fadeIn(0.6)} style={{ fontSize: 9 }}>
          이 화면처럼 만들고 싶어요
        </Bub>
        <Bub {...fadeIn(1.3)} style={{ fontSize: 9 }}>
          위쪽은 <b style={{ color: C.acc }}>Navigation Bar</b>, 큰 영역은 <b style={{ color: '#2a6fd6' }}>Hero Section</b>이에요. 같은 구조로 만들게요!
        </Bub>
      </div>
      <motion.span className="chip" style={{ position: 'absolute', left: 30, right: 30, top: 176, textAlign: 'center' }} {...fadeIn(2.4)}>
        글 대신 사진으로도 말할 수 있어요
      </motion.span>
    </div>
  )
}

export function Checkpoint() {
  const s = useStep(4, 1300)
  const rewound = s === 3
  return (
    <>
      <svg viewBox="0 0 280 210" style={{ position: 'absolute', inset: 0 }}>
        <line x1="36" y1="86" x2="244" y2="86" stroke="#d6d2c8" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {['요청 1', '요청 2', '요청 3'].map((t, i) => {
        const x = 60 + i * 80
        const shown = i <= Math.min(s, 2)
        return (
          <motion.div key={t} style={{ position: 'absolute', left: x - 30, top: 54, width: 60, display: 'grid', justifyItems: 'center', gap: 5 }} initial={false} animate={{ opacity: shown ? (rewound && i === 2 ? 0.25 : 1) : 0 }}>
            <span className="cp-flag" style={{ background: i === 1 && rewound ? C.acc : '#ffffff', color: i === 1 && rewound ? '#fff' : C.ink }}>
              ⚑
            </span>
            <span className="cm-dot2" style={{ borderColor: rewound && i === 2 ? '#cfcac0' : C.acc }} />
            <span style={{ fontSize: 9, fontWeight: 700 }}>{t}</span>
          </motion.div>
        )
      })}
      {rewound && (
        <motion.svg viewBox="0 0 280 210" style={{ position: 'absolute', inset: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.path d="M 220 50 C 200 24, 160 24, 140 46" fill="none" stroke={C.acc} strokeWidth="2.5" strokeDasharray="5 5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
        </motion.svg>
      )}
      <AnimatePresence mode="wait">
        <motion.span key={rewound ? 'r' : 'n'} className={'cors-msg' + (rewound ? ' ok' : '')} style={{ top: 150, color: rewound ? undefined : '#45423c', background: rewound ? undefined : '#f3f0ea' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {rewound ? '요청 2 직후로 되감기 · 그 뒤 변경은 취소' : 'AI가 일할 때마다 체크포인트가 자동 저장돼요'}
        </motion.span>
      </AnimatePresence>
    </>
  )
}
