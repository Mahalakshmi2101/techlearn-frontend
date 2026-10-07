import { useState, useRef, useEffect } from 'react'

const SYSTEM_PROMPT = `You are TechLearn's AI study assistant. You help students understand programming concepts covered in TechLearn courses: Java, Data Structures & Algorithms, Spring Boot, React, and SQL.

STRICT RULES:
- Only answer questions related to these topics: Java, DSA, Spring Boot, React, SQL, and general programming concepts
- If asked about anything outside these topics, politely redirect the student
- Keep answers concise, clear, and beginner-friendly
- Use simple analogies before technical definitions
- If you give code examples, keep them short and relevant
- Never answer questions about other subjects, personal topics, or anything unrelated to the course content`

export default function AIAssistant({ courseTitle }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm your TechLearn study assistant 👋\n\nI can help you understand concepts from ${courseTitle}. Ask me anything about the course content!`
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    const newMessages = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setLoading(true)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      })
      const data = await res.json()
      const reply = data.content?.[0]?.text || 'Sorry, I could not get a response.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Something went wrong. Please try again.'
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 1000,
          width: 54, height: 54, borderRadius: '50%',
          background: 'linear-gradient(135deg, #7c3aed, #14a085)',
          border: 'none', color: '#fff', fontSize: 22,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(124,58,237,0.4)',
          transition: 'transform 0.2s ease',
          transform: open ? 'rotate(45deg) scale(0.9)' : 'scale(1)'
        }}
        title="AI Study Assistant"
      >
        {open ? '✕' : '🤖'}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 96, right: 28, zIndex: 1000,
          width: 360, height: 500,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-strong)',
          borderRadius: 20,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          animation: 'fadeIn 0.3s ease'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #7c3aed22, #14a08522)',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 10
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #14a085)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16
            }}>🤖</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Study Assistant</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Powered by Claude AI</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '82%',
                  padding: '10px 14px',
                  borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: m.role === 'user'
                    ? 'linear-gradient(135deg, #14a085, #0d7377)'
                    : 'rgba(255,255,255,0.07)',
                  border: m.role === 'assistant' ? '1px solid var(--border)' : 'none',
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: '#fff',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '10px 16px',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px 16px 16px 4px',
                  fontSize: 18, letterSpacing: 4
                }}>
                  <span style={{ animation: 'pulse 1.2s ease infinite' }}>...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--border)',
            display: 'flex', gap: 8
          }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about the course..."
              rows={1}
              style={{
                flex: 1, resize: 'none', background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-strong)', borderRadius: 12,
                padding: '10px 14px', color: 'var(--text-primary)',
                fontSize: 13, lineHeight: 1.5, outline: 'none',
                fontFamily: 'var(--font-sans)'
              }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              style={{
                width: 40, height: 40, borderRadius: '50%', border: 'none',
                background: 'linear-gradient(135deg, #14a085, #0d7377)',
                color: '#fff', fontSize: 16, flexShrink: 0,
                opacity: !input.trim() || loading ? 0.4 : 1,
                transition: 'opacity 0.2s', alignSelf: 'flex-end'
              }}
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  )
}