import React from 'react';
import type { BaseErgonomicChartProps } from '@/types/base';
export interface UseFullHDExportOptions {
    readonly exportName?: string;
    readonly exportWidth?: number;
    readonly exportHeight?: number;
    readonly theme?: 'light' | 'dark';
    readonly chartComponent: React.ComponentType<any>;
}
export interface UseFullHDExportReturn {
    readonly isExportModalOpen: boolean;
    readonly openExportModal: () => void;
    readonly closeExportModal: () => void;
    readonly exportModalProps: {
        readonly isOpen: boolean;
        readonly onClose: () => void;
        readonly chartProps: BaseErgonomicChartProps;
        readonly chartComponent: React.ComponentType<any>;
        readonly exportName: string;
        readonly exportWidth: number;
        readonly exportHeight: number;
        readonly theme: 'light' | 'dark';
    };
}
/**
 * Custom hook for Full HD chart export functionality
 *
 * @param chartProps - The chart props to export
 * @param options - Export configuration options
 * @returns Export modal state and controls
 *
 * @example
 * ```tsx
 * function MyChart() {
 *   const chartProps = { data, title: "My Chart", ... };
 *   const { isExportModalOpen, openExportModal, closeExportModal, exportModalProps } =
 *     useFullHDExport(chartProps, { exportName: 'my-chart.png' });
 *
 *   return (
 *     <>
 *       <BarChart {...chartProps} />
 *       <button onClick={openExportModal}>Export Full HD</button>
 *       <ExportPreviewModal {...exportModalProps} />
 *     </>
 *   );
 * }
 * ```
 */
export declare function useFullHDExport(chartProps: BaseErgonomicChartProps, options: UseFullHDExportOptions): UseFullHDExportReturn;
//# sourceMappingURL=useFullHDExport.d.ts.map