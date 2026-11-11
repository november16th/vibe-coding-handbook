import { Redis } from '@upstash/redis'

// 접속 정보는 Vercel 환경변수(KV_REST_API_URL, KV_REST_API_TOKEN)에서 읽는다
const redis = Redis.fromEnv()

const koreaDate = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' })

const json = (data, status = 200) =>
  Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } })

async function record(request) {
  const { type, id } = await request.json().catch(() => ({}))
  if (type === 'visit') {
    await Promise.all([redis.incr('visits:total'), redis.incr(`visits:${koreaDate()}`)])
    return json({ ok: true })
  }
  if (type === 'view' && typeof id === 'string' && /^[\w-]{1,40}$/.test(id)) {
    await redis.hincrby('views', id, 1)
    return json({ ok: true })
  }
  return json({ error: 'bad request' }, 400)
}

async function read() {
  const [total, today, views] = await Promise.all([
    redis.get('visits:total'),
    redis.get(`visits:${koreaDate()}`),
    redis.hgetall('views'),
  ])
  return json({ total: total ?? 0, today: today ?? 0, views: views ?? {} })
}

export default {
  fetch(request) {
    if (request.method === 'POST') return record(request)
    if (request.method === 'GET') return read()
    return json({ error: 'method not allowed' }, 405)
  },
}
