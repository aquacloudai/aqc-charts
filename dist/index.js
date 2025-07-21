import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";

//#region src/utils/EChartsLoader.ts
let loadingPromise = null;
let isLoaded = false;
/**
* Load ECharts dynamically from CDN
*/
async function loadECharts(options = {}) {
	if (isLoaded && window.echarts && window.ecStat) return window.echarts;
	if (loadingPromise) return loadingPromise;
	const { version = "5.6.0" } = options;
	loadingPromise = new Promise((resolve, reject) => {
		if (window.echarts && window.ecStat) {
			isLoaded = true;
			resolve(window.echarts);
			return;
		}
		let scriptsLoaded = 0;
		const totalScripts = 2;
		let hasError = false;
		const onScriptLoad = () => {
			scriptsLoaded++;
			if (scriptsLoaded === totalScripts && !hasError) if (window.echarts && window.ecStat) try {
				window.echarts.registerTransform(window.ecStat.transform.clustering);
				window.echarts.registerTransform(window.ecStat.transform.regression);
				window.echarts.registerTransform(window.ecStat.transform.histogram);
				isLoaded = true;
				resolve(window.echarts);
			} catch (error) {
				reject(new Error("Failed to register ecStat transforms"));
			}
			else reject(new Error("ECharts or ecStat failed to load properly"));
		};
		const onScriptError = (scriptName) => {
			if (!hasError) {
				hasError = true;
				reject(new Error(`Failed to load ${scriptName} from CDN`));
			}
		};
		const echartsScript = document.createElement("script");
		echartsScript.src = `https://cdn.jsdelivr.net/npm/echarts@${version}/dist/echarts.min.js`;
		echartsScript.async = true;
		echartsScript.onload = onScriptLoad;
		echartsScript.onerror = () => onScriptError("ECharts");
		document.head.appendChild(echartsScript);
		const ecStatScript = document.createElement("script");
		ecStatScript.src = "https://cdn.jsdelivr.net/npm/echarts-stat@1.2.0/dist/ecStat.min.js";
		ecStatScript.async = true;
		ecStatScript.onload = onScriptLoad;
		ecStatScript.onerror = () => onScriptError("ecStat");
		document.head.appendChild(ecStatScript);
	});
	return loadingPromise;
}

//#endregion
//#region src/hooks/echarts/useChartInstance.ts
function useChartInstance({ containerRef, onChartReady }) {
	const chartRef = useRef(null);
	const [isInitialized, setIsInitialized] = useState(false);
	const [error, setError] = useState(null);
	const disposeChart = useCallback(() => {
		if (chartRef.current) {
			chartRef.current.dispose();
			chartRef.current = null;
			setIsInitialized(false);
		}
	}, []);
	const initChart = useCallback(async () => {
		if (!containerRef.current) return;
		try {
			const echarts = await loadECharts();
			disposeChart();
			const chart = echarts.init(containerRef.current, void 0, {
				renderer: "canvas",
				useDirtyRect: true
			});
			chartRef.current = chart;
			setIsInitialized(true);
			setError(null);
			onChartReady?.(chart);
		} catch (err) {
			const error$1 = err instanceof Error ? err : new Error("Failed to initialize chart");
			setError(error$1);
			setIsInitialized(false);
			console.error("Failed to initialize ECharts:", error$1);
		}
	}, [
		containerRef,
		onChartReady,
		disposeChart
	]);
	useEffect(() => {
		if (containerRef.current) initChart();
		return () => {
			disposeChart();
		};
	}, [initChart, disposeChart]);
	return {
		chartInstance: chartRef.current,
		isInitialized,
		error,
		initChart,
		disposeChart
	};
}

//#endregion
//#region src/hooks/echarts/useChartResize.ts
function useChartResize({ chartInstance, containerRef, debounceMs = 100 }) {
	const resizeTimeoutRef = useRef(void 0);
	const handleResize = useCallback(() => {
		if (resizeTimeoutRef.current !== void 0) clearTimeout(resizeTimeoutRef.current);
		resizeTimeoutRef.current = setTimeout(() => {
			if (chartInstance) try {
				chartInstance.resize();
			} catch (error) {
				console.warn("Failed to resize chart:", error);
			}
		}, debounceMs);
	}, [chartInstance, debounceMs]);
	useEffect(() => {
		if (!containerRef.current || !chartInstance) return;
		const resizeObserver = new ResizeObserver(handleResize);
		resizeObserver.observe(containerRef.current);
		window.addEventListener("resize", handleResize);
		return () => {
			resizeObserver.disconnect();
			window.removeEventListener("resize", handleResize);
			if (resizeTimeoutRef.current !== void 0) clearTimeout(resizeTimeoutRef.current);
		};
	}, [
		containerRef,
		chartInstance,
		handleResize
	]);
	return { resize: handleResize };
}

//#endregion
//#region src/hooks/echarts/useChartOptions.ts
function deepEqual(a, b) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (typeof a !== typeof b) return false;
	if (typeof a !== "object") return false;
	const keysA = Object.keys(a);
	const keysB = Object.keys(b);
	if (keysA.length !== keysB.length) return false;
	for (const key of keysA) {
		if (!keysB.includes(key)) return false;
		if (!deepEqual(a[key], b[key])) return false;
	}
	return true;
}
function useChartOptions({ chartInstance, option, theme, notMerge = true, lazyUpdate = true }) {
	const lastChartInstanceRef = useRef(null);
	const lastOptionRef = useRef(null);
	useEffect(() => {
		if (!chartInstance || !option) return;
		const isNewChartInstance = lastChartInstanceRef.current !== chartInstance;
		const hasOptionChanged = !deepEqual(lastOptionRef.current, option);
		if (isNewChartInstance) lastChartInstanceRef.current = chartInstance;
		if (isNewChartInstance || hasOptionChanged) {
			lastOptionRef.current = option;
			try {
				chartInstance.setOption(option, {
					notMerge: isNewChartInstance ? true : notMerge,
					lazyUpdate
				});
			} catch (error) {
				console.error("Failed to set chart options:", error);
			}
		}
	}, [
		chartInstance,
		option,
		notMerge,
		lazyUpdate
	]);
	useEffect(() => {
		if (!chartInstance || !theme) return;
		if (typeof theme === "object") try {
			const currentOption = chartInstance.getOption();
			if (currentOption && typeof currentOption === "object") {
				const themedOption = {
					...currentOption,
					...theme
				};
				chartInstance.setOption(themedOption, { notMerge: true });
			}
		} catch (error) {
			console.error("Failed to apply theme:", error);
		}
	}, [chartInstance, theme]);
}

//#endregion
//#region src/hooks/echarts/useChartEvents.ts
function useChartEvents({ chartInstance, events = {} }) {
	const handlersRef = useRef(new Map());
	useEffect(() => {
		if (!chartInstance) return;
		handlersRef.current.forEach((handler, eventName) => {
			chartInstance.off(eventName, handler);
		});
		handlersRef.current.clear();
		Object.entries(events).forEach(([eventName, handler]) => {
			const wrappedHandler = (params) => {
				handler(params, chartInstance);
			};
			handlersRef.current.set(eventName, wrappedHandler);
			chartInstance.on(eventName, wrappedHandler);
		});
		return () => {
			handlersRef.current.forEach((handler, eventName) => {
				chartInstance.off(eventName, handler);
			});
			handlersRef.current.clear();
		};
	}, [chartInstance, events]);
}

//#endregion
//#region src/hooks/useECharts.ts
function useECharts({ option, theme, loading: externalLoading = false, notMerge = false, lazyUpdate = true, onChartReady, events, debounceResize = 100 }) {
	const containerRef = useRef(null);
	const { chartInstance, isInitialized, error, disposeChart } = useChartInstance({
		containerRef,
		onChartReady
	});
	const { resize } = useChartResize({
		chartInstance,
		containerRef,
		debounceMs: debounceResize
	});
	useChartOptions({
		chartInstance,
		option,
		theme,
		notMerge,
		lazyUpdate
	});
	useChartEvents({
		chartInstance,
		events: events || {}
	});
	const isLoading = useMemo(() => {
		return !isInitialized || externalLoading;
	}, [isInitialized, externalLoading]);
	const showLoading = useCallback(() => {
		if (chartInstance && isInitialized) chartInstance.showLoading("default", {
			text: "Loading...",
			color: "#1890ff",
			textColor: "#000",
			maskColor: "rgba(255, 255, 255, 0.8)",
			zlevel: 0
		});
	}, [chartInstance, isInitialized]);
	const hideLoading = useCallback(() => {
		if (chartInstance && isInitialized) chartInstance.hideLoading();
	}, [chartInstance, isInitialized]);
	useEffect(() => {
		if (externalLoading) showLoading();
		else hideLoading();
	}, [
		externalLoading,
		showLoading,
		hideLoading
	]);
	const getEChartsInstance = useCallback(() => {
		return chartInstance;
	}, [chartInstance]);
	const refresh = useCallback(() => {
		if (chartInstance && option) {
			chartInstance.clear();
			chartInstance.setOption(option, { notMerge: true });
		}
	}, [chartInstance, option]);
	const clear = useCallback(() => {
		if (chartInstance) chartInstance.clear();
	}, [chartInstance]);
	return {
		containerRef,
		loading: isLoading,
		error,
		resize,
		refresh,
		clear,
		getEChartsInstance,
		showLoading,
		hideLoading,
		dispose: disposeChart
	};
}

