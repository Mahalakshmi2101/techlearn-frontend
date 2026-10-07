export default function ProgressBar({ percentage, showLabel = true, height = 6 }) {
  return (
    <div>
      {showLabel && (
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          marginBottom: 6, fontSize: 12, color: 'var(--text-secondary)'
        }}>
          <span>Progress</span>
          <span style={{ color: '#14a085', fontWeight: 600 }}>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="progress-track" style={{ height }}>
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}