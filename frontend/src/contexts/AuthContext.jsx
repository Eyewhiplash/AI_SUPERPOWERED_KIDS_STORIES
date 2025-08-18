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
      
      // Real API call to backend
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        return { success: true }
      } else {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Inloggning misslyckades')
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

  const register = async (username, password) => {
    try {
      setLoading(true)
      setError(null)
      
      // Real API call to backend
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      })
      
      if (response.ok) {
        const result = await response.json()
        return { success: true, message: result.message }
      } else {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Registrering misslyckades')
      }
    } catch (err) {
      setError(err.message || 'Registrering misslyckades')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const updateUserSettings = async (newSettings) => {
    if (user) {
      try {
        // Real API call to update settings
        const response = await fetch(`http://localhost:8000/users/${user.id}/settings`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {}),
          },
          body: JSON.stringify(newSettings)
        })
        
        if (response.ok) {
          const updatedUser = {
            ...user,
            settings: { ...user.settings, ...newSettings }
          }
          setUser(updatedUser)
          localStorage.setItem('user', JSON.stringify(updatedUser))
        }
      } catch (err) {
        console.error('Failed to update settings:', err)
      }
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
    register,
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