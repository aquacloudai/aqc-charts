import { RegressionChart, useResolvedTheme } from '@aquacloud_ai/aqc-charts';

interface RegressionChartExampleProps {
  theme: 'light' | 'dark' | 'auto';
  onInteraction?: (data: string) => void;
}

// Linear relationship data (with some noise)
const linearData = [
  { x: 1, y: 2.3 },
  { x: 2, y: 4.1 },
  { x: 3, y: 5.8 },
  { x: 4, y: 8.2 },
  { x: 5, y: 9.9 },
  { x: 6, y: 12.1 },
  { x: 7, y: 13.8 },
  { x: 8, y: 16.2 },
  { x: 9, y: 18.1 },
  { x: 10, y: 19.8 },
];

// Exponential growth data
const exponentialData = [
  { x: 0, y: 1 },
  { x: 1, y: 2.7 },
  { x: 2, y: 7.4 },
  { x: 3, y: 20 },
  { x: 4, y: 55 },
  { x: 5, y: 148 },
];

// Polynomial data (quadratic-ish)
const polynomialData = [
  { x: -3, y: 9.2 },
  { x: -2, y: 4.1 },
  { x: -1, y: 1.3 },
  { x: 0, y: 0.5 },
  { x: 1, y: 1.2 },
  { x: 2, y: 4.3 },
  { x: 3, y: 9.1 },
  { x: 4, y: 16.2 },
  { x: 5, y: 25.1 },
];

// Logarithmic data
const logarithmicData = [
  { x: 1, y: 0 },
  { x: 2, y: 0.7 },
  { x: 3, y: 1.1 },
  { x: 5, y: 1.6 },
  { x: 8, y: 2.1 },
  { x: 13, y: 2.6 },
  { x: 21, y: 3.0 },
  { x: 34, y: 3.5 },
];

export function RegressionChartExample({ theme, onInteraction }: RegressionChartExampleProps) {
  const resolvedTheme = useResolvedTheme(theme);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Linear Regression */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', color: resolvedTheme === 'dark' ? '#fff' : '#333' }}>
          Linear Regression
        </h3>
        <RegressionChart
          data={linearData}
          xField="x"
          yField="y"
          method="linear"
          title="Linear Trend Analysis"
          theme={theme}
          height={350}
          pointSize={10}
          showEquation
          showRSquared
          xAxis={{ name: 'X Variable' }}
          yAxis={{ name: 'Y Variable' }}
          onDataPointClick={(params) => {
            const data = params.data as [number, number];
            onInteraction?.(`Point: (${data?.[0]}, ${data?.[1]})`);
          }}
        />
      </section>

      {/* Exponential Regression */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', color: resolvedTheme === 'dark' ? '#fff' : '#333' }}>
          Exponential Regression
        </h3>
        <RegressionChart
          data={exponentialData}
          xField="x"
          yField="y"
          method="exponential"
          title="Exponential Growth Model"
          theme={theme}
          height={350}
          pointSize={10}
          showEquation
          showRSquared
          xAxis={{ name: 'Time Period' }}
          yAxis={{ name: 'Growth Value' }}
        />
      </section>

      {/* Polynomial Regression */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', color: resolvedTheme === 'dark' ? '#fff' : '#333' }}>
          Polynomial Regression (Order 2)
        </h3>
        <RegressionChart
          data={polynomialData}
          xField="x"
          yField="y"
          method="polynomial"
          order={2}
          title="Quadratic Fit"
          theme={theme}
          height={350}
          pointSize={10}
          showEquation
          showRSquared
          xAxis={{ name: 'X' }}
          yAxis={{ name: 'Y' }}
        />
      </section>

      {/* Logarithmic Regression */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', color: resolvedTheme === 'dark' ? '#fff' : '#333' }}>
          Logarithmic Regression
        </h3>
        <RegressionChart
          data={logarithmicData}
          xField="x"
          yField="y"
          method="logarithmic"
          title="Logarithmic Trend"
          theme={theme}
          height={350}
          pointSize={10}
          showEquation
          showRSquared
          xAxis={{ name: 'Input' }}
          yAxis={{ name: 'Output' }}
        />
      </section>
    </div>
  );
}
