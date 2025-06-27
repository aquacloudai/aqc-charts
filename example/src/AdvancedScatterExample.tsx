import React, { useMemo } from 'react';
import { ScatterChart, type ScatterChartData } from 'aqc-charts';

export const AdvancedScatterExample: React.FC = () => {
    // Example similar to the one you provided - Male and Female height/weight data
    const heightWeightData: ScatterChartData = useMemo(() => ({
        series: [
            {
                name: 'Female',
                type: 'scatter',
                emphasis: {
                    focus: 'series'
                },
                data: [
                    { value: [161.2, 51.6], name: 'F1' },
                    { value: [167.5, 59.0], name: 'F2' },
                    { value: [159.5, 49.2], name: 'F3' },
                    { value: [157.0, 63.0], name: 'F4' },
                    { value: [155.8, 53.6], name: 'F5' },
                    { value: [170.0, 59.0], name: 'F6' },
                    { value: [159.1, 47.6], name: 'F7' },
                    { value: [166.0, 69.8], name: 'F8' },
                    { value: [176.2, 66.8], name: 'F9' },
                    { value: [160.2, 75.2], name: 'F10' },
                    { value: [172.5, 55.2], name: 'F11' },
                    { value: [170.9, 54.2], name: 'F12' },
                    { value: [172.9, 62.5], name: 'F13' },
                    { value: [153.4, 42.0], name: 'F14' },
                    { value: [160.0, 50.0], name: 'F15' },
                    { value: [147.2, 49.8], name: 'F16' },
                    { value: [168.2, 49.2], name: 'F17' },
                    { value: [175.0, 73.2], name: 'F18' },
                    { value: [157.0, 47.8], name: 'F19' },
                    { value: [167.6, 68.8], name: 'F20' }
                ],
                markArea: {
                    silent: true,
                    itemStyle: {
                        color: 'transparent',
                        borderWidth: 1,
                        borderType: 'dashed'
                    },
                    data: [
                        [
                            {
                                name: 'Female Data Range',
                                xAxis: 'min',
                                yAxis: 'min'
                            },
                            {
                                xAxis: 'max',
                                yAxis: 'max'
                            }
                        ]
                    ]
                },
                markPoint: {
                    data: [
                        { type: 'max', name: 'Max' },
                        { type: 'min', name: 'Min' }
                    ]
                },
                markLine: {
                    lineStyle: {
                        type: 'solid'
                    },
                    data: [
                        { type: 'average', name: 'AVG' },
                        { xAxis: 160 }
                    ]
                }
            },
            {
                name: 'Male',
                type: 'scatter',
                emphasis: {
                    focus: 'series'
                },
                data: [
                    { value: [174.0, 65.6], name: 'M1' },
                    { value: [175.3, 71.8], name: 'M2' },
                    { value: [193.5, 80.7], name: 'M3' },
                    { value: [186.5, 72.6], name: 'M4' },
                    { value: [187.2, 78.8], name: 'M5' },
                    { value: [181.5, 74.8], name: 'M6' },
                    { value: [184.0, 86.4], name: 'M7' },
                    { value: [184.5, 78.4], name: 'M8' },
                    { value: [175.0, 62.0], name: 'M9' },
                    { value: [184.0, 81.6], name: 'M10' },
                    { value: [180.0, 76.6], name: 'M11' },
                    { value: [177.8, 83.6], name: 'M12' },
                    { value: [192.0, 90.0], name: 'M13' },
                    { value: [176.0, 74.6], name: 'M14' },
                    { value: [174.0, 71.0], name: 'M15' },
                    { value: [184.0, 79.6], name: 'M16' },
                    { value: [192.7, 93.8], name: 'M17' },
                    { value: [171.5, 70.0], name: 'M18' },
                    { value: [173.0, 72.4], name: 'M19' },
                    { value: [176.0, 85.9], name: 'M20' }
                ],
                markArea: {
                    silent: true,
                    itemStyle: {
                        color: 'transparent',
                        borderWidth: 1,
                        borderType: 'dashed'
                    },
                    data: [
                        [
                            {
                                name: 'Male Data Range',
                                xAxis: 'min',
                                yAxis: 'min'
                            },
                            {
                                xAxis: 'max',
                                yAxis: 'max'
                            }
                        ]
                    ]
                },
                markPoint: {
                    data: [
                        { type: 'max', name: 'Max' },
                        { type: 'min', name: 'Min' }
                    ]
                },
                markLine: {
                    lineStyle: {
                        type: 'solid'
                    },
                    data: [
                        { type: 'average', name: 'Average' },
                        { xAxis: 170 }
                    ]
                }
            }
        ],
        xAxis: {
            type: 'value',
            scale: true,
            axisLabel: {
                formatter: '{value} cm'
            },
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            scale: true,
            axisLabel: {
                formatter: '{value} kg'
            },
            splitLine: {
                show: false
            }
        }
    }), []);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Advanced Scatter Chart Features</h2>
            <p>This example showcases advanced ECharts features like toolbox, brush selection, mark areas, mark points, and mark lines.</p>
            
            <div style={{ height: '600px', marginBottom: '20px' }}>
                <ScatterChart
                    data={heightWeightData}
                    title="Male and Female Height and Weight Distribution"
                    width="100%"
                    height={600}
                    option={{
                        title: {
                            text: 'Male and Female Height and Weight Distribution',
                            subtext: 'Data from: Heinz 2003'
                        },
                        grid: {
                            left: '3%',
                            right: '7%',
                            bottom: '7%',
                            containLabel: true
                        },
                        toolbox: {
                            feature: {
                                dataZoom: {},
                                brush: {
                                    type: ['rect', 'polygon', 'clear']
                                }
                            }
                        },
                        brush: {},
                        legend: {
                            data: ['Female', 'Male'],
                            left: 'center',
                            bottom: 10
                        },
                        tooltip: {
                            showDelay: 0,
                            formatter: function (params: any) {
                                if (params.value.length > 1) {
                                    return (
                                        params.seriesName +
                                        ' :<br/>' +
                                        params.value[0] +
                                        'cm ' +
                                        params.value[1] +
                                        'kg '
                                    );
                                } else {
                                    return (
                                        params.seriesName +
                                        ' :<br/>' +
                                        params.name +
                                        ' : ' +
                                        params.value +
                                        'kg '
                                    );
                                }
                            },
                            axisPointer: {
                                show: true,
                                type: 'cross',
                                lineStyle: {
                                    type: 'dashed',
                                    width: 1
                                }
                            }
                        }
                    }}
                />
            </div>

            <div style={{ padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <h3>📊 Advanced Features Demonstrated:</h3>
                <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                    <li><strong>Toolbox:</strong> Data zoom and brush selection tools</li>
                    <li><strong>Brush Selection:</strong> Draw rectangles and polygons to select data</li>
                    <li><strong>Mark Areas:</strong> Highlight data ranges with dashed borders</li>
                    <li><strong>Mark Points:</strong> Show min/max values for each series</li>
                    <li><strong>Mark Lines:</strong> Display average lines and reference lines</li>
                    <li><strong>Custom Tooltip:</strong> Formatted to show height in cm and weight in kg</li>
                    <li><strong>Cross Axis Pointer:</strong> Shows crosshairs when hovering</li>
                    <li><strong>Legend:</strong> Positioned at bottom center</li>
                    <li><strong>Grid Layout:</strong> Custom margins and label containment</li>
                </ul>
            </div>

            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f4fd', borderRadius: '8px' }}>
                <h3>🔧 How to Use These Features:</h3>
                <p><strong>Using Custom Option (Full ECharts Power):</strong></p>
                <pre style={{ backgroundColor: '#f8f8f8', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
{`<ScatterChart
  data={data}
  option={{
    grid: { left: '3%', right: '7%', containLabel: true },
    toolbox: { 
      feature: { 
        dataZoom: {}, 
        brush: { type: ['rect', 'polygon', 'clear'] } 
      } 
    },
    brush: {},
    legend: { data: ['Female', 'Male'], bottom: 10 },
    tooltip: { 
      formatter: (params) => \`\${params.seriesName}: \${params.value[0]}cm \${params.value[1]}kg\`
    },
    // Any other ECharts option...
  }}
/>`}
                </pre>
            </div>
        </div>
    );
};