import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = async (username, password) => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate API call - replace with real authentication later
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (username && password) {
        const userData = {
          id: 1,
          username,
          settings: {
            storyAge: 5, // default age for stories
            theme: 'candy'
          }
        }
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        return { success: true }
      } else {
        throw new Error('Användarnamn och lösenord krävs')
      }
    } catch (err) {
      setError(err.message || 'Inloggning misslyckades')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setError(null)
    localStorage.removeItem('user')
  }

  const updateUserSettings = (newSettings) => {
    if (user) {
      const updatedUser = {
        ...user,
        settings: { ...user.settings, ...newSettings }
      }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  const clearError = () => setError(null)

  // Load user from localStorage on init
  React.useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch (err) {
      console.error('Error loading user from storage:', err)
      localStorage.removeItem('user')
    }
  }, [])

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateUserSettings,
    clearError,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 