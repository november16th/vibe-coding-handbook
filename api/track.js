import { redis, koreaDate, json } from './_lib.js'

// 실제로 쓰이는지 알려주는 신호를 기록만 한다. 여기서는 아무 숫자도 돌려주지 않고,
// 모은 숫자는 비밀번호가 있어야 열리는 /api/admin 에서만 볼 수 있다.
//   { copy: 'term-modal' }          요청 문장 복사 (어느 페이지에서 복사했는지)
//   { search: '팝업', hits: 3 }      검색어와 결과 개수. 결과가 0개면 따로도 센다

const PAGE = /^[\w-]{1,60}$/

// 검색어는 앞뒤 공백을 지우고, 공백을 하나로 줄이고, 소문자로 바꿔 같은 말끼리 모은다
const cleanQuery = (q) =>
  typeof q === 'string' ? q.trim().replace(/\s+/g, ' ').toLowerCase().slice(0, 40) : ''

async function record(request) {
  const body = await request.json().catch(() => ({}))
  const day = koreaDate()
  const pipeline = redis.pipeline()

  if (typeof body.copy === 'string' && PAGE.test(body.copy)) {
    pipeline.hincrby('copies', body.copy, 1).incr(`copies:${day}`)
  } else if (cleanQuery(body.search) && Number.isInteger(body.hits) && body.hits >= 0) {
    const q = cleanQuery(body.search)
    pipeline.hincrby('searches', q, 1).incr(`searches:${day}`)
    if (body.hits === 0) pipeline.hincrby('searches:miss', q, 1)
  } else {
    return json({ error: 'bad request' }, 400)
  }

  await pipeline.exec()
  return new Response(null, { status: 204 })
}

export default {
  fetch(request) {
    if (request.method === 'POST') return record(request)
    return json({ error: 'method not allowed' }, 405)
  },
}
