/**
 * Chart Error Boundary Component
 * Catches JavaScript errors in chart components and displays fallback UI
 */

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { ChartError, ChartErrorCode, isChartError, createChartError } from '@/utils/errors';

interface ChartErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: ChartError, retry: () => void) => ReactNode;
  onError?: (error: ChartError, errorInfo: ErrorInfo) => void;
  showErrorDetails?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

interface ChartErrorBoundaryState {
  hasError: boolean;
  error: ChartError | null;
  errorId: string;
}

/**
 * Default fallback component for chart errors
 */
const DefaultErrorFallback: React.FC<{
  error: ChartError;
  retry: () => void;
  showDetails: boolean;
  className?: string | undefined;
  style?: React.CSSProperties | undefined;
}> = ({ error, retry, showDetails, className = '', style = {} }) => {
  const [showDetailedError, setShowDetailedError] = React.useState(false);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    padding: '20px',
    border: '2px dashed #ff4d4f',
    borderRadius: '8px',
    backgroundColor: '#fff2f0',
    color: '#a8071a',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    ...style,
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '48px',
    marginBottom: '16px',
    opacity: 0.7,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '8px',
    textAlign: 'center',
  };

  const messageStyle: React.CSSProperties = {
    fontSize: '14px',
    marginBottom: '16px',
    textAlign: 'center',
    lineHeight: 1.5,
    maxWidth: '400px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    marginRight: '8px',
    backgroundColor: '#ff4d4f',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    color: '#ff4d4f',
    border: '1px solid #ff4d4f',
  };

  const detailsStyle: React.CSSProperties = {
    marginTop: '16px',
    padding: '12px',
    backgroundColor: '#ffeaea',
    border: '1px solid #ffccc7',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '12px',
    maxWidth: '600px',
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
  };

  const getErrorIcon = () => {
    switch (error.code) {
      case ChartErrorCode.ECHARTS_LOAD_FAILED:
        return '🌐';
      case ChartErrorCode.INVALID_DATA_FORMAT:
      case ChartErrorCode.EMPTY_DATA:
        return '📊';
      case ChartErrorCode.CHART_RENDER_FAILED:
        return '🎨';
      default:
        return '⚠️';
    }
  };

  const getErrorTitle = () => {
    if (error.recoverable) {
      return 'Chart Loading Failed';
    }
    return 'Chart Error';
  };

  return (
    <div className={`aqc-charts-error-boundary ${className}`} style={containerStyle}>
      <div style={iconStyle}>{getErrorIcon()}</div>
      <div style={titleStyle}>{getErrorTitle()}</div>
      <div style={messageStyle}>
        {error.toUserMessage()}
      </div>
      
      <div>
        {error.recoverable && (
          <button
            style={buttonStyle}
            onClick={retry}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d9363e'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ff4d4f'}
          >
            Try Again
          </button>
        )}
        
        {showDetails && (
          <button
            style={secondaryButtonStyle}
            onClick={() => setShowDetailedError(!showDetailedError)}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fff2f0'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {showDetailedError ? 'Hide Details' : 'Show Details'}
          </button>
        )}
      </div>

      {showDetailedError && (
        <div style={detailsStyle}>
          {error.toDetailedString()}
        </div>
      )}
    </div>
  );
};

/**
 * Chart Error Boundary Component
 */
export class ChartErrorBoundary extends Component<ChartErrorBoundaryProps, ChartErrorBoundaryState> {
  private retryTimeoutId: number | null = null;

  constructor(props: ChartErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ChartErrorBoundaryState> {
    // Convert any error to ChartError
    const chartError = isChartError(error) 
      ? error 
      : createChartError(error, ChartErrorCode.UNKNOWN_ERROR);

    return {
      hasError: true,
      error: chartError,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const chartError = this.state.error!;
    
    // Log error for debugging
    console.error('Chart Error Boundary caught an error:', {
      error: chartError.toDetailedString(),
      errorInfo,
      stack: error.stack,
    });

    // Call user-provided error handler
    this.props.onError?.(chartError, errorInfo);

    // Report to error tracking service (if available)
    this.reportError(chartError, errorInfo);
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private reportError = (error: ChartError, errorInfo: ErrorInfo) => {
    // This could be enhanced to report to services like Sentry, LogRocket, etc.
    if (typeof window !== 'undefined' && (window as any).reportError) {
      (window as any).reportError({
        error: error.toDetailedString(),
        errorInfo,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    }
  };

  private handleRetry = () => {
    // Clear any existing timeout
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }

    // Add a small delay to prevent rapid retries
    this.retryTimeoutId = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorId: '',
      });
    }, 100) as any;
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      // Use default fallback
      return (
        <DefaultErrorFallback
          error={this.state.error}
          retry={this.handleRetry}
          showDetails={this.props.showErrorDetails ?? process.env.NODE_ENV === 'development'}
          className={this.props.className}
          style={this.props.style}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * HOC to wrap components with error boundary
 */
export function withChartErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ChartErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ChartErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ChartErrorBoundary>
  );

  WrappedComponent.displayName = `withChartErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

/**
 * Hook to manually trigger error boundary (for functional components)
 */
export function useChartErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  // Trigger error boundary by throwing in useEffect
  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  const throwError = React.useCallback((error: Error | ChartError) => {
    const chartError = isChartError(error) 
      ? error 
      : createChartError(error, ChartErrorCode.UNKNOWN_ERROR);
    setError(chartError);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return { throwError, clearError };
}

export default ChartErrorBoundary;