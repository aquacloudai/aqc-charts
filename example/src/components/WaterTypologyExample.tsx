import React, { useState, useCallback, useMemo } from 'react';
import { GeoChart } from '../../../src';
import type { GeoChartProps } from '../../../src';

interface WaterTypologyExampleProps {
  theme: 'light' | 'dark';
  colorPalette: string[];
  onInteraction: (data: string) => void;
}

// Marine environment types with sample data
const marineEnvironments = {
  'coastal-shallow': {
    name: 'Coastal Shallow Waters',
    description: 'Shallow coastal waters (0-50m depth) with high biological productivity',
    data: [
      { name: 'norway-coastline', value: 85.2 },
      { name: 'water-types', value: 78.9 },
      { name: 'coastal-area-1', value: 92.1 },
      { name: 'coastal-area-2', value: 73.5 },
      { name: 'coastal-area-3', value: 88.7 },
    ],
    unit: '% Species Diversity',
    colors: ['#e8f5e8', '#c3e6c3', '#a1d6a1', '#7fc67f', '#5db65d', '#3ba63b']
  },
  'fjord-systems': {
    name: 'Fjord Systems',
    description: 'Deep fjord waters with unique circulation patterns and marine life',
    data: [
      { name: 'norway-coastline', value: 45.8 },
      { name: 'water-types', value: 52.3 },
      { name: 'coastal-area-1', value: 38.9 },
      { name: 'coastal-area-2', value: 61.2 },
      { name: 'coastal-area-3', value: 48.7 },
    ],
    unit: 'Water Exchange Rate (days)',
    colors: ['#e6f3ff', '#bde0ff', '#94cdff', '#6bb9ff', '#42a6ff', '#1993ff']
  },
  'open-ocean': {
    name: 'Open Ocean Waters',
    description: 'Deep offshore waters beyond the continental shelf',
    data: [
      { name: 'norway-coastline', value: 156.4 },
      { name: 'water-types', value: 198.7 },
      { name: 'coastal-area-1', value: 142.1 },
      { name: 'coastal-area-2', value: 234.8 },
      { name: 'coastal-area-3', value: 178.9 },
    ],
    unit: 'Average Depth (m)',
    colors: ['#f0f8ff', '#d1e7ff', '#b3d6ff', '#94c5ff', '#75b4ff', '#56a3ff']
  },
  'arctic-waters': {
    name: 'Arctic Waters',
    description: 'Cold northern waters with seasonal ice coverage',
    data: [
      { name: 'norway-coastline', value: 2.1 },
      { name: 'water-types', value: 1.8 },
      { name: 'coastal-area-1', value: 3.2 },
      { name: 'coastal-area-2', value: 1.5 },
      { name: 'coastal-area-3', value: 2.7 },
    ],
    unit: 'Temperature (°C)',
    colors: ['#f0f8ff', '#e1f1ff', '#d2eaff', '#c3e3ff', '#b4dcff', '#a5d5ff']
  },
  'kelp-forests': {
    name: 'Kelp Forest Areas',
    description: 'Underwater kelp forest ecosystems supporting diverse marine life',
    data: [
      { name: 'norway-coastline', value: 67.3 },
      { name: 'water-types', value: 74.8 },
      { name: 'coastal-area-1', value: 58.9 },
      { name: 'coastal-area-2', value: 82.1 },
      { name: 'coastal-area-3', value: 69.7 },
    ],
    unit: 'Kelp Density (%)',
    colors: ['#f0fff0', '#e0ffe0', '#d0ffd0', '#c0ffc0', '#b0ffb0', '#a0ffa0']
  }
};

const ExampleCard = ({ 
  title, 
  children,
  theme
}: { 
  title: string; 
  children: React.ReactNode;
  theme: 'light' | 'dark';
}) => (
  <div style={{
    backgroundColor: theme === 'dark' ? '#2a2a2a' : '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: `1px solid ${theme === 'dark' ? '#444' : '#ddd'}`,
  }}>
    <h4 style={{
      margin: '0 0 15px 0',
      color: theme === 'dark' ? '#fff' : '#333',
      fontSize: '16px',
      fontWeight: '600'
    }}>
      {title}
    </h4>
    {children}
  </div>
);

