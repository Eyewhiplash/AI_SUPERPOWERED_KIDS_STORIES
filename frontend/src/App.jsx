import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import CreateStoryPage from './pages/CreateStoryPage'
import CalculatorPage from './pages/CalculatorPage'
import DrawingPage from './pages/DrawingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  const [selectedTheme, setSelectedTheme] = useState('candy')

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <Header selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme} />
            <Routes>
              <Route path="/" element={<HomePage selectedTheme={selectedTheme} />} />
              <Route path="/create-story" element={<CreateStoryPage selectedTheme={selectedTheme} />} />
              <Route path="/calculator" element={<CalculatorPage selectedTheme={selectedTheme} />} />
              <Route path="/drawing" element={<DrawingPage selectedTheme={selectedTheme} />} />
              <Route path="/login" element={<LoginPage selectedTheme={selectedTheme} />} />
              <Route path="/register" element={<RegisterPage selectedTheme={selectedTheme} />} />
              <Route path="/settings" element={<SettingsPage selectedTheme={selectedTheme} />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
 