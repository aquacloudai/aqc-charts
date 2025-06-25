//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion
const react = __toESM(require("react"));
const echarts = __toESM(require("echarts"));
const react_jsx_runtime = __toESM(require("react/jsx-runtime"));

//#region src/hooks/useECharts.ts
const useECharts = (containerRef, option, theme = "light", opts = {}, notMerge = false, lazyUpdate = true) => {
	const [loading, setLoading] = (0, react.useState)(true);
	const [error, setError] = (0, react.useState)(null);
	const chartRef = (0, react.useRef)(null);
	(0, react.useEffect)(() => {
		if (!containerRef.current) return;
		try {
			setLoading(true);
			setError(null);
			if (containerRef.current) echarts.dispose(containerRef.current);
			if (chartRef.current) chartRef.current = null;
			const chartInstance = echarts.init(containerRef.current, typeof theme === "string" ? theme : void 0, {
				renderer: opts.renderer ?? "canvas",
				locale: opts.locale ?? "en",
				...opts
			});
			chartRef.current = chartInstance;
			setLoading(false);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to initialize chart";
			setError(errorMessage);
			setLoading(false);
		}
		return () => {
			if (containerRef.current) echarts.dispose(containerRef.current);
			chartRef.current = null;
		};
	}, []);
	(0, react.useEffect)(() => {
		if (!chartRef.current || !option || loading) return;
		try {
			if (typeof theme === "object") {
				const themedOption = {
					backgroundColor: theme.backgroundColor,
					textStyle: theme.textStyle,
					color: theme.color,
					...option
				};
				chartRef.current.setOption(themedOption, notMerge, lazyUpdate);
			} else chartRef.current.setOption(option, notMerge, lazyUpdate);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to update chart";
			setError(errorMessage);
		}
	}, [
		option,
		theme,
		notMerge,
		lazyUpdate,
		loading
	]);
	(0, react.useEffect)(() => {
		const handleResize = () => {
			if (chartRef.current) try {
				chartRef.current.resize();
			} catch (err) {
				console.warn("Chart resize failed:", err);
			}
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	const resize = () => {
		if (chartRef.current) try {
			chartRef.current.resize();
		} catch (err) {
			console.warn("Chart resize failed:", err);
		}
	};
	const refresh = () => {
		if (chartRef.current && option) try {
			chartRef.current.setOption(option, true, false);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to refresh chart";
			setError(errorMessage);
		}
	};
	return {
		chart: chartRef.current,
		loading,
		error,
		resize,
		refresh
	};
};

//#endregion
//#region src/components/BaseChart.tsx
const BaseChart = (0, react.forwardRef)(({ title, width = "100%", height = 400, theme = "light", loading: externalLoading = false, notMerge = false, lazyUpdate = true, onChartReady, onClick, onDoubleClick, onMouseOver, onMouseOut, onDataZoom, onBrush, className = "", style = {}, option, renderer = "canvas", locale = "en",...restProps }, ref) => {
	const echartsContainerRef = (0, react.useRef)(null);
	const chartOption = (0, react.useMemo)(() => {
		if (title && typeof title === "string") return {
			...option,
			title: {
				...option.title,
				text: title,
				left: "center"
			}
		};
		return option;
	}, [option, title]);
	const { chart, loading: chartLoading, error, refresh } = useECharts(echartsContainerRef, chartOption, theme, {
		renderer,
		locale
	}, notMerge, lazyUpdate);
	(0, react.useEffect)(() => {
		if (!chart) return;
		const eventHandlers = [];
		if (onClick) {
			const handler = (params) => {
				onClick(params, chart);
			};
			chart.on("click", handler);
			eventHandlers.push(["click", handler]);
		}
		if (onDoubleClick) {
			const handler = (params) => {
				onDoubleClick(params, chart);
			};
			chart.on("dblclick", handler);
			eventHandlers.push(["dblclick", handler]);
		}
		if (onMouseOver) {
			const handler = (params) => {
				onMouseOver(params, chart);
			};
			chart.on("mouseover", handler);
			eventHandlers.push(["mouseover", handler]);
		}
		if (onMouseOut) {
			const handler = (params) => {
				onMouseOut(params, chart);
			};
			chart.on("mouseout", handler);
			eventHandlers.push(["mouseout", handler]);
		}
		if (onDataZoom) {
			const handler = (params) => {
				onDataZoom(params, chart);
			};
			chart.on("datazoom", handler);
			eventHandlers.push(["datazoom", handler]);
		}
		if (onBrush) {
			const handler = (params) => {
				onBrush(params, chart);
			};
			chart.on("brush", handler);
			eventHandlers.push(["brush", handler]);
		}
		onChartReady?.(chart);
		return () => {
			for (const [event, handler] of eventHandlers) chart.off(event, handler);
		};
	}, [
		chart,
		onClick,
		onDoubleClick,
		onMouseOver,
		onMouseOut,
		onDataZoom,
		onBrush,
		onChartReady
	]);
	(0, react.useEffect)(() => {
		if (chart) if (externalLoading) chart.showLoading();
		else chart.hideLoading();
	}, [chart, externalLoading]);
	(0, react.useImperativeHandle)(ref, () => ({
		getEChartsInstance: () => chart,
		refresh
	}), [chart, refresh]);
	const containerStyle = (0, react.useMemo)(() => ({
		width,
		height,
		position: "relative",
		...style
	}), [
		width,
		height,
		style
	]);
	if (error) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: `aqc-charts-error ${className}`,
		style: containerStyle,
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			style: {
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				height: "100%",
				color: "#ff4d4f",
				fontSize: "14px"
			},
			children: ["Error: ", error]
		})
	});
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: `aqc-charts-container ${className}`,
		style: containerStyle,
		...restProps,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			ref: echartsContainerRef,
			style: {
				width: "100%",
				height: "100%"
			}
		}), (chartLoading || externalLoading) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			className: "aqc-charts-loading",
			style: {
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "rgba(255, 255, 255, 0.8)",
				zIndex: 1e3
			},
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "aqc-charts-spinner",
				style: {
					width: "32px",
					height: "32px",
					border: "3px solid #f3f3f3",
					borderTop: "3px solid #1890ff",
					borderRadius: "50%",
					animation: "aqc-charts-spin 1s linear infinite"
				}
			})
		})]
	});
});
BaseChart.displayName = "BaseChart";

