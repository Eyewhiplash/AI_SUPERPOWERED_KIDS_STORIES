import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

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

const characters = [
  { name: 'Prinsessa Luna', emoji: '👸', description: 'En modig prinsessa som älskar äventyr' },
  { name: 'Riddaren Leo', emoji: '🛡️', description: 'En tapper riddare som skyddar alla' },
  { name: 'Trollkarlen Merlin', emoji: '🧙‍♂️', description: 'En klok trollkarl med magiska krafter' },
  { name: 'Enhörningen Stella', emoji: '🦄', description: 'En vacker enhörning med helande magi' },
  { name: 'Draken Ember', emoji: '🐉', description: 'En snäll drake som sprutar regnbågar' },
  { name: 'Älvan Willow', emoji: '🧚‍♀️', description: 'En lekfull älva som talar med djur' },
  { name: 'Piraten Captain Ruby', emoji: '🏴‍☠️', description: 'En äventyrlig pirat som söker skatter' },
  { name: 'Roboten Zara', emoji: '🤖', description: 'En vänlig robot från framtiden' }
]

const items = [
  { name: 'Magisk stav', emoji: '🪄', description: 'Som kan förändra allt den rör' },
  { name: 'Glittrande krona', emoji: '👑', description: 'Som ger visdom och mod' },
  { name: 'Flygande matta', emoji: '🧞‍♂️', description: 'Som kan ta dig vart som helst' },
  { name: 'Skattekarta', emoji: '🗺️', description: 'Som leder till dolda rikedomar' },
  { name: 'Magisk nyckel', emoji: '🗝️', description: 'Som öppnar alla låsta dörrar' },
  { name: 'Trollsvärd', emoji: '⚔️', description: 'Som skyddar mot alla faror' },
  { name: 'Kristallkula', emoji: '🔮', description: 'Som visar framtiden' },
  { name: 'Förtrollad bok', emoji: '📖', description: 'Full av urgamla hemligheter' }
]

const locations = [
  { name: 'Det förtrollade slottet', emoji: '🏰', description: 'Högt uppe bland molnen' },
  { name: 'Den magiska skogen', emoji: '🌲', description: 'Där träden viskar hemligheter' },
  { name: 'Piratskepp på havet', emoji: '🚢', description: 'Som seglar mot okända öar' },
  { name: 'Rymdskepp bland stjärnorna', emoji: '🚀', description: 'På väg till nya planeter' },
  { name: 'Undervattenspalatset', emoji: '🏛️', description: 'Djupt ner i oceanens botten' },
  { name: 'Den flytande staden', emoji: '🏙️', description: 'Som svävar högt över jorden' },
  { name: 'Drakens berg', emoji: '⛰️', description: 'Där eldsprutande drakar bor' },
  { name: 'Sagolandet', emoji: '🌈', description: 'Där allt är möjligt' }
]

const moods = [
  { name: 'Äventyrlig', emoji: '⚡', description: 'Full av spännande upptäckter' },
  { name: 'Magisk', emoji: '✨', description: 'Med trollformler och underverk' },
  { name: 'Rolig', emoji: '😄', description: 'Med skratt och bus' },
  { name: 'Mysig', emoji: '🌸', description: 'Varm och trygg känsla' },
  { name: 'Mystisk', emoji: '🌙', description: 'Full av gåtor att lösa' },
  { name: 'Hjältemodig', emoji: '🦸‍♀️', description: 'Om mod och vänskap' }
]

const conflicts = [
  { name: 'Hitta en försvunnen vän', emoji: '🔍', description: 'Som behöver räddas' },
  { name: 'Lösa en gammal gåta', emoji: '🧩', description: 'Som ingen har klarat förut' },
  { name: 'Rädda kungariket', emoji: '🛡️', description: 'Från en stor fara' },
  { name: 'Hitta en magisk skatt', emoji: '💎', description: 'Som är gömd på en hemlig plats' },
  { name: 'Hjälpa en ensam varelse', emoji: '🤝', description: 'Att hitta hem' },
  { name: 'Stoppa en ond trollkarl', emoji: '⚔️', description: 'Som vill sprida mörker' }
]

