import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import LessonBook from '../components/LessonBook'
import Quiz from '../components/Quiz'
import ProgressBar from '../components/ProgressBar'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../api/axios'

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [quiz, setQuiz] = useState(null)
  const [progress, setProgress] = useState(null)
  const [completedIds, setCompletedIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [toast, setToast] = useState(null)
  const [bookOpen, setBookOpen] = useState(false)
  const [bookStartLesson, setBookStartLesson] = useState(0)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const openBook = (lessonIndex) => {
    setBookStartLesson(lessonIndex)
    setBookOpen(true)
  }

  useEffect(() => {
    Promise.all([
      api.get(`/courses/${id}`),
      api.get(`/progress/${id}`)
    ])
      .then(([cRes, pRes]) => {
        setCourse(cRes.data)
        setProgress(pRes.data)
        const completions = pRes.data.lesson_completions || []
        setCompletedIds(completions.map(c => c.lesson_id))
        return api.get(`/courses/${id}/quiz`)
          .then(qRes => setQuiz(qRes.data))
          .catch(() => setQuiz(null))
      })
      .catch(() => setError('Course not found.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleProgressUpdate = (newProgress, lessonId, nowCompleted) => {
    setProgress(newProgress)
    setCompletedIds(prev =>
      nowCompleted ? [...prev, lessonId] : prev.filter(i => i !== lessonId)
    )
    showToast(
      nowCompleted ? 'Lesson marked as complete! 🎉' : 'Lesson unmarked.',
      nowCompleted ? 'success' : 'error'
    )
  }

  const THUMBNAILS = {
    java: { bg: 'linear-gradient(135deg, #f89820, #c85a00)', icon: '☕' },
    dsa: { bg: 'linear-gradient(135deg, #14a085, #0d5c4f)', icon: '🧮' },
    spring: { bg: 'linear-gradient(135deg, #6db33f, #3a7a1a)', icon: '🌱' },
    react: { bg: 'linear-gradient(135deg, #61dafb, #0891b2)', icon: '⚛️' },
    sql: { bg: 'linear-gradient(135deg, #336791, #1a3a5c)', icon: '🗄️' },
  }

  if (loading) return <><Navbar /><LoadingSpinner /></>

  if (error) return (
    <>
      <Navbar />
      <div style={{ maxWidth: 600, margin: '4rem auto', textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>{error}</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Back to courses</button>
      </div>
    </>
  )

  const thumb = THUMBNAILS[course.thumbnail] || THUMBNAILS.java

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{ background: thumb.bg, padding: '3rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 50, padding: '6px 16px', color: '#fff', fontSize: 13,
              marginBottom: '1.5rem', cursor: 'pointer'
            }}
          >
            ← All courses
          </button>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ fontSize: 64 }}>{thumb.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <span className="badge badge-teal">{course.difficulty}</span>
                <span className="badge badge-blue">{course.category}</span>
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{course.title}</h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.6, maxWidth: 600, marginBottom: 16 }}>
                {course.description}
              </p>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                <span>👨‍💻 {course.instructor}</span>
                <span>⏱ {course.duration}</span>
                <span>📖 {course.lessons?.length} lessons</span>
              </div>
            </div>
            {progress && (
              <div style={{
                background: 'rgba(0,0,0,0.3)', borderRadius: 16, padding: '1.25rem',
                minWidth: 200, backdropFilter: 'blur(8px)'
              }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
                  {Math.round(progress.percentage)}%
                </div>
                <ProgressBar percentage={progress.percentage} showLabel={false} height={8} />
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>
                  {progress.completed_lessons}/{progress.total_lessons} lessons done
                </div>
                {progress.is_completed && (
                  <div style={{ fontSize: 12, color: '#34d399', marginTop: 6, fontWeight: 600 }}>
                    ✓ Course completed!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <main style={{
        maxWidth: bookOpen ? '100%' : 1100,
        margin: '0 auto',
        padding: bookOpen ? '0' : '2rem 1.5rem',
        transition: 'all 0.4s ease'
      }}>
        {bookOpen ? (
          <div style={{
            minHeight: 'calc(100vh - 80px)', background: 'var(--bg-primary)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '2rem', animation: 'fadeInBook 0.4s ease'
          }}>
            <style>{`
              @keyframes fadeInBook {
                from { opacity: 0; transform: scale(0.96); }
                to   { opacity: 1; transform: scale(1); }
              }
            `}</style>
            <div style={{ width: '100%', maxWidth: 900 }}>
              <button
                onClick={() => setBookOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 50, padding: '6px 18px', color: 'var(--text-secondary)',
                  fontSize: 13, cursor: 'pointer', marginBottom: '1.5rem'
                }}
              >
                ← Back to course
              </button>
              {course.lessons && (
                <LessonBook
                  lessons={course.lessons}
                  courseId={id}
                  completedLessonIds={completedIds}
                  onProgressUpdate={handleProgressUpdate}
                  initialLesson={bookStartLesson}
                />
              )}
            </div>
          </div>
        ) : !showQuiz ? (
          <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600 }}>All lessons</h3>
              {quiz && (
                <button className="btn btn-secondary" onClick={() => setShowQuiz(true)}>
                  📝 Take quiz
                </button>
              )}
            </div>
            {course.lessons?.map((lesson, i) => (
              <div
                key={lesson.id}
                onClick={() => openBook(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 0',
                  borderBottom: i < course.lessons.length - 1 ? '1px solid var(--border)' : 'none',
                  cursor: 'pointer', transition: 'opacity 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: completedIds.includes(lesson.id) ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${completedIds.includes(lesson.id) ? '#10b981' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, color: completedIds.includes(lesson.id) ? '#10b981' : 'var(--text-muted)'
                }}>
                  {completedIds.includes(lesson.id) ? '✓' : i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{lesson.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{lesson.duration}</div>
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>📖 Open →</span>
              </div>
            ))}
          </div>
        ) : (
          <Quiz quiz={quiz} courseId={id} onClose={() => setShowQuiz(false)} />
        )}
      </main>

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}