//#endregion
//#region src/utils/chartHelpers.ts
/**
* Create a basic line chart option
*/
function createLineChartOption(data) {
	const option = {
		tooltip: {
			trigger: "axis",
			axisPointer: { type: "cross" }
		},
		grid: {
			left: "3%",
			right: "4%",
			bottom: "3%",
			top: data.title ? data.series.length > 1 ? 100 : 80 : data.series.length > 1 ? 60 : 40,
			containLabel: true
		},
		xAxis: {
			type: "category",
			data: data.categories,
			boundaryGap: false
		},
		yAxis: { type: "value" },
		series: data.series.map((s) => {
			const seriesItem = {
				name: s.name,
				type: "line",
				data: s.data
			};
			if (s.color) seriesItem.itemStyle = { color: s.color };
			return seriesItem;
		})
	};
	if (data.title) option.title = {
		text: data.title,
		left: "center"
	};
	if (data.series.length > 1) option.legend = {
		data: data.series.map((s) => s.name),
		top: data.title ? 60 : 20
	};
	return option;
}
/**
* Create a basic bar chart option
*/
function createBarChartOption(data) {
	const option = {
		tooltip: {
			trigger: "axis",
			axisPointer: { type: "shadow" }
		},
		grid: {
			left: "3%",
			right: "4%",
			bottom: "3%",
			top: data.title ? data.series.length > 1 ? 100 : 80 : data.series.length > 1 ? 60 : 40,
			containLabel: true
		},
		xAxis: {
			type: "category",
			data: data.categories
		},
		yAxis: { type: "value" },
		series: data.series.map((s) => {
			const seriesItem = {
				name: s.name,
				type: "bar",
				data: s.data
			};
			if (s.color) seriesItem.itemStyle = { color: s.color };
			return seriesItem;
		})
	};
	if (data.title) option.title = {
		text: data.title,
		left: "center"
	};
	if (data.series.length > 1) option.legend = {
		data: data.series.map((s) => s.name),
		top: data.title ? 60 : 20
	};
	return option;
}
/**
* Create a basic sankey chart option
*/
function createSankeyChartOption(data) {
	const option = {
		tooltip: {
			trigger: "item",
			triggerOn: "mousemove"
		},
		series: [{
			type: "sankey",
			layout: data.layout || "none",
			orient: data.orient || "horizontal",
			nodeAlign: data.nodeAlign || "justify",
			nodeGap: data.nodeGap || 8,
			nodeWidth: data.nodeWidth || 20,
			iterations: data.iterations || 32,
			emphasis: { focus: "adjacency" },
			data: data.nodes.map((node) => {
				const result = { name: node.name };
				if (node.value !== void 0) result.value = node.value;
				if (node.depth !== void 0) result.depth = node.depth;
				if (node.itemStyle) result.itemStyle = node.itemStyle;
				if (node.label) result.label = node.label;
				if (node.emphasis) result.emphasis = node.emphasis;
				return result;
			}),
			links: data.links.map((link) => {
				const result = {
					source: link.source,
					target: link.target,
					value: link.value
				};
				if (link.lineStyle) result.lineStyle = link.lineStyle;
				if (link.emphasis) result.emphasis = link.emphasis;
				return result;
			})
		}]
	};
	if (data.title) option.title = {
		text: data.title,
		left: "center"
	};
	return option;
}
/**
* Merge ECharts options (simple deep merge)
*/
function mergeOptions(base, override) {
	const result = { ...base };
	for (const key in override) {
		const overrideValue = override[key];
		const baseValue = result[key];
		if (overrideValue !== void 0) if (typeof overrideValue === "object" && overrideValue !== null && !Array.isArray(overrideValue) && typeof baseValue === "object" && baseValue !== null && !Array.isArray(baseValue)) result[key] = {
			...baseValue,
			...overrideValue
		};
		else result[key] = overrideValue;
	}
	return result;
}

