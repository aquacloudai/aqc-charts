import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { BaseErgonomicChartProps } from '@/types/base';

export interface ExportPreviewModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly chartProps: BaseErgonomicChartProps;
  readonly chartComponent: React.ComponentType<any>; // The chart component to render (BarChart, LineChart, etc.)
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
export function ExportPreviewModal({ 
  isOpen, 
  onClose, 
  chartProps, 
  chartComponent: ChartComponent,
  exportName = 'chart-export.png',
  exportWidth = 1920,
  exportHeight = 1080,
  theme = 'light'
}: ExportPreviewModalProps) {
  const chartRef = useRef<any>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Handle escape key and prevent body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleExport = async () => {
    if (!chartRef.current) return;
    
    setIsExporting(true);
    
    try {
      // Small delay to ensure chart is fully rendered
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get the ECharts instance and export
      const chart = chartRef.current.getChart?.();
      if (chart) {
        const dataURL = chart.getDataURL({
          type: 'png',
          pixelRatio: 1, // Already at full resolution
          backgroundColor: '#ffffff'
        });
        
        if (dataURL) {
          // Create download
          const link = document.createElement('a');
          link.download = exportName;
          link.href = dataURL;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  // Calculate preview scale (50% for Full HD, adjust for other sizes)
  const previewScale = Math.min(0.5, 960 / exportWidth, 540 / exportHeight);
  const previewWidth = exportWidth * previewScale;
  const previewHeight = exportHeight * previewScale;

  // Create Full HD optimized chart props
  const fullHDChartProps = {
    ...chartProps,
    width: exportWidth,
    height: exportHeight,
    // Scale up text and elements for high resolution
    customOption: {
      ...chartProps.customOption,
      title: {
        textStyle: {
          fontSize: Math.round(32 * (exportWidth / 1920)), // Scale with width
          fontWeight: 'bold'
        },
        top: Math.round(20 * (exportHeight / 1080)),
        left: 'center',
        ...chartProps.customOption?.title
      },
      xAxis: {
        axisLabel: {
          fontSize: Math.round(20 * (exportWidth / 1920)),
          fontWeight: 'normal'
        },
        nameTextStyle: {
          fontSize: Math.round(24 * (exportWidth / 1920))
        },
        ...chartProps.customOption?.xAxis
      },
      yAxis: {
        axisLabel: {
          fontSize: Math.round(20 * (exportWidth / 1920)),
          fontWeight: 'normal'
        },
        nameTextStyle: {
          fontSize: Math.round(24 * (exportWidth / 1920))
        },
        ...chartProps.customOption?.yAxis
      },
      legend: {
        textStyle: {
          fontSize: Math.round(20 * (exportWidth / 1920))
        },
        ...chartProps.customOption?.legend
      },
      grid: {
        top: Math.round(80 * (exportHeight / 1080)),
        left: Math.round(80 * (exportWidth / 1920)),
        right: Math.round(80 * (exportWidth / 1920)),
        bottom: Math.round(80 * (exportHeight / 1080)),
        ...chartProps.customOption?.grid
      },
      toolbox: {
        show: false, // Hide toolbox in export version
        ...chartProps.customOption?.toolbox
      }
    }
  };

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px',
      }}
      onClick={(e) => {
        // Close when clicking backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        style={{
          backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '95vw',
          maxHeight: '95vh',
          overflow: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
        }}
      >
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px' 
        }}>
          <div>
            <h3 style={{
              margin: 0,
              color: theme === 'dark' ? '#ffffff' : '#1f2937',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              📺 Export Preview ({exportWidth}×{exportHeight})
            </h3>
            <p style={{
              margin: '4px 0 0 0',
              color: theme === 'dark' ? '#9ca3af' : '#6b7280',
              fontSize: '14px'
            }}>
              Preview your chart at full resolution with optimized scaling
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: theme === 'dark' ? '#9ca3af' : '#6b7280',
              padding: '4px',
              borderRadius: '4px',
            }}
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Chart Container - Scaled preview */}
        <div style={{
          width: `${previewWidth}px`,
          height: `${previewHeight}px`,
          border: `2px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb',
        }}>
          <div style={{
            transform: `scale(${previewScale})`,
            transformOrigin: 'top left',
            width: `${exportWidth}px`,
            height: `${exportHeight}px`,
          }}>
            <ChartComponent
              ref={chartRef}
              {...fullHDChartProps}
            />
          </div>
        </div>

        {/* Export Info */}
        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: theme === 'dark' ? '#111827' : '#f3f4f6',
          borderRadius: '6px',
          fontSize: '13px',
          color: theme === 'dark' ? '#d1d5db' : '#4b5563',
        }}>
          <strong>📋 Export Details:</strong>
          <br />
          • Resolution: {exportWidth}×{exportHeight} pixels
          • Format: PNG with white background
          • Quality: High resolution (1:1 pixel ratio)
          • Logos: Included as configured
          • Text: Auto-scaled for resolution
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '20px',
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              backgroundColor: 'transparent',
              color: theme === 'dark' ? '#9ca3af' : '#6b7280',
              border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              backgroundColor: theme === 'dark' ? '#3b82f6' : '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: isExporting ? 'wait' : 'pointer',
              opacity: isExporting ? 0.7 : 1,
            }}
          >
            {isExporting ? '⏳ Exporting...' : '💾 Export PNG'}
          </button>
        </div>
      </div>
    </div>
  );

  // Render portal to document body
  return createPortal(modalContent, document.body);
}