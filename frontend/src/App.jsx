import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import CreateStoryPage from './pages/CreateStoryPage'
import CalculatorPage from './pages/CalculatorPage'
import DrawingPage from './pages/DrawingPage'

function App() {
  const [selectedTheme, setSelectedTheme] = useState('candy')

  return (
    <Router>
      <div className="App">
        <Header selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme} />
        <Routes>
          <Route path="/" element={<HomePage selectedTheme={selectedTheme} />} />
          <Route path="/create-story" element={<CreateStoryPage selectedTheme={selectedTheme} />} />
          <Route path="/calculator" element={<CalculatorPage selectedTheme={selectedTheme} />} />
          <Route path="/drawing" element={<DrawingPage selectedTheme={selectedTheme} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
 