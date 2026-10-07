import { useState, useRef } from 'react'
import api from '../api/axios'

export default function LessonBook({ lessons, courseId, completedLessonIds, onProgressUpdate, initialLesson }) {
  const [current, setCurrent] = useState(initialLesson ?? 0)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState('next')
  const rightRef = useRef()

  const lesson = lessons[current]
  const isCompleted = completedLessonIds.includes(lesson?.id)

  const flip = (dir) => {
    const next = current + dir
    if (next < 0 || next >= lessons.length || animating) return
    setAnimating(true)
    setDirection(dir > 0 ? 'next' : 'prev')
    rightRef.current?.classList.add('book-flip')
    setTimeout(() => {
      setCurrent(next)
      rightRef.current?.classList.remove('book-flip')
      setAnimating(false)
    }, 730)
  }

  const jumpTo = (i) => {
    if (i === current || animating) return
    setDirection(i > current ? 'next' : 'prev')
    setAnimating(true)
    rightRef.current?.classList.add('book-flip')
    setTimeout(() => {
      setCurrent(i)
      rightRef.current?.classList.remove('book-flip')
      setAnimating(false)
    }, 730)
  }

  const handleComplete = async () => {
    try {
      let res
      if (isCompleted) {
        res = await api.delete(`/progress/${courseId}/uncomplete-lesson`, {
          data: { lesson_id: lesson.id }
        })
      } else {
        res = await api.post(`/progress/${courseId}/complete-lesson`, {
          lesson_id: lesson.id
        })
      }
      onProgressUpdate(res.data, lesson.id, !isCompleted)
    } catch (err) {
      console.error(err)
    }
  }

  if (!lesson) return null

  const nextLesson = lessons[current + 1]

  return (
    <div style={{ width: '100%' }}>
      <style>{`
        .book-page-right {
          transform-origin: left center;
          transform-style: preserve-3d;
          transition: transform 0.7s cubic-bezier(0.645,0.045,0.355,1);
        }
        .book-flip { transform: rotateY(-165deg) !important; }
        .page-back {
          position: absolute; inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform: rotateY(180deg);
          border-radius: 0 12px 12px 0;
          background: linear-gradient(160deg, #2d1b4e, #4a2c7a);
          display: flex; align-items: center; justify-content: center;
          flex-direction: column; gap: 8px; padding: 2rem;
        }
        .page-front {
  position: relative;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  height: 100%;
  display: flex; flex-direction: column;
  padding: 2rem;
  overflow-y: auto;
}
        .page-front::-webkit-scrollbar { width: 4px; }
        .page-front::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }
        pre { 
          background: rgba(0,0,0,0.3);
          border-left: 3px solid #7dd3fc;
          border-radius: 0 6px 6px 0;
          padding: 14px 16px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #7dd3fc;
          overflow-x: auto;
          white-space: pre-wrap;
          word-break: break-word;
          margin: 12px 0;
          line-height: 1.7;
        }
      `}</style>

      {/* Dots */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: '1.5rem' }}>
        {lessons.map((l, i) => (
          <button
            key={l.id}
            onClick={() => jumpTo(i)}
            title={l.title}
            style={{
              width: i === current ? 24 : 8,
              height: 8,
              borderRadius: 4,
              border: 'none',
              background: i === current ? '#14a085' : completedLessonIds.includes(l.id)
                ? 'rgba(20,160,133,0.4)' : 'rgba(255,255,255,0.15)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              padding: 0
            }}
          />
        ))}
      </div>

      {/* Book */}
      <div style={{ perspective: 1400 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          height: 420, position: 'relative',
          filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))'
        }}>
          {/* Left page */}
          <div style={{
            background: 'linear-gradient(160deg, #0d7377, #14a085)',
            borderRadius: '12px 0 0 12px',
            padding: '2rem',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            position: 'relative'
          }}>
            <div>
              <div style={{
                display: 'inline-block',
                padding: '4px 12px', borderRadius: 20,
                background: 'rgba(255,255,255,0.15)',
                color: '#a8edea', fontSize: 11, marginBottom: 16
              }}>
                Lesson {current + 1} of {lessons.length}
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 12, lineHeight: 1.4 }}>
                {lesson.title}
              </h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
                ⏱ {lesson.duration}
              </p>
            </div>

            <button
              onClick={handleComplete}
              className="btn"
              style={{
                background: isCompleted ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.15)',
                color: isCompleted ? '#34d399' : '#fff',
                border: `1px solid ${isCompleted ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.3)'}`,
                justifyContent: 'center', marginTop: 'auto',
                width: '100%'
              }}
            >
              {isCompleted ? '✓ Completed' : 'Mark as complete'}
            </button>

            <span style={{ position: 'absolute', bottom: 12, right: 16, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
              {current * 2 + 1}
            </span>
          </div>

          {/* Spine */}
          <div style={{
            position: 'absolute', left: '50%', top: 0,
            width: 8, height: '100%',
            background: 'linear-gradient(to right, #0a5254, #1a6b6e)',
            transform: 'translateX(-50%)', zIndex: 10,
            boxShadow: '2px 0 8px rgba(0,0,0,0.3)'
          }} />

          {/* Right page */}
          <div
            ref={rightRef}
            className="book-page-right"
            style={{
              background: 'linear-gradient(160deg, #1a1a5e, #2d2d8e)',
              borderRadius: '0 12px 12px 0',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div className="page-front">
              <div style={{ fontSize: 11, color: '#a78bfa', marginBottom: 12, letterSpacing: '0.04em' }}>
                LESSON CONTENT
              </div>
              <div style={{
                fontSize: 13, color: 'rgba(255,255,255,0.82)',
                lineHeight: 1.8, flex: 1
              }}>
                {lesson.content.split('```').map((part, i) => (
                  i % 2 === 1
                    ? <pre key={i}>{part.replace(/^java\n|^python\n|^sql\n/, '')}</pre>
                    : <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{part}</span>
                ))}
              </div>
            </div>

            <div className="page-back">
              {nextLesson ? (
                <>
                  <div style={{ fontSize: 13, color: '#c4b5fd', fontWeight: 600 }}>
                    Up next
                  </div>
                  <div style={{ fontSize: 14, color: '#fff', fontWeight: 700, textAlign: 'center' }}>
                    {nextLesson.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>
                    {nextLesson.duration}
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 14, color: '#c4b5fd', fontWeight: 600 }}>
                  🎉 Last lesson!
                </div>
              )}
            </div>

            <span style={{ position: 'absolute', bottom: 12, left: 16, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
              {current * 2 + 2}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 16, marginTop: '1.5rem'
      }}>
        <button
          className="btn btn-secondary"
          onClick={() => flip(-1)}
          disabled={current === 0 || animating}
        >
          ← Previous
        </button>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          {current + 1} / {lessons.length}
        </span>
        <button
          className="btn btn-primary"
          onClick={() => flip(1)}
          disabled={current === lessons.length - 1 || animating}
        >
          Next lesson →
        </button>
      </div>
    </div>
  )
}