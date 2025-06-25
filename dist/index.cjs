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
const BaseChart = (0, react.forwardRef)(({ series = [], xAxis, yAxis, title, subtitle, legend, tooltip, width = "100%", height = 400, theme = "light", loading: externalLoading = false, notMerge = false, lazyUpdate = true, onChartReady, onClick, onDoubleClick, onMouseOver, onMouseOut, onDataZoom, onBrush, className = "", style = {}, option: customOption, renderer = "canvas", locale = "en",...restProps }, ref) => {
	const echartsContainerRef = (0, react.useRef)(null);
	const chartOption = (0, react.useMemo)(() => {
		if (customOption) return customOption;
		const titleConfig = typeof title === "string" ? {
			text: title,
			subtext: subtitle
		} : title;
		return {
			title: titleConfig ? {
				left: "center",
				...titleConfig
			} : void 0,
			tooltip: tooltip ?? {
				trigger: "axis",
				axisPointer: { type: series.some((s) => s.type === "line") ? "cross" : "shadow" }
			},
			legend: legend ?? (series.length > 1 ? {
				data: series.map((s) => s.name),
				top: titleConfig ? 60 : 20
			} : void 0),
			grid: {
				left: "3%",
				right: "4%",
				bottom: "3%",
				top: titleConfig ? series.length > 1 ? 100 : 80 : series.length > 1 ? 60 : 40,
				containLabel: true
			},
			xAxis: xAxis ?? {
				type: "category",
				data: []
			},
			yAxis: yAxis ?? { type: "value" },
			series: series.map((s) => ({
				...s,
				itemStyle: s.color ? {
					color: s.color,
					...s.itemStyle
				} : s.itemStyle
			})),
			animation: true,
			animationDuration: 1e3,
			animationEasing: "cubicOut"
		};
	}, [
		series,
		xAxis,
		yAxis,
		title,
		subtitle,
		legend,
		tooltip,
		customOption
	]);
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
//#region src/components/LineChart.tsx
const LineChart = (0, react.forwardRef)(({ data, smooth = false, area = false, stack = false, symbol = true, symbolSize = 4, connectNulls = false, defaultLineStyle, defaultSymbol = "circle", xAxis,...props }, ref) => {
	const series = (0, react.useMemo)(() => data.map((item) => ({
		...item,
		type: "line",
		smooth: item.smooth ?? smooth,
		showSymbol: symbol,
		symbol: item.symbol ?? defaultSymbol,
		symbolSize: item.symbolSize ?? symbolSize,
		connectNulls: item.connectNulls ?? connectNulls,
		stack: stack ? item.stack ?? "total" : void 0,
		areaStyle: area ? item.areaStyle ?? {} : void 0,
		lineStyle: {
			...defaultLineStyle,
			...item.lineStyle
		}
	})), [
		data,
		smooth,
		area,
		stack,
		symbol,
		symbolSize,
		connectNulls,
		defaultLineStyle,
		defaultSymbol
	]);
	const defaultXAxis = (0, react.useMemo)(() => ({
		type: "category",
		boundaryGap: false,
		...xAxis
	}), [xAxis]);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BaseChart, {
		ref,
		series,
		xAxis: defaultXAxis,
		...props
	});
});
LineChart.displayName = "LineChart";

//#endregion
//#region src/components/BarChart.tsx
const BarChart = (0, react.forwardRef)(({ data, horizontal = false, stack = false, showValues = false, barWidth, barMaxWidth, xAxis, yAxis,...props }, ref) => {
	const series = (0, react.useMemo)(() => data.map((item) => ({
		...item,
		type: "bar",
		stack: stack ? item.stack ?? "total" : void 0,
		barWidth,
		barMaxWidth,
		label: showValues ? {
			show: true,
			position: horizontal ? "right" : "top",
			...item.label
		} : item.label
	})), [
		data,
		stack,
		showValues,
		horizontal,
		barWidth,
		barMaxWidth
	]);
	const defaultXAxis = (0, react.useMemo)(() => horizontal ? {
		type: "value",
		...xAxis
	} : {
		type: "category",
		...xAxis
	}, [horizontal, xAxis]);
	const defaultYAxis = (0, react.useMemo)(() => horizontal ? {
		type: "category",
		...yAxis
	} : {
		type: "value",
		...yAxis
	}, [horizontal, yAxis]);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BaseChart, {
		ref,
		series,
		xAxis: defaultXAxis,
		yAxis: defaultYAxis,
		...props
	});
});
BarChart.displayName = "BarChart";

//#endregion
//#region src/components/PieChart.tsx
const PieChart = (0, react.forwardRef)(({ data, radius = ["40%", "70%"], center = ["50%", "50%"], roseType = false, showLabels = true, showLegend = true,...props }, ref) => {
	const series = (0, react.useMemo)(() => [{
		type: "pie",
		data,
		radius,
		center,
		roseType: roseType === true ? "radius" : roseType,
		label: { show: showLabels },
		emphasis: { label: {
			show: true,
			fontSize: 14,
			fontWeight: "bold"
		} }
	}], [
		data,
		radius,
		center,
		roseType,
		showLabels
	]);
	const chartOption = (0, react.useMemo)(() => ({
		tooltip: {
			trigger: "item",
			formatter: "{a} <br/>{b}: {c} ({d}%)"
		},
		legend: showLegend ? {
			data: data.map((item) => item.name),
			top: 20
		} : void 0,
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
			title: titleConfig ? {
				top: 30,
				left: "center",
				...titleConfig
			} : void 0,
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
				barMaxWidth,
				data: processedData,
				itemStyle: seriesItem.color ? { color: seriesItem.color } : void 0,
				label: showValues ? {
					show: true,
					position: horizontal ? "right" : "top",
					formatter: showPercentage ? (params) => `${Math.round(params.value * 1e3) / 10}%` : void 0
				} : void 0
			};
		});
		const titleConfig = typeof title === "string" ? { text: title } : title;
		return {
			title: titleConfig ? {
				left: "center",
				...titleConfig
			} : void 0,
			tooltip: {
				trigger: "axis",
				axisPointer: { type: "shadow" },
				formatter: showPercentage ? (params) => {
					if (!Array.isArray(params)) return "";
					let result = `${params[0].name}<br/>`;
					for (const param of params) {
						const percentage = Math.round(param.value * 1e3) / 10;
						result += `${param.marker}${param.seriesName}: ${percentage}%<br/>`;
					}
					return result;
				} : void 0
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
				axisLabel: showPercentage ? { formatter: (value) => `${Math.round(value * 100)}%` } : void 0
			} : {
				type: "category",
				data: categories
			},
			yAxis: horizontal ? {
				type: "category",
				data: categories
			} : {
				type: "value",
				axisLabel: showPercentage ? { formatter: (value) => `${Math.round(value * 100)}%` } : void 0
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
exports.StackedBarChart = StackedBarChart;
exports.darkTheme = darkTheme;
exports.lightTheme = lightTheme;
exports.useECharts = useECharts;