import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

const RequiredStar = () => <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>

const PasswordInput = ({ fieldKey, placeholder, show, toggle, form, setForm }) => (
  <div style={{ position: 'relative' }}>
    <input
      className="input"
      type={show ? 'text' : 'password'}
      placeholder={placeholder}
      value={form[fieldKey]}
      onChange={e => setForm(f => ({ ...f, [fieldKey]: e.target.value }))}
      style={{ paddingRight: '2.5rem' }}
    />
    <button
      type="button"
      onClick={toggle}
      style={{
        position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'var(--text-secondary)', padding: 0, fontSize: 16
      }}
    >
      {show ? '🙈' : '👁️'}
    </button>
  </div>
)

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const navigate = useNavigate()

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username) { setError('Username is required.'); return }
    if (!form.email) { setError('Email is required.'); return }
    if (!emailRegex.test(form.email)) { setError('Enter a valid email address.'); return }
    if (!form.password) { setError('Password is required.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (!form.confirm) { setError('Please confirm your password.'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }

    setLoading(true)
    setError('')
    try {
      await api.post('/auth/register', {
        username: form.username,
        email: form.email,
        password: form.password
      })
      navigate('/login')
    } catch (err) {
      const detail = err.response?.data?.detail
      if (detail?.includes('username')) setError('Username already taken.')
      else if (detail?.includes('email')) setError('Email already registered.')
      else setError(detail || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', padding: '2rem'
    }}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: 420, padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16,
            background: 'linear-gradient(135deg, #14a085, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 700, color: '#fff', margin: '0 auto 16px'
          }}>T</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Create account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Start your learning journey</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--text-secondary)' }}>
              Username<RequiredStar />
            </label>
            <input
              className="input"
              type="text"
              placeholder="Choose a username"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              autoFocus
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--text-secondary)' }}>
              Email<RequiredStar />
            </label>
            <input
              className="input"
              type="text"
              placeholder="your@email.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--text-secondary)' }}>
              Password<RequiredStar />
            </label>
            <PasswordInput
              fieldKey="password"
              placeholder="At least 6 characters"
              show={showPassword}
              toggle={() => setShowPassword(p => !p)}
              form={form}
              setForm={setForm}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--text-secondary)' }}>
              Confirm password<RequiredStar />
            </label>
            <PasswordInput
              fieldKey="confirm"
              placeholder="Repeat your password"
              show={showConfirm}
              toggle={() => setShowConfirm(p => !p)}
              form={form}
              setForm={setForm}
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#f87171', marginBottom: 14
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: 4 }}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: 14, color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#14a085', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}