import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service here
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <FiAlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">앗! 문제가 발생했습니다</h1>
              <p className="text-gray-600">
                일시적인 오류가 발생했습니다. 페이지를 새로고침하거나 다시 시도해주세요.
              </p>
            </div>

            {/* Error Details (only in development) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900 mb-2">오류 세부 정보:</h2>
                <div className="text-xs text-gray-700 font-mono mb-2">
                  <strong>Error:</strong> {this.state.error.toString()}
                </div>
                {this.state.errorInfo && (
                  <details className="text-xs text-gray-600 font-mono">
                    <summary className="cursor-pointer text-primary-600 hover:text-primary-700 mb-2">
                      Component Stack 보기
                    </summary>
                    <pre className="whitespace-pre-wrap bg-white p-2 rounded border border-gray-200 overflow-auto max-h-64">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="btn-primary"
              >
                다시 시도
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="btn-outline"
              >
                홈으로 돌아가기
              </button>
            </div>

            {/* Support Info */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                문제가 계속되면{' '}
                <a href="mailto:support@essaybridge.com" className="text-primary-600 hover:text-primary-700 font-medium">
                  고객 지원팀
                </a>
                에 문의해주세요.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
