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

  const inputNumber = (num) => {
    if (waitingForNumber) {
      setDisplay(String(num))
      setWaitingForNumber(false)
    } else {
      setDisplay(display === '0' ? String(num) : display + num)
    }
  }

  const inputOperation = (nextOperation) => {
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

      setDisplay(String(result))
      setPreviousValue(result)
    }

    setWaitingForNumber(true)
    setOperation(nextOperation)
  }

  const calculate = () => {
    inputOperation(null)
    setOperation(null)
    setPreviousValue(null)
    setWaitingForNumber(true)
  }

  const clear = () => {
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
    maxWidth: '400px',
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

  const calculatorStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  }

  const displayStyle = {
    backgroundColor: '#1f2937',
    color: '#ffffff',
    fontSize: '32px',
    fontWeight: '600',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px',
    textAlign: 'right',
    minHeight: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }

  const buttonGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px'
  }

  const buttonStyle = {
    backgroundColor: '#f3f4f6',
    border: 'none',
    borderRadius: '12px',
    padding: '20px',
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minHeight: '60px'
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
        
        <h1 style={titleStyle}>🧮 Miniräknare</h1>
        
        <div style={calculatorStyle}>
          <div style={displayStyle}>
            {display}
          </div>
          
          <div style={buttonGridStyle}>
            <button style={clearButtonStyle} onClick={clear}>C</button>
            <button style={buttonStyle} onClick={() => {}}>±</button>
            <button style={buttonStyle} onClick={() => {}}>%</button>
            <button style={operationButtonStyle} onClick={() => inputOperation('÷')}>÷</button>
            
            <button style={buttonStyle} onClick={() => inputNumber(7)}>7</button>
            <button style={buttonStyle} onClick={() => inputNumber(8)}>8</button>
            <button style={buttonStyle} onClick={() => inputNumber(9)}>9</button>
            <button style={operationButtonStyle} onClick={() => inputOperation('×')}>×</button>
            
            <button style={buttonStyle} onClick={() => inputNumber(4)}>4</button>
            <button style={buttonStyle} onClick={() => inputNumber(5)}>5</button>
            <button style={buttonStyle} onClick={() => inputNumber(6)}>6</button>
            <button style={operationButtonStyle} onClick={() => inputOperation('-')}>-</button>
            
            <button style={buttonStyle} onClick={() => inputNumber(1)}>1</button>
            <button style={buttonStyle} onClick={() => inputNumber(2)}>2</button>
            <button style={buttonStyle} onClick={() => inputNumber(3)}>3</button>
            <button style={operationButtonStyle} onClick={() => inputOperation('+')}>+</button>
            
            <button style={{...buttonStyle, gridColumn: 'span 2'}} onClick={() => inputNumber(0)}>0</button>
            <button style={buttonStyle} onClick={() => {}}>.</button>
            <button style={equalsButtonStyle} onClick={calculate}>=</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalculatorPage 