import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.content}>
            <h1 style={styles.title}>Oops! Something went wrong</h1>
            <p style={styles.message}>
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              style={styles.button}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
    background: '#f7fafc'
  },
  content: {
    textAlign: 'center',
    maxWidth: '500px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '16px'
  },
  message: {
    fontSize: '16px',
    color: '#718096',
    marginBottom: '24px'
  },
  button: {
    padding: '12px 32px',
    background: '#4299e1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s'
  }
};

export default ErrorBoundary;