export function WaterTypologyExample({ theme, colorPalette, onInteraction }: WaterTypologyExampleProps) {
  const [selectedType, setSelectedType] = useState<keyof typeof marineEnvironments>('coastal-shallow');

  const handleChartClick = useCallback((params: any) => {
    if (params && params.data) {
      const currentEnv = marineEnvironments[selectedType];
      onInteraction(`Clicked on ${params.data.name}: ${params.data.value} ${currentEnv.unit}`);
    }
  }, [onInteraction, selectedType]);

  const handleChartHover = useCallback((params: any) => {
    if (params && params.data) {
      const currentEnv = marineEnvironments[selectedType];
      onInteraction(`Hovering over ${params.data.name}: ${params.data.value} ${currentEnv.unit}`);
    }
  }, [onInteraction, selectedType]);

  const handleMapLoad = useCallback(() => {
    onInteraction(`Norwegian water typologies map loaded successfully!`);
  }, [onInteraction]);

  const handleMapError = useCallback((error: Error) => {
    onInteraction(`Water typologies map loading failed: ${error.message}`);
  }, [onInteraction]);

  const currentEnvironment = marineEnvironments[selectedType];

  const commonProps: Partial<GeoChartProps> = useMemo(() => ({
    theme,
    height: 500,
    onClick: handleChartClick,
    onMouseOver: handleChartHover,
    visualMap: {
      show: true,
      left: 'right',
      colors: currentEnvironment.colors,
      text: ['High', 'Low'],
      calculable: true,
    },
    tooltip: {
      trigger: 'item',
      showDelay: 0,
      transitionDuration: 0.2,
      formatter: `{b}: {c} ${currentEnvironment.unit}`,
    },
    toolbox: {
      show: true,
      features: {
        dataView: true,
        restore: true,
        saveAsImage: true,
      },
    },
    roam: true,
  }), [theme, handleChartClick, handleChartHover, currentEnvironment]);

  return (
    <div>
      {/* Marine Type Selection */}
      <div style={{
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: theme === 'dark' ? '#333' : '#f8f9fa',
        borderRadius: '8px',
        border: `1px solid ${theme === 'dark' ? '#444' : '#e0e0e0'}`,
      }}>
        <label style={{
          display: 'block',
          marginBottom: '10px',
          fontWeight: 'bold',
          color: theme === 'dark' ? '#fff' : '#333'
        }}>
          Select Marine Environment Type:
        </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as keyof typeof marineEnvironments)}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            backgroundColor: theme === 'dark' ? '#444' : '#fff',
            color: theme === 'dark' ? '#fff' : '#333',
            fontSize: '14px'
          }}
        >
          {Object.entries(marineEnvironments).map(([key, env]) => (
            <option key={key} value={key}>
              {env.name}
            </option>
          ))}
        </select>
        
        <div style={{
          marginTop: '10px',
          padding: '8px',
          backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f0f0f0',
          borderRadius: '4px',
          fontSize: '13px',
          color: theme === 'dark' ? '#ccc' : '#666'
        }}>
          <strong>Description:</strong> {currentEnvironment.description}
          <br />
          <strong>Measurement:</strong> {currentEnvironment.unit}
        </div>
      </div>

      <ExampleCard title={`🌊 ${currentEnvironment.name}`} theme={theme}>
        <p style={{
          margin: '0 0 15px 0',
          color: theme === 'dark' ? '#ccc' : '#666',
          fontSize: '14px',
        }}>
          Interactive map showing {currentEnvironment.description.toLowerCase()}. 
          The colors represent different values of {currentEnvironment.unit.toLowerCase()}.
        </p>
        
        <GeoChart
          data={currentEnvironment.data}
          mapName="NorwayWaterTypologies"
          mapUrl="/norwegian_water_typologies_with_map.svg"
          mapType="svg"
          chartType="map"
          title={`${currentEnvironment.name} - ${currentEnvironment.unit}`}
          {...commonProps}
          onMapLoad={handleMapLoad}
          onMapError={handleMapError}
        />
      </ExampleCard>

      {/* Code Example */}
      <ExampleCard title="📝 Usage Example" theme={theme}>
        <div style={{
          backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f8f8f8',
          padding: '15px',
          borderRadius: '6px',
          fontFamily: 'monospace',
          fontSize: '13px',
          color: theme === 'dark' ? '#e6e6e6' : '#333',
          overflowX: 'auto',
        }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
{`import { GeoChart } from 'aqc-charts';

// Sample marine environment data
const coastalWaterData = [
  { name: 'coastal-zone-1', value: 85.2 },
  { name: 'coastal-zone-2', value: 78.9 },
  { name: 'coastal-zone-3', value: 92.1 },
  // ... more zones
];

// Norwegian water typologies map
<GeoChart
  data={coastalWaterData}
  mapName="NorwayWaterTypologies"
  mapUrl="/norwegian_water_typologies_with_map.svg"
  mapType="svg"
  chartType="map"
  title="Coastal Shallow Waters - Species Diversity"
  visualMap={{
    show: true,
    left: 'right',
    colors: ['#e8f5e8', '#c3e6c3', '#a1d6a1', '#7fc67f', '#5db65d'],
    text: ['High', 'Low'],
    calculable: true,
  }}
  tooltip={{
    trigger: 'item',
    formatter: '{b}: {c}% Species Diversity'
  }}
  roam={true}
  onMapLoad={() => {
    console.log('Water typologies map loaded!');
  }}
/>`}
          </pre>
        </div>
      </ExampleCard>
    </div>
  );
}