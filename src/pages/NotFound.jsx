import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', flexDirection: 'column', gap: '1rem', textAlign: 'center'
    }}>
      <div style={{ fontSize: 72 }}>404</div>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Page not found</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
        The page you are looking for does not exist.
      </p>
      <button className="btn btn-primary" onClick={() => navigate('/')}>
        Go home
      </button>
    </div>
  )
}