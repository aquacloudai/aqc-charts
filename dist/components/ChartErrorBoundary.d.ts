/**
 * Chart Error Boundary Component
 * Catches JavaScript errors in chart components and displays fallback UI
 */
import React, { Component, ReactNode, ErrorInfo } from 'react';
import { ChartError } from '@/utils/errors';
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
 * Chart Error Boundary Component
 */
export declare class ChartErrorBoundary extends Component<ChartErrorBoundaryProps, ChartErrorBoundaryState> {
    private retryTimeoutId;
    constructor(props: ChartErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): Partial<ChartErrorBoundaryState>;
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    componentWillUnmount(): void;
    private reportError;
    private handleRetry;
    render(): string | number | bigint | boolean | import("react/jsx-runtime").JSX.Element | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined;
}
/**
 * HOC to wrap components with error boundary
 */
export declare function withChartErrorBoundary<P extends object>(Component: React.ComponentType<P>, errorBoundaryProps?: Omit<ChartErrorBoundaryProps, 'children'>): {
    (props: P): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
/**
 * Hook to manually trigger error boundary (for functional components)
 */
export declare function useChartErrorHandler(): {
    throwError: (error: Error | ChartError) => void;
    clearError: () => void;
};
export default ChartErrorBoundary;
//# sourceMappingURL=ChartErrorBoundary.d.ts.map