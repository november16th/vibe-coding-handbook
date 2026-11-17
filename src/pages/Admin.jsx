import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTerm, TERMS } from '../terms'
import { TUTORIALS } from '../tutorial'
import TrendChart from '../components/TrendChart'

// 관리자만 보는 사용 지표. 비밀번호(Vercel 환경변수 ADMIN_TOKEN)를 넣어야 숫자를 불러온다.
// 비밀번호는 이 브라우저에만 저장하고, 다른 곳에는 보내지 않는다.

const KEY = 'admin-token'
const load = () => {
  try {
    return localStorage.getItem(KEY) ?? ''
  } catch {
    return ''
  }
}
const save = (v) => {
  try {
    v ? localStorage.setItem(KEY, v) : localStorage.removeItem(KEY)
  } catch {
    // 저장하지 못하면 매번 다시 입력하면 된다
  }
}

// 복사·조회 위치 이름을 읽기 쉬운 이름으로. term-modal → Modal, tutorial-4-2 → 혼자 마음껏 개발하기 2단계
function placeName(key) {
  const term = key.match(/^term-(.+)$/)
  if (term) return getTerm(term[1])?.en ?? key
  const tut = key.match(/^tutorial-(\d+)(?:-(\d+))?$/)
  if (tut) return `${TUTORIALS[tut[1] - 1]?.title ?? key}${tut[2] ? ` ${tut[2]}단계` : ''}`
  return getTerm(key)?.en ?? key
}

const pct = (a, b) => (b ? `${Math.round((a / b) * 100)}%` : '-')

function Ranking({ title, hint, rows, name = (k) => k }) {
  return (
    <section className="admin-card">
      <h2>{title}</h2>
      <p className="admin-hint">{hint}</p>
      {rows.length ? (
        <ol className="admin-rank">
          {rows.map((r) => (
            <li key={r.key}>
              <span>{name(r.key)}</span>
              <b className="mono">{r.count.toLocaleString()}</b>
            </li>
          ))}
        </ol>
      ) : (
        <p className="admin-empty">아직 기록이 없어요.</p>
      )}
    </section>
  )
}

