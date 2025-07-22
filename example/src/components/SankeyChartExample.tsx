import React from 'react';
import { SankeyChart } from 'aqc-charts';

// Sample datasets for sankey chart demonstrations
const budgetFlowData = {
  nodes: [
    { name: 'Revenue' },
    { name: 'Product Sales' },
    { name: 'Services' },
    { name: 'Licensing' },
    { name: 'Operations' },
    { name: 'Marketing' },
    { name: 'R&D' },
    { name: 'Support' },
    { name: 'Profit' },
    { name: 'Reinvestment' }
  ],
  links: [
    // Revenue sources
    { source: 'Product Sales', target: 'Revenue', value: 750000 },
    { source: 'Services', target: 'Revenue', value: 420000 },
    { source: 'Licensing', target: 'Revenue', value: 180000 },
    
    // Revenue allocation
    { source: 'Revenue', target: 'Operations', value: 480000 },
    { source: 'Revenue', target: 'Marketing', value: 270000 },
    { source: 'Revenue', target: 'R&D', value: 320000 },
    { source: 'Revenue', target: 'Support', value: 150000 },
    { source: 'Revenue', target: 'Profit', value: 130000 },
    
    // Profit reinvestment
    { source: 'Profit', target: 'Reinvestment', value: 130000 }
  ]
};

const energyFlowData = {
  nodes: [
    { name: 'Solar', value: 250 },
    { name: 'Wind', value: 180 },
    { name: 'Hydro', value: 120 },
    { name: 'Coal', value: 400 },
    { name: 'Natural Gas', value: 300 },
    { name: 'Grid', value: 1250 },
    { name: 'Residential', value: 450 },
    { name: 'Commercial', value: 350 },
    { name: 'Industrial', value: 450 },
  ],
  links: [
    // Energy sources to grid
    { source: 'Solar', target: 'Grid', value: 250 },
    { source: 'Wind', target: 'Grid', value: 180 },
    { source: 'Hydro', target: 'Grid', value: 120 },
    { source: 'Coal', target: 'Grid', value: 400 },
    { source: 'Natural Gas', target: 'Grid', value: 300 },
    
    // Grid to consumers
    { source: 'Grid', target: 'Residential', value: 450 },
    { source: 'Grid', target: 'Commercial', value: 350 },
    { source: 'Grid', target: 'Industrial', value: 450 }
  ]
};

const customerJourneyData = [
  { stage: 'Awareness', next_stage: 'Interest', users: 10000 },
  { stage: 'Interest', next_stage: 'Consideration', users: 3500 },
  { stage: 'Interest', next_stage: 'Bounce', users: 6500 },
  { stage: 'Consideration', next_stage: 'Purchase', users: 1200 },
  { stage: 'Consideration', next_stage: 'Abandoned', users: 2300 },
  { stage: 'Purchase', next_stage: 'Onboarding', users: 1200 },
  { stage: 'Onboarding', next_stage: 'Active User', users: 950 },
  { stage: 'Onboarding', next_stage: 'Churned', users: 250 },
  { stage: 'Active User', next_stage: 'Loyal Customer', users: 420 },
  { stage: 'Active User', next_stage: 'Occasional User', users: 530 }
];

const websiteTrafficData = {
  nodes: [
    { name: 'Direct Traffic' },
    { name: 'Search Engine' },
    { name: 'Social Media' },
    { name: 'Email Campaign' },
    { name: 'Referrals' },
    { name: 'Homepage' },
    { name: 'Product Pages' },
    { name: 'Blog' },
    { name: 'About Us' },
    { name: 'Contact' },
    { name: 'Conversion' },
    { name: 'Exit' }
  ],
  links: [
    // Traffic sources to entry points
    { source: 'Direct Traffic', target: 'Homepage', value: 5200 },
    { source: 'Search Engine', target: 'Product Pages', value: 8300 },
    { source: 'Search Engine', target: 'Blog', value: 4100 },
    { source: 'Social Media', target: 'Homepage', value: 2800 },
    { source: 'Social Media', target: 'Blog', value: 3200 },
    { source: 'Email Campaign', target: 'Product Pages', value: 1900 },
    { source: 'Referrals', target: 'Homepage', value: 1500 },
    
    // Internal navigation
    { source: 'Homepage', target: 'Product Pages', value: 4800 },
    { source: 'Homepage', target: 'About Us', value: 2200 },
    { source: 'Blog', target: 'Product Pages', value: 2900 },
    { source: 'Product Pages', target: 'Contact', value: 1800 },
    
    // Exits and conversions
    { source: 'Product Pages', target: 'Conversion', value: 2400 },
    { source: 'Product Pages', target: 'Exit', value: 12800 },
    { source: 'Homepage', target: 'Exit', value: 4000 },
    { source: 'Blog', target: 'Exit', value: 4400 },
    { source: 'About Us', target: 'Exit', value: 1800 },
    { source: 'Contact', target: 'Conversion', value: 600 },
    { source: 'Contact', target: 'Exit', value: 1200 }
  ]
};

