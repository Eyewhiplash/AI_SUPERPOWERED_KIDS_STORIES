import React, { useState } from 'react'
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

const CalculatorPage = ({ selectedTheme = 'candy' }) => {
  const navigate = useNavigate()
  const currentTheme = themes[selectedTheme] || themes.candy
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [waitingForNumber, setWaitingForNumber] = useState(false)

  // Musical notes: do re mi fa sol la si do
  const musicNotes = {
    1: 261.63, // do (C4)
    2: 293.66, // re (D4)
    3: 329.63, // mi (E4)
    4: 349.23, // fa (F4)
    5: 392.00, // sol (G4)
    6: 440.00, // la (A4)
    7: 493.88, // si (B4)
    8: 523.25, // do (C5)
    9: 659.25, // special high note (E5)
    0: 130.81  // low do (C3)
  }

  const playNote = (frequency) => {
    if (typeof window !== 'undefined' && window.AudioContext) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    }
  }

  const playOperationSound = () => {
    // Play a short chord for operations
    if (typeof window !== 'undefined' && window.AudioContext) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const frequencies = [440, 554.37] // A4 + C#5 chord
      
      frequencies.forEach(freq => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime)
        oscillator.type = 'triangle'
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
      })
    }
  }

  const playClearSound = () => {
    // Play a descending sound for clear
    if (typeof window !== 'undefined' && window.AudioContext) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.4)
      oscillator.type = 'sawtooth'
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.4)
    }
  }

  const playEqualsSound = () => {
    // Play success chord for equals
    if (typeof window !== 'undefined' && window.AudioContext) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const frequencies = [523.25, 659.25, 783.99] // C5, E5, G5 major chord
      
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()
          
          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)
          
          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime)
          oscillator.type = 'sine'
          
          gainNode.gain.setValueAtTime(0.25, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6)
          
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.6)
        }, index * 100)
      })
    }
  }

  const playClickSound = () => {
    // Simple click for other buttons
    if (typeof window !== 'undefined' && window.AudioContext) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.type = 'square'
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    }
  }

  const inputNumber = (num) => {
    // Play musical note for numbers 1-9
    if (musicNotes[num]) {
      playNote(musicNotes[num])
    }
    
    if (waitingForNumber) {
      setDisplay(String(num))
      setWaitingForNumber(false)
    } else {
      // Limit display to 15 digits to better use the wide screen
      if (display.length < 15) {
        setDisplay(display === '0' ? String(num) : display + num)
      }
    }
  }

  const inputOperation = (nextOperation) => {
    playOperationSound()
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      let result = 0

      switch (operation) {
        case '+':
          result = currentValue + inputValue
          break
        case '-':
          result = currentValue - inputValue
          break
        case '×':
          result = currentValue * inputValue
          break
        case '÷':
          result = inputValue !== 0 ? currentValue / inputValue : currentValue
          break
        default:
          return
      }

      // Format result to fit display (max 15 characters for wide screen)
      let resultStr = String(result)
      if (resultStr.length > 15) {
        // If result is too long, show in scientific notation or truncate
        if (Math.abs(result) >= 1e12 || (Math.abs(result) < 1e-3 && result !== 0)) {
          resultStr = result.toExponential(4)
        } else {
          resultStr = result.toPrecision(12)
        }
        // If still too long, truncate
        if (resultStr.length > 15) {
          resultStr = resultStr.substring(0, 15)
        }
      }
      setDisplay(resultStr)
      setPreviousValue(result)
    }

    setWaitingForNumber(true)
    setOperation(nextOperation)
  }

  const calculate = () => {
    const inputValue = parseFloat(display)

    if (previousValue !== null && operation) {
      const currentValue = previousValue || 0
      let result = 0

      switch (operation) {
        case '+':
          result = currentValue + inputValue
          break
        case '-':
          result = currentValue - inputValue
          break
        case '×':
          result = currentValue * inputValue
          break
        case '÷':
          result = inputValue !== 0 ? currentValue / inputValue : currentValue
          break
        default:
          return
      }

      // Format result to fit display (max 15 characters for wide screen)
      let resultStr = String(result)
      if (resultStr.length > 15) {
        // If result is too long, show in scientific notation or truncate
        if (Math.abs(result) >= 1e12 || (Math.abs(result) < 1e-3 && result !== 0)) {
          resultStr = result.toExponential(4)
        } else {
          resultStr = result.toPrecision(12)
        }
        // If still too long, truncate
        if (resultStr.length > 15) {
          resultStr = resultStr.substring(0, 15)
        }
      }
      setDisplay(resultStr)
      setPreviousValue(result)
    }

    playEqualsSound()
    setOperation(null)
    setPreviousValue(null)
    setWaitingForNumber(true)
  }

  const clear = () => {
    playClearSound()
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForNumber(false)
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
    maxWidth: '420px',
    margin: '0 auto',
    padding: '40px 20px',
    textAlign: 'center'
  }





  const calculatorStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '18px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  }

  const displayStyle = {
    backgroundColor: '#1f2937',
    color: '#ffffff',
    fontSize: '36px',
    fontWeight: '600',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '15px',
    textAlign: 'right',
    minHeight: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    fontFamily: 'monospace'
  }

  const buttonGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px'
  }

  const buttonStyle = {
    backgroundColor: '#f3f4f6',
    border: 'none',
    borderRadius: '12px',
    padding: '14px',
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minHeight: '52px',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    WebkitTapHighlightColor: 'transparent'
  }

  const musicalButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
    color: '#ffffff',
    boxShadow: '0 4px 8px rgba(251, 191, 36, 0.3)'
  }

  const operationButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#3b82f6',
    color: '#ffffff'
  }

  const equalsButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#10b981',
    color: '#ffffff'
  }

  const clearButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#ef4444',
    color: '#ffffff'
  }

  return (
    <div style={mainStyle}>
      <div style={containerStyle}>


        
        <p style={{ 
          color: currentTheme.textColor, 
          fontSize: '18px', 
          marginBottom: '20px',
          fontWeight: '500'
        }}>
          🎵 Tryck på siffrorna och hör musiknoten! 🎵
        </p>
        
        <p style={{ 
          color: currentTheme.textColor, 
          fontSize: '14px', 
          marginBottom: '15px',
          opacity: 0.7
        }}>
          
        </p>
        
        <div style={calculatorStyle}>
          <div style={displayStyle}>
            {display}
          </div>
          
          <div style={buttonGridStyle}>
            <button style={clearButtonStyle} onClick={clear}>C</button>
            <button style={buttonStyle} onClick={() => playClickSound()}>±</button>
            <button style={buttonStyle} onClick={() => playClickSound()}>%</button>
            <button style={operationButtonStyle} onClick={() => inputOperation('÷')}>÷</button>
            
            <button style={musicalButtonStyle} onClick={() => inputNumber(7)}>7<br/><small style={{fontSize: '8px', color: '#fbbf24'}}>si</small></button>
            <button style={musicalButtonStyle} onClick={() => inputNumber(8)}>8<br/><small style={{fontSize: '8px', color: '#fbbf24'}}>do</small></button>
            <button style={musicalButtonStyle} onClick={() => inputNumber(9)}>9<br/><small style={{fontSize: '8px', color: '#fbbf24'}}>♪</small></button>
            <button style={operationButtonStyle} onClick={() => inputOperation('×')}>×</button>
            
            <button style={musicalButtonStyle} onClick={() => inputNumber(4)}>4<br/><small style={{fontSize: '8px', color: '#fbbf24'}}>fa</small></button>
            <button style={musicalButtonStyle} onClick={() => inputNumber(5)}>5<br/><small style={{fontSize: '8px', color: '#fbbf24'}}>sol</small></button>
            <button style={musicalButtonStyle} onClick={() => inputNumber(6)}>6<br/><small style={{fontSize: '8px', color: '#fbbf24'}}>la</small></button>
            <button style={operationButtonStyle} onClick={() => inputOperation('-')}>-</button>
            
            <button style={musicalButtonStyle} onClick={() => inputNumber(1)}>1<br/><small style={{fontSize: '8px', color: '#fbbf24'}}>do</small></button>
            <button style={musicalButtonStyle} onClick={() => inputNumber(2)}>2<br/><small style={{fontSize: '8px', color: '#fbbf24'}}>re</small></button>
            <button style={musicalButtonStyle} onClick={() => inputNumber(3)}>3<br/><small style={{fontSize: '8px', color: '#fbbf24'}}>mi</small></button>
            <button style={operationButtonStyle} onClick={() => inputOperation('+')}>+</button>
            
            <button style={{...musicalButtonStyle, gridColumn: 'span 2'}} onClick={() => inputNumber(0)}>0<br/><small style={{fontSize: '8px', color: '#fbbf24'}}>do baixo</small></button>
            <button style={buttonStyle} onClick={() => {
              playClickSound()
              if (!display.includes('.') && display.length < 14) {
                setDisplay(display + '.')
              }
            }}>.</button>
            <button style={equalsButtonStyle} onClick={calculate}>=</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalculatorPage 