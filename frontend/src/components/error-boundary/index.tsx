import { Component, type ReactNode } from "react";
import { Result } from "antd";

type Props = {
  children?: ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    // eslint-disable-next-line no-console
    console.error(error, errorInfo);
    // TODO: Send to log service
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    return hasError ? (
      <Result status="error" title="Something went wrong" />
    ) : (
      children
    );
  }
}
