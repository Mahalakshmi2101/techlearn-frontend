import { useState, useEffect, useRef } from 'react'
import api from '../api/axios'

export default function Quiz({ quiz, courseId, onClose }) {
  const [phase, setPhase] = useState('intro')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState(null)
  const [timeLeft, setTimeLeft] = useState(quiz.time_limit)
  const [selected, setSelected] = useState(null)
  const [checked, setChecked] = useState(false)
  const [checkResult, setCheckResult] = useState(null)
  const timerRef = useRef()
  const startTimeRef = useRef()
  const answersRef = useRef({})

  useEffect(() => {
    answersRef.current = answers
  }, [answers])

  useEffect(() => {
    if (phase === 'quiz') {
      startTimeRef.current = Date.now()
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current)
            finishQuiz(answersRef.current)
            return 0
          }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [phase])

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const timerColor = timeLeft < 30 ? '#ef4444' : timeLeft < 60 ? '#f59e0b' : '#14a085'

  const handleSelect = (opt) => {
    if (checked) return
    setSelected(opt)
  }

  const handleCheck = async () => {
    if (!selected || checked) return
    try {
      const res = await api.post('/quiz/check-answer', {
        question_id: quiz.questions[current].id,
        selected_option: selected
      })
      setCheckResult(res.data)
      setChecked(true)
      setAnswers(prev => {
        const updated = {
          ...prev,
          [quiz.questions[current].id]: {
            selected,
            correct: res.data.correct_option,
            is_correct: res.data.is_correct,
            explanation: res.data.explanation
          }
        }
        answersRef.current = updated
        return updated
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleNext = () => {
    if (current < quiz.questions.length - 1) {
      setCurrent(c => c + 1)
      setSelected(null)
      setChecked(false)
      setCheckResult(null)
    } else {
      finishQuiz(answersRef.current)
    }
  }

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(c => c - 1)
      const q = quiz.questions[current - 1]
      const prev = answersRef.current[q.id]
      setSelected(prev?.selected || null)
      setChecked(!!prev)
      setCheckResult(prev ? {
        correct_option: prev.correct,
        is_correct: prev.is_correct,
        explanation: prev.explanation
      } : null)
    }
  }

  const finishQuiz = async (currentAnswers) => {
    clearInterval(timerRef.current)
    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000)
    const score = Object.values(currentAnswers).filter(a => a.is_correct).length
    try {
      await api.post('/quiz/submit', {
        quiz_id: quiz.id,
        score,
        total: quiz.questions.length,
        time_taken: timeTaken
      })
    } catch (err) {
      console.error(err)
    }
    setResults({ score, total: quiz.questions.length, timeTaken })
    setAnswers(currentAnswers)
    setPhase('result')
  }

  const retry = () => {
    setPhase('intro')
    setCurrent(0)
    setAnswers({})
    answersRef.current = {}
    setSelected(null)
    setChecked(false)
    setCheckResult(null)
    setTimeLeft(quiz.time_limit)
  }

  const q = quiz.questions[current]
  const opts = q ? [
    { key: 'a', label: q.option_a },
    { key: 'b', label: q.option_b },
    { key: 'c', label: q.option_c },
    { key: 'd', label: q.option_d },
  ] : []

  const optColor = (key) => {
    if (!checked) return selected === key ? 'rgba(20,160,133,0.2)' : 'rgba(255,255,255,0.04)'
    if (key === checkResult?.correct_option) return 'rgba(16,185,129,0.2)'
    if (key === selected && !checkResult?.is_correct) return 'rgba(239,68,68,0.2)'
    return 'rgba(255,255,255,0.04)'
  }

  const optBorder = (key) => {
    if (!checked) return selected === key ? '1px solid #14a085' : '1px solid var(--border)'
    if (key === checkResult?.correct_option) return '1px solid #10b981'
    if (key === selected && !checkResult?.is_correct) return '1px solid #ef4444'
    return '1px solid var(--border)'
  }

  if (phase === 'intro') return (
    <div className="card fade-in" style={{ padding: '2.5rem', textAlign: 'center', maxWidth: 520, margin: '0 auto' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{quiz.title}</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
        {quiz.questions.length} questions &nbsp;·&nbsp; {formatTime(quiz.time_limit)} time limit
      </p>
      <div style={{
        background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
        borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontSize: 13,
        color: '#fbbf24', lineHeight: 1.6, textAlign: 'left'
      }}>
        ⚠️ Timer starts when you begin. You can navigate between questions before submitting.
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary btn-lg" onClick={() => setPhase('quiz')}>
          Start quiz →
        </button>
      </div>
    </div>
  )

  if (phase === 'result') {
    const pct = Math.round((results.score / results.total) * 100)
    const passed = pct >= 60
    return (
      <div className="card fade-in" style={{ padding: '2.5rem', maxWidth: 580, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>{passed ? '🎉' : '😔'}</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
            {passed ? 'Well done!' : 'Keep going!'}
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            You scored {results.score} out of {results.total}
          </p>
          <div style={{ fontSize: 48, fontWeight: 800, color: passed ? '#10b981' : '#ef4444', margin: '16px 0' }}>
            {pct}%
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Time taken: {formatTime(results.timeTaken)}
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Answer review</h3>
          {quiz.questions.map((q, i) => {
            const ans = answers[q.id]
            return (
              <div key={q.id} style={{
                background: ans?.is_correct ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                border: `1px solid ${ans?.is_correct ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                borderRadius: 10, padding: '14px 16px', marginBottom: 10
              }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 16 }}>{ans?.is_correct ? '✅' : '❌'}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Q{i + 1}. {q.text}</p>
                    {ans ? (
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {ans.explanation}
                      </p>
                    ) : (
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        Not attempted
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={onClose}>Back to course</button>
          <button className="btn btn-primary" onClick={retry}>Retry quiz</button>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in" style={{ maxWidth: 620, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Question {current + 1} of {quiz.questions.length}
        </div>
        <div style={{
          padding: '6px 16px',
          background: `rgba(${timerColor === '#ef4444' ? '239,68,68' : timerColor === '#f59e0b' ? '245,158,11' : '20,160,133'},0.15)`,
          border: `1px solid ${timerColor}40`,
          borderRadius: 50, fontSize: 14, fontWeight: 700, color: timerColor,
          animation: timeLeft < 10 ? 'pulse 0.8s ease infinite' : 'none'
        }}>
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div className="progress-track" style={{ height: 4 }}>
          <div className="progress-fill" style={{ width: `${((current + 1) / quiz.questions.length) * 100}%` }} />
        </div>
      </div>

      <div className="card" style={{ padding: '2rem', marginBottom: '1rem' }}>
        <p style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.6, marginBottom: '1.5rem' }}>{q.text}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {opts.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              style={{
                background: optColor(key), border: optBorder(key),
                borderRadius: 10, padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: 12,
                cursor: checked ? 'default' : 'pointer',
                transition: 'all 0.2s', textAlign: 'left', color: 'var(--text-primary)'
              }}
            >
              <span style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: selected === key ? '#14a085' : 'rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
                color: selected === key ? '#fff' : 'var(--text-secondary)'
              }}>
                {key.toUpperCase()}
              </span>
              <span style={{ fontSize: 14 }}>{label}</span>
              {checked && key === checkResult?.correct_option && (
                <span style={{ marginLeft: 'auto', color: '#10b981' }}>✓</span>
              )}
              {checked && key === selected && !checkResult?.is_correct && (
                <span style={{ marginLeft: 'auto', color: '#ef4444' }}>✗</span>
              )}
            </button>
          ))}
        </div>

        {checked && checkResult && (
          <div style={{
            marginTop: 16,
            background: checkResult.is_correct ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            border: `1px solid ${checkResult.is_correct ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
            borderRadius: 10, padding: '12px 16px',
            fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6
          }}>
            <strong style={{ color: checkResult.is_correct ? '#10b981' : '#f87171' }}>
              {checkResult.is_correct ? '✓ Correct! ' : '✗ Incorrect. '}
            </strong>
            {checkResult.explanation}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn btn-secondary" onClick={handlePrev} disabled={current === 0}>
          ← Previous
        </button>
        <div style={{ display: 'flex', gap: 10 }}>
          {!checked ? (
            <button className="btn btn-primary" onClick={handleCheck} disabled={!selected}>
              Check answer
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleNext}>
              {current < quiz.questions.length - 1 ? 'Next →' : 'Finish quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}