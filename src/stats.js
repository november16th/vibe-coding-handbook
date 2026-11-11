import { useEffect, useState } from 'react'

const API = '/api/stats'

// npm run dev에는 Vercel 함수가 없으므로 배포된 사이트에서만 호출한다
const ENABLED = import.meta.env.PROD

// 개발 화면에서 숫자 자리를 확인하기 위한 가짜 값. 카드마다 다른 숫자가 나온다
const FAKE_STATS = ENABLED
  ? null
  : {
      today: 12,
      total: 3456,
      views: new Proxy({}, { get: (_, id) => [...String(id)].reduce((sum, ch) => (sum * 31 + ch.charCodeAt(0)) % 5000, 7) }),
    }

// 시크릿 창 등에서 저장소 접근이 막혀도 화면은 멈추지 않게 한다
const read = (storage, key) => {
  try {
    return window[storage].getItem(key)
  } catch {
    return null
  }
}
const write = (storage, key, value) => {
  try {
    window[storage].setItem(key, value)
  } catch {
    // 저장하지 못해도 카운트에만 영향을 준다
  }
}

// 기록이 끝난 뒤에 숫자를 읽어야 방금 올린 값까지 보인다
let writes = Promise.resolve()

function send(body) {
  const request = fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
    .then((res) => res.ok)
    .catch(() => false)
  writes = Promise.all([writes, request])
  return request
}

// 같은 브라우저는 한국 날짜 기준 하루 한 번만 방문으로 센다
export function recordVisit() {
  if (!ENABLED) return
  const day = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' })
  if (read('localStorage', 'visited') === day) return
  send({ type: 'visit' }).then((ok) => ok && write('localStorage', 'visited', day))
}

// 같은 탭에서 새로고침을 반복해도 한 번만 조회로 센다
export function recordView(id) {
  if (!ENABLED) return
  const key = `viewed:${id}`
  if (read('sessionStorage', key)) return
  write('sessionStorage', key, '1')
  send({ type: 'view', id })
}

// 숫자를 못 불러오면 null로 남고, 화면은 숫자 없이 그대로 보인다
// key가 바뀌면 다시 불러온다. 방금 올린 조회수까지 보려면 recordView 효과보다 뒤에서 호출한다
export function useStats(key) {
  const [stats, setStats] = useState(FAKE_STATS)
  useEffect(() => {
    if (!ENABLED) return
    let alive = true
    writes
      .then(() => fetch(API))
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => alive && setStats(data))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [key])
  return stats
}
