import React, { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

const DrawingPage = ({ selectedTheme = 'candy' }) => {
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const currentTheme = themes[selectedTheme] || themes.candy
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentColor, setCurrentColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(5)

  const colors = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8000', '#8000ff', '#ff0080']

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }, [])

  const startDrawing = (e) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const ctx = canvas.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e) => {
    if (!isDrawing) return
    
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const ctx = canvas.getContext('2d')
    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.strokeStyle = currentColor
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const mainStyle = {
    background: currentTheme.background,
    minHeight: '100vh',
    paddingTop: '48px',
    paddingBottom: '60px',
    margin: 0,
    width: '100vw',
    transition: 'all 0.5s ease'
  }

  const containerStyle = {
    width: '100%',
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 20px',
    textAlign: 'center'
  }

  const titleStyle = {
    fontSize: '48px',
    color: currentTheme.textColor,
    marginBottom: '16px',
    fontWeight: '700',
    textShadow: selectedTheme === 'space' || selectedTheme === 'ocean' ? '2px 2px 4px rgba(0,0,0,0.3)' : 'none'
  }

  const backButtonStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    cursor: 'pointer',
    marginBottom: '32px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease'
  }

  const drawingAreaStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  }

  const canvasStyle = {
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    cursor: 'crosshair',
    touchAction: 'none'
  }

  const toolbarStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  }

  const colorPaletteStyle = {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  }

  const colorButtonStyle = (color) => ({
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    border: currentColor === color ? '3px solid #1f2937' : '2px solid #e5e7eb',
    backgroundColor: color,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  })

  const sliderStyle = {
    width: '100px',
    height: '6px',
    borderRadius: '3px',
    background: '#e5e7eb',
    outline: 'none',
    cursor: 'pointer'
  }

  const buttonStyle = {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }

  return (
    <div style={mainStyle}>
      <div style={containerStyle}>
        <button 
          style={backButtonStyle}
          onClick={() => navigate('/')}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)'
            e.target.style.boxShadow = '0 6px 18px rgba(0,0,0,0.15)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          ← Tillbaka
        </button>
        
        <h1 style={titleStyle}>✏️ Ritplatta</h1>
        
        <div style={drawingAreaStyle}>
          <div style={toolbarStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>Färger:</span>
              <div style={colorPaletteStyle}>
                {colors.map(color => (
                  <button
                    key={color}
                    style={colorButtonStyle(color)}
                    onClick={() => setCurrentColor(color)}
                  />
                ))}
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>Penselstorlek:</span>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(e.target.value)}
                style={sliderStyle}
              />
              <span style={{ fontSize: '14px', color: '#6b7280', minWidth: '20px' }}>{brushSize}</span>
            </div>
            
            <button 
              style={buttonStyle}
              onClick={clearCanvas}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
            >
              Rensa
            </button>
          </div>
          
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            style={canvasStyle}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
          
          <p style={{ marginTop: '16px', color: '#6b7280', fontSize: '14px' }}>
            Rita genom att dra musen över canvas-området
          </p>
        </div>
      </div>
    </div>
  )
}

export default DrawingPage 