import React, { useState, useCallback, useMemo } from 'react';
import { GeoChart } from '../../../src';
import type { GeoChartProps } from '../../../src';

interface GeoChartExampleProps {
  theme: 'light' | 'dark';
  colorPalette: string[];
  onInteraction: (data: string) => void;
}

// Sample data for different countries (for demonstration - these represent the whole country)
const countryData = {
  norway: [{ name: 'Norway', value: 5421241 }],
  germany: [{ name: 'Germany', value: 83240525 }],
  france: [{ name: 'France', value: 67391582 }],
};

// Comprehensive Norwegian Marine Water Typology Data
const marineTypologyData = {
  protected_fjords: [
    // Type 01: Protected Fjord - Sheltered fjord environments
    { name: 'water-B-01-19', value: 98 },
    { name: 'water-G-01-16', value: 96 },
    { name: 'water-G-01-19', value: 94 },
    { name: 'water-H-01-15', value: 97 },
    { name: 'water-H-01-16', value: 95 },
    { name: 'water-M-01-7', value: 99 },
    { name: 'water-N-01-4', value: 93 },
    { name: 'water-S-01-6', value: 92 },
    { name: 'water-S-01-14', value: 91 },
    // Type 01a: Protected Fjord with Oxygenated Seabed
    { name: 'water-B-01a-19', value: 97 },
    { name: 'water-G-01a-16', value: 95 },
    { name: 'water-H-01a-15', value: 96 },
    { name: 'water-M-01a-7', value: 98 },
    { name: 'water-N-01a-4', value: 92 },
    { name: 'water-S-01a-6', value: 91 },
  ],
  freshwater_fjords: [
    // Type 02: Protected Freshwater Influenced Fjord
    { name: 'water-B-02-19', value: 88 },
    { name: 'water-G-02-16', value: 86 },
    { name: 'water-H-02-15', value: 87 },
    { name: 'water-M-02-7', value: 89 },
    { name: 'water-N-02-4', value: 85 },
    { name: 'water-S-02-6', value: 84 },
    // Type 02a: Protected Freshwater Influenced with Oxygen Depleted Seabed
    { name: 'water-G-02a-16', value: 82 },
    { name: 'water-H-02a-15', value: 83 },
    { name: 'water-M-02a-7', value: 81 },
    { name: 'water-N-02a-4', value: 80 },
    { name: 'water-S-02a-6', value: 79 },
    // Type 03: Strong Freshwater Influenced Fjord
    { name: 'water-B-03-19', value: 90 },
    { name: 'water-G-03-16', value: 88 },
    { name: 'water-H-03-15', value: 89 },
    { name: 'water-M-03-7', value: 91 },
    { name: 'water-N-03-4', value: 87 },
    { name: 'water-S-03-6', value: 86 },
    // Type 03a: Strong Freshwater Influenced with Oxygen Depleted Seabed
    { name: 'water-N-03a-4', value: 78 },
    { name: 'water-S-03a-6', value: 77 },
  ],
  exposed_fjords: [
    // Type 04: Moderately Exposed Fjord
    { name: 'water-B-04-19', value: 85 },
    { name: 'water-G-04-16', value: 83 },
    { name: 'water-H-04-15', value: 84 },
    { name: 'water-M-04-7', value: 86 },
    { name: 'water-N-04-4', value: 82 },
    { name: 'water-S-04-6', value: 81 },
    // Type 05: Moderately Exposed Freshwater Influenced Fjord
    { name: 'water-N-05-4', value: 80 },
    { name: 'water-S-05-6', value: 79 },
    { name: 'water-S-05-13', value: 78 },
  ],
  coastal_areas: [
    // Type 06: Wave Exposed Coast - Open coastal areas
    { name: 'water-N-06-4', value: 95 },
    { name: 'water-S-06-6', value: 92 },
    { name: 'water-M-06-7', value: 89 },
    { name: 'water-H-06-11', value: 87 },
    { name: 'water-S-06-14', value: 90 },
    { name: 'water-H-06-15', value: 85 },
    { name: 'water-G-06-16', value: 88 },
    { name: 'water-B-06-19', value: 91 },
    { name: 'water-H-06-16', value: 86 },
    { name: 'water-G-06-19', value: 84 },
    // Type 07: Wave Exposed Freshwater Influenced Coast
    { name: 'water-S-07-6', value: 83 },
  ],
  special_waters: [
    // Type 08: Narrow Straits - Strong currents
    { name: 'water-B-08-19', value: 75 },
    { name: 'water-G-08-16', value: 73 },
    { name: 'water-H-08-15', value: 74 },
    // Type 09: Special Water Occurrence - Unique characteristics
    { name: 'water-B-09-19', value: 70 },
    { name: 'water-G-09-16', value: 68 },
    { name: 'water-G-09-19', value: 69 },
    { name: 'water-H-09-15', value: 71 },
    { name: 'water-N-09-4', value: 67 },
  ],
};

