import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { GROUPS, searchTerms } from '../terms'
import { Stage, Icon, TutorialDemo } from '../demos/parts'
import { TUTORIALS, SHOW_TUTORIAL } from '../tutorial'
import LockNoticeModal from '../components/LockNoticeModal'
import { useStats } from '../stats'

// 카드 오른쪽 위: 조회수만 (숫자를 못 불러오면 아무것도 안 보인다)
const ViewCount = ({ n }) => (n == null ? null : <span className="card-no mono">조회수 {n.toLocaleString()}</span>)

export function TermCard({ term, alias, views }) {
  const { Demo } = term
  return (
    <Link to={`/term/${term.id}`} className="card">
      <Stage>
        <Demo />
      </Stage>
      <div className="card-body">
        <div className="card-title">
          <h4>{term.en}</h4>
        </div>
        <p>{term.ko}</p>
        {alias && <p className="card-alias">'{alias}'(으)로도 불려요</p>}
      </div>
      <ViewCount n={views} />
    </Link>
  )
}

// 튜토리얼 코스 카드. 잠긴 코스는 썸네일을 흐리게 하고 눌러도 열리지 않는다
function TutorialCard({ tut, course, views, onLocked }) {
  const onClick = tut.locked
    ? (e) => {
        e.preventDefault()
        onLocked()
      }
    : undefined
  return (
    <Link to={`/tutorial/${course}/1`} className={'card' + (tut.locked ? ' card-locked' : '')} onClick={onClick} aria-disabled={tut.locked || undefined}>
      <Stage>
        <TutorialDemo road={tut.road} title={tut.subtitle} />
      </Stage>
      {tut.locked && (
        <span className="card-lock" aria-label="잠긴 코스">
          <Icon n="lock" size={22} w={2.2} />
        </span>
      )}
      <div className="card-body">
        <div className="card-title">
          <h4>{tut.title}</h4>
        </div>
        <p>
          {tut.subtitle} · {tut.steps.length}단계
        </p>
      </div>
      <ViewCount n={views} />
    </Link>
  )
}

function TutorialSection({ views }) {
  const [notice, setNotice] = useState(false)
  const closeNotice = useCallback(() => setNotice(false), [])
  return (
    <section id="tutorial" className="group">
      <div className="group-head">
        <h2>
          튜토리얼 <span className="mono">{TUTORIALS.length}</span>
        </h2>
        <p>코딩을 처음 해본다면 1번부터 차례로 따라오세요. 용어를 하나씩 배우면서 내 홈페이지를 만들고, 저장하고, 인터넷에 공개하는 데까지 가요.</p>
      </div>
      <div className="grid" style={{ marginTop: 16 }}>
        {TUTORIALS.map((tut, i) => (
          <TutorialCard key={tut.title} tut={tut} course={i + 1} views={views && (views[`tutorial-${i + 1}`] ?? 0)} onLocked={() => setNotice(true)} />
        ))}
      </div>
      <LockNoticeModal open={notice} onClose={closeNotice} />
    </section>
  )
}

const INTRO = '바이브코딩하다 모르는 말이 나오면 찾아보는 용어 사전이에요. 움직이는 카드로 보고, AI에게 할 말까지 복사해 가세요.'

const count = (g) => g.sections.reduce((m, s) => m + s.items.length, 0)

// 상단 탭: 맨 앞이 '튜토리얼', 그다음 용어 그룹
const TABS = [...(SHOW_TUTORIAL ? [{ id: 'tutorial', short: '튜토리얼', n: TUTORIALS.length }] : []), ...GROUPS.map((g) => ({ id: g.id, short: g.short, n: count(g) }))]

