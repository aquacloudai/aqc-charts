import React from 'react';

interface WaterTypologyMinimalProps {
  theme: 'light' | 'dark';
  colorPalette: string[];
  onInteraction: (data: string) => void;
}

export function WaterTypologyMinimal({ theme, colorPalette, onInteraction }: WaterTypologyMinimalProps) {
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
        fontSize: '16px',
        fontWeight: '600'
      }}>
        🌊 Water Typology (Minimal Test)
      </h4>
      <p style={{
        margin: '0 0 15px 0',
        color: theme === 'dark' ? '#ccc' : '#666',
        fontSize: '14px',
      }}>
        This is a minimal test component to verify basic rendering works.
      </p>
      <button 
        onClick={() => onInteraction('Minimal test button clicked')}
        style={{
          padding: '8px 16px',
          backgroundColor: colorPalette[0],
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Button
      </button>
    </div>
  );
}