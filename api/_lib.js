import { Redis } from '@upstash/redis'

// 이름이 _로 시작하는 파일은 Vercel이 주소로 공개하지 않는다. api 함수들이 같이 쓰는 도구 모음

// 접속 정보는 Vercel 환경변수(KV_REST_API_URL, KV_REST_API_TOKEN)에서 읽는다
export const redis = Redis.fromEnv()

export const koreaDate = (date = new Date()) => date.toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' })

export const json = (data, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } })
