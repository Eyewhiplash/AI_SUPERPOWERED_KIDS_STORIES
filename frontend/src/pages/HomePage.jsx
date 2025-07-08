import React from 'react'

const HomePage = () => {
  const mainStyle = {
    backgroundColor: 'white',
    minHeight: '400px',
    padding: '40px 20px',
    flex: 1
  }

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center'
  }

  const titleStyle = {
    fontSize: '32px',
    color: '#1f2937',
    marginBottom: '16px'
  }

  const subtitleStyle = {
    fontSize: '18px',
    color: '#6b7280',
    marginBottom: '32px'
  }

  return (
    <div style={mainStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>Välkommen till AI Stories</h2>
        <p style={subtitleStyle}>Skapa magiska berättelser för barn med AI</p>
      </div>
    </div>
  )
}

export default HomePage 