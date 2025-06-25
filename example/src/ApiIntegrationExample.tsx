import React, { useState } from 'react';
import { LineChart } from 'aqc-charts';

const sampleData = {
  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  series: [
    {
      name: 'Sales',
      data: [120, 200, 150, 80, 70, 110, 130],
    },
    {
      name: 'Profit',
      data: [20, 30, 40, 35, 25, 30, 45],
    }
  ]
};

export function ApiIntegrationExample() {
  const [activeExample, setActiveExample] = useState<'simple' | 'advanced' | 'hybrid'>('simple');

  const examples = {
    simple: {
      title: 'Level 1: Simple Props (React-friendly)',
      description: 'Using familiar React patterns for common configurations',
      component: (
        <LineChart 
          data={sampleData}
          title="Monthly Performance"
          legend={{ show: true, position: 'top' }}
          tooltip={{ trigger: 'axis' }}
          width="100%"
          height={400}
        />
      ),
      code: `<LineChart 
  data={sampleData}
  title="Monthly Performance"
  legend={{ show: true, position: 'top' }}
  tooltip={{ trigger: 'axis' }}
  width="100%"
  height={400}
/>`
    },
    
    advanced: {
      title: 'Level 2: Full ECharts Option Power',
      description: 'Using comprehensive ECharts option object for advanced features',
      component: (
        <LineChart 
          data={sampleData}
          option={{
            title: {
              text: 'Advanced Performance Dashboard',
              left: 'center',
              textStyle: { fontSize: 18, fontWeight: 'bold' }
            },
            dataZoom: [
              { type: 'slider', start: 0, end: 100 },
              { type: 'inside' }
            ],
            brush: {
              toolbox: ['rect', 'polygon', 'keep', 'clear'],
              xAxisIndex: 'all'
            },
            toolbox: {
              feature: {
                saveAsImage: { show: true },
                restore: { show: true },
                dataZoom: { show: true },
                brush: { show: true }
              }
            },
            grid: {
              left: '10%',
              right: '10%',
              bottom: '20%',
              top: '15%'
            },
            animation: {
              duration: 2000,
              easing: 'elasticOut'
            }
          }}
          width="100%"
          height={500}
        />
      ),
      code: `<LineChart 
  data={sampleData}
  option={{
    title: {
      text: 'Advanced Performance Dashboard',
      left: 'center',
      textStyle: { fontSize: 18, fontWeight: 'bold' }
    },
    dataZoom: [
      { type: 'slider', start: 0, end: 100 },
      { type: 'inside' }
    ],
    brush: {
      toolbox: ['rect', 'polygon', 'keep', 'clear'],
      xAxisIndex: 'all'
    },
    toolbox: {
      feature: {
        saveAsImage: { show: true },
        restore: { show: true },
        dataZoom: { show: true },
        brush: { show: true }
      }
    },
    grid: {
      left: '10%',
      right: '10%', 
      bottom: '20%',
      top: '15%'
    },
    animation: {
      duration: 2000,
      easing: 'elasticOut'
    }
  }}
  width="100%"
  height={500}
/>`
    },
    
    hybrid: {
      title: 'Level 3: Hybrid Approach (Best of Both)',
      description: 'React props override option object values with smart merging',
      component: (
        <LineChart 
          data={sampleData}
          title="Hybrid Dashboard" // This prop overrides option.title.text
          legend={{ show: false }} // This prop overrides option.legend
          option={{
            title: {
              text: 'This will be overridden by prop',
              left: 'center', // This positioning remains
              textStyle: { fontSize: 16, color: '#666' } // This styling remains
            },
            legend: {
              show: true, // This gets overridden by prop
              orient: 'vertical', // This would remain if legend prop allowed it
              right: 20
            },
            dataZoom: [{ type: 'slider', start: 20, end: 80 }], // Advanced feature via option
            tooltip: {
              trigger: 'axis',
              formatter: (params: any) => {
                return params.map((p: any) => 
                  `${p.seriesName}: ${p.value}`
                ).join('<br/>');
              }
            },
            animation: {
              duration: 1500,
              easing: 'bounceOut'
            }
          }}
          width="100%"
          height={450}
        />
      ),
      code: `<LineChart 
  data={sampleData}
  title="Hybrid Dashboard" // Overrides option.title.text
  legend={{ show: false }} // Overrides option.legend.show
  option={{
    title: {
      text: 'This will be overridden',
      left: 'center', // Positioning preserved
      textStyle: { fontSize: 16, color: '#666' } // Styling preserved
    },
    legend: {
      show: true, // Gets overridden
      orient: 'vertical',
      right: 20
    },
    dataZoom: [{ type: 'slider', start: 20, end: 80 }],
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        return params.map(p => 
          \`\${p.seriesName}: \${p.value}\`
        ).join('<br/>');
      }
    },
    animation: {
      duration: 1500,
      easing: 'bounceOut' 
    }
  }}
  width="100%"
  height={450}
/>`
    }
  };

  const currentExample = examples[activeExample];

  return (
    <div style={{ padding: '20px' }}>
      <h2>ECharts API Integration Patterns</h2>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        This example demonstrates the three levels of ECharts integration supported by the library.
      </p>

      {/* Tab Navigation */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
        {(Object.keys(examples) as Array<keyof typeof examples>).map((key) => (
          <button
            key={key}
            onClick={() => setActiveExample(key)}
            style={{
              padding: '10px 20px',
              border: 'none',
              background: activeExample === key ? '#1890ff' : 'transparent',
              color: activeExample === key ? 'white' : '#666',
              borderBottom: activeExample === key ? '2px solid #1890ff' : '2px solid transparent',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            {examples[key].title.split(':')[0]}
          </button>
        ))}
      </div>

      {/* Current Example */}
      <div>
        <h3>{currentExample.title}</h3>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          {currentExample.description}
        </p>

        {/* Chart Display */}
        <div style={{ marginBottom: '30px', border: '1px solid #eee', borderRadius: '4px', padding: '20px' }}>
          {currentExample.component}
        </div>

        {/* Code Example */}
        <details>
          <summary style={{ cursor: 'pointer', marginBottom: '10px', fontWeight: 'bold' }}>
            Show Code Example
          </summary>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '15px', 
            borderRadius: '4px', 
            overflow: 'auto',
            fontSize: '14px',
            lineHeight: '1.4'
          }}>
            <code>{currentExample.code}</code>
          </pre>
        </details>
      </div>

      {/* Benefits Summary */}
      <div style={{ marginTop: '40px', padding: '20px', background: '#f9f9f9', borderRadius: '4px' }}>
        <h4>Key Benefits of This Approach</h4>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li><strong>Progressive Disclosure:</strong> Start simple, add complexity as needed</li>
          <li><strong>Type Safety:</strong> Full TypeScript support for all ECharts options</li>
          <li><strong>React Patterns:</strong> Familiar prop-based API for common use cases</li>
          <li><strong>Full Power:</strong> Access to all ECharts features through option object</li>
          <li><strong>Smart Merging:</strong> Props intelligently override option values</li>
          <li><strong>Development Help:</strong> Validation and warnings in development mode</li>
        </ul>
      </div>

      {/* Advanced Features Reference */}
      <div style={{ marginTop: '20px', padding: '20px', background: '#e6f7ff', borderRadius: '4px' }}>
        <h4>Advanced Features Available via Option Object</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '10px', marginTop: '10px' }}>
          <div><code>dataZoom</code> - Interactive zoom controls</div>
          <div><code>brush</code> - Selection and filtering</div>
          <div><code>timeline</code> - Animated data progression</div>
          <div><code>toolbox</code> - Built-in tools (save, restore, etc.)</div>
          <div><code>visualMap</code> - Data-driven visual mapping</div>
          <div><code>graphic</code> - Custom annotations</div>
          <div><code>media</code> - Responsive design queries</div>
          <div><code>stateAnimation</code> - Advanced animations</div>
        </div>
      </div>
    </div>
  );
}