// Sample USA data for comparison (matching the original example)
const usaPopulationData = [
  { name: 'Alabama', value: 4822023 },
  { name: 'Alaska', value: 731449 },
  { name: 'Arizona', value: 6553255 },
  { name: 'Arkansas', value: 2949131 },
  { name: 'California', value: 38041430 },
  { name: 'Colorado', value: 5187582 },
  { name: 'Connecticut', value: 3590347 },
  { name: 'Delaware', value: 917092 },
  { name: 'District of Columbia', value: 632323 },
  { name: 'Florida', value: 19317568 },
  { name: 'Georgia', value: 9919945 },
  { name: 'Hawaii', value: 1392313 },
  { name: 'Idaho', value: 1595728 },
  { name: 'Illinois', value: 12875255 },
  { name: 'Indiana', value: 6537334 },
  { name: 'Iowa', value: 3074186 },
  { name: 'Kansas', value: 2885905 },
  { name: 'Kentucky', value: 4380415 },
  { name: 'Louisiana', value: 4601893 },
  { name: 'Maine', value: 1329192 },
  { name: 'Maryland', value: 5884563 },
  { name: 'Massachusetts', value: 6646144 },
  { name: 'Michigan', value: 9883360 },
  { name: 'Minnesota', value: 5379139 },
  { name: 'Mississippi', value: 2984926 },
  { name: 'Missouri', value: 6021988 },
  { name: 'Montana', value: 1005141 },
  { name: 'Nebraska', value: 1855525 },
  { name: 'Nevada', value: 2758931 },
  { name: 'New Hampshire', value: 1320718 },
  { name: 'New Jersey', value: 8864590 },
  { name: 'New Mexico', value: 2085538 },
  { name: 'New York', value: 19570261 },
  { name: 'North Carolina', value: 9752073 },
  { name: 'North Dakota', value: 699628 },
  { name: 'Ohio', value: 11544225 },
  { name: 'Oklahoma', value: 3814820 },
  { name: 'Oregon', value: 3899353 },
  { name: 'Pennsylvania', value: 12763536 },
  { name: 'Rhode Island', value: 1050292 },
  { name: 'South Carolina', value: 4723723 },
  { name: 'South Dakota', value: 833354 },
  { name: 'Tennessee', value: 6456243 },
  { name: 'Texas', value: 26059203 },
  { name: 'Utah', value: 2855287 },
  { name: 'Vermont', value: 626011 },
  { name: 'Virginia', value: 8185867 },
  { name: 'Washington', value: 6897012 },
  { name: 'West Virginia', value: 1855413 },
  { name: 'Wisconsin', value: 5726398 },
  { name: 'Wyoming', value: 576412 },
  { name: 'Puerto Rico', value: 3667084 },
];

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

