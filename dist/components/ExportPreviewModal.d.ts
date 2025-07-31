import React from 'react';
import type { BaseErgonomicChartProps } from '@/types/base';
export interface ExportPreviewModalProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly chartProps: BaseErgonomicChartProps;
    readonly chartComponent: React.ComponentType<any>;
    readonly exportName?: string;
    readonly exportWidth?: number;
    readonly exportHeight?: number;
    readonly theme?: 'light' | 'dark';
}
/**
 * Export Preview Modal - Shows a full-resolution chart preview before export
 *
 * Features:
 * - Portal-based modal (no DOM interference)
 * - Configurable export dimensions (default: 1920x1080)
 * - Preview scaling (50% for Full HD)
 * - One-click export to PNG
 * - Theme-aware styling
 * - Escape key support
 */
export declare function ExportPreviewModal({ isOpen, onClose, chartProps, chartComponent: ChartComponent, exportName, exportWidth, exportHeight, theme }: ExportPreviewModalProps): React.ReactPortal | null;
//# sourceMappingURL=ExportPreviewModal.d.ts.map