const CreateStoryPage = ({ selectedTheme = 'candy' }) => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const currentTheme = themes[selectedTheme] || themes.candy

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])
  const [currentView, setCurrentView] = useState('main') // 'main', 'bibliotek', 'ny-saga', 'sparade-sagor', 'universella-sagor'
  const [storyStep, setStoryStep] = useState('character') // 'character', 'items', 'location', 'mood', 'conflict', 'generate'
  const [storyData, setStoryData] = useState({
    character: null,
    item: null,
    location: null,
    mood: null,
    conflict: null
  })
  const [isGenerating, setIsGenerating] = useState(false)

  const mainStyle = {
    minHeight: 'calc(100vh - 120px)',
    background: currentTheme.background,
    padding: '20px 20px 80px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    boxSizing: 'border-box'
  }

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const buttonStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '16px',
    padding: '24px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    cursor: 'pointer',
    margin: '0',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    width: '250px',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    flexShrink: 0
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '40px',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    padding: '20px',
    justifyItems: 'center',
    alignItems: 'start'
  }

  const titleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: currentTheme.textColor,
    marginBottom: '10px',
    textAlign: 'center'
  }

  const handleSelection = (type, item) => {
    const newStoryData = { ...storyData, [type]: item }
    setStoryData(newStoryData)
    
    // Move to next step
    const steps = ['character', 'items', 'location', 'mood', 'conflict', 'generate']
    const currentIndex = steps.indexOf(storyStep)
    if (currentIndex < steps.length - 1) {
      setStoryStep(steps[currentIndex + 1])
    }
  }

  const handleBack = () => {
    const steps = ['character', 'items', 'location', 'mood', 'conflict', 'generate']
    const currentIndex = steps.indexOf(storyStep)
    if (currentIndex > 0) {
      setStoryStep(steps[currentIndex - 1])
    }
  }

  const renderMainView = () => (
    <>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '20px',
        flexWrap: 'nowrap',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <button 
          style={buttonStyle}
          onClick={() => setCurrentView('bibliotek')}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-5px)'
            e.target.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)'
          }}
        >
                          <div style={{ fontSize: '32px', marginBottom: '10px' }}>📖</div>
                <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>Bibliotek</div>
                <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.3' }}>
            Läs sparade & universella sagor
          </div>
        </button>
        
        <button 
          style={buttonStyle}
          onClick={() => {
            setCurrentView('ny-saga')
            setStoryStep('character')
            setStoryData({
              character: null,
              item: null,
              location: null,
              mood: null,
              conflict: null
            })
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-5px)'
            e.target.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)'
          }}
        >
                          <div style={{ fontSize: '32px', marginBottom: '10px' }}>✨</div>
                <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>Ny saga</div>
                <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.3' }}>
            Skapa en ny magisk berättelse
          </div>
        </button>
      </div>
    </>
  )

  const renderBibliotekView = () => (
    <>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '20px',
        flexWrap: 'nowrap',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <button 
          style={buttonStyle}
          onClick={() => setCurrentView('sparade-sagor')}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-5px)'
            e.target.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)'
          }}
        >
                          <div style={{ fontSize: '32px', marginBottom: '10px' }}>💾</div>
                <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>Sparade sagor</div>
                <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.3' }}>
            Dina egna skapade berättelser
          </div>
        </button>
        
        <button 
          style={buttonStyle}
          onClick={() => setCurrentView('universella-sagor')}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-5px)'
            e.target.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)'
          }}
        >
                          <div style={{ fontSize: '32px', marginBottom: '10px' }}>🌟</div>
                <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>Universella sagor</div>
                <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.3' }}>
            Klassiska sagor för alla barn
          </div>
        </button>
      </div>
    </>
  )

  const renderStoryCreationStep = () => {
    let title, subtitle, options, type

    switch (storyStep) {
      case 'character':
        title = 'Vem ska sagan handla om?'
        subtitle = 'Välj din huvudkaraktär för äventyret'
        options = characters
        type = 'character'
        break
      case 'items':
        title = `Vad hade ${storyData.character?.name} med sig?`
        subtitle = 'Välj ett magiskt föremål för äventyret'
        options = items
        type = 'item'
        break
      case 'location':
        title = 'Vart tar vår saga plats?'
        subtitle = 'Välj var äventyret ska utspela sig'
        options = locations
        type = 'location'
        break
      case 'mood':
        title = 'Vilken känsla ska sagan ha?'
        subtitle = 'Välj stämningen för din berättelse'
        options = moods
        type = 'mood'
        break
      case 'conflict':
        title = 'Vad ska hända i sagan?'
        subtitle = 'Välj vad din hjälte ska göra'
        options = conflicts
        type = 'conflict'
        break
      case 'generate':
        return renderStoryGeneration()
      default:
        return null
    }

    return (
      <>
        <div style={{ 
          display: 'flex',
          justifyContent: 'flex-start',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto 20px',
          padding: '0 20px'
        }}>
          <button
            onClick={() => setCurrentView('main')}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#1f2937',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <span style={{ fontSize: '16px' }}>←</span>
            <span>Tillbaka</span>
          </button>
        </div>
        <h2 style={titleStyle}>{title}</h2>
        <p style={{ 
          fontSize: '16px', 
          color: currentTheme.textColor, 
          marginBottom: '15px',
          opacity: 0.8
        }}>
          {subtitle}
        </p>
        <div style={gridStyle}>
          {options.map((option, index) => (
            <button
              key={index}
              style={buttonStyle}
              onClick={() => handleSelection(type, option)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)'
              }}
            >
               <div style={{ 
                 fontSize: '32px', 
                 marginBottom: '10px',
                 backgroundColor: 'transparent',
                 border: 'none',
                 padding: '0',
                 margin: '0 0 10px 0'
               }}>{option.emoji}</div>
               <div style={{ 
                 fontSize: '16px', 
                 fontWeight: '700', 
                 marginBottom: '6px',
                 backgroundColor: 'transparent',
                 border: 'none',
                 padding: '0',
                 margin: '0 0 6px 0'
               }}>
                 {option.name}
               </div>
               <div style={{ 
                 fontSize: '12px', 
                 color: '#6b7280', 
                 lineHeight: '1.3',
                 backgroundColor: 'transparent !important',
                 border: 'none',
                 padding: '0',
                 margin: '0',
                 boxShadow: 'none',
                 outline: 'none'
               }}>
                 {option.description}
               </div>
            </button>
          ))}
        </div>
      </>
    )
  }

  const renderStoryGeneration = () => (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      maxHeight: 'calc(100vh - 140px)',
      overflow: 'hidden',
      width: '100%'
    }}>
      <div style={{ 
        display: 'flex',
        justifyContent: 'flex-start',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto 8px',
        padding: '0 20px'
      }}>
        <button
          onClick={handleBack}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#1f2937',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <span style={{ fontSize: '14px' }}>←</span>
          <span>Tillbaka</span>
        </button>
      </div>
      
      <h2 style={{ ...titleStyle, marginBottom: '8px' }}>Din saga är redo!</h2>
      
      <div style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        borderRadius: '16px', 
        padding: '20px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        textAlign: 'left',
        maxWidth: '600px',
        width: '100%',
        margin: '0 auto 15px'
      }}>
        <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#1f2937' }}>
          Sagans ingredienser:
        </h3>
        <div style={{ lineHeight: '1.6', fontSize: '14px', color: '#374151' }}>
          <p style={{ margin: '4px 0' }}><strong>Huvudkaraktär:</strong> {storyData.character?.emoji} {storyData.character?.name}</p>
          <p style={{ margin: '4px 0' }}><strong>Magiskt föremål:</strong> {storyData.item?.emoji} {storyData.item?.name}</p>
          <p style={{ margin: '4px 0' }}><strong>Plats:</strong> {storyData.location?.emoji} {storyData.location?.name}</p>
          <p style={{ margin: '4px 0' }}><strong>Stämning:</strong> {storyData.mood?.emoji} {storyData.mood?.name}</p>
          <p style={{ margin: '4px 0' }}><strong>Äventyr:</strong> {storyData.conflict?.emoji} {storyData.conflict?.name}</p>
        </div>
      </div>
      
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        justifyContent: 'center',
        flexWrap: 'wrap',
        width: '100%',
        maxWidth: '600px'
      }}>
        <button 
          style={{
            backgroundColor: isGenerating ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '20px',
            fontSize: '18px',
            fontWeight: '600',
            cursor: isGenerating ? 'not-allowed' : 'pointer',
            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            width: '290px',
            height: '100px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            opacity: isGenerating ? 0.7 : 1
          }}
          onClick={async () => {
            if (isGenerating) return
            
            setIsGenerating(true)
            try {
              const response = await fetch('http://localhost:8000/stories', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  title: `Äventyr med ${storyData.character?.name}`,
                  character: storyData.character?.name,
                  setting: storyData.location?.name,
                  adventure: storyData.conflict?.name,
                  storyType: 'character'
                })
              })
              
              if (response.ok) {
                const story = await response.json()
                navigate('/story-reader', { state: { story, storyData } })
              } else {
                alert('Kunde inte skapa saga. Försök igen!')
              }
            } catch (err) {
              alert('Nätverksfel. Kontrollera att backend körs!')
            } finally {
              setIsGenerating(false)
            }
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.backgroundColor = '#2563eb'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.backgroundColor = '#3b82f6'
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>
            {isGenerating ? '⏳' : '🪄'}
          </div>
          <div>{isGenerating ? 'Skapar saga...' : 'Skapa saga nu!'}</div>
        </button>
        
        <button 
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '12px',
            padding: '20px',
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937',
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            width: '290px',
            height: '100px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}
          onClick={() => {
            setStoryStep('character')
            setStoryData({
              character: null,
              item: null,
              location: null,
              mood: null,
              conflict: null
            })
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔄</div>
          <div>Börja om</div>
        </button>
      </div>
    </div>
  )

  const renderNySagaView = () => (
    <>
      {renderStoryCreationStep()}
    </>
  )

  const renderSparadeSagorView = () => (
    <>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '24px'
      }}>
        <div style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
          borderRadius: '20px', 
          padding: '40px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          textAlign: 'center',
          width: '400px',
          height: '250px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>💾</div>
          <p style={{ fontSize: '18px', color: '#1f2937', marginBottom: '15px', fontWeight: '600' }}>
            Sparade sagor
          </p>
          <p style={{ fontSize: '16px', color: '#6b7280', lineHeight: '1.5' }}>
            Här kommer dina egna skapade berättelser att visas. Funktionen byggs snart!
          </p>
        </div>
      </div>
    </>
  )

  const renderUniversellaSagorView = () => {
    const universalStories = [
      { id: 1, title: 'Askungen', description: 'En klassisk saga om vänlighet och magi', icon: '👸' },
      { id: 2, title: 'De tre små grisarna', description: 'En berättelse om mod och planering', icon: '🐷' },
      { id: 3, title: 'Rödluvan', description: 'En spännande vandring genom skogen', icon: '🔴' },
      { id: 4, title: 'Guldlock och de tre björnarna', description: 'En saga om nyfikenhet och respekt', icon: '🐻' },
      { id: 5, title: 'Törnrosa', description: 'En magisk berättelse om sömn och kärlek', icon: '🌹' },
      { id: 6, title: 'Snövit', description: 'En saga om vänskap och ärlighet', icon: '🍎' }
    ]

    return (
    <>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: currentTheme.textColor,
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            🌟 Universella sagor
          </h2>
          <p style={{
            fontSize: '16px',
            color: currentTheme.textColor,
            opacity: 0.8,
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            Klassiska sagor som älskats i generationer
          </p>
        </div>

      <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          {universalStories.map((story) => (
            <div
              key={story.id}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                minHeight: '160px',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
                textAlign: 'center'
              }}
              onClick={() => {
                // TODO: Open story reader with this universal story
                alert(`Läser "${story.title}" - kommer snart från backend!`)
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                {story.icon}
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '8px'
              }}>
                {story.title}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: '1.4',
                margin: 0
              }}>
                {story.description}
          </p>
        </div>
          ))}
      </div>
    </>
  )
  }

  return (
    <div style={mainStyle}>
      <div style={containerStyle}>
        {currentView === 'main' && renderMainView()}
        {currentView === 'bibliotek' && renderBibliotekView()}
        {currentView === 'ny-saga' && renderNySagaView()}
        {currentView === 'sparade-sagor' && renderSparadeSagorView()}
        {currentView === 'universella-sagor' && renderUniversellaSagorView()}
      </div>
    </div>
  )
}

export default CreateStoryPage 