export function GeoChartExample({ theme, colorPalette, onInteraction }: GeoChartExampleProps) {
  const [selectedMap, setSelectedMap] = useState<'norway' | 'norway-svg' | 'norway-typology' | 'germany' | 'france'>('norway');
  const [selectedMarineType, setSelectedMarineType] = useState<'protected_fjords' | 'freshwater_fjords' | 'exposed_fjords' | 'coastal_areas' | 'special_waters'>('protected_fjords');
  const [loadedMaps, setLoadedMaps] = useState<Set<string>>(new Set(['norway'])); // Start with norway loaded

  const handleChartClick = useCallback((params: any) => {
    if (params && params.data) {
      onInteraction(`Clicked on ${params.data.name}: ${params.data.value.toLocaleString()}`);
    }
  }, [onInteraction]);

  const handleChartHover = useCallback((params: any) => {
    if (params && params.data) {
      onInteraction(`Hovering over ${params.data.name}: ${params.data.value.toLocaleString()}`);
    }
  }, [onInteraction]);

  // Stable callbacks for map loading to prevent re-registration
  const handleMapLoad = useCallback((mapName: string) => {
    onInteraction(`${mapName} GeoJSON loaded successfully!`);
  }, [onInteraction]);

  const handleMapError = useCallback((mapName: string, error: Error) => {
    onInteraction(`${mapName} map loading failed: ${error.message}`);
  }, [onInteraction]);

  const commonProps: Partial<GeoChartProps> = useMemo(() => ({
    theme,
    height: 500,
    onClick: handleChartClick,
    onMouseOver: handleChartHover,
    visualMap: {
      show: true,
      left: 'right',
      min: 0,
      max: 100,
      text: ['High', 'Low'],
      calculable: true,
      inRange: {
        color: ['#313695', '#d73027']
      }
    },
    tooltip: {
      trigger: 'item',
      showDelay: 0,
      transitionDuration: 0.2,
      formatter: '{b}: {c}',
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
  }), [theme, handleChartClick, handleChartHover, colorPalette]);

  return (
    <div>
      {/* Map Selection */}
      <div style={{
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5',
        borderRadius: '6px',
      }}>
        <label style={{
          marginRight: '10px',
          fontWeight: 'bold',
          color: theme === 'dark' ? '#fff' : '#333'
        }}>
          Select Map:
        </label>
        <select
          value={selectedMap}
          onChange={(e) => {
            const newMap = e.target.value as 'norway' | 'norway-svg' | 'norway-typology' | 'germany' | 'france';
            setSelectedMap(newMap);
            // Mark the new map as loaded so it will render
            setLoadedMaps(prev => new Set([...prev, newMap]));
          }}
          style={{
            padding: '5px 10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            backgroundColor: theme === 'dark' ? '#444' : '#fff',
            color: theme === 'dark' ? '#fff' : '#333'
          }}
        >
          <option value="norway">🇳🇴 Norway (GeoJSON)</option>
          <option value="norway-svg">🇳🇴 Norway (SVG)</option>
          <option value="norway-typology">🌊 Norway Water Typology</option>
          <option value="germany">🇩🇪 Germany (GeoJSON)</option>
          <option value="france">🇫🇷 France (GeoJSON)</option>
        </select>
      </div>

      {selectedMap === 'norway' && (
        <ExampleCard title="🇳🇴 Norway (GeoJSON Example)" theme={theme}>
          <p style={{
            margin: '0 0 15px 0',
            color: theme === 'dark' ? '#ccc' : '#666',
            fontSize: '14px',
          }}>
            This example uses a real GeoJSON file downloaded from GitHub to display Norway's boundaries.
            Perfect for custom geographic data visualization!
          </p>
          
          {loadedMaps.has('norway') && (
            <GeoChart
              data={countryData.norway}
              mapName="Norway"
              mapUrl="/norway.geojson"
              mapType="geojson"
              chartType="map"
              title="Norway Population"
              {...commonProps}
              onMapLoad={() => handleMapLoad('Norway')}
              onMapError={(error) => handleMapError('Norway', error)}
            />
          )}
        </ExampleCard>
      )}

      {selectedMap === 'germany' && (
        <ExampleCard title="🇩🇪 Germany (GeoJSON Example)" theme={theme}>
          <p style={{
            margin: '0 0 15px 0',
            color: theme === 'dark' ? '#ccc' : '#666',
            fontSize: '14px',
          }}>
            This example demonstrates using a German GeoJSON file for geographic visualization.
            The data is loaded dynamically from a remote source.
          </p>
          
          {loadedMaps.has('germany') && (
            <GeoChart
              data={countryData.germany}
              mapName="Germany"
              mapUrl="/germany.geojson"
              mapType="geojson"
              chartType="map"
              title="Germany Population"
              {...commonProps}
              onMapLoad={() => handleMapLoad('Germany')}
              onMapError={(error) => handleMapError('Germany', error)}
            />
          )}
        </ExampleCard>
      )}

      {selectedMap === 'france' && (
        <ExampleCard title="🇫🇷 France (GeoJSON Example)" theme={theme}>
          <p style={{
            margin: '0 0 15px 0',
            color: theme === 'dark' ? '#ccc' : '#666',
            fontSize: '14px',
          }}>
            This example shows France using GeoJSON data. Notice how different countries
            have different boundary complexities and shapes.
          </p>
          
          {loadedMaps.has('france') && (
            <GeoChart
              data={countryData.france}
              mapName="France"
              mapUrl="/france.geojson"
              mapType="geojson"
              chartType="map"
              title="France Population"
              {...commonProps}
              onMapLoad={() => handleMapLoad('France')}
              onMapError={(error) => handleMapError('France', error)}
            />
          )}
        </ExampleCard>
      )}

      {selectedMap === 'norway-svg' && (
        <ExampleCard title="🇳🇴 Norway (SVG Example)" theme={theme}>
          <p style={{
            margin: '0 0 15px 0',
            color: theme === 'dark' ? '#ccc' : '#666',
            fontSize: '14px',
          }}>
            This example demonstrates using an SVG map file showing Norwegian aquaculture production areas.
            SVG maps can provide cleaner rendering and smaller file sizes, and this one includes 
            all 13 mainland production areas with sample fish production data (in tonnes).
          </p>
          
          {loadedMaps.has('norway-svg') && (
            <GeoChart
              data={[
                { name: 'production-area-1', value: 45200 },
                { name: 'production-area-2', value: 38750 },
                { name: 'production-area-3', value: 52100 },
                { name: 'production-area-4', value: 61800 },
                { name: 'production-area-5', value: 43900 },
                { name: 'production-area-6', value: 67300 },
                { name: 'production-area-7', value: 71500 },
                { name: 'production-area-8', value: 48600 },
                { name: 'production-area-9', value: 55900 },
                { name: 'production-area-10', value: 39400 },
                { name: 'production-area-11', value: 44800 },
                { name: 'production-area-12', value: 58200 },
                { name: 'production-area-13', value: 35600 },
              ]}
              mapName="NorwayRegions"
              mapUrl="/norwegian_production_areas_mainland.svg"
              mapType="svg"
              chartType="map"
              title="Norwegian Aquaculture Production Areas"
              {...commonProps}
              onMapLoad={() => handleMapLoad('Norway SVG')}
              onMapError={(error) => handleMapError('Norway SVG', error)}
            />
          )}
        </ExampleCard>
      )}

      {selectedMap === 'norway-typology' && (
        <ExampleCard title="🌊 Norway Water Typology (SVG Example)" theme={theme}>
          <p style={{
            margin: '0 0 15px 0',
            color: theme === 'dark' ? '#ccc' : '#666',
            fontSize: '14px',
          }}>
            Comprehensive Norwegian marine water typology classification system with 5 major categories 
            covering all Norwegian marine regions (Barents Sea, Norwegian Sea, North Sea, Skagerrak). 
            Each type represents specific environmental conditions including wave exposure, freshwater influence, and oxygen levels.
          </p>
          
          {/* Marine Type Selection */}
          <div style={{
            marginBottom: '20px',
            padding: '10px',
            backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f8f8f8',
            borderRadius: '6px',
          }}>
            <label style={{
              marginRight: '10px',
              fontWeight: 'bold',
              color: theme === 'dark' ? '#fff' : '#333'
            }}>
              Marine Environment Type:
            </label>
            <select
              value={selectedMarineType}
              onChange={(e) => setSelectedMarineType(e.target.value as keyof typeof marineTypologyData)}
              style={{
                padding: '5px 10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                backgroundColor: theme === 'dark' ? '#444' : '#fff',
                color: theme === 'dark' ? '#fff' : '#333'
              }}
            >
              <option value="protected_fjords">🛡️ Protected Fjords</option>
              <option value="freshwater_fjords">🏞️ Freshwater Influenced Fjords</option>
              <option value="exposed_fjords">⛰️ Exposed Fjords</option>
              <option value="coastal_areas">🌊 Wave Exposed Coastal Areas</option>
              <option value="special_waters">⚡ Special Waters & Straits</option>
            </select>
          </div>
          
          {loadedMaps.has('norway-typology') && (
            <GeoChart
              data={marineTypologyData[selectedMarineType]}
              mapName="NorwayWaterTypologies"
              mapUrl="/norwegian_water_typologies_with_map.svg"
              mapType="svg"
              chartType="map"
              title={`Norwegian Water Typologies - ${
                selectedMarineType === 'protected_fjords' ? 'Protected Fjord Systems' :
                selectedMarineType === 'freshwater_fjords' ? 'Freshwater Influenced Fjords' :
                selectedMarineType === 'exposed_fjords' ? 'Exposed Fjord Environments' :
                selectedMarineType === 'coastal_areas' ? 'Wave Exposed Coastal Waters' :
                'Special Waters & Narrow Straits'
              }`}
              {...commonProps}
              onMapLoad={() => handleMapLoad('Norway Water Typology')}
              onMapError={(error) => handleMapError('Norway Water Typology', error)}
            />
          )}
        </ExampleCard>
      )}

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

// Sample data for choropleth maps
const populationData = [
  { name: 'Norway', value: 5421241 },
  { name: 'Germany', value: 83240525 },
  { name: 'France', value: 67391582 },
];

// GeoJSON map usage (custom boundary data)
<GeoChart
  data={populationData}
  mapName="Norway"
  mapUrl="/norway.geojson"
  mapType="geojson"
  chartType="map"
  title="Population by Country"
  visualMap={{
    show: true,
    left: 'right',
    colors: ['#313695', '#4575b4', '#74add1', ...],
    text: ['High', 'Low'],
    calculable: true,
  }}
  roam={true}
  toolbox={{
    show: true,
    features: {
      dataView: true,
      restore: true,
      saveAsImage: true,
    },
  }}
  onMapLoad={() => {
    console.log('Map loaded successfully!');
  }}
  onMapError={(error) => {
    console.error('Map loading failed:', error);
  }}
/>

// SVG map usage (custom SVG-based boundary data)
<GeoChart
  data={populationData}
  mapName="NorwaySVG"
  mapUrl="/norway.svg"
  mapType="svg"
  chartType="geo"
  title="Norway Population (SVG)"
  roam={true}
  onMapLoad={() => {
    console.log('SVG map loaded successfully!');
  }}
/>`}
          </pre>
        </div>
      </ExampleCard>
    </div>
  );
}