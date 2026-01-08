import { GeoChart, useResolvedTheme } from '@aquacloud_ai/aqc-charts';

interface GeoChartExampleProps {
  theme: 'light' | 'dark' | 'auto';
  onInteraction?: (data: string) => void;
}

// US states population data (sample)
const usPopulationData = [
  { name: 'California', value: 39538223 },
  { name: 'Texas', value: 29145505 },
  { name: 'Florida', value: 21538187 },
  { name: 'New York', value: 20201249 },
  { name: 'Pennsylvania', value: 13002700 },
  { name: 'Illinois', value: 12812508 },
  { name: 'Ohio', value: 11799448 },
  { name: 'Georgia', value: 10711908 },
  { name: 'North Carolina', value: 10439388 },
  { name: 'Michigan', value: 10077331 },
];

// World GDP data (sample)
const worldGdpData = [
  { name: 'United States', value: 25462700 },
  { name: 'China', value: 17963200 },
  { name: 'Japan', value: 4231140 },
  { name: 'Germany', value: 4072190 },
  { name: 'India', value: 3385090 },
  { name: 'United Kingdom', value: 3070670 },
  { name: 'France', value: 2782910 },
  { name: 'Russia', value: 2240420 },
  { name: 'Canada', value: 2139840 },
  { name: 'Italy', value: 2010430 },
];

export function GeoChartExample({ theme, onInteraction }: GeoChartExampleProps) {
  const resolvedTheme = useResolvedTheme(theme);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* USA Map */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', color: resolvedTheme === 'dark' ? '#fff' : '#333' }}>
          USA Population by State
        </h3>
        <GeoChart
          data={usPopulationData}
          mapName="USA"
          mapUrl="https://cdn.jsdelivr.net/npm/echarts/map/json/usa.json"
          mapType="geojson"
          chartType="map"
          title="US Population Distribution"
          theme={theme}
          height={500}
          showLabels={false}
          roam
          visualMap={{
            show: true,
            min: 10000000,
            max: 40000000,
            text: ['High', 'Low'],
            calculable: true,
          }}
          onDataPointClick={(params) => {
            onInteraction?.(`${params.name}: ${(params.value as number)?.toLocaleString()} people`);
          }}
        />
      </section>

      {/* World Map */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', color: resolvedTheme === 'dark' ? '#fff' : '#333' }}>
          World GDP (Billions USD)
        </h3>
        <GeoChart
          data={worldGdpData}
          mapName="world"
          mapUrl="https://cdn.jsdelivr.net/npm/echarts/map/json/world.json"
          mapType="geojson"
          chartType="map"
          title="Global GDP Distribution"
          theme={theme}
          height={500}
          showLabels={false}
          roam
          visualMap={{
            show: true,
            min: 1000000,
            max: 26000000,
            text: ['High GDP', 'Low GDP'],
            calculable: true,
          }}
        />
      </section>

      {/* Note about maps */}
      <section>
        <div style={{
          padding: '16px',
          backgroundColor: resolvedTheme === 'dark' ? '#1a1a2e' : '#f0f4f8',
          borderRadius: '8px',
          color: resolvedTheme === 'dark' ? '#a0aec0' : '#4a5568',
          fontSize: '14px',
        }}>
          <strong>Note:</strong> GeoChart requires external map data (GeoJSON or SVG).
          The maps are loaded from CDN. You can also provide your own custom map data
          via the <code>mapUrl</code> prop.
        </div>
      </section>
    </div>
  );
}