//#endregion
//#region src/components/LineChart.tsx
const LineChart = (0, react.forwardRef)(({ data, smooth = false, area = false, stack = false, symbol = true, symbolSize = 4, connectNulls = false, title, option: customOption, series: customSeries,...props }, ref) => {
	const chartOption = (0, react.useMemo)(() => {
		if (customSeries) return {
			xAxis: {
				type: "category",
				data: data?.categories || []
			},
			yAxis: { type: "value" },
			series: customSeries,
			...title && { title: {
				text: title,
				left: "center"
			} },
			...customOption && customOption
		};
		if (!data?.series || !Array.isArray(data.series)) return { series: [] };
		const baseOption = createLineChartOption({
			categories: data.categories,
			series: data.series.map((s) => ({
				name: s.name,
				data: s.data,
				...s.color && { color: s.color },
				...Object.fromEntries(Object.entries(s).filter(([key]) => ![
					"name",
					"data",
					"color"
				].includes(key)))
			})),
			...title && { title }
		});
		if (baseOption.series && Array.isArray(baseOption.series)) baseOption.series = baseOption.series.map((series, index) => {
			const result = {
				...series,
				smooth: data.series[index]?.smooth ?? smooth,
				showSymbol: symbol,
				symbolSize: data.series[index]?.symbolSize ?? symbolSize,
				connectNulls: data.series[index]?.connectNulls ?? connectNulls
			};
			if (data.series[index]?.symbol) result.symbol = data.series[index].symbol;
			if (stack && data.series[index]?.stack) result.stack = data.series[index].stack;
			else if (stack) result.stack = "total";
			if (area) result.areaStyle = {};
			return result;
		});
		return customOption ? mergeOptions(baseOption, customOption) : baseOption;
	}, [
		data,
		smooth,
		area,
		stack,
		symbol,
		symbolSize,
		connectNulls,
		title,
		customOption,
		customSeries
	]);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BaseChart, {
		ref,
		option: chartOption,
		...props
	});
});
LineChart.displayName = "LineChart";

