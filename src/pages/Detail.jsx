import { Link, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { getTerm } from '../terms'
import { Stage } from '../demos/parts'
import { PromptBox } from '../components/kit'
import { PLAYGROUNDS } from '../playgrounds'
import { GUIDES } from '../guides'
import { TermCard } from './Home'
import { useStats } from '../stats'

// 상세 화면 뒤로가기 줄 오른쪽 끝의 조회수
export function PageViews({ stats, id }) {
  if (!stats) return null
  return (
    <span className="page-views">
      <b>조회수</b> {(stats.views[id] ?? 0).toLocaleString()}
    </span>
  )
}

// 용어 이름·설명 (상세 화면과 튜토리얼이 함께 쓴다)
export function TermIntro({ term }) {
  return (
    <>
      <h1>{term.en}</h1>
      <p className="detail-ko">{term.ko}</p>
      {term.aka.length > 0 && <p className="detail-aka">{term.aka.map((a) => `'${a}'`).join(', ')}(으)로도 불려요</p>}
      <p className="detail-desc">{term.desc}</p>
    </>
  )
}

// 체험 화면 / 따라 해보기 안내 / 움직이는 카드 중 그 용어에 있는 것
export function TermBody({ term, showPrompt = true }) {
  const { Demo } = term
  const Playground = term.playground && PLAYGROUNDS[term.playground]
  const { Guide, title: guideTitle } = GUIDES[term.id] ?? {}
  return (
    <>
      {Playground ? (
        <section className="detail-block">
          <h2>직접 해보기</h2>
          <Playground />
        </section>
      ) : Guide ? null : (
        <section className="detail-block">
          <div className="detail-demo">
            <Stage className="big">
              <Demo />
            </Stage>
          </div>
          {showPrompt && (
            <>
              <p className="soon">이 용어의 직접 조작 화면은 준비 중이에요. 지금은 움직임을 보고 프롬프트를 복사해 쓸 수 있어요.</p>
              <PromptBox text={term.prompt} />
            </>
          )}
        </section>
      )}

      {Guide && (
        <section className="detail-block">
          {guideTitle && <h2>{guideTitle}</h2>}
          <Guide />
        </section>
      )}
    </>
  )
}

export default function Detail() {
  const { id } = useParams()
  const term = getTerm(id)
  const stats = useStats(term?.id)

  if (!term) {
    return (
      <main className="wrap detail">
        <p>용어를 찾을 수 없어요.</p>
        <Link to="/" className="btn">
          전체 용어로
        </Link>
      </main>
    )
  }

  const { Guide } = GUIDES[term.id] ?? {}
  const related = term.section.items.filter((x) => x !== term).slice(0, 4)

  return (
    <>
      <header className="topbar">
        <div className="topbar-in">
          <Link to="/" className="logo">
            VIBE CODING HANDBOOK
          </Link>
        </div>
      </header>

      <main className="wrap detail" key={term.id}>
        <motion.div className="detail-head" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="detail-top">
            <Link to={`/#${term.section.id}`} className="back">
              ← 전체 용어
            </Link>
            <PageViews stats={stats} id={term.id} />
          </div>
          <span className="crumb">
            {term.group.title} · {term.section.title} <span className="mono">{term.no}</span>
          </span>
          <TermIntro term={term} />
        </motion.div>

        <TermBody term={term} />

        {/* 따라 해보기 안내가 있는 화면은 안내로 끝낸다 */}
        {!Guide && related.length > 0 && (
          <section className="detail-block">
            <h2>같은 분류의 다른 용어</h2>
            <div className="grid">
              {related.map((t) => (
                <TermCard key={t.id} term={t} views={stats && (stats.views[t.id] ?? 0)} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  )
}
