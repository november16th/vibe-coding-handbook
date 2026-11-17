import { createContext, useEffect, useState } from 'react'

const API = '/api/stats'

// npm run dev에는 Vercel 함수가 없으므로 배포된 사이트에서만 호출한다
const ENABLED = import.meta.env.PROD

// 개발 화면에서 숫자 자리를 확인하기 위한 가짜 값. 가짜임을 알 수 있게 모두 1234로 둔다
const FAKE_STATS = ENABLED
  ? null
  : {
      today: 1234,
      total: 1234,
      views: new Proxy({}, { get: () => 1234 }),
      likes: new Proxy({}, { get: () => 12 }),
    }

// 시크릿 창 등에서 저장소 접근이 막혀도 화면은 멈추지 않게 한다
const read = (key) => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}
const write = (key, value) => {
  try {
    localStorage.setItem(key, value)
  } catch {
    // 저장하지 못해도 카운트에만 영향을 준다
  }
}

let visitInFlight = false

// 기록할 것이 있으면 POST 한 번으로 기록하고 최신 숫자까지 받는다
async function sync(view) {
  const day = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' })
  // 같은 브라우저는 한국 날짜 기준 하루 한 번만 방문으로 센다
  const lastVisit = read('visited')
  const visit = lastVisit !== day && !visitInFlight
  // 전에 다른 날 와본 적이 있으면 다시 온 방문자
  const returning = visit && Boolean(lastVisit)
  if (!visit && !view) {
    const res = await fetch(API)
    return res.ok ? res.json() : null
  }

  if (visit) visitInFlight = true
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visit, returning, view }),
    })
    if (!res.ok) return null
    if (visit) write('visited', day)
    return res.json()
  } finally {
    if (visit) visitInFlight = false
  }
}

// view를 넘기면 그 페이지의 조회수를 1 올린다. 숫자를 못 불러오면 null로 남고, 화면은 숫자 없이 그대로 보인다
export function useStats(view) {
  const [stats, setStats] = useState(FAKE_STATS)
  useEffect(() => {
    if (!ENABLED) return
    let alive = true
    sync(view)
      .then((data) => alive && setStats(data))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [view])
  return stats
}

// 관리자만 보는 사용 신호를 보낸다 (요청 문장 복사, 검색어). 실패해도 화면에는 영향이 없다
export function track(event) {
  if (!ENABLED) return
  const body = JSON.stringify(event)
  try {
    // 페이지를 떠나는 중에도 전송되도록 sendBeacon을 먼저 쓴다. 서버는 내용을 JSON으로 읽는다
    if (navigator.sendBeacon?.('/api/track', new Blob([body], { type: 'text/plain' }))) return
  } catch {
    // sendBeacon이 막힌 브라우저는 아래 fetch로
  }
  fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {})
}

// 복사 기록에 남길 이름. 용어 페이지는 'Hero Section'처럼 화면의 제목 그대로, 튜토리얼은 '코스 이름 N단계'
export const CopyName = createContext(null)

// 좋아요·의견 보내기. 좋아요는 바뀐 숫자를 받아 와야 해서 응답을 기다린다. 개발 화면에서는 보내지 않는다
export async function postFeedback(body) {
  if (!ENABLED) return null
  const res = await fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  if (!res.ok) throw new Error('feedback failed')
  return res.status === 204 ? null : res.json()
}
