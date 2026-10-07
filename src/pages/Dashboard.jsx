import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import CourseCard from '../components/CourseCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Dashboard() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [progress, setProgress] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('All')

  const categories = ['All', 'Programming', 'DSA', 'Backend', 'Frontend', 'Database']

  useEffect(() => {
    Promise.all([api.get('/courses/'), api.get('/progress/')])
      .then(([cRes, pRes]) => {
        setCourses(cRes.data)
        const pMap = {}
        pRes.data.forEach(p => { pMap[p.course_id] = p })
        setProgress(pMap)
      })
      .catch(() => setError('Failed to load courses. Please refresh.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'All' ? courses : courses.filter(c => c.category === filter)

  const totalCompleted = Object.values(progress).filter(p => p.is_completed).length
  const overallPct = courses.length
    ? Math.round(Object.values(progress).reduce((sum, p) => sum + (p.percentage || 0), 0) / courses.length)
    : 0

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Hero */}
        <div className="fade-in" style={{
          background: 'linear-gradient(135deg, rgba(20,160,133,0.15), rgba(124,58,237,0.15))',
          border: '1px solid var(--border)',
          borderRadius: 20, padding: '2rem 2.5rem', marginBottom: '2rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '1.5rem'
        }}>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Good day,</p>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
              {user?.username} 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              Keep the momentum going. Consistency beats intensity.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            {[
              { label: 'Courses completed', value: `${totalCompleted}/${courses.length}` },
              { label: 'Overall progress', value: `${overallPct}%` },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#14a085' }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '7px 18px', borderRadius: 50, border: 'none',
                background: filter === cat
                  ? 'linear-gradient(135deg, #14a085, #0d7377)'
                  : 'rgba(255,255,255,0.06)',
                color: filter === cat ? '#fff' : 'var(--text-secondary)',
                fontSize: 13, fontWeight: filter === cat ? 600 : 400,
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: filter === cat ? '0 4px 12px rgba(20,160,133,0.3)' : 'none'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading && <LoadingSpinner />}

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 12, padding: '1.5rem', textAlign: 'center',
            color: '#f87171', fontSize: 14
          }}>
            {error}
            <button className="btn btn-danger btn-sm" style={{ display: 'block', margin: '12px auto 0' }}
              onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
            <p style={{ fontSize: 16 }}>No courses in this category yet.</p>
          </div>
        )}

        {!loading && !error && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem'
          }}>
            {filtered.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                progress={progress[course.id]}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}