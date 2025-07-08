import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'

function App() {
  const appStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  }

  return (
    <div style={appStyle}>
      <Header />
      <main style={{flex: 1}}>
        <HomePage />
      </main>
      <Footer />
    </div>
  )
}

export default App
 