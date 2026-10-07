import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout, theme, toggleTheme } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(15,15,26,0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 2rem',
      height: '64px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: 34, height: 34,
          background: 'linear-gradient(135deg, #14a085, #7c3aed)',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 700, color: '#fff'
        }}>T</div>
        <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
          Tech<span style={{ color: '#14a085' }}>Learn</span>
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={toggleTheme}
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid var(--border-strong)',
            borderRadius: '50%',
            width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, color: 'var(--text-secondary)',
            transition: 'var(--transition)'
          }}
          title="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '6px 14px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50px',
          border: '1px solid var(--border)'
        }}>
          <div style={{
            width: 28, height: 28,
            background: 'linear-gradient(135deg, #14a085, #7c3aed)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#fff'
          }}>
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
            {user?.username}
          </span>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </nav>
  )
}