import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration, useLocation, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Detail from './pages/Detail'
import Tutorial from './pages/Tutorial'
import Admin from './pages/Admin'
import { SHOW_TUTORIAL } from './tutorial'
import './styles.css'

// "/#section" 으로 돌아왔을 때 해당 섹션으로 이동
function HashScroll() {
  const { hash, pathname } = useLocation()
  useEffect(() => {
    if (!hash) return
    const el = document.getElementById(hash.slice(1))
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 120 })
  }, [hash, pathname])
  return null
}

function Root() {
  return (
    <>
      <Outlet />
      <ScrollRestoration />
      <HashScroll />
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/term/:id', element: <Detail /> },
      // 관리자용 사용 지표. 링크는 어디에도 없고, 비밀번호가 있어야 숫자가 보인다
      { path: '/admin', element: <Admin /> },
      // 튜토리얼을 숨긴 동안에는 주소로 들어와도 홈으로 보낸다
      { path: '/tutorial/:course', element: SHOW_TUTORIAL ? <Tutorial /> : <Navigate to="/" replace /> },
      { path: '/tutorial/:course/:step', element: SHOW_TUTORIAL ? <Tutorial /> : <Navigate to="/" replace /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