//#endregion
//#region src/components/BarChart.tsx
const BarChart = (0, react.forwardRef)(({ data, horizontal = false, stack = false, showValues = false, barWidth, barMaxWidth, title, option: customOption, series: customSeries,...props }, ref) => {
	const chartOption = (0, react.useMemo)(() => {
		if (customSeries) return {
			xAxis: horizontal ? { type: "value" } : {
				type: "category",
				data: data?.categories || []
			},
			yAxis: horizontal ? {
				type: "category",
				data: data?.categories || []
			} : { type: "value" },
			series: customSeries,
			...title && { title: {
				text: title,
				left: "center"
			} },
			...customOption && customOption
		};
		if (!data?.series || !Array.isArray(data.series)) return { series: [] };
		const baseOption = createBarChartOption({
			categories: data.categories,
			series: data.series.map((s) => ({
				name: s.name,
				data: s.data,
				...s.color && { color: s.color }
			})),
			...title && { title }
		});
		if (baseOption.series && Array.isArray(baseOption.series)) baseOption.series = baseOption.series.map((series) => {
			const result = {
				...series,
				stack: stack ? "total" : void 0,
				...barWidth && { barWidth },
				...barMaxWidth && { barMaxWidth }
			};
			if (showValues) result.label = {
				show: true,
				position: horizontal ? "right" : "top"
			};
			return result;
		});
		if (horizontal) {
			baseOption.xAxis = { type: "value" };
			baseOption.yAxis = {
				type: "category",
				data: data.categories
			};
		}
		return customOption ? mergeOptions(baseOption, customOption) : baseOption;
	}, [
		data,
		horizontal,
		stack,
		showValues,
		barWidth,
		barMaxWidth,
		title,
		customOption,
		customSeries
	]);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BaseChart, {
		ref,
		option: chartOption,
		...props
	});
});
BarChart.displayName = "BarChart";

//#endregion
//#region src/components/PieChart.tsx
const PieChart = (0, react.forwardRef)(({ data, radius = ["40%", "70%"], center = ["50%", "50%"], roseType = false, showLabels = true, showLegend = true, series: customSeries,...props }, ref) => {
	const series = (0, react.useMemo)(() => {
		if (customSeries) return customSeries;
		return [{
			type: "pie",
			data: [...data],
			radius,
			center: [...center],
			...roseType && { roseType: roseType === true ? "radius" : roseType },
			label: { show: showLabels },
			emphasis: { label: {
				show: true,
				fontSize: 14,
				fontWeight: "bold"
			} }
		}];
	}, [
		data,
		radius,
		center,
		roseType,
		showLabels,
		customSeries
	]);
	const chartOption = (0, react.useMemo)(() => ({
		tooltip: {
			trigger: "item",
			formatter: "{a} <br/>{b}: {c} ({d}%)"
		},
		...showLegend && { legend: {
			data: data.map((item) => item.name),
			top: 20
		} },
		series
	}), [
		series,
		showLegend,
		data
	]);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BaseChart, {
		ref,
		option: chartOption,
		...props
	});
});
PieChart.displayName = "PieChart";

