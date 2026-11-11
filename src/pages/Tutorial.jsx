import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { getTerm } from '../terms'
import { TUTORIALS, SHOTS } from '../tutorial'
import { PromptBox } from '../components/kit'
import { TermIntro, TermBody, PageViews } from './Detail'
import { useStats } from '../stats'

// **굵게** 표시만 지원하는 아주 작은 변환
const rich = (text) => text.split('**').map((part, i) => (i % 2 ? <b key={i}>{part}</b> : part))

function WalkItem({ text, shot, tip }) {
  const img = shot && SHOTS.has(shot) ? `/tutorial/${shot}` : null
  return (
    <li>
      <div className="tut-walk-body">
        {text.map((t) => (
          <p key={t}>{rich(t)}</p>
        ))}
        {tip && <p className="tut-walk-tip">{tip}</p>}
        {img && (
          <a className="tut-walk-img" href={img} target="_blank" rel="noreferrer" title="크게 보기">
            <img src={img} alt="" loading="lazy" />
          </a>
        )}
      </div>
    </li>
  )
}

export default function Tutorial() {
  const { course, step } = useParams()
  const c = Number(course)
  const n = Number(step ?? 1)
  const tut = TUTORIALS[c - 1]
  const lesson = tut?.steps[n - 1]
  const stats = useStats(tut ? `tutorial-${c}` : undefined)

  if (!tut) return <Navigate to="/#tutorial" replace />
  if (!lesson) return <Navigate to={`/tutorial/${c}/1`} replace />

  const total = tut.steps.length
  const term = getTerm(lesson.term)
  const last = n === total
  const nextTut = TUTORIALS[c]
  const hasTask = lesson.walk || lesson.todo || lesson.prompt

  return (
    <>
      <header className="topbar">
        <div className="topbar-in">
          <Link to="/" className="logo">
            VIBE CODING HANDBOOK
          </Link>
        </div>
      </header>

      <main className="wrap detail" key={`${c}-${n}`}>
        <motion.div className="detail-head" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {(n > 1 || stats) && (
            <div className="detail-top">
              {n > 1 && (
                <Link to={`/tutorial/${c}/${n - 1}`} className="back">
                  ← 이전 단계
                </Link>
              )}
              <PageViews stats={stats} id={`tutorial-${c}`} />
            </div>
          )}
          {tut.prev && n === 1 && (
            <div className="tut-prev-course">
              <p>
                <b>🔗 이어지는 코스예요</b>
                {tut.prev}
              </p>
              <Link to={`/tutorial/${c - 1}/1`} className="btn">
                {TUTORIALS[c - 2].title} 시작하기 →
              </Link>
            </div>
          )}
          {lesson.intro && (
            <div className="tut-intro">
              <p className="tut-lead">{lesson.intro.text}</p>
              {SHOTS.has(lesson.intro.shot) && (
                <a className="tut-walk-img" href={`/tutorial/${lesson.intro.shot}`} target="_blank" rel="noreferrer" title="크게 보기">
                  <img src={`/tutorial/${lesson.intro.shot}`} alt="VIBE CODING HANDBOOK 첫 화면" loading="lazy" />
                </a>
              )}
            </div>
          )}
          <p className="tut-lead">{lesson.lead}</p>

          {hasTask && (
            <section className="tut-task">
              <h2>이번 단계에서 해볼 일</h2>
              {lesson.walk && (
                <ol className="tut-todo tut-walk">
                  {lesson.walk.map((w) => (
                    <WalkItem key={w.text[0]} {...w} />
                  ))}
                </ol>
              )}
              {lesson.todo && (
                <ul className="tut-todo">
                  {lesson.todo.map((t) => (
                    <li key={t}>{rich(t)}</li>
                  ))}
                </ul>
              )}
              {lesson.links && (
                <div className="tut-links">
                  {lesson.links.map(([label, href]) => (
                    <a key={href} href={href} target="_blank" rel="noreferrer" className="btn">
                      {label} ↗
                    </a>
                  ))}
                </div>
              )}
              <div className="tut-prompts">
                {lesson.prompt && <PromptBox text={lesson.prompt} label="👍 AI에게 이렇게 보내보세요" tone="go" />}
                {lesson.stuck && <PromptBox text={lesson.stuck} label="❌ 막혔을 때는 이렇게 물어보세요" tone="stuck" />}
              </div>
            </section>
          )}

          <span className="crumb">
            {tut.title} · {lesson.chapter}{' '}
            <span className="mono">
              {n} / {total}
            </span>
          </span>
          <nav className="tut-bar" aria-label="단계 이동">
            {tut.steps.map((st, i) => (
              <Link key={i} to={`/tutorial/${c}/${i + 1}`} className={(i < n ? 'on' : '') + (i === n - 1 ? ' cur' : '')} title={`${i + 1}. ${getTerm(st.term).en}`} aria-current={i === n - 1 ? 'step' : undefined}>
                <i />
              </Link>
            ))}
          </nav>
          <TermIntro term={term} />
        </motion.div>

        <TermBody term={term} showPrompt={!hasTask} />

        {last && (
          <div className="tut-done">
            <b>💯 {tut.title} 완료!</b>
            <span>{tut.finish}</span>
          </div>
        )}

        <nav className="tut-nav">
          {!last ? (
            <Link to={`/tutorial/${c}/${n + 1}`} className="btn tut-next">
              다음 단계 · {getTerm(tut.steps[n].term).en} →
            </Link>
          ) : nextTut ? (
            <Link to={`/tutorial/${c + 1}/1`} className="btn tut-next">
              다음 코스 · {nextTut.title} →
            </Link>
          ) : (
            <Link to="/" className="btn tut-next">
              전체 용어 보러 가기
            </Link>
          )}
        </nav>
      </main>
    </>
  )
}
