import React, { useState, useCallback } from 'react';
import { GeoChart } from '../../../src';

interface WaterTypologySimpleProps {
  theme: 'light' | 'dark';
  colorPalette: string[];
  onInteraction: (data: string) => void;
}

const marineTypes = {
  'coastal': 'Coastal Waters',
  'fjord': 'Fjord Systems', 
  'ocean': 'Open Ocean'
};

export function WaterTypologySimple({ theme, colorPalette, onInteraction }: WaterTypologySimpleProps) {
  const [selectedType, setSelectedType] = useState<keyof typeof marineTypes>('coastal');

  const handleChartClick = useCallback((params: any) => {
    if (params && params.data) {
      onInteraction(`Clicked on ${params.data.name}: ${params.data.value}`);
    }
  }, [onInteraction]);

  const sampleData = [
    { name: 'norway-coastline', value: 85.2 },
    { name: 'water-types', value: 78.9 },
  ];

  return (
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
      }}>
        🌊 Norwegian Water Typologies
      </h4>

      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value as keyof typeof marineTypes)}
        style={{
          marginBottom: '15px',
          padding: '8px 12px',
          borderRadius: '6px',
          border: '1px solid #ccc',
          backgroundColor: theme === 'dark' ? '#444' : '#fff',
          color: theme === 'dark' ? '#fff' : '#333',
        }}
      >
        {Object.entries(marineTypes).map(([key, name]) => (
          <option key={key} value={key}>{name}</option>
        ))}
      </select>

      <GeoChart
        data={sampleData}
        mapName="NorwayWaterTypologies"
        mapUrl="/norwegian_water_typologies_with_map.svg"
        mapType="svg"
        chartType="map"
        title={marineTypes[selectedType]}
        theme={theme}
        height={400}
        onClick={handleChartClick}
        visualMap={{
          show: true,
          left: 'right',
          colors: colorPalette.slice(0, 6),
          text: ['High', 'Low'],
          calculable: true,
        }}
        roam={true}
      />
    </div>
  );
}