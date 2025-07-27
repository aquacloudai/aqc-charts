import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  theme?: 'light' | 'dark';
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      const { theme = 'light' } = this.props;
      
      return (
        <div style={{
          backgroundColor: theme === 'dark' ? '#2a2a2a' : '#ffffff',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: `2px solid ${theme === 'dark' ? '#ff6b6b' : '#dc3545'}`,
        }}>
          <h2 style={{
            color: theme === 'dark' ? '#ff6b6b' : '#dc3545',
            margin: '0 0 15px 0',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            ⚠️ Something went wrong
          </h2>
          
          <p style={{
            color: theme === 'dark' ? '#ccc' : '#666',
            margin: '0 0 15px 0'
          }}>
            An error occurred while rendering this component.
          </p>

          <details style={{
            backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f8f8f8',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '15px'
          }}>
            <summary style={{
              color: theme === 'dark' ? '#fff' : '#333',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              Error Details
            </summary>
            
            <div style={{
              marginTop: '10px',
              fontFamily: 'monospace',
              fontSize: '12px',
              color: theme === 'dark' ? '#e6e6e6' : '#333',
              whiteSpace: 'pre-wrap'
            }}>
              <strong>Error:</strong> {this.state.error?.toString()}
              
              {this.state.errorInfo && (
                <>
                  <br /><br />
                  <strong>Component Stack:</strong>
                  {this.state.errorInfo.componentStack}
                </>
              )}
            </div>
          </details>

          <button
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            style={{
              padding: '8px 16px',
              backgroundColor: theme === 'dark' ? '#4CAF50' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}