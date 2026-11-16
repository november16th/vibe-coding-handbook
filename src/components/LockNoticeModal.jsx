import { Fragment, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Icon } from '../demos/parts'
import { LOCKED_NOTICE } from '../tutorial'

// **굵게** 표시만 지원하는 아주 작은 변환
const rich = (text) => text.split('**').map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part))

// 잠긴 튜토리얼 코스를 눌렀을 때 띄우는 안내 창
export default function LockNoticeModal({ open, onClose }) {
  const okRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    addEventListener('keydown', onKey)
    okRef.current?.focus()
    return () => {
      document.body.style.overflow = prev
      removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="md-modal" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <motion.div className="lock-notice" role="alertdialog" aria-modal="true" aria-labelledby="lock-notice-title" onClick={(e) => e.stopPropagation()} initial={{ y: 24, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 24, scale: 0.98 }} transition={{ type: 'spring', stiffness: 380, damping: 32 }}>
            <span className="lock-notice-icon">
              <Icon n="lock" size={20} w={2.2} />
            </span>
            <h2 id="lock-notice-title">{LOCKED_NOTICE.title}</h2>
            {LOCKED_NOTICE.body.map((lines) => (
              <p key={lines[0]}>
                {lines.map((line, i) => (
                  <Fragment key={line}>
                    {i > 0 && <br />}
                    {rich(line)}
                  </Fragment>
                ))}
              </p>
            ))}
            <div className="lock-notice-btns">
              <button ref={okRef} className="btn" onClick={onClose}>
                확인
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
