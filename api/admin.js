import { timingSafeEqual } from 'node:crypto'
import { redis, koreaDate, json } from './_lib.js'

// 관리자만 보는 사용 지표. Vercel 환경변수 ADMIN_TOKEN과 같은 비밀번호를
// Authorization: Bearer <비밀번호> 로 보내야 열린다.

const DAYS = 14

const sameToken = (given, expected) => {
  const a = Buffer.from(given)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

// 많이 나온 순서로 n개만
const top = (hash, n = 30) =>
  Object.entries(hash ?? {})
    .map(([key, count]) => ({ key, count: Number(count) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n)

// 오늘부터 거꾸로 DAYS일의 한국 날짜
const recentDays = () => Array.from({ length: DAYS }, (_, i) => koreaDate(new Date(Date.now() - i * 86400000)))

async function report() {
  const days = recentDays()
  const pipeline = redis.pipeline()
  pipeline.hgetall('copies').hgetall('searches').hgetall('searches:miss').hgetall('views')
  for (const d of days) pipeline.get(`visits:${d}`).get(`returning:${d}`).get(`copies:${d}`).get(`searches:${d}`)
  const [copies, searches, misses, views, ...daily] = await pipeline.exec()

  return json({
    daily: days.map((day, i) => {
      const [visits, returning, copied, searched] = daily.slice(i * 4, i * 4 + 4).map((v) => Number(v ?? 0))
      return { day, visits, returning, copies: copied, searches: searched }
    }),
    copies: top(copies),
    searches: top(searches),
    misses: top(misses),
    views: top(views),
  })
}

export default {
  fetch(request) {
    const expected = process.env.ADMIN_TOKEN
    if (!expected) return json({ error: 'ADMIN_TOKEN is not set' }, 503)
    const given = (request.headers.get('authorization') ?? '').replace(/^Bearer /, '')
    if (!sameToken(given, expected)) return json({ error: 'unauthorized' }, 401)
    if (request.method === 'GET') return report()
    return json({ error: 'method not allowed' }, 405)
  },
}
