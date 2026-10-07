import { useNavigate } from 'react-router-dom'
import ProgressBar from './ProgressBar'

const THUMBNAILS = {
  java: { bg: 'linear-gradient(135deg, #f89820, #c85a00)', icon: '☕' },
  dsa: { bg: 'linear-gradient(135deg, #14a085, #0d5c4f)', icon: '🧮' },
  spring: { bg: 'linear-gradient(135deg, #6db33f, #3a7a1a)', icon: '🌱' },
  react: { bg: 'linear-gradient(135deg, #61dafb, #0891b2)', icon: '⚛️' },
  sql: { bg: 'linear-gradient(135deg, #336791, #1a3a5c)', icon: '🗄️' },
}

const DIFFICULTY_COLOR = {
  Beginner: 'badge-teal',
  Intermediate: 'badge-warning',
  Advanced: 'badge-purple',
}

export default function CourseCard({ course, progress }) {
  const navigate = useNavigate()
  const thumb = THUMBNAILS[course.thumbnail] || THUMBNAILS.java
  const pct = progress?.percentage || 0

  return (
    <div
      className="card"
      onClick={() => navigate(`/course/${course.id}`)}
      style={{
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)'
        e.currentTarget.style.borderColor = 'rgba(20,160,133,0.4)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = 'var(--border)'
      }}
    >
      {/* Thumbnail */}
      <div style={{
        height: 140,
        background: thumb.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 52,
        position: 'relative'
      }}>
        {thumb.icon}
        {progress?.is_completed && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(16,185,129,0.9)',
            borderRadius: '50%', width: 28, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14
          }}>✓</div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          <span className={`badge ${DIFFICULTY_COLOR[course.difficulty] || 'badge-blue'}`}>
            {course.difficulty}
          </span>
          <span className="badge badge-blue">{course.category}</span>
        </div>

        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)', lineHeight: 1.4 }}>
          {course.title}
        </h3>

        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {course.description}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12,
          color: 'var(--text-muted)', marginBottom: 14 }}>
          <span>👨‍💻 {course.instructor}</span>
          <span>⏱ {course.duration}</span>
        </div>

        <ProgressBar percentage={pct} />
      </div>
    </div>
  )
}