function useActiveGroup() {
  const [active, setActive] = useState(TABS[0].id)
  useEffect(() => {
    const onScroll = () => {
      let cur = TABS[0].id
      for (const g of TABS) {
        const el = document.getElementById(g.id)
        if (el && el.getBoundingClientRect().top < 170) cur = g.id
      }
      setActive(cur)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return active
}

export default function Home() {
  const active = useActiveGroup()
  const stats = useStats()
  const viewsOf = (id) => stats && (stats.views[id] ?? 0)
  const activeGroup = GROUPS.find((g) => g.id === active)
  const [q, setQ] = useState('')
  const hits = q.trim() ? searchTerms(q) : null

  const go = (id) => (e) => {
    e.preventDefault()
    setQ('')
    requestAnimationFrame(() => {
      const el = document.getElementById(id)
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 124, behavior: 'smooth' })
    })
  }

  return (
    <>
      <header className="topbar">
        <div className="topbar-in">
          <Link to="/" className="logo">
            VIBE CODING HANDBOOK
          </Link>
          <nav className="group-tabs">
            {TABS.map((g) => {
              const on = !hits && active === g.id
              return (
                <a key={g.id} href={'#' + g.id} onClick={go(g.id)} className={on ? 'on' : ''}>
                  {on && <motion.span layoutId="gt" className="group-tab-bg" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
                  <span style={{ position: 'relative' }}>
                    {g.short} {g.n && <b className="mono">{g.n}</b>}
                  </span>
                </a>
              )
            })}
          </nav>
          <label className="search">
            <Icon n="search" size={15} color="#8a857b" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="검색 (예: 팝업, 배포)" />
            {q && (
              <button className="search-x" onClick={() => setQ('')} aria-label="검색어 지우기">
                <Icon n="x" size={12} w={2.6} />
              </button>
            )}
          </label>
        </div>
        <div className="site-meta">
          <p className="site-tagline">{INTRO}</p>
          <div className="site-credit">
            <b>제작자</b>
            <span>박지윤</span>
            <b>출처</b>
            <span>유튜브, 경험, 검색</span>
            {stats && (
              <>
                <b>방문자</b>
                <span>{stats.today.toLocaleString()}</span>
                <b>누적</b>
                <span>{stats.total.toLocaleString()}</span>
              </>
            )}
          </div>
        </div>
        <div className="sub-tabs">
          {!hits &&
            activeGroup?.sections.map((s) => (
              <a key={s.id} href={'#' + s.id} onClick={go(s.id)}>
                {s.title}
                <span className="mono">{s.items.length}</span>
              </a>
            ))}
        </div>
      </header>

      <main className="wrap">
        {!hits && <p className="site-intro">{INTRO}</p>}
        {hits ? (
          <section className="group">
            <div className="group-head">
              <h2>
                '{q.trim()}' 검색 결과 <span className="mono">{hits.length}</span>
              </h2>
            </div>
            {hits.length ? (
              <div className="grid">
                {hits.map(({ term, alias }) => (
                  <TermCard key={term.id} term={term} alias={alias} views={viewsOf(term.id)} />
                ))}
              </div>
            ) : (
              <p className="no-hit">찾는 용어가 없어요. 영어 이름이나 비슷한 한글 표현으로도 찾아보세요.</p>
            )}
          </section>
        ) : (
          <>
            {SHOW_TUTORIAL && <TutorialSection views={stats?.views} />}
            {GROUPS.map((g) => (
            <section key={g.id} id={g.id} className="group">
              <div className="group-head">
                <h2>
                  {g.title} <span className="mono">{count(g)}</span>
                </h2>
                <p>{g.intro}</p>
              </div>
              {g.sections.map((s) => (
                <div key={s.id} id={s.id} className="section">
                  <div className="section-head">
                    <h3>
                      {s.title} <span className="mono">{s.items.length}</span>
                    </h3>
                    <span className="section-en mono">{s.en.toUpperCase()}</span>
                  </div>
                  <div className="grid">
                    {s.items.map((t) => (
                      <TermCard key={t.id} term={t} views={viewsOf(t.id)} />
                    ))}
                  </div>
                </div>
              ))}
            </section>
            ))}
          </>
        )}
      </main>
    </>
  )
}
