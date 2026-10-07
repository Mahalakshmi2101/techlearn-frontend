export default function LoadingSpinner({ fullscreen = false, size = 36 }) {
  const spinner = (
    <div style={{
      width: size, height: size,
      border: `3px solid rgba(255,255,255,0.1)`,
      borderTop: `3px solid #14a085`,
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
  )

  if (fullscreen) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: 'var(--bg-primary)'
    }}>
      {spinner}
    </div>
  )

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
      {spinner}
    </div>
  )
}