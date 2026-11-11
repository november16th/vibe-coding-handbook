import { Redis } from '@upstash/redis'

// 접속 정보는 Vercel 환경변수(KV_REST_API_URL, KV_REST_API_TOKEN)에서 읽는다
const redis = Redis.fromEnv()

const koreaDate = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' })

const json = (data, status = 200) =>
  Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } })

// 기록과 읽기를 파이프라인 하나로 묶어 Upstash를 한 번만 왕복한다
async function run({ visit, view } = {}) {
  const day = koreaDate()
  const pipeline = redis.pipeline()
  if (visit) pipeline.incr('visits:total').incr(`visits:${day}`)
  if (view) pipeline.hincrby('views', view, 1)
  pipeline.get('visits:total').get(`visits:${day}`).hgetall('views')
  const [total, today, views] = (await pipeline.exec()).slice(-3)
  return json({ total: total ?? 0, today: today ?? 0, views: views ?? {} })
}

async function record(request) {
  const { visit, view } = await request.json().catch(() => ({}))
  const validView = typeof view === 'string' && /^[\w-]{1,40}$/.test(view)
  if (visit !== true && !validView) return json({ error: 'bad request' }, 400)
  return run({ visit: visit === true, view: validView ? view : null })
}

export default {
  fetch(request) {
    if (request.method === 'POST') return record(request)
    if (request.method === 'GET') return run()
    return json({ error: 'method not allowed' }, 405)
  },
}
