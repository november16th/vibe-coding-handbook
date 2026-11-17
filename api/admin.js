import { createHash, timingSafeEqual } from 'node:crypto'
import { redis, koreaDate, json } from './_lib.js'

// 관리자만 보는 사용 지표. Vercel 환경변수 ADMIN_TOKEN과 같은 비밀번호를
// Authorization: Bearer <비밀번호> 로 보내야 열린다.
// 같은 곳(IP)에서 비밀번호를 5번 틀리면 1시간 동안 맞는 비밀번호로도 열리지 않는다.

const DAYS = 14
const MAX_FAILS = 5
const LOCK_SECONDS = 60 * 60

// 접속한 곳의 IP. Vercel이 x-forwarded-for 맨 앞에 실제 IP를 넣어 준다.
// IP를 그대로 저장하지 않도록 해시로 바꿔 키 이름에만 쓴다
const clientKey = (request) => {
  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown'
  return `admin:fail:${createHash('sha256').update(ip).digest('hex').slice(0, 32)}`
}

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

// Upstash가 JSON 문자열을 객체로 바꿔 주기도 하고 안 바꿔 주기도 해서 둘 다 받는다
const parseJson = (v) => {
  if (v && typeof v === 'object') return v
  try {
    return JSON.parse(v)
  } catch {
    return null
  }
}

// 오늘부터 거꾸로 DAYS일의 한국 날짜
const recentDays = () => Array.from({ length: DAYS }, (_, i) => koreaDate(new Date(Date.now() - i * 86400000)))

async function report() {
  const days = recentDays()
  const pipeline = redis.pipeline()
  pipeline.hgetall('copies').hgetall('searches').hgetall('searches:miss').hgetall('views')
  for (const d of days) pipeline.get(`visits:${d}`).get(`returning:${d}`).get(`copies:${d}`).get(`searches:${d}`)
  pipeline.lrange('searches:recent', 0, 19)
  const [copies, searches, misses, views, ...rest] = await pipeline.exec()
  const daily = rest.slice(0, -1)
  const recent = rest.at(-1)

  return json({
    daily: days.map((day, i) => {
      const [visits, returning, copied, searched] = daily.slice(i * 4, i * 4 + 4).map((v) => Number(v ?? 0))
      return { day, visits, returning, copies: copied, searches: searched }
    }),
    copies: top(copies),
    searches: top(searches),
    misses: top(misses),
    views: top(views),
    recent: (recent ?? []).map(parseJson).filter(Boolean),
    // 한 번이라도 본 페이지 이름 전부. 아직 아무도 안 본 용어를 찾는 데 쓴다
    viewed: Object.keys(views ?? {}).filter((k) => Number(views[k]) > 0),
  })
}

async function handle(request) {
  const expected = process.env.ADMIN_TOKEN
  if (!expected) return json({ error: 'ADMIN_TOKEN is not set' }, 503)

  const key = clientKey(request)
  const fails = Number((await redis.get(key)) ?? 0)
  if (fails >= MAX_FAILS) return json({ error: 'locked', retryAfter: await redis.ttl(key) }, 429)

  const given = (request.headers.get('authorization') ?? '').replace(/^Bearer /, '')
  if (!sameToken(given, expected)) {
    const count = await redis.incr(key)
    // 첫 실패 때부터 1시간을 잰다. 그 안에 5번 틀리면 남은 시간 동안 막힌다
    if (count === 1) await redis.expire(key, LOCK_SECONDS)
    if (count >= MAX_FAILS) return json({ error: 'locked', retryAfter: await redis.ttl(key) }, 429)
    return json({ error: 'unauthorized', remaining: MAX_FAILS - count }, 401)
  }

  if (fails) await redis.del(key)
  if (request.method === 'GET') return report()
  return json({ error: 'method not allowed' }, 405)
}

export default { fetch: handle }
