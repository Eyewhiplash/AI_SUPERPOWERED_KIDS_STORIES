import React, { useRef, useEffect, useState } from 'react'

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
  const canvasRef = useRef(null)
  const currentTheme = themes[selectedTheme] || themes.candy
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#FF6B6B')
  const [brushSize, setBrushSize] = useState(5)
  const [ctx, setCtx] = useState(null)
  const [tool, setTool] = useState('brush')
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [preview, setPreview] = useState(null)


  const colors = [
    { name: 'White', value: '#FFFFFF' },
    { name: 'Light Gray', value: '#E0E0E0' },
    { name: 'Gray', value: '#9E9E9E' },
    { name: 'Black', value: '#000000' },
    { name: 'Light Red', value: '#FFB6B6' },
    { name: 'Red', value: '#FF6B6B' },
    { name: 'Dark Red', value: '#FF0000' },
    { name: 'Light Orange', value: '#FFB74D' },
    { name: 'Orange', value: '#FF9800' },
    { name: 'Dark Orange', value: '#F57C00' },
    { name: 'Light Yellow', value: '#FFF176' },
    { name: 'Yellow', value: '#FFE66D' },
    { name: 'Dark Yellow', value: '#FFD54F' },
    { name: 'Light Green', value: '#81C784' },
    { name: 'Green', value: '#4CAF50' },
    { name: 'Dark Green', value: '#388E3C' },
    { name: 'Light Blue', value: '#64B5F6' },
    { name: 'Blue', value: '#4ECDC4' },
    { name: 'Dark Blue', value: '#1976D2' },
    { name: 'Light Purple', value: '#BA68C8' },
    { name: 'Purple', value: '#9C27B0' },
    { name: 'Dark Purple', value: '#7B1FA2' },
    { name: 'Light Pink', value: '#F48FB1' },
    { name: 'Pink', value: '#E91E63' },
    { name: 'Dark Pink', value: '#C2185B' },
    { name: 'Brown', value: '#795548' }
  ]

  const tools = [
    { id: 'brush', name: 'Brush', icon: '🖌️' },
    { id: 'pencil', name: 'Pencil', icon: '✏️' },
    { id: 'crayon', name: 'Crayon', icon: '🖍️' },
    { id: 'spray', name: 'Spray', icon: '💨' },
    { id: 'eraser', name: 'Eraser', icon: '🧹' },
    { id: 'line', name: 'Line', icon: '📏' },
    { id: 'rectangle', name: 'Rectangle', icon: '⬜' },
    { id: 'circle', name: 'Circle', icon: '⭕' },
    { id: 'fill', name: 'Fill', icon: '🪣' },
    { id: 'star', name: 'Star', src: '/assets/shapes/star.png' },
    { id: 'heart', name: 'Heart', src: '/assets/shapes/heart.png' },
    { id: 'sun', name: 'Sun', src: '/assets/shapes/sun.png' },
    { id: 'tree', name: 'Tree', src: '/assets/shapes/tree.png' },
    { id: 'flower', name: 'Flower', src: '/assets/shapes/flower.png' },
    { id: 'ball', name: 'Ball', src: '/assets/shapes/ball.png' },
    { id: 'bird', name: 'Bird', src: '/assets/shapes/bird.png' },
    { id: 'cat', name: 'Cat', src: '/assets/shapes/cat.png' },
    { id: 'house', name: 'House', src: '/assets/shapes/house.png' },
    { id: 'rabbit', name: 'Rabbit', src: '/assets/shapes/rabbit.png' }
  ]



  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    // Set up canvas scaling for crisp rendering
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    
    context.scale(dpr, dpr)
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.strokeStyle = color
    context.lineWidth = brushSize
    
    // Fill with white background
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    
    setCtx(context)
    saveToHistory()
  }, [])

  useEffect(() => {
    if (ctx) {
      ctx.strokeStyle = color
      ctx.fillStyle = color
      ctx.lineWidth = brushSize
    }
  }, [color, brushSize, ctx])

  const saveToHistory = () => {
    const canvas = canvasRef.current
    if (canvas && ctx) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(imageData)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    }
  }

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      ctx.putImageData(history[newIndex], 0, 0)
      setHistoryIndex(newIndex)
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      ctx.putImageData(history[newIndex], 0, 0)
      setHistoryIndex(newIndex)
    }
  }

  const getCoordinates = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    return { x, y }
  }

  const floodFill = (startX, startY, fillColor) => {
    const canvas = canvasRef.current
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    
    const startPos = (startY * canvas.width + startX) * 4
    const startR = data[startPos]
    const startG = data[startPos + 1]
    const startB = data[startPos + 2]
    
    // Convert hex to RGB
    const hex = fillColor.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    
    if (startR === r && startG === g && startB === b) return
    
    const stack = [[startX, startY]]
    
    while (stack.length > 0) {
      const [x, y] = stack.pop()
      const pos = (y * canvas.width + x) * 4
      
      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue
      if (data[pos] !== startR || data[pos + 1] !== startG || data[pos + 2] !== startB) continue
      
      data[pos] = r
      data[pos + 1] = g
      data[pos + 2] = b
      data[pos + 3] = 255
      
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
    }
    
    ctx.putImageData(imageData, 0, 0)
  }

  const drawStamp = (stampId, x, y) => {
    const stampSrc = `/assets/shapes/${stampId}.png`
    const img = new Image()
    img.onload = () => {
      const size = brushSize * 8
      ctx.drawImage(img, x - size/2, y - size/2, size, size)
      saveToHistory()
    }
    img.src = stampSrc
  }



  const startDrawing = (e) => {
    const { x, y } = getCoordinates(e)
    setStartPos({ x, y })
    
    if (tool === 'fill') {
      floodFill(Math.floor(x), Math.floor(y), color)
      saveToHistory()
      return
    }
    
    if (['star', 'heart', 'sun', 'tree', 'flower', 'ball', 'bird', 'cat', 'house', 'rabbit'].includes(tool)) {
      drawStamp(tool, x, y)
      return
    }
    

    
    setIsDrawing(true)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e) => {
    if (!isDrawing) return
    const { x, y } = getCoordinates(e)
    
    // Clear preview for shape tools
    if (['line', 'rectangle', 'circle'].includes(tool)) {
      if (!preview) {
        setPreview(ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height))
      }
      ctx.putImageData(preview, 0, 0)
      
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth = brushSize
      
      if (tool === 'line') {
        ctx.moveTo(startPos.x, startPos.y)
        ctx.lineTo(x, y)
        ctx.stroke()
      } else if (tool === 'rectangle') {
        const width = x - startPos.x
        const height = y - startPos.y
        ctx.rect(startPos.x, startPos.y, width, height)
        ctx.stroke()
      } else if (tool === 'circle') {
        const radius = Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2))
        ctx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2)
        ctx.stroke()
      }
      return
    }
    
    ctx.strokeStyle = color
    ctx.lineWidth = brushSize
    
    switch (tool) {
      case 'brush':
        ctx.lineTo(x, y)
        ctx.stroke()
        break
      case 'pencil':
        ctx.lineWidth = 1
        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.lineWidth = brushSize
        break
      case 'crayon':
        // Waxy texture effect
        for (let i = 0; i < 3; i++) {
          const offsetX = (Math.random() - 0.5) * brushSize
          const offsetY = (Math.random() - 0.5) * brushSize
          ctx.beginPath()
          ctx.moveTo(x + offsetX, y + offsetY)
          ctx.lineTo(x + offsetX + (Math.random() - 0.5) * 2, y + offsetY + (Math.random() - 0.5) * 2)
          ctx.stroke()
        }
        break
      case 'spray':
        // Spray paint effect
        for (let i = 0; i < 10; i++) {
          const angle = Math.random() * Math.PI * 2
          const radius = Math.random() * brushSize * 2
          const sprayX = x + Math.cos(angle) * radius
          const sprayY = y + Math.sin(angle) * radius
          ctx.fillRect(sprayX, sprayY, 1, 1)
        }
        break
      case 'eraser':
        ctx.globalCompositeOperation = 'destination-out'
        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.globalCompositeOperation = 'source-over'
        break
      default:
        ctx.lineTo(x, y)
        ctx.stroke()
    }
  }

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
      setPreview(null)
      saveToHistory()
    }
  }

  const clearCanvas = () => {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    saveToHistory()
  }

  return (
    <div style={{
      background: currentTheme.background,
      minHeight: '100vh',
      paddingTop: '60px',
      paddingBottom: '80px',
      margin: 0
    }}>
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px'
      }}>
        
        <h1 style={{
          fontSize: '28px',
          color: currentTheme.textColor,
          margin: '0 0 20px 0',
          fontWeight: '700',
          fontFamily: 'Comic Sans MS, cursive',
          textAlign: 'center'
        }}>
          🎨 Magisk Målarbok
        </h1>

        {/* Main container - TRANSPARENT */}
        <div style={{
          background: 'transparent',
          border: 'none',
          borderRadius: '15px',
          padding: '20px'
        }}>
          
          {/* Top section - Tools and Colors */}
          <div style={{
            display: 'flex',
            gap: '60px',
            justifyContent: 'space-around',
            marginBottom: '20px',
            flexWrap: 'wrap',
            width: '100%',
            maxWidth: '900px',
            margin: '0 auto 20px auto'
          }}>
            
            {/* Tools */}
            <div style={{ textAlign: 'center' }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '15px',
                color: '#333',
                fontFamily: 'Comic Sans MS, cursive'
              }}>
                🛠️ Verktyg
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(10, 1fr)',
                gap: '6px',
                maxWidth: '400px'
              }}>
                {tools.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTool(t.id)}
                    style={{
                      width: '35px',
                      height: '35px',
                      backgroundColor: tool === t.id ? '#4CAF50' : '#f0f0f0',
                      color: tool === t.id ? '#fff' : '#333',
                      border: `2px solid ${tool === t.id ? '#4CAF50' : '#ddd'}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      fontFamily: 'Comic Sans MS, cursive'
                    }}
                    title={t.name}
                  >
                    {t.src ? (
                      <img 
                        src={t.src} 
                        alt={t.name}
                        style={{
                          width: '22px',
                          height: '22px',
                          objectFit: 'contain'
                        }}
                      />
                    ) : (
                      t.icon
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div style={{ textAlign: 'center' }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '15px',
                color: '#333',
                fontFamily: 'Comic Sans MS, cursive'
              }}>
                🎨 Färger
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                gap: '4px',
                maxWidth: '200px'
              }}>
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.value)}
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: c.value,
                      border: color === c.value ? '2px solid #333' : '1px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>



          {/* Canvas - TRANSPARENT container */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <div style={{
              background: 'transparent',
              padding: '0',
              display: 'inline-block'
            }}>
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                style={{
                  border: '2px solid #ccc',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  cursor: 'crosshair',
                  touchAction: 'none',
                  display: 'block'
                }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
              />
            </div>
          </div>

          {/* Bottom controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: 'Comic Sans MS, cursive'
              }}>
                📏 Storlek:
              </span>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                style={{ width: '100px' }}
              />
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#666',
                minWidth: '30px'
              }}>
                {brushSize}px
              </span>
            </div>
            
            <button 
              onClick={undo}
              disabled={historyIndex <= 0}
              style={{
                padding: '10px 20px',
                backgroundColor: historyIndex <= 0 ? '#ccc' : '#4CAF50',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: historyIndex <= 0 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: 'Comic Sans MS, cursive'
              }}
            >
              ↶ Ångra
            </button>
            
            <button 
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              style={{
                padding: '10px 20px',
                backgroundColor: historyIndex >= history.length - 1 ? '#ccc' : '#4CAF50',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: historyIndex >= history.length - 1 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: 'Comic Sans MS, cursive'
              }}
            >
              ↷ Gör om
            </button>
            
            <button 
              onClick={clearCanvas}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f44336',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: 'Comic Sans MS, cursive'
              }}
            >
              🗑️ Rensa
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DrawingPage 