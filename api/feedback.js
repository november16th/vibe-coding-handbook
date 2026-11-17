import { redis, json } from './_lib.js'

// 용어 상세 페이지의 좋아요와 의견.
//   { term: 'modal', like: true | false }   좋아요 누르기 / 취소. 바뀐 좋아요 수를 돌려준다 (화면에 공개되는 숫자)
//   { term: 'modal', comment: '...' }       의견 보내기. 의견은 비밀번호가 있어야 열리는 /api/admin 에서만 본다

const TERM = /^[\w-]{1,40}$/
const MAX_COMMENT = 500
const KEEP_COMMENTS = 500

async function record(request) {
  const body = await request.json().catch(() => ({}))
  const { term } = body
  if (typeof term !== 'string' || !TERM.test(term)) return json({ error: 'bad request' }, 400)

  if (typeof body.like === 'boolean') {
    let likes = await redis.hincrby('likes', term, body.like ? 1 : -1)
    // 취소가 겹쳐 음수가 되지 않게 0에서 멈춘다
    if (likes < 0) {
      await redis.hset('likes', { [term]: 0 })
      likes = 0
    }
    return json({ likes })
  }

  if (typeof body.comment === 'string') {
    const text = body.comment.trim().slice(0, MAX_COMMENT)
    if (!text) return json({ error: 'bad request' }, 400)
    const entry = JSON.stringify({ term, text, at: new Date().toISOString() })
    // 최근 의견만 남긴다
    await redis.pipeline().lpush('feedback:comments', entry).ltrim('feedback:comments', 0, KEEP_COMMENTS - 1).exec()
    return new Response(null, { status: 204 })
  }

  return json({ error: 'bad request' }, 400)
}

export default {
  fetch(request) {
    if (request.method === 'POST') return record(request)
    return json({ error: 'method not allowed' }, 405)
  },
}
