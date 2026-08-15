
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
          <div className="max-w-md w-full bg-gray-900 p-8 rounded-lg border border-gray-800 shadow-xl">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Application Error</h2>
            <div className="bg-gray-950 p-4 rounded mb-4 overflow-auto">
              <p className="text-red-400 font-mono text-sm">
                {this.state.error?.message}
              </p>
            </div>
            <p className="text-gray-400 mb-4">
              The application encountered an unexpected error. Please refresh the page or contact support if the issue persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
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

export default ErrorBoundary;