//#endregion
//#region src/components/BaseChart.tsx
const BaseChart = forwardRef(({ title, width = "100%", height = 400, theme = "light", loading: externalLoading = false, notMerge = false, lazyUpdate = true, onChartReady, onClick, onDoubleClick, onMouseOver, onMouseOut, onDataZoom, onBrush, className = "", style = {}, option, renderer = "canvas", locale = "en",...restProps }, ref) => {
	const chartOption = useMemo(() => {
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
	const { containerRef: echartsContainerRefFromHook, loading: chartLoading, error, refresh, getEChartsInstance, clear, resize: resizeChart, showLoading: showChartLoading, hideLoading: hideChartLoading, dispose } = useECharts({
		option: chartOption,
		theme,
		notMerge,
		lazyUpdate,
		onChartReady
	});
	const chart = getEChartsInstance();
	useEffect(() => {
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
	useEffect(() => {
		if (chart) if (externalLoading) chart.showLoading();
		else chart.hideLoading();
	}, [chart, externalLoading]);
	useImperativeHandle(ref, () => ({
		getEChartsInstance,
		refresh,
		clear,
		resize: resizeChart,
		showLoading: showChartLoading,
		hideLoading: hideChartLoading,
		dispose
	}), [
		getEChartsInstance,
		refresh,
		clear,
		resizeChart,
		showChartLoading,
		hideChartLoading,
		dispose
	]);
	const containerStyle = useMemo(() => ({
		width,
		height,
		position: "relative",
		...style
	}), [
		width,
		height,
		style
	]);
	if (error) return /* @__PURE__ */ jsx("div", {
		className: `aqc-charts-error ${className}`,
		style: containerStyle,
		children: /* @__PURE__ */ jsxs("div", {
			style: {
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				height: "100%",
				color: "#ff4d4f",
				fontSize: "14px"
			},
			children: ["Error: ", error?.message || "Unknown error"]
		})
	});
	return /* @__PURE__ */ jsxs("div", {
		className: `aqc-charts-container ${className}`,
		style: containerStyle,
		...restProps,
		children: [/* @__PURE__ */ jsx("div", {
			ref: echartsContainerRefFromHook,
			style: {
				width: "100%",
				height: "100%"
			}
		}), (chartLoading || externalLoading) && /* @__PURE__ */ jsx("div", {
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
			children: /* @__PURE__ */ jsx("div", {
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
//#region src/utils/ergonomic.ts
const COLOR_PALETTES = {
	default: [
		"#5470c6",
		"#91cc75",
		"#fac858",
		"#ee6666",
		"#73c0de",
		"#3ba272",
		"#fc8452",
		"#9a60b4",
		"#ea7ccc"
	],
	vibrant: [
		"#FF6B6B",
		"#4ECDC4",
		"#45B7D1",
		"#96CEB4",
		"#FFEAA7",
		"#DDA0DD",
		"#98D8C8",
		"#F7DC6F",
		"#BB8FCE"
	],
	pastel: [
		"#FFB3BA",
		"#BAFFC9",
		"#BAE1FF",
		"#FFFFBA",
		"#FFD9BA",
		"#E6E6FA",
		"#D3FFD3",
		"#FFCCFF",
		"#FFEFD5"
	],
	business: [
		"#2E4057",
		"#048A81",
		"#54C6EB",
		"#F8B500",
		"#B83A4B",
		"#5C7A89",
		"#A8E6CF",
		"#FFB6B3",
		"#C7CEEA"
	],
	earth: [
		"#8B4513",
		"#228B22",
		"#4682B4",
		"#DAA520",
		"#CD853F",
		"#32CD32",
		"#6495ED",
		"#FF8C00",
		"#9ACD32"
	]
};
function isObjectData(data) {
	return data.length > 0 && typeof data[0] === "object" && !Array.isArray(data[0]);
}
function extractUniqueValues(data, field) {
	return [...new Set(data.map((item) => item[field]).filter((val) => val != null))];
}
function groupDataByField(data, field) {
	return data.reduce((groups, item) => {
		const key = String(item[field] ?? "Unknown");
		if (!groups[key]) groups[key] = [];
		groups[key].push(item);
		return groups;
	}, {});
}
function detectDataType(values) {
	const nonNullValues = values.filter((v) => v != null);
	if (nonNullValues.length === 0) return "categorical";
	if (nonNullValues.every((v) => typeof v === "number" || !isNaN(Number(v)))) return "numeric";
	if (nonNullValues.some((v) => v instanceof Date || typeof v === "string" && !isNaN(Date.parse(v)))) return "time";
	return "categorical";
}
function buildBaseOption(props) {
	const option = {};
	const isDark = props.theme === "dark";
	if (props.title) option.title = {
		text: props.title,
		subtext: props.subtitle,
		left: props.titlePosition || "center",
		textStyle: { color: isDark ? "#ffffff" : "#333333" },
		subtextStyle: { color: isDark ? "#cccccc" : "#666666" }
	};
	option.animation = props.animate !== false;
	if (props.animationDuration) option.animationDuration = props.animationDuration;
	if (props.backgroundColor) option.backgroundColor = props.backgroundColor;
	else option.backgroundColor = isDark ? "#1a1a1a" : "#ffffff";
	if (props.colorPalette) option.color = [...props.colorPalette];
	else option.color = [...COLOR_PALETTES.default];
	option.textStyle = { color: isDark ? "#ffffff" : "#333333" };
	if (!option.backgroundColor) option.backgroundColor = isDark ? "#1a1a1a" : "#ffffff";
	return option;
}
function buildAxisOption(config, dataType = "categorical", theme) {
	const isDark = theme === "dark";
	if (!config) return {
		type: dataType === "numeric" ? "value" : dataType === "time" ? "time" : "category",
		...dataType === "categorical" && { boundaryGap: false },
		axisLine: { lineStyle: { color: isDark ? "#666666" : "#cccccc" } },
		axisTick: { lineStyle: { color: isDark ? "#666666" : "#cccccc" } },
		axisLabel: { color: isDark ? "#cccccc" : "#666666" },
		splitLine: { lineStyle: { color: isDark ? "#333333" : "#f0f0f0" } }
	};
	const axisType = config.type === "linear" ? "value" : config.type === "log" ? "log" : config.type || (dataType === "numeric" ? "value" : dataType === "time" ? "time" : "category");
	return {
		type: axisType,
		name: config.label,
		min: config.min,
		max: config.max,
		splitLine: config.grid ? {
			show: true,
			lineStyle: { color: config.gridColor || (isDark ? "#333333" : "#f0f0f0") }
		} : { lineStyle: { color: isDark ? "#333333" : "#f0f0f0" } },
		interval: config.tickInterval,
		axisLine: { lineStyle: { color: isDark ? "#666666" : "#cccccc" } },
		axisTick: { lineStyle: { color: isDark ? "#666666" : "#cccccc" } },
		axisLabel: {
			rotate: config.rotate,
			formatter: config.format ? typeof config.format === "function" ? config.format : (value) => {
				if (config.format === "${value:,.0f}") return "$" + value.toLocaleString("en-US", { maximumFractionDigits: 0 });
				if (config.format === "{value}%") return value + "%";
				if (config.format === "${value}") return "$" + value;
				return value.toString();
			} : void 0,
			color: isDark ? "#cccccc" : "#666666"
		},
		nameTextStyle: { color: isDark ? "#cccccc" : "#666666" },
		...(axisType === "category" || axisType === "time") && { boundaryGap: config.boundaryGap !== void 0 ? config.boundaryGap : false }
	};
}
function buildLegendOption(config, hasTitle, hasSubtitle, hasDataZoom, theme) {
	if (!config || config.show === false) return { show: false };
	const position = config.position || "top";
	const orientation = config.orientation || (position === "left" || position === "right" ? "vertical" : "horizontal");
	const align = config.align || "center";
	let positioning = {};
	switch (position) {
		case "top":
			if (hasTitle && hasSubtitle) positioning = { top: "12%" };
			else if (hasTitle) positioning = { top: "8%" };
			else positioning = { top: "5%" };
			if (align === "center") positioning = {
				...positioning,
				left: "center"
			};
			else if (align === "start") positioning = {
				...positioning,
				left: "5%"
			};
			else if (align === "end") positioning = {
				...positioning,
				right: "5%"
			};
			break;
		case "bottom":
			if (hasDataZoom) positioning = { bottom: "15%" };
			else positioning = { bottom: "8%" };
			if (align === "center") positioning = {
				...positioning,
				left: "center"
			};
			else if (align === "start") positioning = {
				...positioning,
				left: "5%"
			};
			else if (align === "end") positioning = {
				...positioning,
				right: "5%"
			};
			break;
		case "left":
			positioning = {
				left: "5%",
				top: hasTitle ? hasSubtitle ? "15%" : "12%" : "center"
			};
			break;
		case "right":
			positioning = {
				right: "5%",
				top: hasTitle ? hasSubtitle ? "15%" : "12%" : "center"
			};
			break;
	}
	const isDark = theme === "dark";
	return {
		show: true,
		type: "scroll",
		orient: orientation,
		...positioning,
		itemGap: 10,
		textStyle: {
			fontSize: 12,
			padding: [
				2,
				0,
				0,
				2
			],
			color: isDark ? "#cccccc" : "#666666"
		}
	};
}
function calculateGridSpacing(legendConfig, hasTitle, hasSubtitle, hasDataZoom) {
	const defaultGrid = {
		left: "3%",
		right: "4%",
		top: "10%",
		bottom: "3%",
		containLabel: true
	};
	if (!legendConfig || legendConfig.show === false) {
		let topSpacing = "10%";
		if (hasTitle && hasSubtitle) topSpacing = "15%";
		else if (hasTitle) topSpacing = "12%";
		return {
			...defaultGrid,
			top: topSpacing,
			bottom: hasDataZoom ? "12%" : "3%"
		};
	}
	const position = legendConfig.position || "top";
	let gridAdjustments = { ...defaultGrid };
	switch (position) {
		case "top":
			if (hasTitle && hasSubtitle) gridAdjustments.top = "20%";
			else if (hasTitle) gridAdjustments.top = "18%";
			else gridAdjustments.top = "15%";
			gridAdjustments.bottom = hasDataZoom ? "12%" : "3%";
			break;
		case "bottom":
			let topSpacing = "10%";
			if (hasTitle && hasSubtitle) topSpacing = "15%";
			else if (hasTitle) topSpacing = "12%";
			gridAdjustments.top = topSpacing;
			if (hasDataZoom) gridAdjustments.bottom = "25%";
			else gridAdjustments.bottom = "15%";
			break;
		case "left":
			gridAdjustments.left = "15%";
			gridAdjustments.top = hasTitle ? hasSubtitle ? "15%" : "12%" : "10%";
			gridAdjustments.bottom = hasDataZoom ? "12%" : "3%";
			break;
		case "right":
			gridAdjustments.right = "15%";
			gridAdjustments.top = hasTitle ? hasSubtitle ? "15%" : "12%" : "10%";
			gridAdjustments.bottom = hasDataZoom ? "12%" : "3%";
			break;
	}
	return gridAdjustments;
}
function buildTooltipOption(config, theme) {
	if (!config || config.show === false) return { show: false };
	const isDark = theme === "dark";
	return {
		show: true,
		trigger: config.trigger || "item",
		formatter: config.format,
		backgroundColor: config.backgroundColor || (isDark ? "#333333" : "rgba(255, 255, 255, 0.95)"),
		borderColor: config.borderColor || (isDark ? "#555555" : "#dddddd"),
		textStyle: config.textColor ? { color: config.textColor } : { color: isDark ? "#ffffff" : "#333333" }
	};
}
function buildLineChartOption(props) {
	const baseOption = buildBaseOption(props);
	let series = [];
	let xAxisData = [];
	if (props.series && props.data) {
		series = props.series.map((s) => ({
			name: s.name,
			type: "line",
			data: isObjectData(s.data) && props.yField ? s.data.map((item) => item[props.yField]) : s.data,
			smooth: s.smooth ?? props.smooth,
			lineStyle: { width: props.strokeWidth },
			itemStyle: { color: s.color },
			areaStyle: s.showArea ?? props.showArea ? { opacity: props.areaOpacity || .3 } : void 0,
			symbol: props.showPoints !== false ? props.pointShape || "circle" : "none",
			symbolSize: props.pointSize || 4
		}));
		if (props.series && props.series[0] && isObjectData(props.series[0].data) && props.xField) xAxisData = props.series[0].data.map((item) => item[props.xField]);
	} else if (props.data) if (isObjectData(props.data)) if (props.seriesField) {
		const groups = groupDataByField(props.data, props.seriesField);
		series = Object.entries(groups).map(([name, groupData]) => ({
			name,
			type: "line",
			data: groupData.map((item) => item[props.yField]),
			smooth: props.smooth,
			lineStyle: { width: props.strokeWidth },
			areaStyle: props.showArea ? { opacity: props.areaOpacity || .3 } : void 0,
			symbol: props.showPoints !== false ? props.pointShape || "circle" : "none",
			symbolSize: props.pointSize || 4
		}));
		xAxisData = extractUniqueValues(props.data, props.xField);
	} else {
		if (Array.isArray(props.yField)) series = props.yField.map((field) => ({
			name: field,
			type: "line",
			data: props.data.map((item) => item[field]),
			smooth: props.smooth,
			lineStyle: { width: props.strokeWidth },
			areaStyle: props.showArea ? { opacity: props.areaOpacity || .3 } : void 0,
			symbol: props.showPoints !== false ? props.pointShape || "circle" : "none",
			symbolSize: props.pointSize || 4
		}));
		else series = [{
			type: "line",
			data: props.data.map((item) => item[props.yField]),
			smooth: props.smooth,
			lineStyle: { width: props.strokeWidth },
			areaStyle: props.showArea ? { opacity: props.areaOpacity || .3 } : void 0,
			symbol: props.showPoints !== false ? props.pointShape || "circle" : "none",
			symbolSize: props.pointSize || 4
		}];
		if (props.data) xAxisData = props.data.map((item) => item[props.xField]);
	}
	else series = [{
		type: "line",
		data: props.data,
		smooth: props.smooth,
		lineStyle: { width: props.strokeWidth },
		areaStyle: props.showArea ? { opacity: props.areaOpacity || .3 } : void 0,
		symbol: props.showPoints !== false ? props.pointShape || "circle" : "none",
		symbolSize: props.pointSize || 4
	}];
	const xAxisType = props.data && isObjectData(props.data) && props.xField ? detectDataType(props.data.map((item) => item[props.xField])) : "categorical";
	return {
		...baseOption,
		grid: calculateGridSpacing(props.legend, !!props.title, !!props.subtitle, !!props.zoom),
		xAxis: {
			...buildAxisOption(props.xAxis, xAxisType, props.theme),
			data: xAxisType === "categorical" ? xAxisData : void 0
		},
		yAxis: buildAxisOption(props.yAxis, "numeric", props.theme),
		series,
		legend: buildLegendOption(props.legend, !!props.title, !!props.subtitle, !!props.zoom, props.theme),
		tooltip: buildTooltipOption(props.tooltip, props.theme),
		...props.zoom && { dataZoom: [{ type: "inside" }, { type: "slider" }] },
		...props.brush && { brush: {} },
		...props.customOption
	};
}
function buildBarChartOption(props) {
	const baseOption = buildBaseOption(props);
	let series = [];
	let categoryData = [];
	if (props.series) {
		series = props.series.map((s) => ({
			name: s.name,
			type: "bar",
			data: isObjectData(s.data) && props.valueField ? s.data.map((item) => item[props.valueField]) : s.data,
			itemStyle: {
				color: s.color,
				borderRadius: props.borderRadius
			},
			stack: s.stack || (props.stack ? "defaultStack" : void 0),
			barWidth: props.barWidth,
			barGap: props.barGap
		}));
		if (props.series && props.series[0] && isObjectData(props.series[0].data) && props.categoryField) categoryData = props.series[0].data.map((item) => item[props.categoryField]);
	} else if (props.data) if (isObjectData(props.data)) if (props.seriesField) {
		const groups = groupDataByField(props.data, props.seriesField);
		series = Object.entries(groups).map(([name, groupData]) => ({
			name,
			type: "bar",
			data: groupData.map((item) => item[props.valueField]),
			stack: props.stack ? "defaultStack" : void 0,
			barWidth: props.barWidth,
			barGap: props.barGap,
			itemStyle: { borderRadius: props.borderRadius }
		}));
		categoryData = extractUniqueValues(props.data, props.categoryField);
	} else {
		if (Array.isArray(props.valueField)) series = props.valueField.map((field) => ({
			name: field,
			type: "bar",
			data: props.data.map((item) => item[field]),
			stack: props.stack ? "defaultStack" : void 0,
			barWidth: props.barWidth,
			barGap: props.barGap,
			itemStyle: { borderRadius: props.borderRadius }
		}));
		else series = [{
			type: "bar",
			data: props.data.map((item) => item[props.valueField]),
			stack: props.stack ? "defaultStack" : void 0,
			barWidth: props.barWidth,
			barGap: props.barGap,
			itemStyle: { borderRadius: props.borderRadius }
		}];
		if (props.data) categoryData = props.data.map((item) => item[props.categoryField]);
	}
	else series = [{
		type: "bar",
		data: props.data,
		stack: props.stack ? "defaultStack" : void 0,
		barWidth: props.barWidth,
		barGap: props.barGap,
		itemStyle: { borderRadius: props.borderRadius }
	}];
	if (props.showPercentage && props.stack && series.length > 1) {
		const totalsByCategory = [];
		const categoryCount = Math.max(...series.map((s) => s.data.length));
		for (let i = 0; i < categoryCount; i++) {
			let sum = 0;
			for (const seriesItem of series) sum += seriesItem.data[i] || 0;
			totalsByCategory.push(sum);
		}
		series = series.map((seriesItem) => ({
			...seriesItem,
			data: seriesItem.data.map((value, index) => {
				const total = totalsByCategory[index];
				return total === void 0 || total <= 0 ? 0 : value / total;
			}),
			label: {
				show: true,
				position: props.orientation === "horizontal" ? "right" : "top",
				formatter: (params) => `${Math.round(params.value * 1e3) / 10}%`
			}
		}));
	}
	if (props.sortBy && props.sortBy !== "none") {}
	const isHorizontal = props.orientation === "horizontal";
	if ((props.stackType === "percent" || props.showPercentage) && props.stack) {
		const yAxisOptions = isHorizontal ? buildAxisOption(props.yAxis, "categorical", props.theme) : buildAxisOption(props.yAxis, "numeric", props.theme);
		let tooltipConfig = props.tooltip;
		if (props.showPercentage && !props.tooltip?.format) tooltipConfig = {
			...props.tooltip,
			show: true,
			trigger: "axis",
			format: (params) => {
				if (!Array.isArray(params)) return "";
				let result = `${params[0].name}<br/>`;
				for (const param of params) {
					const percentage = Math.round(param.value * 1e3) / 10;
					result += `${param.marker}${param.seriesName}: ${percentage}%<br/>`;
				}
				return result;
			}
		};
		if (!isHorizontal) {
			if (props.stackType === "percent") {
				yAxisOptions.max = 100;
				yAxisOptions.axisLabel = {
					...yAxisOptions.axisLabel,
					formatter: "{value}%"
				};
			} else if (props.showPercentage) {
				yAxisOptions.max = 1;
				yAxisOptions.axisLabel = {
					...yAxisOptions.axisLabel,
					formatter: (value) => `${Math.round(value * 100)}%`
				};
			}
		}
		return {
			...baseOption,
			grid: calculateGridSpacing(props.legend, !!props.title, !!props.subtitle, false),
			xAxis: isHorizontal ? {
				...buildAxisOption(props.xAxis, "numeric", props.theme),
				...props.stackType === "percent" ? {
					max: 100,
					axisLabel: { formatter: "{value}%" }
				} : {},
				...props.showPercentage && props.stackType !== "percent" ? {
					max: 1,
					axisLabel: { formatter: (value) => `${Math.round(value * 100)}%` }
				} : {}
			} : {
				...buildAxisOption(props.xAxis, "categorical", props.theme),
				data: categoryData,
				boundaryGap: true
			},
			yAxis: isHorizontal ? {
				...yAxisOptions,
				data: categoryData,
				boundaryGap: true
			} : yAxisOptions,
			series: series.map((s) => ({
				...s,
				stack: props.stackType === "percent" ? "percent" : "defaultStack"
			})),
			legend: buildLegendOption(props.legend, !!props.title, !!props.subtitle, false, props.theme),
			tooltip: buildTooltipOption(tooltipConfig, props.theme),
			...props.customOption
		};
	}
	return {
		...baseOption,
		grid: calculateGridSpacing(props.legend, !!props.title, !!props.subtitle, false),
		xAxis: isHorizontal ? buildAxisOption(props.xAxis, "numeric", props.theme) : {
			...buildAxisOption(props.xAxis, "categorical", props.theme),
			data: categoryData,
			boundaryGap: true
		},
		yAxis: isHorizontal ? {
			...buildAxisOption(props.yAxis, "categorical", props.theme),
			data: categoryData,
			boundaryGap: true
		} : buildAxisOption(props.yAxis, "numeric", props.theme),
		series,
		legend: buildLegendOption(props.legend, !!props.title, !!props.subtitle, false, props.theme),
		tooltip: buildTooltipOption(props.tooltip, props.theme),
		...props.customOption
	};
}
function buildPieChartOption(props) {
	const baseOption = buildBaseOption(props);
	let data = [];
	if (props.data && isObjectData(props.data)) if (props.nameField && props.valueField) data = props.data.map((item) => ({
		name: item[props.nameField],
		value: item[props.valueField]
	}));
	else {
		const firstItem = props.data[0];
		if (firstItem) {
			const keys = Object.keys(firstItem);
			data = props.data.map((item) => ({
				name: item[keys[0]],
				value: item[keys[1]]
			}));
		}
	}
	else if (props.data) data = [...props.data];
	const radius = Array.isArray(props.radius) ? props.radius : ["0%", (props.radius || 75) + "%"];
	return {
		...baseOption,
		series: [{
			type: "pie",
			data,
			radius,
			startAngle: props.startAngle || 90,
			...props.roseType ? { roseType: "area" } : {},
			label: {
				show: props.showLabels !== false,
				position: props.labelPosition || "outside",
				formatter: props.labelFormat || (props.showPercentages ? "{b}: {d}%" : "{b}: {c}")
			},
			selectedMode: props.selectedMode || false,
			...props.emphasis !== false ? { emphasis: { focus: "self" } } : {}
		}],
		legend: buildLegendOption(props.legend, !!props.title, !!props.subtitle, false, props.theme),
		tooltip: buildTooltipOption(props.tooltip, props.theme),
		...props.customOption
	};
}
function buildScatterChartOption(props) {
	const baseOption = buildBaseOption(props);
	let series = [];
	if (props.series) series = props.series.map((s) => ({
		name: s.name,
		type: "scatter",
		data: s.data,
		itemStyle: {
			color: s.color,
			opacity: props.pointOpacity || .8
		},
		symbolSize: s.pointSize || props.pointSize || 10,
		symbol: s.pointShape || props.pointShape || "circle"
	}));
	else if (props.data && props.data.length > 0) if (isObjectData(props.data)) if (props.seriesField) {
		const groups = groupDataByField(props.data, props.seriesField);
		series = Object.entries(groups).map(([name, groupData]) => {
			let processedData;
			if (props.sizeField) processedData = groupData.map((item) => [
				item[props.xField || "x"],
				item[props.yField || "y"],
				item[props.sizeField]
			]);
			else processedData = groupData.map((item) => [item[props.xField || "x"], item[props.yField || "y"]]);
			return {
				name,
				type: "scatter",
				data: processedData,
				symbolSize: props.sizeField ? (value) => Math.sqrt(value[2] || 1) * 5 : props.pointSize || 10,
				symbol: props.pointShape || "circle",
				itemStyle: { opacity: props.pointOpacity || .8 }
			};
		});
	} else {
		let processedData;
		if (props.sizeField) processedData = props.data.map((item) => [
			item[props.xField || "x"],
			item[props.yField || "y"],
			item[props.sizeField]
		]);
		else processedData = props.data.map((item) => [item[props.xField || "x"], item[props.yField || "y"]]);
		series = [{
			type: "scatter",
			data: processedData,
			symbolSize: props.sizeField ? (value) => Math.sqrt(value[2] || 1) * 5 : props.pointSize || 10,
			symbol: props.pointShape || "circle",
			itemStyle: { opacity: props.pointOpacity || .8 }
		}];
	}
	else series = [{
		type: "scatter",
		data: [...props.data],
		symbolSize: props.pointSize || 10,
		symbol: props.pointShape || "circle",
		itemStyle: { opacity: props.pointOpacity || .8 }
	}];
	const xAxisOption = buildAxisOption(props.xAxis, "numeric", props.theme);
	const yAxisOption = buildAxisOption(props.yAxis, "numeric", props.theme);
	if (xAxisOption.type === "linear") xAxisOption.type = "value";
	if (yAxisOption.type === "linear") yAxisOption.type = "value";
	return {
		...baseOption,
		grid: calculateGridSpacing(props.legend, !!props.title, !!props.subtitle, false),
		xAxis: xAxisOption,
		yAxis: yAxisOption,
		series,
		legend: buildLegendOption(props.legend, !!props.title, !!props.subtitle, false, props.theme),
		tooltip: buildTooltipOption(props.tooltip, props.theme),
		...props.customOption
	};
}
function buildClusterChartOption(props) {
	const baseOption = buildBaseOption(props);
	const DEFAULT_CLUSTER_COLORS = [
		"#37A2DA",
		"#e06343",
		"#37a354",
		"#b55dba",
		"#b5bd48",
		"#8378EA",
		"#96BFFF"
	];
	const clusterCount = props.clusterCount || 6;
	const clusterColors = props.clusterColors || props.colorPalette || DEFAULT_CLUSTER_COLORS;
	const visualMapPosition = props.visualMapPosition || "left";
	if (!props.data || props.data.length === 0) return {
		...baseOption,
		series: []
	};
	let sourceData;
	if (isObjectData(props.data)) {
		const xField = props.xField || "x";
		const yField = props.yField || "y";
		sourceData = props.data.map((item) => [Number(item[xField]) || 0, Number(item[yField]) || 0]);
	} else sourceData = props.data.map((point) => {
		if (Array.isArray(point)) return [Number(point[0]) || 0, Number(point[1]) || 0];
		return [0, 0];
	});
	const outputClusterIndexDimension = 2;
	const gridLeft = visualMapPosition === "left" ? 120 : 60;
	console.log("ClusterChart sourceData sample:", sourceData.slice(0, 3));
	console.log("ClusterChart config:", {
		clusterCount,
		outputClusterIndexDimension
	});
	const pieces = Array.from({ length: clusterCount }, (_, i) => ({
		value: i,
		label: `cluster ${i}`,
		color: clusterColors[i % clusterColors.length] || clusterColors[0] || DEFAULT_CLUSTER_COLORS[0]
	}));
	const chartOption = {
		...baseOption,
		dataset: [{ source: sourceData }, { transform: {
			type: "ecStat:clustering",
			print: true,
			config: {
				clusterCount,
				outputType: "single",
				outputClusterIndexDimension
			}
		} }],
		tooltip: props.tooltip ? buildTooltipOption(props.tooltip, props.theme) : {
			position: "top",
			formatter: (params) => {
				const [x, y, cluster] = params.value;
				const name = params.name || "";
				return `${name ? name + "<br/>" : ""}X: ${x}<br/>Y: ${y}<br/>Cluster: ${cluster}`;
			}
		},
		visualMap: {
			type: "piecewise",
			top: visualMapPosition === "top" ? 10 : visualMapPosition === "bottom" ? "bottom" : "middle",
			...visualMapPosition === "left" && { left: 10 },
			...visualMapPosition === "right" && {
				left: "right",
				right: 10
			},
			...visualMapPosition === "bottom" && { bottom: 10 },
			min: 0,
			max: clusterCount,
			splitNumber: clusterCount,
			dimension: outputClusterIndexDimension,
			pieces
		},
		grid: { left: gridLeft },
		xAxis: {
			...buildAxisOption(props.xAxis, "numeric", props.theme),
			type: "value",
			scale: true
		},
		yAxis: {
			...buildAxisOption(props.yAxis, "numeric", props.theme),
			type: "value",
			scale: true
		},
		series: {
			type: "scatter",
			encode: {
				tooltip: [
					0,
					1,
					2
				],
				x: 0,
				y: 1
			},
			symbolSize: props.pointSize || 15,
			itemStyle: props.itemStyle || { borderColor: "#555" },
			datasetIndex: 1
		},
		...props.customOption
	};
	return chartOption;
}

//#endregion
//#region src/components/LineChart.tsx
/**
* Ergonomic LineChart component with intuitive props
* 
* @example
* // Simple line chart with object data
* <ErgonomicLineChart
*   data={[
*     { month: 'Jan', sales: 100, profit: 20 },
*     { month: 'Feb', sales: 120, profit: 25 },
*     { month: 'Mar', sales: 110, profit: 22 }
*   ]}
*   xField="month"
*   yField={['sales', 'profit']}
*   smooth
*   showArea
* />
* 
* @example
* // Multiple series with explicit configuration
* <ErgonomicLineChart
*   series={[
*     {
*       name: 'Sales',
*       data: [{ date: '2023-01', value: 100 }, { date: '2023-02', value: 120 }],
*       color: '#ff6b6b',
*       smooth: true
*     },
*     {
*       name: 'Profit',
*       data: [{ date: '2023-01', value: 20 }, { date: '2023-02', value: 25 }],
*       color: '#4ecdc4'
*     }
*   ]}
*   xField="date"
*   yField="value"
* />
*/
const LineChart = forwardRef(({ width = "100%", height = 400, className, style, data, xField = "x", yField = "y", seriesField, series, theme = "light", colorPalette, backgroundColor, title, subtitle, titlePosition = "center", smooth = false, strokeWidth = 2, strokeStyle = "solid", showPoints = true, pointSize = 4, pointShape = "circle", showArea = false, areaOpacity = .3, areaGradient = false, xAxis, yAxis, legend, tooltip, zoom = false, pan = false, brush = false, loading = false, disabled = false, animate = true, animationDuration, onChartReady, onDataPointClick, onDataPointHover, customOption, responsive = true,...restProps }, ref) => {
	const chartOption = useMemo(() => {
		return buildLineChartOption({
			data: data || void 0,
			xField,
			yField,
			seriesField,
			series,
			theme,
			colorPalette,
			backgroundColor,
			title,
			subtitle,
			titlePosition,
			smooth,
			strokeWidth,
			strokeStyle,
			showPoints,
			pointSize,
			pointShape,
			showArea,
			areaOpacity,
			areaGradient,
			xAxis: xAxis || void 0,
			yAxis: yAxis || void 0,
			legend,
			tooltip,
			zoom,
			pan,
			brush,
			animate,
			animationDuration,
			customOption
		});
	}, [
		data,
		xField,
		yField,
		seriesField,
		series,
		theme,
		colorPalette,
		backgroundColor,
		title,
		subtitle,
		titlePosition,
		smooth,
		strokeWidth,
		strokeStyle,
		showPoints,
		pointSize,
		pointShape,
		showArea,
		areaOpacity,
		areaGradient,
		xAxis,
		yAxis,
		legend,
		tooltip,
		zoom,
		pan,
		brush,
		animate,
		animationDuration,
		customOption
	]);
	const chartEvents = useMemo(() => {
		const events = {};
		if (onDataPointClick) events.click = (params, chart) => {
			onDataPointClick(params, {
				chart,
				event: params
			});
		};
		if (onDataPointHover) events.mouseover = (params, chart) => {
			onDataPointHover(params, {
				chart,
				event: params
			});
		};
		return Object.keys(events).length > 0 ? events : void 0;
	}, [onDataPointClick, onDataPointHover]);
	const { containerRef, loading: chartLoading, error, getEChartsInstance, resize, showLoading, hideLoading } = useECharts({
		option: chartOption,
		theme,
		loading,
		events: chartEvents,
		onChartReady
	});
	const exportImage = (format = "png") => {
		const chart = getEChartsInstance();
		if (!chart) return "";
		return chart.getDataURL({
			type: format,
			pixelRatio: 2,
			backgroundColor: backgroundColor || "#fff"
		});
	};
	const highlight = (dataIndex, seriesIndex = 0) => {
		const chart = getEChartsInstance();
		if (!chart) return;
		chart.dispatchAction({
			type: "highlight",
			seriesIndex,
			dataIndex
		});
	};
	const clearHighlight = () => {
		const chart = getEChartsInstance();
		if (!chart) return;
		chart.dispatchAction({ type: "downplay" });
	};
	const updateData = (newData) => {
		const chart = getEChartsInstance();
		if (!chart) return;
		const newOption = buildLineChartOption({
			data: newData,
			xField,
			yField,
			seriesField: seriesField || void 0,
			series,
			theme,
			colorPalette,
			backgroundColor,
			title,
			subtitle,
			titlePosition,
			smooth,
			strokeWidth,
			strokeStyle,
			showPoints,
			pointSize,
			pointShape,
			showArea,
			areaOpacity,
			areaGradient,
			xAxis: xAxis || void 0,
			yAxis: yAxis || void 0,
			legend,
			tooltip,
			zoom,
			pan,
			brush,
			animate,
			animationDuration,
			customOption
		});
		chart.setOption(newOption);
	};
	useImperativeHandle(ref, () => ({
		getChart: getEChartsInstance,
		exportImage,
		resize,
		showLoading: () => showLoading(),
		hideLoading,
		highlight,
		clearHighlight,
		updateData
	}), [
		getEChartsInstance,
		exportImage,
		resize,
		showLoading,
		hideLoading,
		highlight,
		clearHighlight,
		updateData
	]);
	if (error) return /* @__PURE__ */ jsxs("div", {
		className: `aqc-charts-error ${className || ""}`,
		style: {
			width,
			height,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			color: "#ff4d4f",
			fontSize: "14px",
			border: "1px dashed #ff4d4f",
			borderRadius: "4px",
			...style
		},
		children: ["Error: ", error.message || "Failed to render chart"]
	});
	const containerStyle = useMemo(() => ({
		width,
		height,
		position: "relative",
		...style
	}), [
		width,
		height,
		style
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: `aqc-charts-container ${className || ""}`,
		style: containerStyle,
		...restProps,
		children: [/* @__PURE__ */ jsx("div", {
			ref: containerRef,
			style: {
				width: "100%",
				height: "100%"
			}
		}), (chartLoading || loading) && /* @__PURE__ */ jsxs("div", {
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
				fontSize: "14px",
				color: "#666"
			},
			children: [/* @__PURE__ */ jsx("div", {
				className: "aqc-charts-spinner",
				style: {
					width: "20px",
					height: "20px",
					border: "2px solid #f3f3f3",
					borderTop: "2px solid #1890ff",
					borderRadius: "50%",
					animation: "spin 1s linear infinite",
					marginRight: "8px"
				}
			}), "Loading..."]
		})]
	});
});
LineChart.displayName = "LineChart";

//#endregion
//#region src/components/BarChart.tsx
/**
* Ergonomic BarChart component with intuitive props
* 
* @example
* // Simple bar chart with object data
* <ErgonomicBarChart
*   data={[
*     { category: 'Q1', sales: 100, profit: 20 },
*     { category: 'Q2', sales: 120, profit: 25 },
*     { category: 'Q3', sales: 110, profit: 22 },
*     { category: 'Q4', sales: 140, profit: 30 }
*   ]}
*   categoryField="category"
*   valueField={['sales', 'profit']}
*   orientation="vertical"
* />
* 
* @example
* // Stacked bar chart
* <ErgonomicBarChart
*   data={salesData}
*   categoryField="month"
*   valueField="amount"
*   seriesField="product"
*   stack="normal"
*   orientation="horizontal"
* />
* 
* @example
* // Multiple series with explicit configuration
* <ErgonomicBarChart
*   series={[
*     {
*       name: 'Sales',
*       data: [{ quarter: 'Q1', value: 100 }, { quarter: 'Q2', value: 120 }],
*       color: '#1890ff'
*     },
*     {
*       name: 'Profit',
*       data: [{ quarter: 'Q1', value: 20 }, { quarter: 'Q2', value: 25 }],
*       color: '#52c41a'
*     }
*   ]}
*   categoryField="quarter"
*   valueField="value"
* />
*/
const BarChart = forwardRef(({ width = "100%", height = 400, className, style, data, categoryField = "category", valueField = "value", seriesField, series, theme = "light", colorPalette, backgroundColor, title, subtitle, titlePosition = "center", orientation = "vertical", barWidth, barGap, borderRadius = 0, stack = false, stackType = "normal", showPercentage = false, xAxis, yAxis, legend, tooltip, sortBy = "none", sortOrder = "asc", loading = false, disabled = false, animate = true, animationDuration, onChartReady, onDataPointClick, onDataPointHover, customOption, responsive = true,...restProps }, ref) => {
	const chartOption = useMemo(() => {
		return buildBarChartOption({
			data: data || void 0,
			categoryField,
			valueField,
			seriesField,
			series,
			theme,
			colorPalette,
			backgroundColor,
			title,
			subtitle,
			titlePosition,
			orientation,
			barWidth,
			barGap,
			borderRadius,
			stack,
			stackType,
			showPercentage,
			xAxis: xAxis || void 0,
			yAxis: yAxis || void 0,
			legend,
			tooltip,
			sortBy,
			sortOrder,
			animate,
			animationDuration,
			customOption
		});
	}, [
		data,
		categoryField,
		valueField,
		seriesField,
		series,
		theme,
		colorPalette,
		backgroundColor,
		title,
		subtitle,
		titlePosition,
		orientation,
		barWidth,
		barGap,
		borderRadius,
		stack,
		stackType,
		showPercentage,
		xAxis,
		yAxis,
		legend,
		tooltip,
		sortBy,
		sortOrder,
		animate,
		animationDuration,
		customOption
	]);
	const chartEvents = useMemo(() => {
		const events = {};
		if (onDataPointClick) events.click = (params, chart) => {
			onDataPointClick(params, {
				chart,
				event: params
			});
		};
		if (onDataPointHover) events.mouseover = (params, chart) => {
			onDataPointHover(params, {
				chart,
				event: params
			});
		};
		return Object.keys(events).length > 0 ? events : void 0;
	}, [onDataPointClick, onDataPointHover]);
	const { containerRef, loading: chartLoading, error, getEChartsInstance, resize, showLoading, hideLoading } = useECharts({
		option: chartOption,
		theme,
		loading,
		events: chartEvents,
		onChartReady
	});
	const exportImage = (format = "png") => {
		const chart = getEChartsInstance();
		if (!chart) return "";
		return chart.getDataURL({
			type: format,
			pixelRatio: 2,
			backgroundColor: backgroundColor || "#fff"
		});
	};
	const highlight = (dataIndex, seriesIndex = 0) => {
		const chart = getEChartsInstance();
		if (!chart) return;
		chart.dispatchAction({
			type: "highlight",
			seriesIndex,
			dataIndex
		});
	};
	const clearHighlight = () => {
		const chart = getEChartsInstance();
		if (!chart) return;
		chart.dispatchAction({ type: "downplay" });
	};
	const updateData = (newData) => {
		const chart = getEChartsInstance();
		if (!chart) return;
		const newOption = buildBarChartOption({
			data: newData,
			categoryField,
			valueField,
			seriesField,
			series,
			theme,
			colorPalette,
			backgroundColor,
			title,
			subtitle,
			titlePosition,
			orientation,
			barWidth,
			barGap,
			borderRadius,
			stack,
			stackType,
			showPercentage,
			xAxis: xAxis || void 0,
			yAxis: yAxis || void 0,
			legend,
			tooltip,
			sortBy,
			sortOrder,
			animate,
			animationDuration,
			customOption
		});
		chart.setOption(newOption);
	};
	useImperativeHandle(ref, () => ({
		getChart: getEChartsInstance,
		exportImage,
		resize,
		showLoading: () => showLoading(),
		hideLoading,
		highlight,
		clearHighlight,
		updateData
	}), [
		getEChartsInstance,
		exportImage,
		resize,
		showLoading,
		hideLoading,
		highlight,
		clearHighlight,
		updateData
	]);
	if (error) return /* @__PURE__ */ jsxs("div", {
		className: `aqc-charts-error ${className || ""}`,
		style: {
			width,
			height,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			color: "#ff4d4f",
			fontSize: "14px",
			border: "1px dashed #ff4d4f",
			borderRadius: "4px",
			...style
		},
		children: ["Error: ", error.message || "Failed to render chart"]
	});
	const containerStyle = useMemo(() => ({
		width,
		height,
		position: "relative",
		...style
	}), [
		width,
		height,
		style
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: `aqc-charts-container ${className || ""}`,
		style: containerStyle,
		...restProps,
		children: [/* @__PURE__ */ jsx("div", {
			ref: containerRef,
			style: {
				width: "100%",
				height: "100%"
			}
		}), (chartLoading || loading) && /* @__PURE__ */ jsxs("div", {
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
				fontSize: "14px",
				color: "#666"
			},
			children: [/* @__PURE__ */ jsx("div", {
				className: "aqc-charts-spinner",
				style: {
					width: "20px",
					height: "20px",
					border: "2px solid #f3f3f3",
					borderTop: "2px solid #1890ff",
					borderRadius: "50%",
					animation: "spin 1s linear infinite",
					marginRight: "8px"
				}
			}), "Loading..."]
		})]
	});
});
BarChart.displayName = "BarChart";

//#endregion
//#region src/components/PieChart.tsx
/**
* Ergonomic PieChart component with intuitive props
* 
* @example
* // Simple pie chart with object data
* <ErgonomicPieChart
*   data={[
*     { category: 'Desktop', sales: 4200 },
*     { category: 'Mobile', sales: 3800 },
*     { category: 'Tablet', sales: 1200 }
*   ]}
*   nameField="category"
*   valueField="sales"
*   title="Sales by Platform"
* />
* 
* @example
* // Donut chart with custom styling
* <ErgonomicPieChart
*   data={marketData}
*   nameField="segment"
*   valueField="share"
*   radius={[40, 70]}
*   title="Market Share"
*   showPercentages
*   labelPosition="outside"
* />
* 
* @example
* // Rose/nightingale chart
* <ErgonomicPieChart
*   data={performanceData}
*   nameField="department"
*   valueField="score"
*   roseType
*   title="Performance by Department"
*   showLabels
* />
*/
const PieChart = forwardRef(({ width = "100%", height = 400, className, style, data, nameField = "name", valueField = "value", theme = "light", colorPalette, backgroundColor, title, subtitle, titlePosition = "center", radius = 75, startAngle = 90, roseType = false, showLabels = true, labelPosition = "outside", showValues = false, showPercentages = true, labelFormat, legend, tooltip, selectedMode = false, emphasis = true, loading = false, disabled = false, animate = true, animationDuration, onChartReady, onDataPointClick, onDataPointHover, customOption, responsive = true,...restProps }, ref) => {
	const chartOption = useMemo(() => {
		return buildPieChartOption({
			data,
			nameField,
			valueField,
			theme,
			colorPalette,
			backgroundColor,
			title,
			subtitle,
			titlePosition,
			radius,
			startAngle,
			roseType,
			showLabels,
			labelPosition,
			showValues,
			showPercentages,
			labelFormat,
			legend,
			tooltip,
			selectedMode,
			emphasis,
			animate,
			animationDuration,
			customOption
		});
	}, [
		data,
		nameField,
		valueField,
		theme,
		colorPalette,
		backgroundColor,
		title,
		subtitle,
		titlePosition,
		radius,
		startAngle,
		roseType,
		showLabels,
		labelPosition,
		showValues,
		showPercentages,
		labelFormat,
		legend,
		tooltip,
		selectedMode,
		emphasis,
		animate,
		animationDuration,
		customOption
	]);
	const chartEvents = useMemo(() => {
		const events = {};
		if (onDataPointClick) events.click = (params, chart) => {
			onDataPointClick(params, {
				chart,
				event: params
			});
		};
		if (onDataPointHover) events.mouseover = (params, chart) => {
			onDataPointHover(params, {
				chart,
				event: params
			});
		};
		return Object.keys(events).length > 0 ? events : void 0;
	}, [onDataPointClick, onDataPointHover]);
	const { containerRef, loading: chartLoading, error, getEChartsInstance, resize, showLoading, hideLoading } = useECharts({
		option: chartOption,
		theme,
		loading,
		events: chartEvents,
		onChartReady
	});
	const exportImage = (format = "png") => {
		const chart = getEChartsInstance();
		if (!chart) return "";
		return chart.getDataURL({
			type: format,
			pixelRatio: 2,
			backgroundColor: backgroundColor || "#fff"
		});
	};
	const highlight = (dataIndex) => {
		const chart = getEChartsInstance();
		if (!chart) return;
		chart.dispatchAction({
			type: "highlight",
			seriesIndex: 0,
			dataIndex
		});
	};
	const clearHighlight = () => {
		const chart = getEChartsInstance();
		if (!chart) return;
		chart.dispatchAction({ type: "downplay" });
	};
	const selectSlice = (dataIndex) => {
		const chart = getEChartsInstance();
		if (!chart) return;
		chart.dispatchAction({
			type: "pieSelect",
			seriesIndex: 0,
			dataIndex
		});
	};
	const unselectSlice = (dataIndex) => {
		const chart = getEChartsInstance();
		if (!chart) return;
		chart.dispatchAction({
			type: "pieUnSelect",
			seriesIndex: 0,
			dataIndex
		});
	};
	const updateData = (newData) => {
		const chart = getEChartsInstance();
		if (!chart) return;
		const newOption = buildPieChartOption({
			data: newData,
			nameField,
			valueField,
			theme,
			colorPalette,
			backgroundColor,
			title,
			subtitle,
			titlePosition,
			radius,
			startAngle,
			roseType,
			showLabels,
			labelPosition,
			showValues,
			showPercentages,
			labelFormat,
			legend,
			tooltip,
			selectedMode,
			emphasis,
			animate,
			animationDuration,
			customOption
		});
		chart.setOption(newOption);
	};
	useImperativeHandle(ref, () => ({
		getChart: getEChartsInstance,
		exportImage,
		resize,
		showLoading: () => showLoading(),
		hideLoading,
		highlight,
		clearHighlight,
		updateData,
		selectSlice,
		unselectSlice
	}), [
		getEChartsInstance,
		exportImage,
		resize,
		showLoading,
		hideLoading,
		highlight,
		clearHighlight,
		updateData,
		selectSlice,
		unselectSlice
	]);
	if (error) return /* @__PURE__ */ jsxs("div", {
		className: `aqc-charts-error ${className || ""}`,
		style: {
			width,
			height,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			color: "#ff4d4f",
			fontSize: "14px",
			border: "1px dashed #ff4d4f",
			borderRadius: "4px",
			...style
		},
		children: ["Error: ", error.message || "Failed to render chart"]
	});
	const containerStyle = useMemo(() => ({
		width,
		height,
		position: "relative",
		...style
	}), [
		width,
		height,
		style
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: `aqc-charts-container ${className || ""}`,
		style: containerStyle,
		...restProps,
		children: [/* @__PURE__ */ jsx("div", {
			ref: containerRef,
			style: {
				width: "100%",
				height: "100%"
			}
		}), (chartLoading || loading) && /* @__PURE__ */ jsxs("div", {
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
				fontSize: "14px",
				color: "#666"
			},
			children: [/* @__PURE__ */ jsx("div", {
				className: "aqc-charts-spinner",
				style: {
					width: "20px",
					height: "20px",
					border: "2px solid #f3f3f3",
					borderTop: "2px solid #1890ff",
					borderRadius: "50%",
					animation: "spin 1s linear infinite",
					marginRight: "8px"
				}
			}), "Loading..."]
		})]
	});
});
PieChart.displayName = "PieChart";

//#endregion
//#region src/components/ScatterChart.tsx
/**
* Ergonomic ScatterChart component with intuitive props
* 
* @example
* // Simple scatter plot with object data
* <ScatterChart
*   data={[
*     { x: 10, y: 20 },
*     { x: 15, y: 25 },
*     { x: 20, y: 18 }
*   ]}
*   xField="x"
*   yField="y"
*   pointSize={8}
* />
* 
* @example
* // Bubble chart with size dimension
* <ScatterChart
*   data={[
*     { sales: 100, profit: 20, employees: 50 },
*     { sales: 120, profit: 25, employees: 60 },
*     { sales: 110, profit: 18, employees: 45 }
*   ]}
*   xField="sales"
*   yField="profit"
*   sizeField="employees"
*   pointSize={[5, 30]}
* />
* 
* @example
* // Multiple series with explicit configuration
* <ScatterChart
*   series={[
*     {
*       name: 'Dataset A',
*       data: [{ x: 10, y: 20 }, { x: 15, y: 25 }],
*       color: '#ff6b6b',
*       pointSize: 10
*     },
*     {
*       name: 'Dataset B',
*       data: [{ x: 5, y: 12 }, { x: 8, y: 18 }],
*       color: '#4ecdc4',
*       pointShape: 'square'
*     }
*   ]}
*   xField="x"
*   yField="y"
* />
*/
const ScatterChart = forwardRef(({ width = "100%", height = 400, className, style, data, xField = "x", yField = "y", sizeField, colorField, seriesField, series, theme = "light", colorPalette, backgroundColor, title, subtitle, titlePosition = "center", pointSize = 10, pointShape = "circle", pointOpacity = .8, xAxis, yAxis, legend, tooltip, showTrendline = false, trendlineType = "linear", loading = false, disabled = false, animate = true, animationDuration, onChartReady, onDataPointClick, onDataPointHover, customOption, responsive = true,...restProps }, ref) => {
	const chartOption = useMemo(() => {
		const optionProps = {
			data: data || [],
			xField,
			yField,
			theme,
			colorPalette,
			backgroundColor,
			title,
			subtitle,
			titlePosition,
			pointSize,
			pointShape,
			pointOpacity,
			animate,
			animationDuration,
			customOption
		};
		if (sizeField) optionProps.sizeField = sizeField;
		if (colorField) optionProps.colorField = colorField;
		if (seriesField) optionProps.seriesField = seriesField;
		if (series) optionProps.series = series;
		if (xAxis) optionProps.xAxis = xAxis;
		if (yAxis) optionProps.yAxis = yAxis;
		if (legend) optionProps.legend = legend;
		if (tooltip) optionProps.tooltip = tooltip;
		if (showTrendline) optionProps.showTrendline = showTrendline;
		if (trendlineType) optionProps.trendlineType = trendlineType;
		return buildScatterChartOption(optionProps);
	}, [
		data,
		xField,
		yField,
		sizeField,
		colorField,
		seriesField,
		series,
		theme,
		colorPalette,
		backgroundColor,
		title,
		subtitle,
		titlePosition,
		pointSize,
		pointShape,
		pointOpacity,
		xAxis,
		yAxis,
		legend,
		tooltip,
		showTrendline,
		trendlineType,
		animate,
		animationDuration,
		customOption
	]);
	const chartEvents = useMemo(() => {
		const events = {};
		if (onDataPointClick) events.click = (params, chart) => {
			onDataPointClick(params, {
				chart,
				event: params
			});
		};
		if (onDataPointHover) events.mouseover = (params, chart) => {
			onDataPointHover(params, {
				chart,
				event: params
			});
		};
		return Object.keys(events).length > 0 ? events : void 0;
	}, [onDataPointClick, onDataPointHover]);
	const { containerRef, loading: chartLoading, error, getEChartsInstance, resize, showLoading, hideLoading } = useECharts({
		option: chartOption,
		theme,
		loading,
		events: chartEvents,
		onChartReady
	});
	const exportImage = (format = "png") => {
		const chart = getEChartsInstance();
		if (!chart) return "";
		return chart.getDataURL({
			type: format,
			pixelRatio: 2,
			backgroundColor: backgroundColor || "#fff"
		});
	};
	const highlight = (dataIndex, seriesIndex = 0) => {
		const chart = getEChartsInstance();
		if (!chart) return;
		chart.dispatchAction({
			type: "highlight",
			seriesIndex,
			dataIndex
		});
	};
	const clearHighlight = () => {
		const chart = getEChartsInstance();
		if (!chart) return;
		chart.dispatchAction({ type: "downplay" });
	};
	const updateData = (newData) => {
		const chart = getEChartsInstance();
		if (!chart) return;
		const optionProps = {
			data: newData,
			xField,
			yField,
			theme,
			colorPalette,
			backgroundColor,
			title,
			subtitle,
			titlePosition,
			pointSize,
			pointShape,
			pointOpacity,
			animate,
			animationDuration,
			customOption
		};
		if (sizeField) optionProps.sizeField = sizeField;
		if (colorField) optionProps.colorField = colorField;
		if (seriesField) optionProps.seriesField = seriesField;
		if (series) optionProps.series = series;
		if (xAxis) optionProps.xAxis = xAxis;
		if (yAxis) optionProps.yAxis = yAxis;
		if (legend) optionProps.legend = legend;
		if (tooltip) optionProps.tooltip = tooltip;
		if (showTrendline) optionProps.showTrendline = showTrendline;
		if (trendlineType) optionProps.trendlineType = trendlineType;
		const newOption = buildScatterChartOption(optionProps);
		chart.setOption(newOption);
	};
	useImperativeHandle(ref, () => ({
		getChart: getEChartsInstance,
		exportImage,
		resize,
		showLoading: () => showLoading(),
		hideLoading,
		highlight,
		clearHighlight,
		updateData
	}), [
		getEChartsInstance,
		exportImage,
		resize,
		showLoading,
		hideLoading,
		highlight,
		clearHighlight,
		updateData
	]);
	if (error) return /* @__PURE__ */ jsxs("div", {
		className: `aqc-charts-error ${className || ""}`,
		style: {
			width,
			height,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			color: "#ff4d4f",
			fontSize: "14px",
			border: "1px dashed #ff4d4f",
			borderRadius: "4px",
			...style
		},
		children: ["Error: ", error.message || "Failed to render chart"]
	});
	const containerStyle = useMemo(() => ({
		width,
		height,
		position: "relative",
		...style
	}), [
		width,
		height,
		style
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: `aqc-charts-container ${className || ""}`,
		style: containerStyle,
		...restProps,
		children: [/* @__PURE__ */ jsx("div", {
			ref: containerRef,
			style: {
				width: "100%",
				height: "100%"
			}
		}), (chartLoading || loading) && /* @__PURE__ */ jsxs("div", {
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
				fontSize: "14px",
				color: "#666"
			},
			children: [/* @__PURE__ */ jsx("div", {
				className: "aqc-charts-spinner",
				style: {
					width: "20px",
					height: "20px",
					border: "2px solid #f3f3f3",
					borderTop: "2px solid #1890ff",
					borderRadius: "50%",
					animation: "spin 1s linear infinite",
					marginRight: "8px"
				}
			}), "Loading..."]
		})]
	});
});
ScatterChart.displayName = "ScatterChart";

//#endregion
//#region src/components/ClusterChart.tsx
/**
* Ergonomic ClusterChart component with intuitive props
* Uses K-means clustering to automatically group data points and visualize clusters
* 
* @example
* // Simple cluster chart with object data
* <ClusterChart
*   data={[
*     { x: 10, y: 20 },
*     { x: 15, y: 25 },
*     { x: 50, y: 60 },
*     { x: 55, y: 65 }
*   ]}
*   xField="x"
*   yField="y"
*   clusterCount={2}
* />
* 
* @example
* // Advanced clustering with custom styling
* <ClusterChart
*   data={customerData}
*   xField="age"
*   yField="income"
*   nameField="name"
*   title="Customer Segmentation"
*   clusterCount={4}
*   clusterColors={['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4']}
*   pointSize={12}
*   showVisualMap={true}
*   visualMapPosition="right"
* />
*/
const ClusterChart = forwardRef(({ width = "100%", height = 400, className, style, data, xField = "x", yField = "y", nameField, clusterCount = 6, clusterMethod = "kmeans", theme = "light", colorPalette, backgroundColor, title, subtitle, titlePosition = "center", pointSize = 15, pointOpacity = .8, showClusterCenters = false, centerSymbol = "diamond", centerSize = 20, clusterColors, showVisualMap = true, visualMapPosition = "left", xAxis, yAxis, legend, tooltip, loading = false, disabled = false, animate = true, animationDuration, onChartReady, onDataPointClick, onDataPointHover, customOption, responsive = true,...restProps }, ref) => {
	const dataKey = useMemo(() => JSON.stringify(data), [data]);
	const chartOption = useMemo(() => {
		const optionProps = {
			data: data || [],
			xField,
			yField,
			nameField,
			clusterCount,
			clusterMethod,
			theme,
			colorPalette: clusterColors || colorPalette,
			backgroundColor,
			title,
			subtitle,
			titlePosition,
			pointSize,
			pointOpacity,
			showClusterCenters,
			centerSymbol,
			centerSize,
			showVisualMap,
			visualMapPosition,
			animate,
			animationDuration,
			customOption
		};
		if (xAxis) optionProps.xAxis = xAxis;
		if (yAxis) optionProps.yAxis = yAxis;
		if (legend) optionProps.legend = legend;
		if (tooltip) optionProps.tooltip = tooltip;
		return buildClusterChartOption(optionProps);
	}, [
		dataKey,
		xField,
		yField,
		nameField,
		clusterCount,
		clusterMethod,
		theme,
		clusterColors,
		colorPalette,
		backgroundColor,
		title,
		subtitle,
		titlePosition,
		pointSize,
		pointOpacity,
		showClusterCenters,
		centerSymbol,
		centerSize,
		showVisualMap,
		visualMapPosition,
		xAxis,
		yAxis,
		legend,
		tooltip,
		animate,
		animationDuration,
		customOption
	]);
	const chartEvents = useMemo(() => {
		const events = {};
		if (onDataPointClick) events.click = (params, chart) => {
			onDataPointClick(params, {
				chart,
				event: params
			});
		};
		if (onDataPointHover) events.mouseover = (params, chart) => {
			onDataPointHover(params, {
				chart,
				event: params
			});
		};
		return Object.keys(events).length > 0 ? events : void 0;
	}, [onDataPointClick, onDataPointHover]);
	const { containerRef, loading: chartLoading, error, getEChartsInstance, resize, showLoading, hideLoading } = useECharts({
		option: chartOption,
		theme,
		loading,
		events: chartEvents,
		onChartReady
	});
	const exportImage = (format = "png") => {
		const chart = getEChartsInstance();
		if (!chart) return "";
		return chart.getDataURL({
			type: format,
			pixelRatio: 2,
			backgroundColor: backgroundColor || "#fff"
		});
	};
	const highlight = (dataIndex, seriesIndex = 0) => {
		const chart = getEChartsInstance();
		if (!chart) return;
		chart.dispatchAction({
			type: "highlight",
			seriesIndex,
			dataIndex
		});
	};
	const clearHighlight = () => {
		const chart = getEChartsInstance();
		if (!chart) return;
		chart.dispatchAction({ type: "downplay" });
	};
	const updateData = (newData) => {
		const chart = getEChartsInstance();
		if (!chart) return;
		const optionProps = {
			data: newData,
			xField,
			yField,
			nameField,
			clusterCount,
			clusterMethod,
			theme,
			colorPalette: clusterColors || colorPalette,
			backgroundColor,
			title,
			subtitle,
			titlePosition,
			pointSize,
			pointOpacity,
			showClusterCenters,
			centerSymbol,
			centerSize,
			showVisualMap,
			visualMapPosition,
			animate,
			animationDuration,
			customOption
		};
		if (xAxis) optionProps.xAxis = xAxis;
		if (yAxis) optionProps.yAxis = yAxis;
		if (legend) optionProps.legend = legend;
		if (tooltip) optionProps.tooltip = tooltip;
		const newOption = buildClusterChartOption(optionProps);
		chart.setOption(newOption);
	};
	useImperativeHandle(ref, () => ({
		getChart: getEChartsInstance,
		exportImage,
		resize,
		showLoading: () => showLoading(),
		hideLoading,
		highlight,
		clearHighlight,
		updateData
	}), [
		getEChartsInstance,
		exportImage,
		resize,
		showLoading,
		hideLoading,
		highlight,
		clearHighlight,
		updateData
	]);
	if (error) return /* @__PURE__ */ jsxs("div", {
		className: `aqc-charts-error ${className || ""}`,
		style: {
			width,
			height,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			color: "#ff4d4f",
			fontSize: "14px",
			border: "1px dashed #ff4d4f",
			borderRadius: "4px",
			...style
		},
		children: ["Error: ", error.message || "Failed to render chart"]
	});
	const containerStyle = useMemo(() => ({
		width,
		height,
		position: "relative",
		...style
	}), [
		width,
		height,
		style
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: `aqc-charts-container ${className || ""}`,
		style: containerStyle,
		...restProps,
		children: [/* @__PURE__ */ jsx("div", {
			ref: containerRef,
			style: {
				width: "100%",
				height: "100%"
			}
		}), (chartLoading || loading) && /* @__PURE__ */ jsxs("div", {
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
				fontSize: "14px",
				color: "#666"
			},
			children: [/* @__PURE__ */ jsx("div", {
				className: "aqc-charts-spinner",
				style: {
					width: "20px",
					height: "20px",
					border: "2px solid #f3f3f3",
					borderTop: "2px solid #1890ff",
					borderRadius: "50%",
					animation: "spin 1s linear infinite",
					marginRight: "8px"
				}
			}), "Loading..."]
		})]
	});
});
ClusterChart.displayName = "ClusterChart";

//#endregion
//#region src/components/legacy/OldCalendarHeatmapChart.tsx
const OldCalendarHeatmapChart = forwardRef(({ data, year, calendar = {}, visualMap = {}, tooltipFormatter, title,...props }, ref) => {
	const chartOption = useMemo(() => {
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
	return /* @__PURE__ */ jsx(BaseChart, {
		ref,
		option: chartOption,
		...props
	});
});
OldCalendarHeatmapChart.displayName = "OldCalendarHeatmapChart";

//#endregion
//#region src/components/legacy/OldStackedBarChart.tsx
const OldStackedBarChart = forwardRef(({ data, horizontal = false, showPercentage = false, showValues = false, barWidth = "60%", barMaxWidth, stackName = "total", showLegend = true, legend, tooltip, xAxis, yAxis, grid, series: customSeries,...props }, ref) => {
	const series = useMemo(() => {
		if (customSeries) return customSeries;
		const { series: rawSeries } = data;
		const totalData = [];
		if (showPercentage) for (let i = 0; i < data.categories.length; i++) {
			let sum = 0;
			for (const seriesItem of rawSeries) sum += seriesItem.data[i] || 0;
			totalData.push(sum);
		}
		return rawSeries.map((seriesItem) => {
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
	}, [
		data,
		showPercentage,
		stackName,
		barWidth,
		barMaxWidth,
		showValues,
		horizontal,
		customSeries
	]);
	const chartOption = useMemo(() => ({
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
			} },
			...tooltip
		},
		legend: showLegend && data?.series && data.series.length > 1 ? {
			data: data.series.map((s) => s.name),
			top: 20,
			selectedMode: "multiple",
			...legend
		} : void 0,
		grid: {
			left: 100,
			right: 100,
			top: showLegend && data?.series && data.series.length > 1 ? 60 : 40,
			bottom: 50,
			containLabel: true,
			...grid
		},
		xAxis: horizontal ? {
			type: "value",
			...showPercentage && { axisLabel: { formatter: (value) => `${Math.round(value * 100)}%` } },
			...xAxis
		} : {
			type: "category",
			data: data.categories,
			...xAxis
		},
		yAxis: horizontal ? {
			type: "category",
			data: data.categories,
			...yAxis
		} : {
			type: "value",
			...showPercentage && { axisLabel: { formatter: (value) => `${Math.round(value * 100)}%` } },
			...yAxis
		},
		series
	}), [
		data,
		horizontal,
		showPercentage,
		showLegend,
		tooltip,
		legend,
		grid,
		xAxis,
		yAxis,
		series
	]);
	return /* @__PURE__ */ jsx(BaseChart, {
		ref,
		option: chartOption,
		...props
	});
});
OldStackedBarChart.displayName = "OldStackedBarChart";

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
//#region src/components/legacy/OldSankeyChart.tsx
const OldSankeyChart = forwardRef(({ data, layout = "none", orient = "horizontal", nodeAlign = "justify", nodeGap = 8, nodeWidth = 20, iterations = 32, title, option: customOption,...props }, ref) => {
	const chartOption = useMemo(() => {
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
	return /* @__PURE__ */ jsx(BaseChart, {
		ref,
		option: chartOption,
		...props
	});
});
OldSankeyChart.displayName = "OldSankeyChart";

//#endregion
//#region src/components/legacy/OldScatterChart.tsx
const OldScatterChart = forwardRef(({ data, symbolSize = 10, symbol = "circle", large = false, largeThreshold = 2e3, progressive = 400, progressiveThreshold = 3e3, enableAdvancedFeatures = false, title, option: customOption, series: customSeries,...props }, ref) => {
	const chartOption = useMemo(() => {
		if (customSeries) return {
			xAxis: {
				type: "value",
				scale: true,
				...data.xAxis
			},
			yAxis: {
				type: "value",
				scale: true,
				...data.yAxis
			},
			series: customSeries,
			tooltip: {
				trigger: "item",
				formatter: (params) => {
					const value = params.value;
					const name = params.seriesName;
					const dataName = params.name || "";
					if (Array.isArray(value)) {
						if (value.length === 3) return `${name}<br/>${dataName}<br/>X: ${value[0]}<br/>Y: ${value[1]}<br/>Size: ${value[2]}`;
						return `${name}<br/>${dataName}<br/>X: ${value[0]}<br/>Y: ${value[1]}`;
					}
					return `${name}<br/>${dataName}<br/>Value: ${value}`;
				}
			},
			...title && { title: {
				text: title,
				left: "center"
			} },
			...customOption && customOption
		};
		if (!data?.series || !Array.isArray(data.series)) return { series: [] };
		const baseOption = {
			xAxis: {
				type: "value",
				scale: true,
				...data.xAxis
			},
			yAxis: {
				type: "value",
				scale: true,
				...data.yAxis
			},
			series: data.series.map((series) => ({
				...series,
				type: "scatter",
				symbolSize: series.symbolSize ?? symbolSize,
				symbol: series.symbol ?? symbol,
				large: series.large ?? large,
				largeThreshold: series.largeThreshold ?? largeThreshold,
				progressive: series.progressive ?? progressive,
				progressiveThreshold: series.progressiveThreshold ?? progressiveThreshold
			})),
			tooltip: {
				trigger: "item",
				formatter: (params) => {
					const value = params.value;
					const name = params.seriesName;
					const dataName = params.name || "";
					if (Array.isArray(value)) {
						if (value.length === 3) return `${name}<br/>${dataName}<br/>X: ${value[0]}<br/>Y: ${value[1]}<br/>Size: ${value[2]}`;
						return `${name}<br/>${dataName}<br/>X: ${value[0]}<br/>Y: ${value[1]}`;
					}
					return `${name}<br/>${dataName}<br/>Value: ${value}`;
				}
			},
			...title && { title: {
				text: title,
				left: "center"
			} }
		};
		return customOption ? {
			...baseOption,
			...customOption
		} : baseOption;
	}, [
		data,
		symbolSize,
		symbol,
		large,
		largeThreshold,
		progressive,
		progressiveThreshold,
		enableAdvancedFeatures,
		title,
		customOption,
		customSeries
	]);
	return /* @__PURE__ */ jsx(BaseChart, {
		ref,
		option: chartOption,
		...props
	});
});
OldScatterChart.displayName = "OldScatterChart";

//#endregion
//#region src/components/legacy/OldClusterChart.tsx
const DEFAULT_COLORS = [
	"#37A2DA",
	"#e06343",
	"#37a354",
	"#b55dba",
	"#b5bd48",
	"#8378EA",
	"#96BFFF"
];
const OldClusterChart = forwardRef(({ data, clusterCount = 6, outputClusterIndexDimension = 2, colors = DEFAULT_COLORS, symbolSize = 15, itemStyle = { borderColor: "#555" }, visualMapPosition = "left", gridLeft = 120, title, option: customOption,...props }, ref) => {
	const chartOption = useMemo(() => {
		if (!data?.data || !Array.isArray(data.data)) return { series: [] };
		const sourceData = data.data.map((point) => [point.value[0], point.value[1]]);
		console.log("ClusterChart sourceData sample:", sourceData.slice(0, 3));
		console.log("ClusterChart config:", {
			clusterCount,
			outputClusterIndexDimension
		});
		const pieces = [];
		for (let i = 0; i < clusterCount; i++) pieces.push({
			value: i,
			label: `cluster ${i}`,
			color: colors[i] || colors[0] || DEFAULT_COLORS[0] || "#37A2DA"
		});
		const baseOption = {
			dataset: [{ source: sourceData }, { transform: {
				type: "ecStat:clustering",
				print: true,
				config: {
					clusterCount,
					outputType: "single",
					outputClusterIndexDimension
				}
			} }],
			tooltip: {
				position: "top",
				formatter: (params) => {
					const [x, y, cluster] = params.value;
					const name = params.name || "";
					return `${name ? name + "<br/>" : ""}X: ${x}<br/>Y: ${y}<br/>Cluster: ${cluster}`;
				}
			},
			visualMap: {
				type: "piecewise",
				top: visualMapPosition === "top" ? 10 : visualMapPosition === "bottom" ? "bottom" : "middle",
				...visualMapPosition === "left" && { left: 10 },
				...visualMapPosition === "right" && {
					left: "right",
					right: 10
				},
				...visualMapPosition === "bottom" && { bottom: 10 },
				min: 0,
				max: clusterCount,
				splitNumber: clusterCount,
				dimension: outputClusterIndexDimension,
				pieces
			},
			grid: { left: gridLeft },
			xAxis: {
				type: "value",
				scale: true,
				...data.xAxis
			},
			yAxis: {
				type: "value",
				scale: true,
				...data.yAxis
			},
			series: {
				type: "scatter",
				encode: {
					tooltip: [0, 1],
					x: 0,
					y: 1
				},
				symbolSize,
				itemStyle,
				datasetIndex: 1
			},
			...title && { title: {
				text: title,
				left: "center"
			} }
		};
		return customOption ? {
			...baseOption,
			...customOption
		} : baseOption;
	}, [
		data,
		clusterCount,
		outputClusterIndexDimension,
		colors,
		symbolSize,
		itemStyle,
		visualMapPosition,
		gridLeft,
		title,
		customOption
	]);
	return /* @__PURE__ */ jsx(BaseChart, {
		ref,
		option: chartOption,
		...props
	});
});
OldClusterChart.displayName = "OldClusterChart";

//#endregion
//#region src/components/legacy/OldRegressionChart.tsx
const OldRegressionChart = forwardRef(({ data, method = "linear", formulaOn = "end", scatterName = "scatter", lineName = "regression", scatterColor = "#5470c6", lineColor = "#91cc75", symbolSize = 8, showFormula = true, formulaFontSize = 16, formulaPosition = { dx: -20 }, splitLineStyle = "dashed", legendPosition = "bottom", title, option: customOption,...props }, ref) => {
	const chartOption = useMemo(() => {
		if (!data?.data || !Array.isArray(data.data)) return { series: [] };
		const sourceData = data.data.map((point) => [point.value[0], point.value[1]]);
		const baseOption = {
			dataset: [{ source: sourceData }, { transform: {
				type: "ecStat:regression",
				config: {
					method,
					...formulaOn !== false && { formulaOn }
				}
			} }],
			...title && { title: {
				text: title,
				subtext: `By ecStat.regression (${method})`,
				sublink: "https://github.com/ecomfe/echarts-stat",
				left: "center"
			} },
			legend: {
				[legendPosition]: legendPosition === "top" || legendPosition === "bottom" ? 5 : void 0,
				[legendPosition === "left" ? "left" : legendPosition === "right" ? "right" : "bottom"]: legendPosition === "left" || legendPosition === "right" ? 5 : 5
			},
			tooltip: {
				trigger: "axis",
				axisPointer: { type: "cross" }
			},
			xAxis: {
				type: "value",
				scale: true,
				splitLine: { lineStyle: { type: splitLineStyle } },
				...data.xAxis
			},
			yAxis: {
				type: "value",
				scale: true,
				splitLine: { lineStyle: { type: splitLineStyle } },
				...data.yAxis
			},
			series: [{
				name: scatterName,
				type: "scatter",
				itemStyle: { color: scatterColor },
				symbolSize
			}, {
				name: lineName,
				type: "line",
				datasetIndex: 1,
				symbolSize: .1,
				symbol: "circle",
				itemStyle: { color: lineColor },
				lineStyle: {
					color: lineColor,
					width: 2
				},
				...showFormula && {
					label: {
						show: true,
						fontSize: formulaFontSize
					},
					labelLayout: formulaPosition
				},
				encode: {
					label: 2,
					tooltip: 1
				}
			}]
		};
		return customOption ? {
			...baseOption,
			...customOption
		} : baseOption;
	}, [
		data,
		method,
		formulaOn,
		scatterName,
		lineName,
		scatterColor,
		lineColor,
		symbolSize,
		showFormula,
		formulaFontSize,
		formulaPosition,
		splitLineStyle,
		legendPosition,
		title,
		customOption
	]);
	return /* @__PURE__ */ jsx(BaseChart, {
		ref,
		option: chartOption,
		...props
	});
});
OldRegressionChart.displayName = "OldRegressionChart";

//#endregion
//#region src/components/legacy/OldGanttChart.tsx
const OldGanttChart = forwardRef(({ data, heightRatio = .6, showDataZoom = true, draggable: _draggable = false, showLegend = false, legend, tooltip, xAxis, yAxis, grid, onTaskDrag: _onTaskDrag,...props }, ref) => {
	const processedData = useMemo(() => {
		if (!data?.tasks || !data?.categories) return {
			tasks: [],
			categories: []
		};
		const categoryMap = new Map(data.categories.map((cat, index) => [cat.name, index]));
		const processedTasks = data.tasks.map((task) => {
			const categoryIndex = categoryMap.get(task.category) ?? 0;
			return [
				categoryIndex,
				new Date(task.startTime).getTime(),
				new Date(task.endTime).getTime(),
				task.name,
				task.vip || false,
				task.id,
				task.color
			];
		});
		const processedCategories = data.categories.map((cat, index) => [
			index,
			cat.name,
			cat.label || cat.name
		]);
		return {
			tasks: processedTasks,
			categories: processedCategories
		};
	}, [data]);
	const renderGanttItem = useMemo(() => {
		return (params, api) => {
			const categoryIndex = api.value(0);
			const timeArrival = api.coord([api.value(1), categoryIndex]);
			const timeDeparture = api.coord([api.value(2), categoryIndex]);
			const barLength = timeDeparture[0] - timeArrival[0];
			const barHeight = api.size([0, 1])[1] * heightRatio;
			const x = timeArrival[0];
			const y = timeArrival[1] - barHeight;
			const taskName = api.value(3) + "";
			const isVip = api.value(4);
			const taskColor = api.value(6);
			const textWidth = taskName.length * 6;
			const showText = barLength > textWidth + 40 && x + barLength >= 180;
			const clipRect = (rect) => {
				const coordSys = params.coordSys;
				return {
					x: Math.max(rect.x, coordSys.x),
					y: Math.max(rect.y, coordSys.y),
					width: Math.min(rect.width, coordSys.x + coordSys.width - Math.max(rect.x, coordSys.x)),
					height: Math.min(rect.height, coordSys.y + coordSys.height - Math.max(rect.y, coordSys.y))
				};
			};
			const rectNormal = clipRect({
				x,
				y,
				width: barLength,
				height: barHeight
			});
			const rectVip = clipRect({
				x,
				y,
				width: barLength / 2,
				height: barHeight
			});
			const children = [{
				type: "rect",
				shape: rectNormal,
				style: {
					fill: taskColor || api.style().fill,
					stroke: api.style().stroke
				}
			}];
			if (isVip) children.push({
				type: "rect",
				shape: rectVip,
				style: {
					fill: "#ddb30b",
					stroke: "transparent"
				}
			});
			if (showText) children.push({
				type: "rect",
				shape: rectNormal,
				style: {
					fill: "transparent",
					stroke: "transparent",
					text: taskName,
					textFill: "#fff",
					textAlign: "center",
					textVerticalAlign: "middle",
					fontSize: 12
				}
			});
			return {
				type: "group",
				children
			};
		};
	}, [heightRatio]);
	const renderAxisLabelItem = useMemo(() => {
		return (params, api) => {
			const y = api.coord([0, api.value(0)])[1];
			if (y < params.coordSys.y + 5) return;
			return {
				type: "group",
				position: [10, y],
				children: [
					{
						type: "path",
						shape: {
							d: "M0,0 L0,-20 L30,-20 C42,-20 38,-1 50,-1 L70,-1 L70,0 Z",
							x: 0,
							y: -20,
							width: 90,
							height: 20,
							layout: "cover"
						},
						style: { fill: "#368c6c" }
					},
					{
						type: "text",
						style: {
							x: 24,
							y: -3,
							text: api.value(1),
							textVerticalAlign: "bottom",
							textAlign: "center",
							fill: "#fff",
							fontSize: 12
						}
					},
					{
						type: "text",
						style: {
							x: 75,
							y: -2,
							text: api.value(2),
							textVerticalAlign: "bottom",
							textAlign: "center",
							fill: "#000",
							fontSize: 12
						}
					}
				]
			};
		};
	}, []);
	const chartOption = useMemo(() => ({
		animation: false,
		tooltip: {
			formatter: (params) => {
				if (Array.isArray(params)) {
					const param = params[0];
					if (param?.seriesIndex === 0) {
						const startTime = new Date(param.value[1]).toLocaleString();
						const endTime = new Date(param.value[2]).toLocaleString();
						const taskName = param.value[3];
						const category = data.categories[param.value[0]]?.name || "Unknown";
						return `
                            <strong>${taskName}</strong><br/>
                            Category: ${category}<br/>
                            Start: ${startTime}<br/>
                            End: ${endTime}
                        `;
					}
				}
				return "";
			},
			...tooltip
		},
		grid: {
			show: true,
			top: 70,
			bottom: showDataZoom ? 40 : 20,
			left: 100,
			right: 20,
			backgroundColor: "#fff",
			borderWidth: 0,
			...grid
		},
		xAxis: {
			type: "time",
			position: "top",
			splitLine: { lineStyle: { color: ["#E9EDFF"] } },
			axisLine: { show: false },
			axisTick: { lineStyle: { color: "#929ABA" } },
			axisLabel: {
				color: "#929ABA",
				inside: false,
				align: "center"
			},
			...xAxis
		},
		yAxis: {
			axisTick: { show: false },
			splitLine: { show: false },
			axisLine: { show: false },
			axisLabel: { show: false },
			min: 0,
			max: processedData.categories.length,
			...yAxis
		},
		...showDataZoom && { dataZoom: [
			{
				type: "slider",
				xAxisIndex: 0,
				filterMode: "weakFilter",
				height: 20,
				bottom: 0,
				start: 0,
				end: 50,
				handleIcon: "path://M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
				handleSize: "80%",
				showDetail: false
			},
			{
				type: "inside",
				xAxisIndex: 0,
				filterMode: "weakFilter",
				start: 0,
				end: 50,
				zoomOnMouseWheel: false,
				moveOnMouseMove: true
			},
			{
				type: "slider",
				yAxisIndex: 0,
				zoomLock: true,
				width: 10,
				right: 10,
				top: 70,
				bottom: 40,
				start: 0,
				end: 100,
				handleSize: 0,
				showDetail: false
			},
			{
				type: "inside",
				yAxisIndex: 0,
				start: 0,
				end: 100,
				zoomOnMouseWheel: false,
				moveOnMouseMove: true,
				moveOnMouseWheel: true
			}
		] },
		legend: showLegend ? {
			top: 20,
			...legend
		} : void 0,
		series: [{
			id: "ganttData",
			type: "custom",
			renderItem: renderGanttItem,
			dimensions: [
				"categoryIndex",
				"startTime",
				"endTime",
				"taskName",
				"vip",
				"id",
				"color"
			],
			encode: {
				x: [1, 2],
				y: 0,
				tooltip: [
					0,
					1,
					2,
					3
				]
			},
			data: processedData.tasks
		}, {
			type: "custom",
			renderItem: renderAxisLabelItem,
			dimensions: [
				"categoryIndex",
				"name",
				"label"
			],
			encode: {
				x: -1,
				y: 0
			},
			data: processedData.categories
		}]
	}), [
		data.categories,
		processedData,
		showDataZoom,
		showLegend,
		tooltip,
		grid,
		xAxis,
		yAxis,
		legend,
		renderGanttItem,
		renderAxisLabelItem
	]);
	return /* @__PURE__ */ jsx(BaseChart, {
		ref,
		option: chartOption,
		...props
	});
});
OldGanttChart.displayName = "OldGanttChart";

//#endregion
//#region src/components/legacy/OldLineChart.tsx
const OldLineChart = forwardRef(({ data, smooth = false, area = false, stack = false, symbol = true, symbolSize = 4, connectNulls = false, title, option: customOption, series: customSeries,...props }, ref) => {
	const chartOption = useMemo(() => {
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
	return /* @__PURE__ */ jsx(BaseChart, {
		ref,
		option: chartOption,
		...props
	});
});
OldLineChart.displayName = "OldLineChart";

//#endregion
//#region src/components/legacy/OldBarChart.tsx
const OldBarChart = forwardRef(({ data, horizontal = false, stack = false, showValues = false, barWidth, barMaxWidth, showLegend = true, legend, tooltip, xAxis, yAxis, grid, series: customSeries,...props }, ref) => {
	const series = useMemo(() => {
		if (customSeries) return customSeries;
		if (!data?.series || !Array.isArray(data.series)) return [];
		return data.series.map((s) => ({
			name: s.name,
			type: "bar",
			data: s.data,
			stack: stack ? "total" : void 0,
			...barWidth && { barWidth },
			...barMaxWidth && { barMaxWidth },
			...s.color && { itemStyle: { color: s.color } },
			...showValues && { label: {
				show: true,
				position: horizontal ? "right" : "top"
			} }
		}));
	}, [
		data?.series,
		stack,
		barWidth,
		barMaxWidth,
		showValues,
		horizontal,
		customSeries
	]);
	const chartOption = useMemo(() => ({
		tooltip: {
			trigger: "axis",
			axisPointer: { type: "shadow" },
			...tooltip
		},
		grid: {
			left: "3%",
			right: "4%",
			bottom: "3%",
			top: showLegend && data?.series && data.series.length > 1 ? 60 : 40,
			containLabel: true,
			...grid
		},
		xAxis: horizontal ? {
			type: "value",
			...xAxis
		} : {
			type: "category",
			data: data?.categories || [],
			...xAxis
		},
		yAxis: horizontal ? {
			type: "category",
			data: data?.categories || [],
			...yAxis
		} : {
			type: "value",
			...yAxis
		},
		legend: showLegend && data?.series && data.series.length > 1 ? {
			data: data.series.map((s) => s.name),
			top: 20,
			...legend
		} : void 0,
		series
	}), [
		data?.categories,
		data?.series,
		horizontal,
		showLegend,
		tooltip,
		grid,
		xAxis,
		yAxis,
		legend,
		series
	]);
	return /* @__PURE__ */ jsx(BaseChart, {
		ref,
		option: chartOption,
		...props
	});
});
OldBarChart.displayName = "OldBarChart";

//#endregion
//#region src/components/legacy/OldPieChart.tsx
const OldPieChart = forwardRef(({ data, radius = ["40%", "70%"], center = ["50%", "50%"], roseType = false, showLabels = true, showLegend = true, legend, series: customSeries,...props }, ref) => {
	const series = useMemo(() => {
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
	const chartOption = useMemo(() => ({
		tooltip: {
			trigger: "item",
			formatter: "{a} <br/>{b}: {c} ({d}%)"
		},
		legend: {
			type: "scroll",
			orient: "vertical",
			right: 10,
			top: 20,
			bottom: 20,
			show: showLegend,
			data: data.map((item) => item.name),
			...legend
		},
		series
	}), [
		series,
		showLegend,
		legend,
		data
	]);
	return /* @__PURE__ */ jsx(BaseChart, {
		ref,
		option: chartOption,
		...props
	});
});
OldPieChart.displayName = "OldPieChart";

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
//#region src/utils/regression.ts
/**
* Extract coordinate points from scatter data
*/
function extractPoints(data) {
	return data.map((point) => {
		const value = point.value;
		if (Array.isArray(value) && value.length >= 2) return [value[0], value[1]];
		throw new Error("Invalid scatter data point format");
	});
}
/**
* Simple K-means clustering implementation
*/
function performKMeansClustering(points, k, maxIterations = 100) {
	if (points.length < k) throw new Error("Number of clusters cannot exceed number of points");
	const centroids = [];
	const xValues = points.map((p) => p.x);
	const yValues = points.map((p) => p.y);
	const minX = Math.min(...xValues);
	const maxX = Math.max(...xValues);
	const minY = Math.min(...yValues);
	const maxY = Math.max(...yValues);
	for (let i = 0; i < k; i++) centroids.push([minX + Math.random() * (maxX - minX), minY + Math.random() * (maxY - minY)]);
	let clusteredPoints = [...points];
	for (let iteration = 0; iteration < maxIterations; iteration++) {
		clusteredPoints = clusteredPoints.map((point) => {
			let minDistance = Infinity;
			let closestCluster = 0;
			for (let i = 0; i < k; i++) {
				const centroid = centroids[i];
				if (centroid) {
					const distance = Math.sqrt((point.x - centroid[0]) ** 2 + (point.y - centroid[1]) ** 2);
					if (distance < minDistance) {
						minDistance = distance;
						closestCluster = i;
					}
				}
			}
			return {
				...point,
				cluster: closestCluster
			};
		});
		const newCentroids = [];
		for (let i = 0; i < k; i++) {
			const clusterPoints = clusteredPoints.filter((p) => p.cluster === i);
			if (clusterPoints.length > 0) {
				const avgX = clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length;
				const avgY = clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length;
				newCentroids.push([avgX, avgY]);
			} else {
				const oldCentroid = centroids[i];
				if (oldCentroid) newCentroids.push(oldCentroid);
				else newCentroids.push([0, 0]);
			}
		}
		let hasConverged = true;
		for (let i = 0; i < k; i++) {
			const oldCentroid = centroids[i];
			const newCentroid = newCentroids[i];
			if (oldCentroid && newCentroid) {
				const distance = Math.sqrt((oldCentroid[0] - newCentroid[0]) ** 2 + (oldCentroid[1] - newCentroid[1]) ** 2);
				if (distance > .001) {
					hasConverged = false;
					break;
				}
			}
		}
		centroids.splice(0, centroids.length, ...newCentroids);
		if (hasConverged) break;
	}
	return {
		points: clusteredPoints,
		centroids,
		clusters: k
	};
}
/**
* Convert cluster points to scatter data format
*/
function clusterPointsToScatterData(clusterResult, colors = [
	"#ff6b6b",
	"#4ecdc4",
	"#45b7d1",
	"#96ceb4",
	"#ffeaa7",
	"#dda0dd",
	"#98d8c8",
	"#f7dc6f"
]) {
	return clusterResult.points.map((point) => ({
		value: [point.x, point.y],
		...point.name && { name: point.name },
		itemStyle: { color: colors[point.cluster ?? 0] || colors[0] }
	}));
}

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
    
    @keyframes spin {
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
    
    .aqc-charts-spinner {
      animation: spin 1s linear infinite;
    }
  `;
	document.head.appendChild(style);
}

//#endregion
export { BarChart, BaseChart, ClusterChart, LineChart, OldBarChart, OldCalendarHeatmapChart, OldClusterChart, OldGanttChart, OldLineChart, OldPieChart, OldRegressionChart, OldSankeyChart, OldScatterChart, OldStackedBarChart, PieChart, ScatterChart, clusterPointsToScatterData, darkTheme, extractPoints, lightTheme, performKMeansClustering, useChartEvents, useChartInstance, useChartOptions, useChartResize, useECharts };