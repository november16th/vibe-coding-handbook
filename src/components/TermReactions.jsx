import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { postFeedback } from '../stats'

// 용어 상세 페이지 별명 줄 오른쪽 끝의 [♡ 숫자] [말풍선].
// 좋아요는 같은 브라우저에서 용어마다 한 번. 다시 누르면 취소된다. 숫자는 모두에게 보인다.
// 말풍선은 의견 입력 창을 연다. 의견은 관리자 화면에서만 본다.

// 아이콘 모양은 Lucide(ISC 라이선스)의 heart / message-circle
const HEART = 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'
const BUBBLE = 'M7.9 20A9 9 0 1 0 4 16.1L2 22Z'

const Svg = ({ d, filled = false }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
)

const likedKey = (term) => `liked:${term}`
const readLiked = (term) => {
  try {
    return localStorage.getItem(likedKey(term)) === '1'
  } catch {
    return false
  }
}
const writeLiked = (term, on) => {
  try {
    on ? localStorage.setItem(likedKey(term), '1') : localStorage.removeItem(likedKey(term))
  } catch {
    // 저장하지 못하면 새로고침 뒤 하트가 비어 보일 뿐이다
  }
}

function CommentModal({ open, term, title, onClose }) {
  const [text, setText] = useState('')
  const [state, setState] = useState('edit') // edit | sending | sent | error
  const boxRef = useRef(null)

  useEffect(() => {
    if (!open) return
    setText('')
    setState('edit')
    const onKey = (e) => e.key === 'Escape' && onClose()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    addEventListener('keydown', onKey)
    requestAnimationFrame(() => boxRef.current?.querySelector('textarea')?.focus())
    return () => {
      document.body.style.overflow = prev
      removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const submit = async (e) => {
    e.preventDefault()
    const comment = text.trim()
    if (!comment || state === 'sending') return
    setState('sending')
    try {
      await postFeedback({ term, comment })
      setState('sent')
    } catch {
      setState('error')
    }
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="md-modal" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <motion.div ref={boxRef} className="lock-notice" role="dialog" aria-modal="true" aria-labelledby="comment-title" onClick={(e) => e.stopPropagation()} initial={{ y: 24, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 24, scale: 0.98 }} transition={{ type: 'spring', stiffness: 380, damping: 32 }}>
            <span className="lock-notice-icon">
              <Svg d={BUBBLE} />
            </span>
            {state === 'sent' ? (
              <>
                <h2 id="comment-title">의견 고마워요!</h2>
                <p>보내주신 내용은 설명을 고칠 때 참고할게요.</p>
                <div className="lock-notice-btns">
                  <button className="btn" onClick={onClose}>
                    닫기
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={submit}>
                <h2 id="comment-title">{title}에 의견 남기기</h2>
                <p>좋았던 점, 어려웠던 점, 더 있으면 하는 내용을 자유롭게 남겨주세요.</p>
                <textarea className="cm-text" value={text} onChange={(e) => setText(e.target.value)} placeholder="예: 예시가 하나 더 있으면 좋겠어요" maxLength={500} rows={4} />
                {state === 'error' && <p className="cm-error">보내지 못했어요. 잠시 뒤에 다시 시도해 주세요.</p>}
                <div className="lock-notice-btns cm-btns">
                  <button type="button" className="btn cm-skip" onClick={onClose}>
                    닫기
                  </button>
                  <button className="btn" disabled={!text.trim() || state === 'sending'}>
                    {state === 'sending' ? '보내는 중' : '보내기'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export default function TermReactions({ term, title, likes }) {
  const [liked, setLiked] = useState(() => readLiked(term))
  // 서버에서 받은 숫자. 누르면 바뀐 숫자로 덮어쓴다. 못 불러왔으면 null이고 숫자 없이 하트만 보인다
  const [count, setCount] = useState(likes ?? null)
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  useEffect(() => setLiked(readLiked(term)), [term])
  useEffect(() => setCount(likes ?? null), [likes])

  const toggle = async () => {
    const next = !liked
    setLiked(next)
    writeLiked(term, next)
    setCount((c) => (c == null ? c : Math.max(0, c + (next ? 1 : -1))))
    try {
      const res = await postFeedback({ term, like: next })
      if (res && typeof res.likes === 'number') setCount(res.likes)
    } catch {
      // 저장에 실패하면 화면을 원래대로 돌린다
      setLiked(!next)
      writeLiked(term, !next)
      setCount((c) => (c == null ? c : Math.max(0, c + (next ? -1 : 1))))
    }
  }

  return (
    <div className="react">
      <motion.button type="button" className={'react-pill' + (liked ? ' on' : '')} onClick={toggle} aria-pressed={liked} aria-label={liked ? '좋아요 취소' : '좋아요'} whileTap={{ scale: 0.9 }}>
        <motion.span key={liked ? 'on' : 'off'} initial={liked ? { scale: 0.5 } : false} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 14 }} className="react-ic">
          <Svg d={HEART} filled={liked} />
        </motion.span>
        {count != null && <span className="mono">{count.toLocaleString()}</span>}
      </motion.button>
      <motion.button type="button" className="react-pill icon" onClick={() => setOpen(true)} aria-label="의견 보내기" title="의견 보내기" whileTap={{ scale: 0.9 }}>
        <Svg d={BUBBLE} />
      </motion.button>
      <CommentModal open={open} term={term} title={title} onClose={close} />
    </div>
  )
}