interface SankeyChartExampleProps {
  theme: 'light' | 'dark';
  colorPalette: readonly string[];
  onInteraction?: (data: string) => void;
}

export function SankeyChartExample({ theme, colorPalette, onInteraction }: SankeyChartExampleProps) {
  return (
    <>
      {/* Example 1: Budget Flow Analysis */}
      <div style={{ marginBottom: '40px' }}>
        <h4 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '20px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          💰 Company Budget Flow Analysis
        </h4>
        <p style={{
          color: theme === 'dark' ? '#ccc' : '#666',
          marginBottom: '20px',
          fontSize: '14px',
          lineHeight: 1.5
        }}>
          Visualize how revenue flows from different sources through various departments to final profit allocation.
        </p>
        
        <div style={{ height: '500px', marginBottom: '20px' }}>
          <SankeyChart
            data={budgetFlowData}
            title="Annual Budget Flow ($)"
            theme={theme}
            colorPalette={colorPalette}
            orient="horizontal"
            nodeAlign="justify"
            nodeWidth={25}
            nodeGap={12}
            linkOpacity={0.7}
            linkCurveness={0.5}
            showNodeValues
            focusMode="adjacency"
            onDataPointClick={(params) => {
              if (params.dataType === 'edge') {
                onInteraction?.(`Link clicked: ${params.data.source} → ${params.data.target} ($${params.data.value.toLocaleString()})`);
              } else {
                onInteraction?.(`Node clicked: ${params.data.name} (${params.data.value ? '$' + params.data.value.toLocaleString() : 'N/A'})`);
              }
            }}
            tooltip={{
              show: true,
              trigger: 'item',
              format: (params: any) => {
                if (params.dataType === 'edge') {
                  return `<strong>${params.data.source} → ${params.data.target}</strong><br/>Amount: $${params.data.value.toLocaleString()}`;
                } else {
                  return `<strong>${params.data.name}</strong><br/>Total: $${params.data.value ? params.data.value.toLocaleString() : 'Calculated'}`;
                }
              }
            }}
          />
        </div>
      </div>

      {/* Example 2: Energy Distribution Network */}
      <div style={{ marginBottom: '40px' }}>
        <h4 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '20px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          ⚡ Energy Distribution Network
        </h4>
        <p style={{
          color: theme === 'dark' ? '#ccc' : '#666',
          marginBottom: '20px',
          fontSize: '14px',
          lineHeight: 1.5
        }}>
          Track energy flow from renewable and non-renewable sources through the grid to different consumer segments.
        </p>
        
        <div style={{ height: '450px', marginBottom: '20px' }}>
          <SankeyChart
            data={energyFlowData}
            title="Energy Distribution (GWh)"
            theme={theme}
            colorPalette={colorPalette.slice(0, 6)}
            orient="horizontal"
            nodeAlign="left"
            nodeWidth={30}
            nodeGap={20}
            linkOpacity={0.6}
            linkCurveness={0.3}
            showNodeValues
            nodeLabels={true}
            focusMode="adjacency"
            onDataPointHover={(params) => {
              if (params.dataType === 'edge') {
                onInteraction?.(`Hovering: ${params.data.source} → ${params.data.target} (${params.data.value} GWh)`);
              }
            }}
          />
        </div>
      </div>

      {/* Example 3: Customer Journey Funnel */}
      <div style={{ marginBottom: '40px' }}>
        <h4 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '20px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          🎯 Customer Journey Analysis
        </h4>
        <p style={{
          color: theme === 'dark' ? '#ccc' : '#666',
          marginBottom: '20px',
          fontSize: '14px',
          lineHeight: 1.5
        }}>
          Track user flow through the conversion funnel from initial awareness to loyal customers.
        </p>
        
        <div style={{ height: '400px', marginBottom: '20px' }}>
          <SankeyChart
            data={customerJourneyData}
            sourceField="stage"
            targetField="next_stage"
            valueField="users"
            title="Customer Conversion Funnel"
            theme={theme}
            colorPalette={colorPalette.slice(2, 8)}
            orient="horizontal"
            nodeAlign="justify"
            nodeWidth={20}
            nodeGap={15}
            linkOpacity={0.8}
            linkCurveness={0.4}
            showLinkLabels
            focusMode="adjacency"
            onDataPointClick={(params) => {
              if (params.dataType === 'edge') {
                onInteraction?.(`Journey step: ${params.data.source} → ${params.data.target} (${params.data.value.toLocaleString()} users)`);
              }
            }}
          />
        </div>
      </div>

      {/* Example 4: Website Traffic Flow */}
      <div style={{ marginBottom: '40px' }}>
        <h4 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '20px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          🌐 Website Traffic Flow Analysis
        </h4>
        <p style={{
          color: theme === 'dark' ? '#ccc' : '#666',
          marginBottom: '20px',
          fontSize: '14px',
          lineHeight: 1.5
        }}>
          Analyze how visitors navigate through your website from different traffic sources to final conversions.
        </p>
        
        <div style={{ height: '550px', marginBottom: '20px' }}>
          <SankeyChart
            data={websiteTrafficData}
            title="Monthly Website Traffic Flow"
            theme={theme}
            colorPalette={colorPalette}
            orient="horizontal"
            nodeAlign="justify"
            nodeWidth={18}
            nodeGap={10}
            linkOpacity={0.5}
            linkCurveness={0.6}
            showNodeValues
            focusMode="trajectory"
            onDataPointClick={(params) => {
              if (params.dataType === 'edge') {
                const conversionRate = params.data.target === 'Conversion' 
                  ? ` (${((params.data.value / (params.data.value + (websiteTrafficData.links.find(l => l.source === params.data.source && l.target === 'Exit')?.value || 0))) * 100).toFixed(1)}% conversion rate)`
                  : '';
                onInteraction?.(`Traffic flow: ${params.data.source} → ${params.data.target} (${params.data.value.toLocaleString()} visitors)${conversionRate}`);
              } else {
                onInteraction?.(`Page/Source: ${params.data.name}`);
              }
            }}
            tooltip={{
              show: true,
              trigger: 'item',
              format: (params: any) => {
                if (params.dataType === 'edge') {
                  return `<strong>${params.data.source} → ${params.data.target}</strong><br/>Visitors: ${params.data.value.toLocaleString()}`;
                } else {
                  return `<strong>${params.data.name}</strong><br/>Total Traffic: ${params.data.value ? params.data.value.toLocaleString() : 'Calculated'}`;
                }
              }
            }}
          />
        </div>
      </div>

      {/* Example 5: Advanced Custom Styling */}
      <div style={{ marginBottom: '40px' }}>
        <h4 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '20px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          🎨 Custom Styled Sankey Chart
        </h4>
        <p style={{
          color: theme === 'dark' ? '#ccc' : '#666',
          marginBottom: '20px',
          fontSize: '14px',
          lineHeight: 1.5
        }}>
          Demonstrate advanced styling options with custom colors, vertical orientation, and enhanced visual effects.
        </p>
        
        <div style={{ height: '600px' }}>
          <SankeyChart
            nodes={[
              { name: 'Mobile Apps', value: 45000 },
              { name: 'Web Platform', value: 38000 },
              { name: 'API Services', value: 12000 },
              { name: 'User Engagement', value: 95000 },
              { name: 'Premium Features', value: 28000 },
              { name: 'Free Tier', value: 67000 },
              { name: 'Revenue', value: 28000 },
              { name: 'Growth', value: 67000 }
            ]}
            links={[
              { source: 'Mobile Apps', target: 'User Engagement', value: 45000 },
              { source: 'Web Platform', target: 'User Engagement', value: 38000 },
              { source: 'API Services', target: 'User Engagement', value: 12000 },
              { source: 'User Engagement', target: 'Premium Features', value: 28000 },
              { source: 'User Engagement', target: 'Free Tier', value: 67000 },
              { source: 'Premium Features', target: 'Revenue', value: 28000 },
              { source: 'Free Tier', target: 'Growth', value: 67000 }
            ]}
            title="Product Platform Flow"
            theme={theme}
            nodeColors={[
              '#FF6B6B', '#4ECDC4', '#45B7D1', 
              '#96CEB4', '#FFEAA7', '#DDA0DD',
              '#98D8C8', '#F7DC6F'
            ]}
            linkColors={[
              'rgba(255, 107, 107, 0.6)',
              'rgba(78, 205, 196, 0.6)', 
              'rgba(69, 183, 209, 0.6)',
              'rgba(150, 206, 180, 0.6)',
              'rgba(255, 234, 167, 0.6)',
              'rgba(221, 160, 221, 0.6)',
              'rgba(152, 216, 200, 0.6)'
            ]}
            orient="vertical"
            nodeAlign="center"
            nodeWidth={35}
            nodeGap={25}
            linkOpacity={0.9}
            linkCurveness={0.8}
            showNodeValues
            showLinkLabels
            nodeLabelPosition="inside"
            focusMode="adjacency"
            animate={true}
            animationDuration={1500}
            onDataPointClick={(params) => {
              onInteraction?.(`Custom styled chart interaction: ${params.dataType === 'edge' 
                ? `${params.data.source} → ${params.data.target}` 
                : params.data.name}`);
            }}
          />
        </div>
      </div>
    </>
  );
}