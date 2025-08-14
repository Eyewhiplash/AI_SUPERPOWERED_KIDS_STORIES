import React, { useState } from 'react'
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
      <div style={containerStyle}>
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

        {/* TTS spelare högst upp */}
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
          </div>
        </div>

        <h1 style={titleStyle}>{story.title}</h1>
        
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