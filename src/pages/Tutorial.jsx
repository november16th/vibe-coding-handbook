import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { getTerm } from '../terms'
import { TUTORIAL, saveTutorialStep } from '../tutorial'
import { PromptBox } from '../components/kit'
import { TermIntro, TermBody } from './Detail'

export default function Tutorial() {
  const { step } = useParams()
  const n = Number(step)
  const total = TUTORIAL.length
  const lesson = TUTORIAL[n - 1]

  useEffect(() => {
    if (lesson) saveTutorialStep(n)
  }, [lesson, n])

  if (!lesson) return <Navigate to="/tutorial/1" replace />

  const term = getTerm(lesson.term)
  const last = n === total
  const hasTask = lesson.todo || lesson.prompt

  return (
    <>
      <header className="topbar">
        <div className="topbar-in">
          <Link to="/" className="logo">
            VIBE CODING HANDBOOK
          </Link>
        </div>
      </header>

      <main className="wrap detail" key={n}>
        <motion.div className="detail-head" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Link to="/#tutorial" className="back">
            ← 전체 용어
          </Link>
          <span className="crumb">
            튜토리얼 · {lesson.chapter}{' '}
            <span className="mono">
              {n} / {total}
            </span>
          </span>
          <div className="tut-bar">
            {TUTORIAL.map((_, i) => (
              <i key={i} className={i < n ? 'on' : ''} />
            ))}
          </div>
          <div className="tut-lead">
            <span className="eyebrow">튜토리얼 안내</span>
            <p>{lesson.lead}</p>
          </div>
          <TermIntro term={term} />
        </motion.div>

        <TermBody term={term} showPrompt={!hasTask} />

        {hasTask && (
          <section className="detail-block">
            <h2>이번 단계에서 해볼 일</h2>
            {lesson.todo && (
              <ul className="tut-todo">
                {lesson.todo.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
            <div className="tut-prompts">
              {lesson.prompt && <PromptBox text={lesson.prompt} label="AI에게 이렇게 보내보세요" />}
              {lesson.stuck && <PromptBox text={lesson.stuck} label="막혔을 때는 이렇게 물어보세요" tone="calm" />}
            </div>
          </section>
        )}

        {last && (
          <div className="tut-done">
            <b>축하해요! 튜토리얼을 모두 마쳤어요.</b>
            <span>이제 내 홈페이지가 인터넷에 있어요. 더 꾸미고 싶을 땐 전체 용어를 둘러보고, 모르는 말은 검색창에 물어보세요.</span>
          </div>
        )}

        <nav className="tut-nav">
          {n > 1 ? (
            <Link to={`/tutorial/${n - 1}`} className="tut-prev">
              ← 이전 단계
            </Link>
          ) : (
            <span />
          )}
          {last ? (
            <Link to="/" className="btn tut-next">
              전체 용어 보러 가기
            </Link>
          ) : (
            <Link to={`/tutorial/${n + 1}`} className="btn tut-next">
              다음 단계 · {getTerm(TUTORIAL[n].term).en} →
            </Link>
          )}
        </nav>
      </main>
    </>
  )
}
