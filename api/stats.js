import { redis, koreaDate, json } from './_lib.js'

// 화면에 보이는 방문자·조회수·좋아요 수. 누구나 읽을 수 있으니 관리자용 숫자는 여기서 돌려주지 않는다

// 기록과 읽기를 파이프라인 하나로 묶어 Upstash를 한 번만 왕복한다
async function run({ visit, returning, view } = {}) {
  const day = koreaDate()
  const pipeline = redis.pipeline()
  if (visit) pipeline.incr('visits:total').incr(`visits:${day}`)
  // 전에 다른 날 와본 브라우저의 방문. 관리자 화면에서만 본다
  if (visit && returning) pipeline.incr(`returning:${day}`)
  if (view) pipeline.hincrby('views', view, 1)
  pipeline.get('visits:total').get(`visits:${day}`).hgetall('views').hgetall('likes')
  const [total, today, views, likes] = (await pipeline.exec()).slice(-4)
  return json({ total: total ?? 0, today: today ?? 0, views: views ?? {}, likes: likes ?? {} })
}

async function record(request) {
  const { visit, returning, view } = await request.json().catch(() => ({}))
  const validView = typeof view === 'string' && /^[\w-]{1,40}$/.test(view)
  if (visit !== true && !validView) return json({ error: 'bad request' }, 400)
  return run({ visit: visit === true, returning: returning === true, view: validView ? view : null })
}

export default {
  fetch(request) {
    if (request.method === 'POST') return record(request)
    if (request.method === 'GET') return run()
    return json({ error: 'method not allowed' }, 405)
  },
}
