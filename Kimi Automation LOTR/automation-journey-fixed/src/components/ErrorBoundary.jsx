import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("🔥 Journey Error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-parchment flex items-center justify-center p-8">
          <div className="ancient-border parchment-texture p-8 max-w-2xl">
            <h1 className="text-3xl font-bold text-ember mb-4">
              ⚠️ Journey Interrupted
            </h1>
            <p className="text-ink-light mb-4">
              We encountered an unexpected obstacle in your adventure.
            </p>
            <div className="bg-parchment-dark p-4 rounded mb-4">
              <p className="font-mono text-sm text-ink">
                {this.state.error?.message || "Unknown error"}
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="fantasy-button"
            >
              Restart Journey
            </button>
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mt-4">
                <summary className="cursor-pointer text-ember">
                  Technical Details (Dev Only)
                </summary>
                <pre className="mt-2 text-xs overflow-auto bg-parchment-darker p-4 rounded">
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
