import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fce7f3 0%, #e0e7ff 50%, #dbeafe 100%)',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            textAlign: 'center',
            maxWidth: '500px'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>😔</div>
            <h2 style={{ fontSize: '24px', color: '#374151', marginBottom: '16px' }}>
              Något gick fel
            </h2>
            <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '24px' }}>
              Ett oväntat fel inträffade. Försök ladda om sidan.
            </p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Ladda om sidan
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary 