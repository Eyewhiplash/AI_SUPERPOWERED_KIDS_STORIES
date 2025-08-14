import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const themes = {
  candy: {
    background: 'linear-gradient(135deg, #fce7f3 0%, #e0e7ff 50%, #dbeafe 100%)',
    textColor: '#374151'
  },
  tropical: {
    background: 'linear-gradient(135deg, #60a5fa 0%, #34d399 50%, #fbbf24 100%)',
    textColor: '#1f2937'
  },
  space: {
    background: 'linear-gradient(135deg, #312e81 0%, #581c87 50%, #000000 100%)',
    textColor: '#f9fafb'
  },
  rainbow: {
    background: 'linear-gradient(90deg, #f87171 0%, #fbbf24 25%, #34d399 50%, #60a5fa 75%, #a78bfa 100%)',
    textColor: '#1f2937'
  },
  ocean: {
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%)',
    textColor: '#f9fafb'
  }
}

const StoryReaderPage = ({ selectedTheme = 'candy' }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const currentTheme = themes[selectedTheme] || themes.candy
  const { story, storyData } = location.state || {}
  const [isSaved, setIsSaved] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoadingTTS, setIsLoadingTTS] = useState(false)
  const [audioEl, setAudioEl] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [voice, setVoice] = useState('alloy')
  const [volume, setVolume] = useState(1)
  const [isGeneratingImages, setIsGeneratingImages] = useState(false)
  const [images, setImages] = useState([])
  const [imagePrompts, setImagePrompts] = useState([])
  const [imageLoaded, setImageLoaded] = useState([])
  const thumbRefs = useRef([])
  const containerRef = useRef(null)
  const [zoomOverlay, setZoomOverlay] = useState({ active: false, index: null, from: null, scale: 1, dx: 0, dy: 0 })

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setZoomOverlay({ active: false, index: null, from: null, scale: 1, anim: false }) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Lås scroll när overlay visas
  useEffect(() => {
    const hasOverlay = zoomOverlay.active
    const original = document.body.style.overflow
    if (hasOverlay) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = original }
  }, [zoomOverlay.active])

  // Ladda ev. sparade bilder för denna saga vid öppning
  useEffect(() => {
    let cancelled = false
    async function loadSavedImages() {
      if (!story || !story.id) return
      if ((images && images.length) > 0) return
      try {
        const res = await fetch(`http://localhost:8000/stories/${story.id}/images`)
        if (!res.ok) return
        const data = await res.json()
        const imgs = Array.isArray(data.images) ? data.images : []
        if (!cancelled && imgs.length > 0) {
          setImages(imgs)
          setImagePrompts((data.prompts || []).map(sanitizeCaption))
          setImageLoaded(new Array(imgs.length).fill(false))
        }
      } catch (_) { /* ignore */ }
    }
    loadSavedImages()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story && story.id])

  // Säkerställ att thumbnails blir synliga även om onLoad missas
  useEffect(() => {
    if (!images || images.length === 0) return
    // initiera refs och markera färdiga bilder
    const states = images.map((_, i) => {
      const imgEl = thumbRefs.current[i]?.querySelector('img')
      return imgEl && imgEl.complete ? true : false
    })
    // om någon complete, uppdatera
    if (states.some(Boolean)) {
      setImageLoaded(prev => {
        const copy = [...(prev.length === images.length ? prev : new Array(images.length).fill(false))]
        states.forEach((v, i) => { if (v) copy[i] = true })
        return copy
      })
    }
  }, [images])

  const sanitizeCaption = (text) => {
    if (!text) return ''
    let t = String(text)
      .replace(/\*\*/g, '') // ta bort ** **
      .replace(/\([^)]*\)/g, '') // ta bort parentes-innehåll
      .replace(/\s+/g, ' ') // normalisera whitespace
      .trim()
    if (t.length > 110) t = t.slice(0, 107).trim() + '…'
    return t
  }

  if (!story) {
    return (
      <div style={{
        minHeight: '100vh',
        background: currentTheme.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <h2 style={{ color: '#1f2937', marginBottom: '20px' }}>Ingen saga hittades</h2>
          <button
            onClick={() => navigate('/create-story')}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Skapa en ny saga
          </button>
        </div>
      </div>
    )
  }

  const mainStyle = {
    minHeight: '100vh',
    background: currentTheme.background,
    paddingTop: '100px',
    paddingBottom: '80px',
    paddingLeft: '20px',
    paddingRight: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box'
  }

  const containerStyle = {
    maxWidth: '800px',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  }

  const titleStyle = {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '30px',
    textAlign: 'center',
    lineHeight: '1.2'
  }

  const storyStyle = {
    fontSize: '18px',
    lineHeight: '1.8',
    color: '#374151',
    marginBottom: '40px',
    textAlign: 'left',
    whiteSpace: 'pre-line'
  }

  const galleryStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '10px',
    marginBottom: '24px'
  }
  const imageCardStyle = {
    backgroundColor: 'rgba(255,255,255,0.85)',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 6px 12px rgba(0,0,0,0.06)',
    position: 'relative',
    cursor: 'zoom-in'
  }
  const imageStyle = {
    width: '100%',
    height: '220px',
    objectFit: 'cover',
    display: 'block',
    transition: 'opacity 400ms ease, transform 400ms ease'
  }
  const imageCaptionStyle = {
    padding: '8px 10px',
    fontSize: '12px',
    color: '#6b7280'
  }
  const placeholderStyle = {
    position: 'absolute',
    inset: 0,
    height: '220px',
    background: 'linear-gradient(90deg, rgba(0,0,0,0.03), rgba(0,0,0,0.06), rgba(0,0,0,0.03))',
    backgroundSize: '200% 100%',
    pointerEvents: 'none'
  }

  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(2px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
    transition: 'opacity 0ms ease',
    opacity: 0
  }
  const lightboxContentStyle = {
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '14px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.5)',
    maxWidth: '90vw',
    maxHeight: '90vh',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  }
  const lightboxImgStyle = {
    maxWidth: '86vw',
    maxHeight: '74vh',
    objectFit: 'contain',
    borderRadius: '10px'
  }
  const lightboxCaptionStyle = {
    fontSize: '14px',
    color: '#4b5563',
    textAlign: 'center'
  }
  const closeButtonStyle = {
    alignSelf: 'center',
    backgroundColor: '#111827',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '8px 14px',
    cursor: 'pointer'
  }

  // “Zoom in place” animation overlay baserat på thumbnail rect
  const zoomOverlayStyle = ({ from, active, scale = 1, dx = 0, dy = 0 }) => {
    if (!from) return { display: 'none' }
    const { top, left, width, height } = from
    return {
      position: 'fixed',
      top,
      left,
      width,
      height,
      zIndex: 1100,
      boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
      borderRadius: '12px',
      overflow: 'hidden',
      background: '#fff',
      transformOrigin: 'center center',
      transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
      transition: 'transform 260ms ease',
    }
  }

  const buttonContainerStyle = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  }

  const ttsBarStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    borderRadius: '14px',
    padding: '10px 12px',
    display: 'grid',
    gridTemplateColumns: '48px 1fr auto',
    gap: '10px 12px',
    alignItems: 'center',
    width: '100%',
    boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
    margin: '0 auto 16px'
  }

  const iconButtonStyle = {
    backgroundColor: isPlaying ? 'rgba(16,185,129,0.9)' : 'rgba(59,130,246,0.9)',
    color: 'white',
    border: 'none',
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: '700',
    cursor: isLoadingTTS ? 'wait' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 14px rgba(0,0,0,0.12)'
  }
  const labelStyle = { fontSize: '12px', color: '#6b7280' }

  const buttonStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '16px 32px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
  }

  const secondaryButtonStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#1f2937',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    padding: '16px 32px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }

  return (
    <div style={mainStyle}>
      <div style={containerStyle} ref={containerRef}>
        <button
          onClick={() => navigate('/create-story')}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            padding: '8px 0px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#6b7280',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '20px',
            alignSelf: 'flex-start'
          }}
        >
          <span>←</span>
          <span>Tillbaka</span>
        </button>

        {/* TTS spelare + bildknapp högst upp */}
        <div style={ttsBarStyle}>
          <button
            style={{...iconButtonStyle, opacity: isLoadingTTS ? 0.7 : 1}}
            disabled={isLoadingTTS}
            onClick={async () => {
              try {
                if (isPlaying && audioEl) {
                  audioEl.pause()
                  setIsPlaying(false)
                  return
                }
                setIsLoadingTTS(true)
                if (audioEl) {
                  audioEl.pause()
                  if (audioUrl) URL.revokeObjectURL(audioUrl)
                }
                const isUniversal = story.storyType === 'universal'
                const urlTts = isUniversal
                  ? `http://localhost:8000/universal-stories/${story.id}/tts?voice=${encodeURIComponent(voice)}`
                  : `http://localhost:8000/stories/${story.id}/tts?voice=${encodeURIComponent(voice)}`
                const res = await fetch(urlTts)
                if (!res.ok) throw new Error('TTS misslyckades')
                const blob = await res.blob()
                const url = URL.createObjectURL(blob)
                setAudioUrl(url)
                const audio = new Audio(url)
                audio.volume = volume
                setAudioEl(audio)
                audio.onended = () => { setIsPlaying(false) }
                audio.ontimeupdate = () => { setCurrentTime(audio.currentTime) }
                audio.onloadedmetadata = () => { setDuration(audio.duration || 0) }
                await audio.play()
                setIsPlaying(true)
              } catch (err) {
                setIsPlaying(false)
                alert('Kunde inte spela upp TTS')
              } finally {
                setIsLoadingTTS(false)
              }
            }}
          >{isLoadingTTS ? '⏳' : (isPlaying ? '❚❚' : '▶')}</button>

          <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
            <input
              type="range"
              min={0}
              max={Math.max(1, duration)}
              step={0.1}
              value={Math.min(currentTime, duration)}
              onChange={(e)=>{ const v = Number(e.target.value); setCurrentTime(v); if(audioEl){ audioEl.currentTime = v } }}
              style={{ width:'100%' }}
            />
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <span style={labelStyle}>{new Date(currentTime * 1000).toISOString().substr(14,5)}</span>
              <span style={labelStyle}>{new Date((duration||0) * 1000).toISOString().substr(14,5)}</span>
            </div>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
            <select
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              style={{ padding:'8px 10px', borderRadius:'8px', border:'1px solid #e5e7eb'}}
            >
              <option value="alloy">Alloy</option>
              <option value="verse">Verse</option>
              <option value="aria">Aria</option>
            </select>
            <input
              type="range"
              min="0" max="1" step="0.01"
              value={volume}
              onChange={(e)=>{ const v = Number(e.target.value); setVolume(v); if(audioEl){ audioEl.volume = v } }}
              style={{ width:'120px' }}
            />
            <button
              onClick={async () => {
                if (isGeneratingImages) return
                try {
                  setIsGeneratingImages(true)
                  const isUniversal = story.storyType === 'universal'
                  const url = isUniversal
                    ? `http://localhost:8000/universal-stories/${story.id}/images?num_images=3&size=1024x1024`
                    : `http://localhost:8000/stories/${story.id}/images?num_images=3&size=1024x1024`
                  const res = await fetch(url, { method: 'POST' })
                  if (!res.ok) throw new Error('Kunde inte skapa bilder')
                  const data = await res.json()
                  const imgs = Array.isArray(data.images) ? data.images : []
                  const prompts = Array.isArray(data.prompts) ? data.prompts.map(sanitizeCaption) : []
                  setImages(imgs)
                  setImagePrompts(prompts)
                  setImageLoaded(new Array(imgs.length).fill(false))
                } catch (e) {
                  alert('Bilder kunde inte genereras just nu')
                } finally {
                  setIsGeneratingImages(false)
                }
              }}
              style={{
                ...secondaryButtonStyle,
                padding: '10px 14px',
                borderWidth: '1px'
              }}
              disabled={isGeneratingImages}
            >{isGeneratingImages ? 'Skapar…' : 'Skapa bilder'}</button>
          </div>
        </div>

        <h1 style={titleStyle}>{story.title}</h1>
        {/* Ladda sparade bilder om de finns */}
        {images.length === 0 && story?.id && (
          <React.Fragment>
            {/* lazy load on mount */}
            {(() => {
              (async () => {
                try {
                  const res = await fetch(`http://localhost:8000/stories/${story.id}/images`)
                  if (res.ok) {
                    const data = await res.json()
                    if (Array.isArray(data.images) && data.images.length > 0) {
                      setImages(data.images)
                      setImagePrompts((data.prompts || []).map(sanitizeCaption))
                      setImageLoaded(new Array(data.images.length).fill(false))
                    }
                  }
                } catch (_) {}
              })()
              return null
            })()}
          </React.Fragment>
        )}
        {images.length > 0 && (
          <div style={galleryStyle}>
            {images.map((src, i) => (
              <div
                key={i}
                style={imageCardStyle}
                onClick={() => {
                  const card = thumbRefs.current[i]
                  let rect = null
                  try { rect = card?.getBoundingClientRect() } catch(_) {}
                  if (rect) {
                    // Start från thumb-rect, zooma till 2x och flytta mot mitten av container
                    // Start från thumb-rect
                    const thumbCenterX = rect.left + rect.width / 2
                    const thumbCenterY = rect.top + rect.height / 2
                    // Fast målpunkt: mitt på sidan horisontellt, högre upp vertikalt (ca 25% av viewporthöjd)
                    const targetCenterX = Math.round(window.innerWidth / 2)
                    const targetCenterY = Math.round(window.innerHeight * 0.5)
                    const dx = targetCenterX - thumbCenterX
                    const dy = targetCenterY - thumbCenterY
                    setZoomOverlay({ active: true, index: i, from: rect, scale: 1, dx: 0, dy: 0 })
                    requestAnimationFrame(() => setZoomOverlay(prev => ({ ...prev, scale: 2.0, dx, dy })))
                  } else {
                    // fallback: ingen animation
                    setZoomOverlay({ active: true, index: i, from: null, scale: 1, dx: 0, dy: 0 })
                  }
                }}
                ref={el => (thumbRefs.current[i] = el)}
              >
                {!imageLoaded[i] && <div style={{...placeholderStyle, animation: 'shimmer 1.2s linear infinite'}} />}
                <img
                  src={src}
                  alt="Illustration"
                  style={{
                    ...imageStyle,
                    opacity: imageLoaded[i] ? 1 : 0,
                    transform: imageLoaded[i] ? 'scale(1)' : 'scale(1.02)'
                  }}
                  onLoad={() => setImageLoaded(prev => {
                    const copy = [...prev]
                    copy[i] = true
                    return copy
                  })}
                  onError={() => setImageLoaded(prev => {
                    const copy = [...prev]
                    copy[i] = true
                    return copy
                  })}
                />
                {imagePrompts[i] && (
                  <div style={imageCaptionStyle}>{imagePrompts[i]}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Zoom-in-place overlay */}
        {zoomOverlay.active && zoomOverlay.from && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1095, pointerEvents: 'none' }}>
            <div
              style={zoomOverlayStyle({ from: zoomOverlay.from, active: zoomOverlay.active, scale: zoomOverlay.scale, dx: zoomOverlay.dx, dy: zoomOverlay.dy })}
            >
              <img src={images[zoomOverlay.index]} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        )}

        {/* Stäng zoom on click på overlay */}
        {zoomOverlay.active && zoomOverlay.from && (
          <div
            onClick={() => setZoomOverlay({ active: false, index: null, from: null, scale: 1, dx: 0, dy: 0 })}
            style={{ position:'fixed', inset:0, zIndex:1090, background:'rgba(0,0,0,0.0)' }}
          />
        )}
        
        <div style={storyStyle}>
          {story.content}
        </div>

        <div style={buttonContainerStyle}>
          <button
            style={{
              ...buttonStyle,
              backgroundColor: isSaved ? '#10b981' : '#f59e0b'
            }}
            onClick={async () => {
              if (isSaved) return
              
              try {
                // Save story to user's library (already saved by backend)
                setIsSaved(true)
                setTimeout(() => {
                  navigate('/create-story', { state: { showLibrary: true } })
                }, 1000)
              } catch (err) {
                alert('Kunde inte spara saga')
              }
            }}
            onMouseEnter={(e) => {
              if (!isSaved) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(245, 158, 11, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isSaved) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)'
              }
            }}
          >
            {isSaved ? '✅ Sparad!' : '💾 Spara i bibliotek'}
          </button>

          <button
            style={secondaryButtonStyle}
            onClick={() => navigate('/')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.backgroundColor = '#f9fafb'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'
            }}
          >
            🏠 Hem
          </button>
        </div>
      </div>
    </div>
  )
}

export default StoryReaderPage 