//#endregion
//#region src/components/CalendarHeatmapChart.tsx
const CalendarHeatmapChart = (0, react.forwardRef)(({ data, year, calendar = {}, visualMap = {}, tooltipFormatter, title,...props }, ref) => {
	const chartOption = (0, react.useMemo)(() => {
		const seriesData = data.map((item) => [item.date, item.value]);
		const values = data.map((item) => item.value);
		const minValue = Math.min(...values);
		const maxValue = Math.max(...values);
		const titleConfig = typeof title === "string" ? { text: title } : title;
		return {
			...titleConfig && { title: {
				top: 30,
				left: "center",
				...titleConfig
			} },
			tooltip: { formatter: tooltipFormatter ? (params) => {
				return tooltipFormatter(params);
			} : (params) => {
				const [date, value] = params.value;
				return `${date}<br/>Value: ${value}`;
			} },
			visualMap: {
				min: minValue,
				max: maxValue,
				type: "piecewise",
				orient: "horizontal",
				left: "center",
				top: titleConfig ? 65 : 35,
				inRange: { color: [
					"#ebedf0",
					"#c6e48b",
					"#7bc96f",
					"#239a3b",
					"#196127"
				] },
				...visualMap
			},
			calendar: {
				top: titleConfig ? 120 : 90,
				left: 30,
				right: 30,
				cellSize: ["auto", 13],
				range: year.toString(),
				itemStyle: {
					borderWidth: .5,
					borderColor: "#fff"
				},
				yearLabel: { show: false },
				dayLabel: {
					firstDay: 1,
					nameMap: [
						"S",
						"M",
						"T",
						"W",
						"T",
						"F",
						"S"
					]
				},
				monthLabel: { nameMap: "en" },
				...calendar
			},
			series: {
				type: "heatmap",
				coordinateSystem: "calendar",
				data: seriesData
			}
		};
	}, [
		data,
		year,
		calendar,
		visualMap,
		tooltipFormatter,
		title
	]);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BaseChart, {
		ref,
		option: chartOption,
		...props
	});
});
CalendarHeatmapChart.displayName = "CalendarHeatmapChart";

//#endregion
//#region src/components/StackedBarChart.tsx
const StackedBarChart = (0, react.forwardRef)(({ data, horizontal = false, showPercentage = false, showValues = false, barWidth = "60%", barMaxWidth, stackName = "total", grid, legendSelectable = true, title,...props }, ref) => {
	const chartOption = (0, react.useMemo)(() => {
		const { categories, series: rawSeries } = data;
		const totalData = [];
		if (showPercentage) for (let i = 0; i < categories.length; i++) {
			let sum = 0;
			for (const seriesItem of rawSeries) sum += seriesItem.data[i] || 0;
			totalData.push(sum);
		}
		const series = rawSeries.map((seriesItem) => {
			const processedData = showPercentage ? seriesItem.data.map((value, index) => {
				const total = totalData[index];
				return total === void 0 || total <= 0 ? 0 : value / total;
			}) : seriesItem.data;
			return {
				name: seriesItem.name,
				type: "bar",
				stack: stackName,
				barWidth,
				...barMaxWidth && { barMaxWidth },
				data: [...processedData],
				...seriesItem.color && { itemStyle: { color: seriesItem.color } },
				...showValues && { label: {
					show: true,
					position: horizontal ? "right" : "top",
					...showPercentage && { formatter: (params) => `${Math.round(params.value * 1e3) / 10}%` }
				} }
			};
		});
		const titleConfig = typeof title === "string" ? { text: title } : title;
		return {
			...titleConfig && { title: {
				left: "center",
				...titleConfig
			} },
			tooltip: {
				trigger: "axis",
				axisPointer: { type: "shadow" },
				...showPercentage && { formatter: (params) => {
					if (!Array.isArray(params)) return "";
					let result = `${params[0].name}<br/>`;
					for (const param of params) {
						const percentage = Math.round(param.value * 1e3) / 10;
						result += `${param.marker}${param.seriesName}: ${percentage}%<br/>`;
					}
					return result;
				} }
			},
			legend: {
				selectedMode: legendSelectable ? "multiple" : false,
				top: titleConfig ? 40 : 20
			},
			grid: {
				left: 100,
				right: 100,
				top: titleConfig ? 80 : 60,
				bottom: 50,
				...grid
			},
			xAxis: horizontal ? {
				type: "value",
				...showPercentage && { axisLabel: { formatter: (value) => `${Math.round(value * 100)}%` } }
			} : {
				type: "category",
				data: categories
			},
			yAxis: horizontal ? {
				type: "category",
				data: categories
			} : {
				type: "value",
				...showPercentage && { axisLabel: { formatter: (value) => `${Math.round(value * 100)}%` } }
			},
			series
		};
	}, [
		data,
		horizontal,
		showPercentage,
		showValues,
		barWidth,
		barMaxWidth,
		stackName,
		grid,
		legendSelectable,
		title
	]);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BaseChart, {
		ref,
		option: chartOption,
		...props
	});
});
StackedBarChart.displayName = "StackedBarChart";

