import React from 'react';

interface WaterTypologyTest2Props {
  theme: 'light' | 'dark';
  colorPalette: string[];
  onInteraction: (data: string) => void;
}

export function WaterTypologyTest2({ theme, colorPalette, onInteraction }: WaterTypologyTest2Props) {
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
        🌊 Water Typology Test (No GeoChart)
      </h4>
      <p style={{ color: theme === 'dark' ? '#ccc' : '#666' }}>
        This is a test component without GeoChart import to verify the basic structure works.
      </p>
      <button 
        onClick={() => onInteraction('Test button clicked')}
        style={{
          padding: '8px 16px',
          backgroundColor: colorPalette[0],
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Interaction
      </button>
    </div>
  );
}