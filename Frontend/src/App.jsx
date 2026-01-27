import { useState, useEffect } from 'react'

function App() {
  const [content, setContent] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [generatedUrl, setGeneratedUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Options
  const [expiration, setExpiration] = useState('') // empty = never
  const [maxViews, setMaxViews] = useState('')

  const handleCreateLink = async () => {
    if (!content.trim()) return

    setIsLoading(true)
    try {
      const payload = {
        content,
        ttl_seconds: expiration ? parseInt(expiration) : undefined,
        max_views: maxViews ? parseInt(maxViews) : undefined
      }

      const res = await fetch('http://localhost:3000/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error('Failed to create paste')

      const data = await res.json()
      setGeneratedUrl(data.url)

      // Auto copy
      navigator.clipboard.writeText(data.url).then(() => {
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      })
    } catch (e) {
      alert('Failed to connect to server. Make sure the backend is running.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    if (window.confirm('Clear all text?')) {
      setContent('')
      setGeneratedUrl('')
      setExpiration('')
      setMaxViews('')
    }
  }

  return (
    <div className="app-container">
      <header>
        <h1>PasteBin-Lite</h1>
        <p className="subtitle">Secure, fast, and minimalist text sharing</p>
      </header>

      <main>
        <div className="editor-wrapper">
          <textarea
            placeholder="Paste your text or code here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            spellCheck="false"
          />
        </div>

        {/* Options Bar */}
        <div className="options-bar" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div className="option-group" style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>Expiration (Seconds)</label>
            <input
              type="number"
              min="1"
              placeholder="In Seconds"
              value={expiration}
              onChange={(e) => setExpiration(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', background: '#2a2a2a', border: '1px solid #444', color: '#fff', borderRadius: '4px' }}
            />
          </div>

          <div className="option-group" style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>View Limit</label>
            <input
              type="number"
              min="1"
              placeholder="Enter Here..."
              value={maxViews}
              onChange={(e) => setMaxViews(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', background: '#2a2a2a', border: '1px solid #444', color: '#fff', borderRadius: '4px' }}
            />
          </div>
        </div>

        {
          generatedUrl && (
            <div className="result-container" style={{ margin: '0 0 1rem 0', padding: '1rem', background: '#2a2a2a', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input
                readOnly
                value={generatedUrl}
                style={{ flex: 1, padding: '0.5rem', background: '#1a1a1a', border: '1px solid #444', color: '#fff', borderRadius: '4px' }}
              />
              <button onClick={() => {
                navigator.clipboard.writeText(generatedUrl)
                setShowToast(true)
                setTimeout(() => setShowToast(false), 3000)
              }}>Copy</button>
            </div>
          )
        }

        <div className="controls">
          <button
            className="secondary-btn"
            onClick={handleClear}
            disabled={!content}
          >
            Clear
          </button>

          <button
            onClick={handleCreateLink}
            disabled={!content.trim() || isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Link'}
            {!isLoading && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            )}
          </button>
        </div>
      </main >

      {showToast && (
        <div className="toast">
          Link copied to clipboard!
        </div>
      )
      }
    </div >
  )
}

export default App
