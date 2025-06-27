import React, { useState, useMemo } from 'react';
import { 
    ScatterChart,
    ClusterChart,
    RegressionChart,
    extractPoints, 
    performKMeansClustering, 
    clusterPointsToScatterData
} from 'aqc-charts';
import type { ScatterChartData, ClusterPoint, ClusterChartData, RegressionChartData, RegressionMethod } from 'aqc-charts';

export function ScatterExample() {
    const [showRegression, setShowRegression] = useState(false);
    const [clusterCount, setClusterCount] = useState(3);
    const [showClusters, setShowClusters] = useState(false);
    const [echartsClusterCount, setEchartsClusterCount] = useState(6);
    const [regressionMethod, setRegressionMethod] = useState<RegressionMethod>('linear');

    // Basic scatter plot data
    const basicScatterData: ScatterChartData = useMemo(() => ({
        series: [
            {
                name: 'Dataset A',
                type: 'scatter',
                data: [
                    { value: [10.0, 8.04] },
                    { value: [8.0, 6.95] },
                    { value: [13.0, 7.58] },
                    { value: [9.0, 8.81] },
                    { value: [11.0, 8.33] },
                    { value: [14.0, 9.96] },
                    { value: [6.0, 7.24] },
                    { value: [4.0, 4.26] },
                    { value: [12.0, 10.84] },
                    { value: [7.0, 4.82] },
                    { value: [5.0, 5.68] }
                ],
                color: '#5470c6',
                symbolSize: 8
            },
            {
                name: 'Dataset B',
                type: 'scatter',
                data: [
                    { value: [10.0, 9.14] },
                    { value: [8.0, 8.14] },
                    { value: [13.0, 8.74] },
                    { value: [9.0, 8.77] },
                    { value: [11.0, 9.26] },
                    { value: [14.0, 8.10] },
                    { value: [6.0, 6.13] },
                    { value: [4.0, 3.10] },
                    { value: [12.0, 9.13] },
                    { value: [7.0, 7.26] },
                    { value: [5.0, 4.74] }
                ],
                color: '#91cc75',
                symbolSize: 8
            }
        ],
        xAxis: {
            name: 'X Values',
            type: 'value',
            scale: true
        },
        yAxis: {
            name: 'Y Values', 
            type: 'value',
            scale: true
        }
    }), []);

    // Bubble chart data (with size dimension)
    const bubbleData: ScatterChartData = useMemo(() => ({
        series: [
            {
                name: 'Countries',
                type: 'scatter',
                data: [
                    { value: [28604, 77, 17096869], name: 'Australia' },
                    { value: [31163, 77.4, 27662440], name: 'Canada' },
                    { value: [1516, 68, 1154605773], name: 'China' },
                    { value: [13670, 74.7, 10582082], name: 'Cuba' },
                    { value: [28599, 75, 4986705], name: 'Finland' },
                    { value: [29476, 77.1, 56943299], name: 'France' },
                    { value: [31476, 75.4, 78958237], name: 'Germany' },
                    { value: [28666, 78.1, 254830], name: 'Iceland' },
                    { value: [1777, 57.7, 870601776], name: 'India' },
                    { value: [29550, 79.1, 122249285], name: 'Japan' },
                    { value: [2076, 67.9, 20194354], name: 'North Korea' },
                    { value: [12087, 72, 42972254], name: 'South Korea' },
                    { value: [24021, 75.4, 3397534], name: 'New Zealand' },
                    { value: [43296, 76.8, 4240375], name: 'Norway' },
                    { value: [10088, 70.8, 38195258], name: 'Poland' },
                    { value: [19349, 69.6, 147568552], name: 'Russia' },
                    { value: [10670, 67.3, 53994605], name: 'Turkey' },
                    { value: [26424, 75.7, 57110117], name: 'United Kingdom' },
                    { value: [37062, 75.4, 252847810], name: 'United States' }
                ],
                color: '#ee6666',
                symbolSize: (value: readonly number[]) => Math.sqrt(value[2]) / 5e2
            }
        ],
        xAxis: {
            name: 'GDP per Capita (PPP)',
            type: 'value',
            scale: true
        },
        yAxis: {
            name: 'Life Expectancy',
            type: 'value',
            scale: true
        }
    }), []);

    // Simple scatter data for basic regression toggle
    const regressionData = useMemo(() => ({
        ...basicScatterData,
        series: basicScatterData.series.slice(0, 1) // Just show first series
    }), [basicScatterData]);

    // Clustering data
    const clusterData = useMemo(() => {
        if (!showClusters) return basicScatterData;

        // Combine both datasets for clustering
        const allPoints: ClusterPoint[] = [
            ...basicScatterData.series[0].data.map((d, i) => ({ 
                x: d.value[0], 
                y: d.value[1], 
                name: `A${i + 1}` 
            })),
            ...basicScatterData.series[1].data.map((d, i) => ({ 
                x: d.value[0], 
                y: d.value[1], 
                name: `B${i + 1}` 
            }))
        ];

        const clusterResult = performKMeansClustering(allPoints, clusterCount);
        const scatterData = clusterPointsToScatterData(clusterResult);

        return {
            series: [
                {
                    name: 'Clustered Data',
                    type: 'scatter' as const,
                    data: scatterData,
                    symbolSize: 10
                }
            ],
            xAxis: basicScatterData.xAxis,
            yAxis: basicScatterData.yAxis
        };
    }, [basicScatterData, showClusters, clusterCount]);

    // Performance test data (large dataset)
    const largeDataset: ScatterChartData = useMemo(() => {
        const data = [];
        for (let i = 0; i < 10000; i++) {
            data.push({
                value: [
                    Math.random() * 100,
                    Math.random() * 100 + Math.sin(i * 0.01) * 20
                ] as [number, number]
            });
        }

        return {
            series: [
                {
                    name: 'Large Dataset',
                    type: 'scatter',
                    data,
                    color: '#fac858',
                    symbolSize: 2,
                    large: true,
                    largeThreshold: 5000
                }
            ],
            xAxis: {
                name: 'Random X',
                type: 'value',
                scale: true
            },
            yAxis: {
                name: 'Random Y + Sin Wave',
                type: 'value',
                scale: true
            }
        };
    }, []);

    // ECharts native clustering data
    const echartsClusterData: ClusterChartData = useMemo(() => {
        // Generate some sample data for clustering
        const clusterData = [];
        
        // Create 3 natural clusters
        for (let i = 0; i < 30; i++) {
            // Cluster 1: around (20, 20)
            clusterData.push({
                value: [
                    20 + Math.random() * 10 - 5,
                    20 + Math.random() * 10 - 5
                ] as [number, number],
                name: `Point ${i + 1}`
            });
        }
        
        for (let i = 0; i < 25; i++) {
            // Cluster 2: around (60, 60)
            clusterData.push({
                value: [
                    60 + Math.random() * 12 - 6,
                    60 + Math.random() * 12 - 6
                ] as [number, number],
                name: `Point ${i + 31}`
            });
        }
        
        for (let i = 0; i < 20; i++) {
            // Cluster 3: around (40, 80)
            clusterData.push({
                value: [
                    40 + Math.random() * 8 - 4,
                    80 + Math.random() * 8 - 4
                ] as [number, number],
                name: `Point ${i + 56}`
            });
        }
        
        // Add some scattered points
        for (let i = 0; i < 15; i++) {
            clusterData.push({
                value: [
                    Math.random() * 100,
                    Math.random() * 100
                ] as [number, number],
                name: `Scattered ${i + 1}`
            });
        }

        return {
            data: clusterData,
            xAxis: {
                name: 'X Coordinate',
                type: 'value'
            },
            yAxis: {
                name: 'Y Coordinate',
                type: 'value'
            }
        };
    }, []);

    // ECharts native regression data
    const echartsRegressionData: RegressionChartData = useMemo(() => {
        // Generate data with some correlation for regression
        const regressionData = [];
        
        // Create data with different patterns based on regression method
        if (regressionMethod === 'linear') {
            // Linear relationship with some noise
            for (let i = 0; i < 50; i++) {
                const x = i * 2;
                const y = 2 * x + 10 + (Math.random() - 0.5) * 20; // y = 2x + 10 + noise
                regressionData.push({
                    value: [x, y] as [number, number],
                    name: `Point ${i + 1}`
                });
            }
        } else if (regressionMethod === 'exponential') {
            // Exponential relationship
            for (let i = 0; i < 30; i++) {
                const x = i * 0.2;
                const y = Math.exp(x * 0.5) + (Math.random() - 0.5) * 2;
                regressionData.push({
                    value: [x, y] as [number, number],
                    name: `Point ${i + 1}`
                });
            }
        } else if (regressionMethod === 'logarithmic') {
            // Logarithmic relationship
            for (let i = 1; i <= 50; i++) {
                const x = i * 2;
                const y = 10 * Math.log(x) + (Math.random() - 0.5) * 5;
                regressionData.push({
                    value: [x, y] as [number, number],
                    name: `Point ${i}`
                });
            }
        } else if (regressionMethod === 'polynomial') {
            // Polynomial relationship
            for (let i = 0; i < 40; i++) {
                const x = (i - 20) * 0.5;
                const y = x * x * 0.5 + x * 2 + 10 + (Math.random() - 0.5) * 8;
                regressionData.push({
                    value: [x, y] as [number, number],
                    name: `Point ${i + 1}`
                });
            }
        }

        return {
            data: regressionData,
            xAxis: {
                name: 'X Values',
                type: 'value'
            },
            yAxis: {
                name: 'Y Values',
                type: 'value'
            }
        };
    }, [regressionMethod]);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Scatter Chart Examples</h2>

            {/* Basic Scatter Plot */}
            <div style={{ marginBottom: '40px' }}>
                <h3>Basic Scatter Plot</h3>
                <p>Anscombe's Quartet - Dataset A and B with identical statistical properties</p>
                <div style={{ height: '400px' }}>
                    <ScatterChart
                        data={basicScatterData}
                        title="Anscombe's Quartet (Datasets A & B)"
                        width="100%"
                        height={400}
                    />
                </div>
            </div>

            {/* Bubble Chart */}
            <div style={{ marginBottom: '40px' }}>
                <h3>Bubble Chart</h3>
                <p>GDP per Capita vs Life Expectancy (bubble size = population)</p>
                <div style={{ height: '500px' }}>
                    <ScatterChart
                        data={bubbleData}
                        title="GDP vs Life Expectancy by Country"
                        width="100%"
                        height={500}
                        option={{
                            tooltip: {
                                trigger: 'item',
                                formatter: (params: any) => {
                                    const [gdp, life, pop] = params.value;
                                    const name = params.name;
                                    return `${name}<br/>GDP per Capita: $${gdp.toLocaleString()}<br/>Life Expectancy: ${life} years<br/>Population: ${pop.toLocaleString()}`;
                                }
                            }
                        }}
                    />
                </div>
            </div>

            {/* Basic Regression Demo */}
            <div style={{ marginBottom: '40px' }}>
                <h3>Basic Scatter Plot</h3>
                <p>Simple scatter plot - for advanced regression analysis, see the ECharts Native Regression section below</p>
                <div style={{ height: '400px' }}>
                    <ScatterChart
                        data={regressionData}
                        title="Dataset A - Single Series"
                        width="100%"
                        height={400}
                    />
                </div>
                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f8ff', borderRadius: '4px' }}>
                    <p><strong>💡 Pro Tip:</strong> For regression analysis, use the new <strong>RegressionChart</strong> component below which supports linear, exponential, logarithmic, and polynomial regression with automatic equation calculation!</p>
                </div>
            </div>

            {/* Clustering Analysis */}
            <div style={{ marginBottom: '40px' }}>
                <h3>K-Means Clustering</h3>
                <div style={{ marginBottom: '10px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                            type="checkbox"
                            checked={showClusters}
                            onChange={(e) => setShowClusters(e.target.checked)}
                        />
                        Enable Clustering
                    </label>
                    {showClusters && (
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Number of Clusters:
                            <input
                                type="range"
                                min="2"
                                max="6"
                                value={clusterCount}
                                onChange={(e) => setClusterCount(parseInt(e.target.value))}
                                style={{ marginLeft: '8px', marginRight: '8px' }}
                            />
                            {clusterCount}
                        </label>
                    )}
                </div>
                <div style={{ height: '400px' }}>
                    <ScatterChart
                        data={clusterData}
                        title={showClusters ? `K-Means Clustering (k=${clusterCount})` : 'Original Data'}
                        width="100%"
                        height={400}
                    />
                </div>
            </div>

            {/* Large Dataset Performance */}
            <div style={{ marginBottom: '40px' }}>
                <h3>Large Dataset Performance</h3>
                <p>10,000 data points with performance optimizations enabled</p>
                <div style={{ height: '400px' }}>
                    <ScatterChart
                        data={largeDataset}
                        title="Large Dataset (10k points)"
                        width="100%"
                        height={400}
                        large={true}
                        largeThreshold={5000}
                        progressive={1000}
                        progressiveThreshold={3000}
                    />
                </div>
            </div>

            {/* Custom Styling Example */}
            <div style={{ marginBottom: '40px' }}>
                <h3>Custom Styling</h3>
                <p>Different symbols and sizes for data visualization</p>
                <div style={{ height: '400px' }}>
                    <ScatterChart
                        data={{
                            series: [
                                {
                                    name: 'Circles',
                                    type: 'scatter',
                                    data: Array.from({ length: 20 }, (_, i) => ({
                                        value: [Math.random() * 50, Math.random() * 50] as [number, number],
                                        name: `Circle ${i + 1}`
                                    })),
                                    symbol: 'circle',
                                    symbolSize: 12,
                                    color: '#5470c6'
                                },
                                {
                                    name: 'Squares',
                                    type: 'scatter',
                                    data: Array.from({ length: 20 }, (_, i) => ({
                                        value: [Math.random() * 50 + 50, Math.random() * 50] as [number, number],
                                        name: `Square ${i + 1}`
                                    })),
                                    symbol: 'rect',
                                    symbolSize: 10,
                                    color: '#91cc75'
                                },
                                {
                                    name: 'Triangles',
                                    type: 'scatter',
                                    data: Array.from({ length: 20 }, (_, i) => ({
                                        value: [Math.random() * 50 + 25, Math.random() * 50 + 50] as [number, number],
                                        name: `Triangle ${i + 1}`
                                    })),
                                    symbol: 'triangle',
                                    symbolSize: 14,
                                    color: '#fac858'
                                }
                            ],
                            xAxis: {
                                name: 'X Coordinate',
                                type: 'value'
                            },
                            yAxis: {
                                name: 'Y Coordinate',
                                type: 'value'
                            }
                        }}
                        title="Different Symbols and Colors"
                        width="100%"
                        height={400}
                    />
                </div>
            </div>

            {/* ECharts Native Clustering */}
            <div style={{ marginBottom: '40px' }}>
                <h3>ECharts Native Clustering (ecStat)</h3>
                <p>Advanced clustering using ECharts' built-in ecStat:clustering transform</p>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Number of Clusters:
                        <input
                            type="range"
                            min="2"
                            max="10"
                            value={echartsClusterCount}
                            onChange={(e) => setEchartsClusterCount(parseInt(e.target.value))}
                            style={{ marginLeft: '8px', marginRight: '8px' }}
                        />
                        {echartsClusterCount}
                    </label>
                </div>
                <div style={{ height: '500px' }}>
                    <ClusterChart
                        data={echartsClusterData}
                        clusterCount={echartsClusterCount}
                        title={`ECharts Native Clustering (k=${echartsClusterCount})`}
                        width="100%"
                        height={500}
                        visualMapPosition="left"
                        gridLeft={120}
                        symbolSize={12}
                        itemStyle={{
                            borderColor: '#555',
                            borderWidth: 1
                        }}
                    />
                </div>
                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    <p><strong>About ECharts Native Clustering:</strong></p>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                        <li>Uses ECharts' built-in <code>ecStat:clustering</code> transform</li>
                        <li>Automatically assigns colors to clusters via visual mapping</li>
                        <li>More performant than custom implementations</li>
                        <li>Supports advanced clustering algorithms</li>
                        <li>Interactive legend shows cluster labels</li>
                    </ul>
                </div>
            </div>

            {/* ECharts Native Regression */}
            <div style={{ marginBottom: '40px' }}>
                <h3>ECharts Native Regression (ecStat)</h3>
                <p>Advanced regression analysis using ECharts' built-in ecStat:regression transform</p>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Regression Method:
                        <select
                            value={regressionMethod}
                            onChange={(e) => setRegressionMethod(e.target.value as RegressionMethod)}
                            style={{ marginLeft: '8px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="linear">Linear</option>
                            <option value="exponential">Exponential</option>
                            <option value="logarithmic">Logarithmic</option>
                            <option value="polynomial">Polynomial</option>
                        </select>
                    </label>
                </div>
                <div style={{ height: '500px' }}>
                    <RegressionChart
                        data={echartsRegressionData}
                        method={regressionMethod}
                        title={`${regressionMethod.charAt(0).toUpperCase() + regressionMethod.slice(1)} Regression Analysis`}
                        width="100%"
                        height={500}
                        scatterName="Data Points"
                        lineName={`${regressionMethod} Fit`}
                        scatterColor="#5470c6"
                        lineColor="#ee6666"
                        symbolSize={6}
                        showFormula={true}
                        formulaFontSize={14}
                        legendPosition="bottom"
                        splitLineStyle="dashed"
                    />
                </div>
                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    <p><strong>About ECharts Native Regression:</strong></p>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                        <li>Uses ECharts' built-in <code>ecStat:regression</code> transform</li>
                        <li>Supports multiple regression methods: linear, exponential, logarithmic, polynomial</li>
                        <li>Automatically calculates and displays regression equation</li>
                        <li>Interactive tooltips show regression line values</li>
                        <li>Generates appropriate data for different relationship types</li>
                        <li>More accurate than custom implementations</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}