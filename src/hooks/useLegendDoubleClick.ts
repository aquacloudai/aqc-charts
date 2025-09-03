import { useRef, useCallback } from 'react';
import type { EChartsType } from 'echarts/core';

export interface UseLegendDoubleClickProps {
  chartInstance: EChartsType | null;
  onLegendDoubleClick?: ((legendName: string, chart: EChartsType) => void) | undefined;
  onSeriesDoubleClick?: ((seriesName: string, chart: EChartsType) => void) | undefined;
  delay?: number;
  enableAutoSelection?: boolean;
}

export function useLegendDoubleClick({
  chartInstance,
  onLegendDoubleClick,
  onSeriesDoubleClick,
  delay = 300,
  enableAutoSelection = false,
}: UseLegendDoubleClickProps) {
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastClickTime = useRef<number>(0);
  const lastClickedItem = useRef<string | null>(null);
  const lastClickType = useRef<'legend' | 'series' | null>(null);
  const selectedLegends = useRef<Set<string>>(new Set());
  const allLegendsVisible = useRef<boolean>(true);

  const handleItemClick = useCallback((params: any, event?: MouseEvent, type: 'legend' | 'series' = 'legend') => {
    if (!chartInstance) return;
    
    // Early return if neither callback nor auto-selection is enabled
    if (!onLegendDoubleClick && !onSeriesDoubleClick && !enableAutoSelection) return;
    
    const itemName = type === 'series' ? params.seriesName || params.name : params.name;
    const currentTime = Date.now();
    const isShiftClick = event?.shiftKey === true;
    
    // Get all legend data from the current option
    const option = chartInstance.getOption();
    const legends = (option as any).legend;
    let legendData: any[] = [];
    
    if (Array.isArray(legends) && legends.length > 0) {
      legendData = legends[0].data || [];
    } else if (legends && !Array.isArray(legends)) {
      legendData = legends.data || [];
    }
    
    // Get series names if legend data is not available
    if (legendData.length === 0) {
      const series = (option as any).series;
      if (Array.isArray(series)) {
        legendData = series.map((s: any) => s.name).filter(Boolean);
      }
    }
    
    const allLegendNames = legendData.map(item => 
      typeof item === 'string' ? item : item.name
    ).filter(Boolean);
    
    // Handle shift+click for multi-select
    if (isShiftClick && enableAutoSelection) {
      // Clear any pending double-click detection
      if (clickTimeout.current) {
        clearTimeout(clickTimeout.current);
        clickTimeout.current = null;
      }
      
      // Toggle the clicked item in our selection set
      if (selectedLegends.current.has(itemName)) {
        selectedLegends.current.delete(itemName);
        chartInstance.dispatchAction({
          type: 'legendUnSelect',
          name: itemName
        });
      } else {
        selectedLegends.current.add(itemName);
        
        // If this is the first selection, hide all others first
        if (allLegendsVisible.current) {
          for (const name of allLegendNames) {
            if (name !== itemName) {
              chartInstance.dispatchAction({
                type: 'legendUnSelect',
                name
              });
            }
          }
          allLegendsVisible.current = false;
        }
        
        chartInstance.dispatchAction({
          type: 'legendSelect',
          name: itemName
        });
      }
      
      // If no legends are selected, show all
      if (selectedLegends.current.size === 0) {
        for (const name of allLegendNames) {
          chartInstance.dispatchAction({
            type: 'legendSelect',
            name
          });
        }
        allLegendsVisible.current = true;
      }
      
      return;
    }
    
    // Clear any existing timeout
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
    }
    
    // Check if this is a potential double-click
    if (
      lastClickedItem.current === itemName &&
      lastClickType.current === type &&
      currentTime - lastClickTime.current < delay
    ) {
      // Double click detected - call appropriate callback
      if (type === 'legend') {
        onLegendDoubleClick?.(itemName, chartInstance);
      } else {
        onSeriesDoubleClick?.(itemName, chartInstance);
      }
      
      // Auto-selection logic: toggle between single series and show all
      if (enableAutoSelection) {
        if (allLegendsVisible.current) {
          // Currently showing all - switch to showing only this series
          selectedLegends.current.clear();
          selectedLegends.current.add(itemName);
          
          // Hide all other legends
          for (const name of allLegendNames) {
            if (name !== itemName) {
              chartInstance.dispatchAction({
                type: 'legendUnSelect',
                name
              });
            }
          }
          
          // Ensure the double-clicked item is selected
          chartInstance.dispatchAction({
            type: 'legendSelect',
            name: itemName
          });
          
          allLegendsVisible.current = false;
        } else {
          // Currently showing filtered view - switch to showing all
          selectedLegends.current.clear();
          
          // Show all legends
          for (const name of allLegendNames) {
            chartInstance.dispatchAction({
              type: 'legendSelect',
              name
            });
          }
          
          allLegendsVisible.current = true;
        }
      }
      
      // Reset tracking
      lastClickTime.current = 0;
      lastClickedItem.current = null;
      lastClickType.current = null;
    } else {
      // Single click - track for potential double-click
      lastClickTime.current = currentTime;
      lastClickedItem.current = itemName;
      lastClickType.current = type;
      
      // Set timeout to reset tracking
      clickTimeout.current = setTimeout(() => {
        lastClickTime.current = 0;
        lastClickedItem.current = null;
        lastClickType.current = null;
        clickTimeout.current = null;
      }, delay);
    }
  }, [chartInstance, onLegendDoubleClick, onSeriesDoubleClick, delay, enableAutoSelection]);

  // Create specific handlers for different event types
  const handleLegendClick = useCallback((params: any, event?: MouseEvent) => {
    handleItemClick(params, event, 'legend');
  }, [handleItemClick]);

  const handleSeriesClick = useCallback((params: any, event?: MouseEvent) => {
    handleItemClick(params, event, 'series');
  }, [handleItemClick]);

  // Cleanup timeout on unmount
  const cleanup = useCallback(() => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
    }
  }, []);

  return {
    handleLegendClick,
    handleSeriesClick,
    cleanup,
  };
}


