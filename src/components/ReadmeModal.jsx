import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import readme from '../../README.md?raw'

// 한 줄 안의 **굵게**, `코드`, [링크](주소), 그냥 적힌 https 주소
function inline(text, key) {
  const parts = []
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s)]+)/g
  let last = 0
  let m
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    const t = m[0]
    const k = key + '-' + m.index
    if (t.startsWith('**')) parts.push(<b key={k}>{inline(t.slice(2, -2), k)}</b>)
    else if (t.startsWith('`')) parts.push(<code key={k}>{t.slice(1, -1)}</code>)
    else if (t.startsWith('[')) {
      const [, label, href] = t.match(/\[([^\]]+)\]\(([^)]+)\)/)
      parts.push(
        <a key={k} href={href} target="_blank" rel="noreferrer">
          {label}
        </a>,
      )
    } else
      parts.push(
        <a key={k} href={t} target="_blank" rel="noreferrer">
          {t}
        </a>,
      )
    last = m.index + t.length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

const cells = (line) =>
  line
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((c) => c.trim())

// README에 쓰는 만큼만: 제목, 문단, 목록, 표, 코드 블록
function renderMd(src) {
  const lines = src.split('\n')
  const out = []
  for (let i = 0; i < lines.length; ) {
    const line = lines[i]
    let m
    if (line.startsWith('```')) {
      const code = []
      for (i++; i < lines.length && !lines[i].startsWith('```'); i++) code.push(lines[i])
      out.push(
        <pre key={i}>
          <code>{code.join('\n')}</code>
        </pre>,
      )
      i++
    } else if ((m = line.match(/^(#{1,3})\s+(.*)/))) {
      const H = 'h' + m[1].length
      out.push(<H key={i}>{inline(m[2], i)}</H>)
      i++
    } else if (line.startsWith('|')) {
      const rows = []
      for (; i < lines.length && lines[i].startsWith('|'); i++) if (!/^\|[\s|:-]+\|$/.test(lines[i].trim())) rows.push(cells(lines[i]))
      const [head, ...body] = rows
      out.push(
        <table key={i}>
          <thead>
            <tr>
              {head.map((c, j) => (
                <th key={j}>{inline(c, `${i}h${j}`)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((r, ri) => (
              <tr key={ri}>
                {r.map((c, j) => (
                  <td key={j}>{inline(c, `${i}-${ri}-${j}`)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>,
      )
    } else if (/^\s*[-*]\s+/.test(line)) {
      const items = []
      for (; i < lines.length && /^\s*[-*]\s+/.test(lines[i]); i++) items.push(<li key={i}>{inline(lines[i].replace(/^\s*[-*]\s+/, ''), i)}</li>)
      out.push(<ul key={i}>{items}</ul>)
    } else if (line.trim()) {
      const para = []
      for (; i < lines.length && lines[i].trim() && !/^(#|\||```|\s*[-*]\s)/.test(lines[i]); i++) para.push(lines[i])
      out.push(<p key={i}>{inline(para.join(' '), i)}</p>)
    } else i++
  }
  return out
}

const DOC = renderMd(readme)

// README.md 전체를 화면 위에 띄워 보여준다
export default function ReadmeModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="md-modal" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <motion.div className="md-modal-box" role="dialog" aria-modal="true" aria-label="README.md" onClick={(e) => e.stopPropagation()} initial={{ y: 24, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 24, scale: 0.98 }} transition={{ type: 'spring', stiffness: 380, damping: 32 }}>
            <div className="md-modal-head">
              <span className="mono">README.md</span>
              <button className="md-modal-x" onClick={onClose} aria-label="닫기">
                ✕
              </button>
            </div>
            <div className="md-doc">{DOC}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
