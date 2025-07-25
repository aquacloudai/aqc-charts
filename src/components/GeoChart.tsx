import { forwardRef, useMemo, useEffect, useCallback, useState, useRef } from 'react';
import type { 
  EChartsOption,
  GeoComponentOption, 
  MapSeriesOption,
  TooltipComponentOption 
} from 'echarts/types/dist/option';
import type { GeoChartProps, ChartRef } from '@/types';
import { BaseChart } from './BaseChart';
import { loadECharts } from '@/utils/EChartsLoader';

// Use a type assertion to access registerMap method

export const GeoChart = forwardRef<ChartRef, GeoChartProps>(({
  data,
  mapName,
  mapUrl,
  mapType = 'geojson',
  mapSpecialAreas,
  chartType = 'map',
  nameField = 'name',
  valueField = 'value',
  visualMap = {},
  geo,
  roam = true,
  scaleLimit,
  itemStyle,
  showLabels = false,
  labelPosition = 'inside',
  tooltip,
  toolbox,
  additionalSeries = [],
  grid,
  xAxis,
  yAxis,
  onSelectChanged,
  onMapLoad,
  onMapError,
  title,
  ...restProps
}, ref) => {
  
  // Track if map data has been loaded
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  // Track registered maps to prevent duplicate registration  
  const registeredMapsRef = useRef<Set<string>>(new Set());
  
  // Stable callbacks to prevent unnecessary re-renders
  const stableOnMapLoad = useCallback(() => {
    onMapLoad?.();
  }, [onMapLoad]);

  const stableOnMapError = useCallback((error: Error) => {
    onMapError?.(error);
  }, [onMapError]);

  // Load and register map data
  const loadMapData = useCallback(async () => {
    try {
      // Load ECharts first
      const echarts = await loadECharts();
      
      // If no mapUrl is provided, assume it's a built-in ECharts map
      if (!mapUrl) {
        setIsMapLoaded(true);
        return;
      }

      // Check if this map is already registered
      const mapKey = `${mapName}-${mapUrl}-${mapType}`;
      if (registeredMapsRef.current.has(mapKey)) {
        console.log(`Map "${mapName}" already registered, skipping`);
        setIsMapLoaded(true);
        stableOnMapLoad();
        return;
      }
      
      // Load map data
      const response = await fetch(mapUrl);
      if (!response.ok) {
        throw new Error(`Failed to load map data: ${response.statusText}`);
      }
      
      if (mapType === 'svg') {
        // Load SVG data as text
        const svgText = await response.text();
        console.log(`Registering SVG map "${mapName}" with ${svgText.length} characters`);
        echarts.registerMap(mapName, { svg: svgText }, mapSpecialAreas);
        console.log(`SVG map "${mapName}" registered successfully`);
        
        // Add longer delay for SVG maps to ensure registration is fully processed
        await new Promise(resolve => setTimeout(resolve, 200));
      } else {
        // Load GeoJSON data
        const geoJson = await response.json();
        console.log(`Registering GeoJSON map "${mapName}"`);
        echarts.registerMap(mapName, geoJson, mapSpecialAreas);
        console.log(`GeoJSON map "${mapName}" registered successfully`);
      }
      
      // Mark this map as registered
      registeredMapsRef.current.add(mapKey);
      
      setIsMapLoaded(true);
      stableOnMapLoad();
    } catch (error) {
      const mapError = error instanceof Error ? error : new Error('Unknown error loading map');
      stableOnMapError(mapError);
      console.error('Failed to load map data:', mapError);
    }
  }, [mapUrl, mapName, mapType, mapSpecialAreas, stableOnMapLoad, stableOnMapError]);

  // Load map data when component mounts or URL changes
  useEffect(() => {
    setIsMapLoaded(false); // Reset loading state when map changes
    loadMapData();
  }, [loadMapData]);

  // Process data to ensure correct format
  const processedData = useMemo(() => {
    if (!data) return [];
    return data.map(item => ({
      name: typeof item === 'object' && nameField in item ? item[nameField as keyof typeof item] : item.name,
      value: typeof item === 'object' && valueField in item ? item[valueField as keyof typeof item] : item.value,
    }));
  }, [data, nameField, valueField]);

  // Calculate min/max values for visual map if not provided
  const dataStats = useMemo(() => {
    const values = processedData.map(item => Number(item.value)).filter(v => !isNaN(v));
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }, [processedData]);

  // Build ECharts option
  const chartOption = useMemo(() => {
    // Don't build option until map is loaded
    if (!isMapLoaded) {
      return {};
    }
    
    const option: EChartsOption = {
      tooltip: {
        trigger: 'item',
        showDelay: 200,
        transitionDuration: 300,
        formatter: '{b}: {c}',
        ...tooltip,
      } as TooltipComponentOption,
    };

    if (chartType === 'geo') {
      // For SVG maps, use map series instead of geo coordinate system to avoid regions error
      if (mapType === 'svg') {
        // SVG maps work better with map series as they don't have proper named regions
        option.series = [
          {
            name: title || 'Geographic Data',
            type: 'map',
            map: mapName,
            roam,
            ...(scaleLimit && { scaleLimit }),
            ...(itemStyle && { itemStyle }),
            emphasis: {
              label: {
                show: showLabels,
              },
              ...(itemStyle?.emphasis && { itemStyle: itemStyle.emphasis }),
            },
            label: {
              show: showLabels,
              position: labelPosition,
            },
            data: processedData,
            // Disable visual map for SVG maps as they usually don't have meaningful data regions
            silent: processedData.length === 0,
          } as MapSeriesOption,
        ];
      } else {
        // Use geo coordinate system for GeoJSON maps 
        const geoConfig = {
          map: mapName,
          roam: roam,
          layoutCenter: ['50%', '50%'],
          layoutSize: '100%',
          selectedMode: 'single',
          itemStyle: {
            areaColor: undefined,
          },
          emphasis: {
            label: {
              show: showLabels,
            },
          },
          select: {
            itemStyle: {
              areaColor: '#b50205',
            },
            label: {
              show: false,
            },
          },
          ...geo,
        };

        // Only add regions if they exist in geo config and are valid
        if (geo?.regions && Array.isArray(geo.regions) && geo.regions.length > 0) {
          geoConfig.regions = geo.regions;
        }

        option.geo = geoConfig as GeoComponentOption;
      }

      // Add custom series if provided (like buttons in Sicily example)
      if (additionalSeries.length > 0) {
        if (mapType === 'svg') {
          // For SVG, merge with existing map series
          const existingSeries = Array.isArray(option.series) ? option.series : (option.series ? [option.series] : []);
          option.series = [...existingSeries, ...additionalSeries];
        } else {
          // For geo coordinate system, just add the additional series
          option.series = [...additionalSeries];
        }
      }

      // Add grid and axes if provided
      if (grid) option.grid = grid;
      if (xAxis) option.xAxis = xAxis;
      if (yAxis) option.yAxis = yAxis;

    } else {
      // Use map series (for choropleth maps with data visualization)
      option.visualMap = {
        show: true,
        left: 'right',
        min: dataStats.min,
        max: dataStats.max,
        colors: [
          '#313695',
          '#4575b4',
          '#74add1',
          '#abd9e9',
          '#e0f3f8',
          '#ffffbf',
          '#fee090',
          '#fdae61',
          '#f46d43',
          '#d73027',
          '#a50026'
        ],
        text: ['High', 'Low'],
        calculable: true,
        orient: 'vertical',
        ...visualMap,
      };

      option.series = [
        {
          name: title || 'Geographic Data',
          type: 'map',
          map: mapName,
          roam,
          ...(scaleLimit && { scaleLimit }),
          ...(itemStyle && { itemStyle }),
          emphasis: {
            label: {
              show: showLabels,
            },
            ...(itemStyle?.emphasis && { itemStyle: itemStyle.emphasis }),
          },
          label: {
            show: showLabels,
            position: labelPosition,
          },
          data: processedData,
        } as MapSeriesOption,
      ];
    }

    if (toolbox?.show) {
      option.toolbox = {
        show: true,
        left: 'left',
        top: 'top',
        feature: {
          ...(toolbox.features?.dataView && { dataView: { readOnly: false } }),
          ...(toolbox.features?.restore && { restore: {} }),
          ...(toolbox.features?.saveAsImage && { saveAsImage: {} }),
        },
      };
    }

    
    return option;
  }, [
    processedData,
    mapName,
    chartType,
    mapType,
    dataStats,
    visualMap,
    geo,
    roam,
    scaleLimit,
    itemStyle,
    showLabels,
    labelPosition,
    tooltip,
    toolbox,
    additionalSeries,
    grid,
    xAxis,
    yAxis,
    title,
    isMapLoaded, // Add this crucial dependency
  ]);

  // Filter out the theme prop if it's 'auto' to match BaseChart expectations
  const { theme: originalTheme, ...filteredProps } = restProps;
  const validTheme: 'light' | 'dark' = originalTheme === 'auto' ? 'light' : (originalTheme || 'light');

  // Stable event handler for select changed events
  const stableOnSelectChanged = useCallback((params: any) => {
    onSelectChanged?.(params);
  }, [onSelectChanged]);

  // Custom event handler for chart ready
  const handleChartReady = useCallback((chart: any) => {
    if (stableOnSelectChanged) {
      chart.on('selectchanged', stableOnSelectChanged);
    }
    
    // Call the original onChartReady if provided
    restProps.onChartReady?.(chart);
  }, [stableOnSelectChanged, restProps.onChartReady]);

  // Only render chart when map data is loaded
  if (!isMapLoaded) {
    return (
      <div style={{
        width: filteredProps.width || '100%',
        height: filteredProps.height || 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: validTheme === 'dark' ? '#2a2a2a' : '#f5f5f5',
        color: validTheme === 'dark' ? '#fff' : '#333',
        border: `1px solid ${validTheme === 'dark' ? '#444' : '#ddd'}`,
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        Loading map data...
      </div>
    );
  }

  return (
    <BaseChart
      ref={ref}
      option={chartOption}
      theme={validTheme}
      onChartReady={handleChartReady}
      {...(title && { title })}
      {...filteredProps}
    />
  );
});

GeoChart.displayName = 'GeoChart';