//#endregion
//#region src/components/SankeyChart.tsx
const SankeyChart = (0, react.forwardRef)(({ data, layout = "none", orient = "horizontal", nodeAlign = "justify", nodeGap = 8, nodeWidth = 20, iterations = 32, title, option: customOption,...props }, ref) => {
	const chartOption = (0, react.useMemo)(() => {
		if (!data?.nodes || !data?.links || !Array.isArray(data.nodes) || !Array.isArray(data.links)) return { series: [] };
		const baseOption = createSankeyChartOption({
			nodes: data.nodes,
			links: data.links,
			layout,
			orient,
			nodeAlign,
			nodeGap,
			nodeWidth,
			iterations,
			...title && { title }
		});
		return customOption ? mergeOptions(baseOption, customOption) : baseOption;
	}, [
		data,
		layout,
		orient,
		nodeAlign,
		nodeGap,
		nodeWidth,
		iterations,
		title,
		customOption
	]);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BaseChart, {
		ref,
		option: chartOption,
		...props
	});
});
SankeyChart.displayName = "SankeyChart";

//#endregion
//#region src/utils/themes.ts
const lightTheme = {
	backgroundColor: "#ffffff",
	textStyle: { color: "#333333" },
	color: [
		"#5470c6",
		"#91cc75",
		"#fac858",
		"#ee6666",
		"#73c0de",
		"#3ba272",
		"#fc8452",
		"#9a60b4",
		"#ea7ccc"
	]
};
const darkTheme = {
	backgroundColor: "#1f1f1f",
	textStyle: { color: "#ffffff" },
	title: { textStyle: { color: "#ffffff" } },
	legend: { textStyle: { color: "#ffffff" } },
	color: [
		"#5470c6",
		"#91cc75",
		"#fac858",
		"#ee6666",
		"#73c0de",
		"#3ba272",
		"#fc8452",
		"#9a60b4",
		"#ea7ccc"
	]
};

//#endregion
//#region src/index.ts
if (typeof document !== "undefined" && !document.getElementById("aqc-charts-styles")) {
	const style = document.createElement("style");
	style.id = "aqc-charts-styles";
	style.textContent = `
    @keyframes aqc-charts-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .aqc-charts-container {
      box-sizing: border-box;
    }
    
    .aqc-charts-loading {
      backdrop-filter: blur(2px);
    }
    
    .aqc-charts-error {
      border: 1px dashed #ff4d4f;
      border-radius: 4px;
    }
  `;
	document.head.appendChild(style);
}

//#endregion
exports.BarChart = BarChart;
exports.BaseChart = BaseChart;
exports.CalendarHeatmapChart = CalendarHeatmapChart;
exports.LineChart = LineChart;
exports.PieChart = PieChart;
exports.SankeyChart = SankeyChart;
exports.StackedBarChart = StackedBarChart;
exports.darkTheme = darkTheme;
exports.lightTheme = lightTheme;
exports.useECharts = useECharts;