import { Component } from "react";
import { AlertCircle } from "lucide-react";
import styles from "./ErrorBoundary.module.css";
import type { ErrorBoundaryProps, ErrorBoundaryState } from "./types";
import { CONSTANTS } from "./constants";

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(CONSTANTS.CONSOLE_ERROR_MESSAGE, error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = CONSTANTS.HOME_URL;
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

        return (
          <div className={styles.container}>
            <div className={styles.content}>
              <div className={styles.emoji}>
                <AlertCircle size={CONSTANTS.ICON_SIZE} />
              </div>
              <h2 className={styles.title}>{CONSTANTS.TITLE}</h2>
              <p className={styles.description}>
                {CONSTANTS.DESCRIPTION}
              </p>
              {this.state.error && (
                <details className={styles.details}>
                  <summary className={styles.summary}>{CONSTANTS.ERROR_DETAILS_SUMMARY}</summary>
                  <pre className={styles.errorMessage}>
                    {this.state.error.message}
                  </pre>
                </details>
              )}
              <button onClick={this.handleReset} className={styles.button}>
                {CONSTANTS.BACK_BUTTON_TEXT}
              </button>
            </div>
          </div>
        );
    }

    return this.props.children;
  }
}

