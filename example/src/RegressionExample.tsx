import React, { useState, useMemo } from 'react';
import { RegressionChart } from 'aqc-charts';
import type { RegressionChartData, RegressionMethod } from 'aqc-charts';

export function RegressionExample() {
    const [selectedMethod, setSelectedMethod] = useState<RegressionMethod>('linear');
    const [showFormula, setShowFormula] = useState(true);
    const [datasetType, setDatasetType] = useState<'clean' | 'noisy' | 'custom'>('clean');

    // Generate different datasets for demonstration
    const datasets = useMemo(() => {
        const cleanLinear: RegressionChartData = {
            data: Array.from({ length: 20 }, (_, i) => ({
                value: [i + 1, 2 * i + 5] as [number, number],
                name: `Point ${i + 1}`
            })),
            xAxis: { name: 'X Values', type: 'value' },
            yAxis: { name: 'Y Values', type: 'value' }
        };

        const noisyLinear: RegressionChartData = {
            data: Array.from({ length: 30 }, (_, i) => ({
                value: [
                    i + 1, 
                    2 * i + 5 + (Math.random() - 0.5) * 10
                ] as [number, number],
                name: `Point ${i + 1}`
            })),
            xAxis: { name: 'X Values', type: 'value' },
            yAxis: { name: 'Y Values', type: 'value' }
        };

        const exponentialData: RegressionChartData = {
            data: Array.from({ length: 25 }, (_, i) => ({
                value: [
                    i * 0.3, 
                    Math.exp(i * 0.15) + (Math.random() - 0.5) * 2
                ] as [number, number],
                name: `Point ${i + 1}`
            })),
            xAxis: { name: 'Time', type: 'value' },
            yAxis: { name: 'Growth', type: 'value' }
        };

        const logarithmicData: RegressionChartData = {
            data: Array.from({ length: 30 }, (_, i) => ({
                value: [
                    (i + 1) * 2, 
                    5 * Math.log(i + 1) + 10 + (Math.random() - 0.5) * 3
                ] as [number, number],
                name: `Point ${i + 1}`
            })),
            xAxis: { name: 'Input', type: 'value' },
            yAxis: { name: 'Output', type: 'value' }
        };

        const polynomialData: RegressionChartData = {
            data: Array.from({ length: 25 }, (_, i) => ({
                value: [
                    (i - 12) * 0.5, 
                    0.2 * Math.pow(i - 12, 2) + (i - 12) + 15 + (Math.random() - 0.5) * 5
                ] as [number, number],
                name: `Point ${i + 1}`
            })),
            xAxis: { name: 'X Values', type: 'value' },
            yAxis: { name: 'Y Values', type: 'value' }
        };

        return { cleanLinear, noisyLinear, exponentialData, logarithmicData, polynomialData };
    }, []);

    // Select appropriate dataset based on method and type
    const currentData = useMemo(() => {
        if (datasetType === 'custom') {
            switch (selectedMethod) {
                case 'exponential': return datasets.exponentialData;
                case 'logarithmic': return datasets.logarithmicData;
                case 'polynomial': return datasets.polynomialData;
                default: return datasets.cleanLinear;
            }
        }
        return datasetType === 'clean' ? datasets.cleanLinear : datasets.noisyLinear;
    }, [selectedMethod, datasetType, datasets]);

    const regressionMethods: { value: RegressionMethod; label: string; description: string }[] = [
        { 
            value: 'linear', 
            label: 'Linear Regression', 
            description: 'Best fit straight line through data points (y = mx + b)' 
        },
        { 
            value: 'exponential', 
            label: 'Exponential Regression', 
            description: 'Exponential growth/decay curve (y = ae^(bx))' 
        },
        { 
            value: 'logarithmic', 
            label: 'Logarithmic Regression', 
            description: 'Logarithmic curve fit (y = a*ln(x) + b)' 
        },
        { 
            value: 'polynomial', 
            label: 'Polynomial Regression', 
            description: 'Polynomial curve fit (y = ax² + bx + c)' 
        }
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h2>Regression Analysis Examples</h2>
            <p>Explore different types of regression analysis using ECharts' native ecStat:regression transform</p>

            {/* Controls */}
            <div style={{ 
                marginBottom: '30px', 
                padding: '20px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
            }}>
                <div style={{ display: 'flex', gap: '30px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div>
                        <label style={{ fontWeight: 'bold', marginRight: '10px' }}>
                            Regression Method:
                        </label>
                        <select
                            value={selectedMethod}
                            onChange={(e) => setSelectedMethod(e.target.value as RegressionMethod)}
                            style={{ 
                                padding: '8px 12px', 
                                borderRadius: '4px', 
                                border: '1px solid #ccc',
                                fontSize: '14px'
                            }}
                        >
                            {regressionMethods.map(method => (
                                <option key={method.value} value={method.value}>
                                    {method.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ fontWeight: 'bold', marginRight: '10px' }}>
                            Dataset:
                        </label>
                        <select
                            value={datasetType}
                            onChange={(e) => setDatasetType(e.target.value as 'clean' | 'noisy' | 'custom')}
                            style={{ 
                                padding: '8px 12px', 
                                borderRadius: '4px', 
                                border: '1px solid #ccc',
                                fontSize: '14px'
                            }}
                        >
                            <option value="clean">Clean Linear Data</option>
                            <option value="noisy">Noisy Linear Data</option>
                            <option value="custom">Method-Specific Data</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                            <input
                                type="checkbox"
                                checked={showFormula}
                                onChange={(e) => setShowFormula(e.target.checked)}
                            />
                            Show Equation
                        </label>
                    </div>
                </div>

                <div style={{ 
                    padding: '12px', 
                    backgroundColor: '#e3f2fd', 
                    borderRadius: '4px',
                    fontSize: '14px'
                }}>
                    <strong>{regressionMethods.find(m => m.value === selectedMethod)?.label}:</strong>{' '}
                    {regressionMethods.find(m => m.value === selectedMethod)?.description}
                </div>
            </div>

            {/* Main Chart */}
            <div style={{ marginBottom: '40px' }}>
                <h3>Interactive Regression Analysis</h3>
                <div style={{ height: '500px' }}>
                    <RegressionChart
                        data={currentData}
                        method={selectedMethod}
                        title={`${regressionMethods.find(m => m.value === selectedMethod)?.label} - ${datasetType.charAt(0).toUpperCase() + datasetType.slice(1)} Data`}
                        width="100%"
                        height={500}
                        scatterName="Data Points"
                        lineName={`${selectedMethod} Fit`}
                        scatterColor="#1890ff"
                        lineColor="#ff4d4f"
                        symbolSize={8}
                        showFormula={showFormula}
                        formulaFontSize={16}
                        formulaPosition={{ dx: -30 }}
                        legendPosition="bottom"
                        splitLineStyle="dashed"
                    />
                </div>
            </div>

            {/* Method Comparison Grid */}
            <div style={{ marginBottom: '40px' }}>
                <h3>Method Comparison</h3>
                <p>Compare how different regression methods fit the same dataset</p>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: '20px',
                    marginTop: '20px'
                }}>
                    {regressionMethods.map(method => (
                        <div key={method.value} style={{ 
                            border: '1px solid #e0e0e0', 
                            borderRadius: '8px',
                            overflow: 'hidden'
                        }}>
                            <div style={{ 
                                padding: '15px', 
                                backgroundColor: '#f5f5f5',
                                borderBottom: '1px solid #e0e0e0'
                            }}>
                                <h4 style={{ margin: 0, fontSize: '16px' }}>{method.label}</h4>
                                <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
                                    {method.description}
                                </p>
                            </div>
                            <div style={{ height: '300px' }}>
                                <RegressionChart
                                    data={datasets.noisyLinear}
                                    method={method.value}
                                    width="100%"
                                    height={300}
                                    scatterName="Data"
                                    lineName="Fit"
                                    scatterColor="#52c41a"
                                    lineColor="#722ed1"
                                    symbolSize={6}
                                    showFormula={true}
                                    formulaFontSize={12}
                                    legendPosition="top"
                                    splitLineStyle="solid"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Information Panel */}
            <div style={{ 
                padding: '20px', 
                backgroundColor: '#f6ffed', 
                border: '1px solid #b7eb8f',
                borderRadius: '8px'
            }}>
                <h3 style={{ color: '#389e0d', marginTop: 0 }}>About ECharts Native Regression</h3>
                <ul style={{ color: '#389e0d', lineHeight: '1.6' }}>
                    <li><strong>Powered by ecStat:</strong> Uses the official ECharts statistical extension</li>
                    <li><strong>Multiple Methods:</strong> Supports linear, exponential, logarithmic, and polynomial regression</li>
                    <li><strong>Automatic Calculations:</strong> Computes regression equations and R² values automatically</li>
                    <li><strong>Interactive:</strong> Hover over the regression line to see calculated values</li>
                    <li><strong>Customizable:</strong> Full control over styling, colors, and formula display</li>
                    <li><strong>Performance:</strong> Optimized for real-time analysis of large datasets</li>
                    <li><strong>Standards Compliant:</strong> Uses industry-standard statistical algorithms</li>
                </ul>
            </div>
        </div>
    );
}