// 가장 최근 검색 20개. 시간순(최신이 위)
function Recent({ rows = [] }) {
  return (
    <section className="admin-card">
      <h2>최근 검색어</h2>
      <p className="admin-hint">가장 최근 20개, 최신이 위예요. 오른쪽은 검색 결과 개수예요</p>
      {rows.length ? (
        <ul className="admin-rank admin-recent">
          {rows.map((r, i) => (
            <li key={r.at + i}>
              <span>{r.q}</span>
              <em className="mono">{new Date(r.at).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</em>
              <b className={'mono' + (r.hits === 0 ? ' admin-miss' : '')}>{r.hits === 0 ? '없음' : `${r.hits}개`}</b>
            </li>
          ))}
        </ul>
      ) : (
        <p className="admin-empty">아직 기록이 없어요.</p>
      )}
    </section>
  )
}

// 조회수가 0인 용어. 이름을 바꾸거나 별명을 더하거나 뺄지 고민할 후보
function Unseen({ viewed = [] }) {
  const seen = new Set(viewed)
  const rows = TERMS.filter((t) => !seen.has(t.id))
  return (
    <section className="admin-card">
      <h2>
        아직 아무도 안 본 용어 <span className="mono admin-count">{rows.length}</span>
      </h2>
      <p className="admin-hint">전체 {TERMS.length}개 중 조회수가 0인 용어예요. 이름을 쉽게 바꾸거나 별명을 더할 후보예요</p>
      {rows.length ? (
        <ul className="admin-rank admin-unseen">
          {rows.map((t) => (
            <li key={t.id}>
              <span>{t.en}</span>
              <em>{t.section.title}</em>
            </li>
          ))}
        </ul>
      ) : (
        <p className="admin-empty">모든 용어가 한 번 이상 조회됐어요.</p>
      )}
    </section>
  )
}

export default function Admin() {
  const [token, setToken] = useState(load)
  const [input, setInput] = useState('')
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])

  useEffect(() => {
    if (!token) return
    let alive = true
    setError('')
    fetch('/api/admin', { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        if (!alive) return
        if (res.status === 401) {
          const { remaining } = await res.json().catch(() => ({}))
          save('')
          setToken('')
          setError(remaining != null ? `비밀번호가 맞지 않아요. ${remaining}번 더 틀리면 1시간 동안 막혀요.` : '비밀번호가 맞지 않아요.')
        } else if (res.status === 429) {
          const { retryAfter } = await res.json().catch(() => ({}))
          save('')
          setToken('')
          const min = retryAfter > 0 ? Math.ceil(retryAfter / 60) : 60
          setError(`비밀번호를 5번 틀려서 잠겼어요. 약 ${min}분 뒤에 다시 시도해 주세요.`)
        } else if (res.status === 503) setError('Vercel 환경변수 ADMIN_TOKEN이 아직 설정되지 않았어요.')
        else if (!res.ok || !res.headers.get('content-type')?.includes('json')) setError('숫자를 불러오지 못했어요. 배포된 사이트에서 열어주세요 (npm run dev에는 api 함수가 없어요).')
        else setData(await res.json())
      })
      .catch(() => alive && setError('숫자를 불러오지 못했어요.'))
    return () => {
      alive = false
    }
  }, [token])

  const submit = (e) => {
    e.preventDefault()
    const v = input.trim()
    if (!v) return
    save(v)
    setToken(v)
    setInput('')
  }

  const logout = () => {
    save('')
    setToken('')
    setData(null)
  }

  const sum = (k) => data?.daily.reduce((m, d) => m + d[k], 0) ?? 0

  return (
    <>
      <header className="topbar">
        <div className="topbar-in">
          <Link to="/" className="logo">
            VIBE CODING HANDBOOK
          </Link>
        </div>
      </header>

      <main className="wrap admin">
        <div className="admin-head">
          <h1>User Activity Analytics</h1>
          {token && (
            <button className="btn small" onClick={logout}>
              로그아웃
            </button>
          )}
        </div>

        {!token && (
          <form className="admin-login" onSubmit={submit}>
            <input type="password" value={input} onChange={(e) => setInput(e.target.value)} placeholder="관리자 비밀번호" autoComplete="current-password" />
            <button className="btn">열기</button>
          </form>
        )}
        {error && <p className="admin-error">{error}</p>}

        {data && (
          <>
            <section className="admin-card">
              <h2>최근 14일</h2>
              <p className="admin-hint">
                재방문은 전에 다른 날 와본 브라우저예요. 복사는 "AI에게 할 말" 복사 버튼을 누른 횟수예요. 14일 합계: 방문 {sum('visits')} · 재방문 {sum('returning')} ({pct(sum('returning'), sum('visits'))}) · 복사 {sum('copies')} · 검색 {sum('searches')}
              </p>
              <TrendChart daily={data.daily} />
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>날짜</th>
                      <th>방문</th>
                      <th>재방문</th>
                      <th>재방문 비율</th>
                      <th>복사</th>
                      <th>검색</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.daily.map((d) => (
                      <tr key={d.day}>
                        <td className="mono">{d.day.slice(5)}</td>
                        <td className="mono">{d.visits}</td>
                        <td className="mono">{d.returning}</td>
                        <td className="mono">{pct(d.returning, d.visits)}</td>
                        <td className="mono">{d.copies}</td>
                        <td className="mono">{d.searches}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="admin-grid">
              <Ranking title="많이 복사한 곳" hint="어느 페이지의 요청 문장을 복사해 갔는지" rows={data.copies} name={placeName} />
              <Ranking title="많이 찾은 검색어" hint="타이핑을 멈춘 뒤의 검색어만 세요" rows={data.searches} />
              <Ranking title="결과가 없던 검색어" hint="사이트에 없는 것. 다음에 추가할 용어 후보예요" rows={data.misses} />
              <Ranking title="많이 본 페이지" hint="카드 조회수 (화면에 보이는 숫자와 같아요)" rows={data.views} name={placeName} />
              <Unseen viewed={data.viewed} />
              <Recent rows={data.recent} />
            </div>
          </>
        )}
      </main>
    </>
  )
}
