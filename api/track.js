import { redis, koreaDate, json } from './_lib.js'

// 실제로 쓰이는지 알려주는 신호를 기록만 한다. 여기서는 아무 숫자도 돌려주지 않고,
// 모은 숫자는 비밀번호가 있어야 열리는 /api/admin 에서만 볼 수 있다.
//   { copy: 'Hero Section' }        요청 문장 복사 (화면의 제목 그대로, 튜토리얼은 '코스 이름 N단계')
//   { search: '팝업', hits: 3 }      검색어와 결과 개수. 결과가 0개면 따로도 센다

// 제목은 대소문자·띄어쓰기를 그대로 둔다. 줄바꿈 같은 제어 문자만 막는다
const cleanName = (n) => (typeof n === 'string' && !/[\u0000-\u001f]/.test(n) ? n.trim().slice(0, 60) : '')

// 검색어는 앞뒤 공백을 지우고, 공백을 하나로 줄이고, 소문자로 바꿔 같은 말끼리 모은다
const cleanQuery = (q) =>
  typeof q === 'string' ? q.trim().replace(/\s+/g, ' ').toLowerCase().slice(0, 40) : ''

async function record(request) {
  const body = await request.json().catch(() => ({}))
  const day = koreaDate()
  const pipeline = redis.pipeline()

  if (cleanName(body.copy)) {
    pipeline.hincrby('copies', cleanName(body.copy), 1).incr(`copies:${day}`)
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
