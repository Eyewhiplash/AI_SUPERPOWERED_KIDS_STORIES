import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'

function App() {
  const [selectedTheme, setSelectedTheme] = useState('candy')

  return (
    <div className="App">
      <Header selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme} />
      <HomePage selectedTheme={selectedTheme} />
      <Footer />
    </div>
  )
}

export default App
 