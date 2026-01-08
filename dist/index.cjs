const require_OldPieChart = require('./OldPieChart-Cq-4VBAT.cjs');
const react = require_OldPieChart.__toESM(require("react"));
const react_jsx_runtime = require_OldPieChart.__toESM(require("react/jsx-runtime"));
const react_dom = require_OldPieChart.__toESM(require("react-dom"));

//#region src/hooks/useChartComponent.tsx
/**
* Shared hook that consolidates common chart component logic.
* Eliminates ~400 lines of duplicated code per chart component.
*
* @example
* ```tsx
* const LineChart = forwardRef<ErgonomicChartRef, LineChartProps>((props, ref) => {
*   const {
*     containerRef,
*     containerStyle,
*     domProps,
*     refMethods,
*     renderError,
*     renderLoading,
*     error,
*   } = useChartComponent({
*     props,
*     buildOption: buildLineChartOption,
*     chartType: 'line',
*   });
*
*   useImperativeHandle(ref, () => refMethods, [refMethods]);
*
*   if (error) return renderError();
*
*   return (
*     <div className={`aqc-charts-container ${props.className || ''}`} style={containerStyle} {...domProps}>
*       <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
*       {renderLoading()}
*     </div>
*   );
* });
* ```
*/
function useChartComponent({ props, buildOption, chartType: _chartType }) {
	const { width = "100%", height = 400, className, style, theme = "light", loading = false, logo, backgroundColor, onChartReady, onDataPointClick, onDataPointHover, onLegendDoubleClick, onSeriesDoubleClick, legendDoubleClickDelay = 300, enableLegendDoubleClickSelection = true,...restProps } = props;
	const chartOption = (0, react.useMemo)(() => {
		return buildOption(props);
	}, [buildOption, props]);
	const { containerRef, loading: chartLoading, error, getEChartsInstance, resize, showLoading, hideLoading } = require_OldPieChart.useECharts({
		option: chartOption,
		theme,
		loading,
		onChartReady
	});
	const chartInstance = getEChartsInstance();
	const { handleLegendClick, handleSeriesClick } = require_OldPieChart.useLegendDoubleClick({
		chartInstance,
		onLegendDoubleClick,
		onSeriesDoubleClick,
		delay: legendDoubleClickDelay,
		enableAutoSelection: enableLegendDoubleClickSelection
	});
	const stableEventHandlers = (0, react.useMemo)(() => {
		const handlers = {};
		if (onDataPointClick) handlers.click = (params) => {
			onDataPointClick(params, {
				chart: chartInstance,
				event: params
			});
		};
		if (onDataPointHover) handlers.mouseover = (params) => {
			onDataPointHover(params, {
				chart: chartInstance,
				event: params
			});
		};
		return handlers;
	}, [
		onDataPointClick,
		onDataPointHover,
		chartInstance
	]);
	const eventHandlersRef = (0, react.useRef)([]);
	(0, react.useEffect)(() => {
		if (!chartInstance) return;
		eventHandlersRef.current.forEach(([event, handler]) => {
			chartInstance.off(event, handler);
		});
		eventHandlersRef.current = [];
		Object.entries(stableEventHandlers).forEach(([event, handler]) => {
			chartInstance.on(event, handler);
			eventHandlersRef.current.push([event, handler]);
		});
		if (onSeriesDoubleClick || enableLegendDoubleClickSelection) {
			const seriesClickHandler = (params) => {
				handleSeriesClick(params);
			};
			chartInstance.on("click", seriesClickHandler);
			eventHandlersRef.current.push(["click", seriesClickHandler]);
		}
		if (onLegendDoubleClick || enableLegendDoubleClickSelection) {
			const legendHandler = (params) => {
				handleLegendClick(params);
			};
			chartInstance.on("legendselectchanged", legendHandler);
			eventHandlersRef.current.push(["legendselectchanged", legendHandler]);
		}
		return () => {
			eventHandlersRef.current.forEach(([event, handler]) => {
				chartInstance.off(event, handler);
			});
			eventHandlersRef.current = [];
		};
	}, [
		chartInstance,
		stableEventHandlers,
		onSeriesDoubleClick,
		onLegendDoubleClick,
		enableLegendDoubleClickSelection,
		handleSeriesClick,
		handleLegendClick
	]);
	const exportImage = (0, react.useCallback)((format = "png", opts) => {
		const chart = getEChartsInstance();
		if (!chart) return "";
		const chartWidth = typeof width === "number" ? width : 600;
		const chartHeight = typeof height === "number" ? height : 400;
		const bgColor = opts?.backgroundColor || backgroundColor || "#fff";
		if (logo?.onSaveOnly) {
			const currentOption = chart.getOption();
			const optionWithLogo = require_OldPieChart.addLogoToOption(currentOption, logo, chartWidth, chartHeight);
			chart.setOption(optionWithLogo, {
				notMerge: false,
				lazyUpdate: false
			});
			const dataURL = chart.getDataURL({
				type: format,
				pixelRatio: opts?.pixelRatio || 2,
				backgroundColor: bgColor,
				...opts?.excludeComponents && { excludeComponents: opts.excludeComponents }
			});
			const optionWithoutLogo = require_OldPieChart.removeLogoFromOption(currentOption);
			chart.setOption(optionWithoutLogo, {
				notMerge: false,
				lazyUpdate: false
			});
			return dataURL;
		}
		return chart.getDataURL({
			type: format,
			pixelRatio: opts?.pixelRatio || 2,
			backgroundColor: bgColor,
			...opts?.excludeComponents && { excludeComponents: opts.excludeComponents }
		});
	}, [
		getEChartsInstance,
		logo,
		width,
		height,
		backgroundColor
	]);
	const saveAsImage = (0, react.useCallback)((filename, opts) => {
		const dataURL = exportImage(opts?.type || "png", opts);
		if (!dataURL) return;
		const link = document.createElement("a");
		link.download = filename || `chart.${opts?.type || "png"}`;
		link.href = dataURL;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}, [exportImage]);
	const highlight = (0, react.useCallback)((dataIndex, seriesIndex = 0) => {
		const chart = getEChartsInstance();
		if (!chart) return;
		chart.dispatchAction({
			type: "highlight",
			seriesIndex,
			dataIndex
		});
	}, [getEChartsInstance]);
	const clearHighlight = (0, react.useCallback)(() => {
		const chart = getEChartsInstance();
		if (!chart) return;
		chart.dispatchAction({ type: "downplay" });
	}, [getEChartsInstance]);
	const updateData = (0, react.useCallback)((newData) => {
		const chart = getEChartsInstance();
		if (!chart) return;
		const newOption = buildOption({
			...props,
			data: newData
		});
		chart.setOption(newOption);
	}, [
		getEChartsInstance,
		buildOption,
		props
	]);
	const containerStyle = (0, react.useMemo)(() => ({
		width,
		height,
		minWidth: typeof width === "string" && width.includes("%") ? "300px" : void 0,
		minHeight: "300px",
		position: "relative",
		...style
	}), [
		width,
		height,
		style
	]);
	const domProps = (0, react.useMemo)(() => {
		const filtered = {};
		Object.keys(restProps).forEach((key) => {
			if (key === "id" || key.startsWith("data-") || key.startsWith("aria-") || key === "role" || key === "tabIndex") filtered[key] = restProps[key];
		});
		return filtered;
	}, [restProps]);
	const renderError = (0, react.useCallback)(() => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
		children: ["Error: ", error?.message || "Failed to render chart"]
	}), [
		className,
		width,
		height,
		style,
		error
	]);
	const renderLoading = (0, react.useCallback)(() => {
		if (!chartLoading && !loading) return null;
		return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
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
		});
	}, [chartLoading, loading]);
	const refMethods = (0, react.useMemo)(() => ({
		getChart: getEChartsInstance,
		exportImage,
		saveAsImage,
		resize,
		showLoading: (_text) => showLoading(),
		hideLoading,
		highlight,
		clearHighlight,
		updateData
	}), [
		getEChartsInstance,
		exportImage,
		saveAsImage,
		resize,
		showLoading,
		hideLoading,
		highlight,
		clearHighlight,
		updateData
	]);
	return {
		containerRef,
		isLoading: chartLoading || loading,
		error,
		containerStyle,
		domProps,
		getEChartsInstance,
		refMethods,
		renderError,
		renderLoading
	};
}

//#endregion
//#region src/utils/color-palettes.ts
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

//#endregion
//#region src/utils/data-processing.ts
function isObjectData(data) {
	return data.length > 0 && typeof data[0] === "object" && !Array.isArray(data[0]);
}
function groupDataByField(data, field) {
	return data.reduce((groups, item) => {
		const key = String(item[field] ?? "Unknown");
		if (!groups[key]) groups[key] = [];
		groups[key].push(item);
		return groups;
	}, {});
}
function mapStrokeStyleToECharts(strokeStyle) {
	switch (strokeStyle) {
		case "dashed": return "dashed";
		case "dotted": return "dotted";
		case "solid":
		default: return "solid";
	}
}
/**
* Aligns multiple series data to ensure all series have data points for every x-axis value.
* Missing data points are filled with null values to maintain proper alignment.
* 
* @param seriesDataList - Array of series data to align
* @returns Object containing unified x-axis values and aligned series data
*/
function alignSeriesData(seriesDataList) {
	if (seriesDataList.length === 0) return {
		xAxisData: [],
		alignedSeries: []
	};
	const allXValues = new Map();
	let indexCounter = 0;
	seriesDataList.forEach((seriesData) => {
		seriesData.data.forEach((item) => {
			const xValue = item[seriesData.xField];
			if (xValue != null && !allXValues.has(xValue)) allXValues.set(xValue, indexCounter++);
		});
	});
	const sortedXValues = Array.from(allXValues.entries()).sort((a, b) => a[1] - b[1]).map(([value]) => value);
	const alignedSeries = seriesDataList.map((seriesData) => {
		const dataMap = new Map();
		seriesData.data.forEach((item) => {
			const xValue = item[seriesData.xField];
			const yValue = item[seriesData.yField];
			if (xValue != null && yValue != null) dataMap.set(xValue, yValue);
		});
		const alignedData = sortedXValues.map((xValue) => dataMap.get(xValue) ?? null);
		return {
			name: seriesData.name,
			alignedData
		};
	});
	return {
		xAxisData: sortedXValues,
		alignedSeries
	};
}

//#endregion
//#region src/utils/base-options.ts
function buildBaseOption(props) {
	const option = {};
	const isDark = props.theme === "dark";
	if (props.title) option.title = {
		text: props.title,
		...props.subtitle && { subtext: props.subtitle },
		left: props.titlePosition || "center",
		top: 10,
		textStyle: {
			color: isDark ? "#ffffff" : "#333333",
			fontSize: 16,
			fontWeight: "bold"
		},
		subtextStyle: {
			color: isDark ? "#cccccc" : "#666666",
			fontSize: 12
		},
		itemGap: 8
	};
	option.animation = props.animate !== false;
	if (props.animationDuration) option.animationDuration = props.animationDuration;
	if (props.backgroundColor) option.backgroundColor = props.backgroundColor;
	else option.backgroundColor = isDark ? "#1a1a1a" : "#ffffff";
	if (props.colorPalette) option.color = [...props.colorPalette];
	else option.color = [...COLOR_PALETTES.default];
	option.textStyle = { color: isDark ? "#ffffff" : "#333333" };
	if (!option.backgroundColor) option.backgroundColor = isDark ? "#1a1a1a" : "#ffffff";
	if (props.logo && !props.logo.onSaveOnly) {
		const chartWidth = typeof props.width === "number" ? props.width : 600;
		const chartHeight = typeof props.height === "number" ? props.height : 400;
		const logoGraphic = require_OldPieChart.createLogoGraphic(props.logo, chartWidth, chartHeight);
		option.graphic = option.graphic ? Array.isArray(option.graphic) ? [...option.graphic, logoGraphic] : [option.graphic, logoGraphic] : [logoGraphic];
	}
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
	const topOffset = hasTitle && hasSubtitle ? "10%" : hasTitle ? "8%" : "3%";
	switch (position) {
		case "top":
			positioning = { top: topOffset };
			if (align === "center") positioning.left = "center";
			else if (align === "start") positioning.left = "10%";
			else positioning.right = "5%";
			break;
		case "bottom":
			positioning = { bottom: hasDataZoom ? "12%" : "3%" };
			if (align === "center") positioning.left = "center";
			else if (align === "start") positioning.left = "10%";
			else positioning.right = "5%";
			break;
		case "left":
			positioning = {
				left: "3%",
				top: topOffset
			};
			break;
		case "right":
			positioning = {
				right: "3%",
				top: topOffset
			};
			break;
	}
	const isDark = theme === "dark";
	return {
		show: true,
		type: "scroll",
		orient: orientation,
		...positioning,
		itemGap: 12,
		itemWidth: 20,
		itemHeight: 12,
		textStyle: {
			fontSize: 12,
			color: isDark ? "#cccccc" : "#666666"
		}
	};
}
function calculateGridSpacing(legendConfig, hasTitle, hasSubtitle, hasDataZoom) {
	const hasLegendTop = legendConfig && legendConfig.show !== false && (legendConfig.position || "top") === "top";
	const hasLegendBottom = legendConfig && legendConfig.show !== false && legendConfig.position === "bottom";
	const hasLegendLeft = legendConfig && legendConfig.show !== false && legendConfig.position === "left";
	const hasLegendRight = legendConfig && legendConfig.show !== false && legendConfig.position === "right";
	let top = "10%";
	if (hasTitle && hasSubtitle && hasLegendTop) top = "18%";
	else if (hasTitle && hasSubtitle) top = "14%";
	else if (hasTitle && hasLegendTop || hasSubtitle && hasLegendTop) top = "15%";
	else if (hasTitle || hasSubtitle) top = "12%";
	else if (hasLegendTop) top = "12%";
	let bottom = "10%";
	if (hasDataZoom && hasLegendBottom) bottom = "22%";
	else if (hasDataZoom) bottom = "15%";
	else if (hasLegendBottom) bottom = "15%";
	return {
		left: hasLegendLeft ? "15%" : "10%",
		right: hasLegendRight ? "15%" : "5%",
		top,
		bottom,
		containLabel: true
	};
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

//#endregion
//#region src/utils/chart-builders/line-chart.ts
function buildLineChartOption(props) {
	const baseOption = buildBaseOption(props);
	let series = [];
	let xAxisData = [];
	if (props.series && props.data) if (props.xField && props.yField && props.series[0]?.data && isObjectData(props.series[0].data)) {
		const seriesDataForAlignment = props.series.map((s) => ({
			name: s.name,
			data: s.data,
			xField: props.xField,
			yField: props.yField
		}));
		const { xAxisData: alignedXAxisData, alignedSeries } = alignSeriesData(seriesDataForAlignment);
		xAxisData = [...alignedXAxisData];
		series = props.series.map((s, index) => ({
			name: s.name,
			type: "line",
			data: alignedSeries[index]?.alignedData || [],
			smooth: s.smooth ?? props.smooth,
			lineStyle: {
				width: s.strokeWidth ?? props.strokeWidth,
				type: mapStrokeStyleToECharts(s.strokeStyle ?? props.strokeStyle)
			},
			itemStyle: { color: s.color },
			areaStyle: s.showArea ?? props.showArea ? { opacity: props.areaOpacity || .3 } : void 0,
			symbol: (s.showPoints ?? props.showPoints) !== false ? s.pointShape ?? props.pointShape ?? "circle" : "none",
			symbolSize: s.pointSize ?? props.pointSize ?? 4,
			yAxisIndex: s.yAxisIndex ?? 0
		}));
	} else {
		series = props.series.map((s) => ({
			name: s.name,
			type: "line",
			data: isObjectData(s.data) && props.yField ? s.data.map((item) => item[props.yField]) : s.data,
			smooth: s.smooth ?? props.smooth,
			lineStyle: {
				width: s.strokeWidth ?? props.strokeWidth,
				type: mapStrokeStyleToECharts(s.strokeStyle ?? props.strokeStyle)
			},
			itemStyle: { color: s.color },
			areaStyle: s.showArea ?? props.showArea ? { opacity: props.areaOpacity || .3 } : void 0,
			symbol: (s.showPoints ?? props.showPoints) !== false ? s.pointShape ?? props.pointShape ?? "circle" : "none",
			symbolSize: s.pointSize ?? props.pointSize ?? 4,
			yAxisIndex: s.yAxisIndex ?? 0
		}));
		if (props.series && props.series[0] && isObjectData(props.series[0].data) && props.xField) xAxisData = props.series[0].data.map((item) => item[props.xField]);
	}
	else if (props.data) if (isObjectData(props.data)) if (props.seriesField) {
		const groups = groupDataByField(props.data, props.seriesField);
		const seriesDataForAlignment = Object.entries(groups).map(([name, groupData]) => ({
			name,
			data: groupData,
			xField: props.xField,
			yField: props.yField
		}));
		const { xAxisData: alignedXAxisData, alignedSeries } = alignSeriesData(seriesDataForAlignment);
		xAxisData = [...alignedXAxisData];
		series = Object.entries(groups).map(([name], index) => {
			const seriesSpecificConfig = props.seriesConfig?.[name] || {};
			return {
				name,
				type: "line",
				data: alignedSeries[index]?.alignedData || [],
				smooth: seriesSpecificConfig.smooth ?? props.smooth,
				lineStyle: {
					width: seriesSpecificConfig.strokeWidth ?? props.strokeWidth,
					type: mapStrokeStyleToECharts(seriesSpecificConfig.strokeStyle ?? props.strokeStyle)
				},
				itemStyle: seriesSpecificConfig.color ? { color: seriesSpecificConfig.color } : void 0,
				areaStyle: seriesSpecificConfig.showArea ?? props.showArea ? { opacity: seriesSpecificConfig.areaOpacity ?? (props.areaOpacity || .3) } : void 0,
				symbol: (seriesSpecificConfig.showPoints ?? props.showPoints) !== false ? seriesSpecificConfig.pointShape ?? props.pointShape ?? "circle" : "none",
				symbolSize: seriesSpecificConfig.pointSize ?? props.pointSize ?? 4,
				yAxisIndex: seriesSpecificConfig.yAxisIndex ?? 0
			};
		});
	} else {
		if (Array.isArray(props.yField)) {
			const seriesDataForAlignment = props.yField.map((field) => ({
				name: field,
				data: props.data,
				xField: props.xField,
				yField: field
			}));
			const { xAxisData: alignedXAxisData, alignedSeries } = alignSeriesData(seriesDataForAlignment);
			xAxisData = [...alignedXAxisData];
			series = props.yField.map((field, index) => {
				const seriesSpecificConfig = props.seriesConfig?.[field] || {};
				return {
					name: field,
					type: "line",
					data: alignedSeries[index]?.alignedData || [],
					smooth: seriesSpecificConfig.smooth ?? props.smooth,
					lineStyle: {
						width: seriesSpecificConfig.strokeWidth ?? props.strokeWidth,
						type: mapStrokeStyleToECharts(seriesSpecificConfig.strokeStyle ?? props.strokeStyle)
					},
					itemStyle: seriesSpecificConfig.color ? { color: seriesSpecificConfig.color } : void 0,
					areaStyle: seriesSpecificConfig.showArea ?? props.showArea ? { opacity: seriesSpecificConfig.areaOpacity ?? (props.areaOpacity || .3) } : void 0,
					symbol: (seriesSpecificConfig.showPoints ?? props.showPoints) !== false ? seriesSpecificConfig.pointShape ?? props.pointShape ?? "circle" : "none",
					symbolSize: seriesSpecificConfig.pointSize ?? props.pointSize ?? 4,
					yAxisIndex: seriesSpecificConfig.yAxisIndex ?? 0
				};
			});
		} else series = [{
			type: "line",
			data: props.data.map((item) => item[props.yField]),
			smooth: props.smooth,
			lineStyle: {
				width: props.strokeWidth,
				type: mapStrokeStyleToECharts(props.strokeStyle)
			},
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
		lineStyle: {
			width: props.strokeWidth,
			type: mapStrokeStyleToECharts(props.strokeStyle)
		},
		areaStyle: props.showArea ? { opacity: props.areaOpacity || .3 } : void 0,
		symbol: props.showPoints !== false ? props.pointShape || "circle" : "none",
		symbolSize: props.pointSize || 4
	}];
	return {
		...baseOption,
		grid: calculateGridSpacing(props.legend, !!props.title, !!props.subtitle, !!props.zoom),
		xAxis: {
			...buildAxisOption(props.xAxis, "categorical", props.theme),
			data: xAxisData
		},
		yAxis: Array.isArray(props.yAxis) ? props.yAxis.map((axis) => buildAxisOption(axis, "numeric", props.theme)) : buildAxisOption(props.yAxis, "numeric", props.theme),
		series,
		legend: buildLegendOption(props.legend, !!props.title, !!props.subtitle, !!props.zoom, props.theme),
		tooltip: buildTooltipOption(props.tooltip, props.theme),
		...props.zoom && { dataZoom: [{ type: "inside" }, { type: "slider" }] },
		...props.brush && { brush: {} },
		...props.customOption
	};
}

//#endregion
//#region src/utils/chart-builders/bar-chart.ts
function buildBarChartOption(props) {
	const baseOption = buildBaseOption(props);
	let series = [];
	let categoryData = [];
	const createLabelConfig = (seriesData, allSeriesData$1, seriesIndex) => {
		if (!props.showLabels && !props.showAbsoluteValues && !props.showPercentageLabels) return { show: false };
		return {
			show: true,
			position: props.orientation === "horizontal" ? "right" : "top",
			formatter: (params) => {
				const showAbsolute = props.showAbsoluteValues || props.showLabels;
				const showPercent = props.showPercentageLabels;
				if (props.stack && showPercent && allSeriesData$1 && typeof seriesIndex === "number") {
					const dataIndex = params.dataIndex;
					let total = 0;
					for (let i = 0; i < allSeriesData$1.length; i++) total += allSeriesData$1[i][dataIndex] || 0;
					const currentValue = params.value;
					const percentage = total > 0 ? Math.round(currentValue / total * 100) : 0;
					if (showAbsolute && showPercent) return `${currentValue} (${percentage}%)`;
					else if (showPercent) return `${percentage}%`;
				}
				if (showAbsolute) return params.value;
				return params.value;
			}
		};
	};
	let allSeriesData = [];
	if (props.series) {
		const extractedSeriesData = props.series.map((s) => isObjectData(s.data) && props.valueField ? s.data.map((item) => item[props.valueField]) : s.data);
		allSeriesData = extractedSeriesData;
		series = props.series.map((s, index) => {
			const seriesData = extractedSeriesData[index];
			return {
				name: s.name,
				type: "bar",
				data: seriesData,
				itemStyle: {
					color: s.color,
					borderRadius: props.borderRadius
				},
				stack: s.stack || (props.stack ? "defaultStack" : void 0),
				barWidth: props.barWidth,
				barGap: props.barGap,
				label: createLabelConfig(seriesData, allSeriesData, index),
				yAxisIndex: s.yAxisIndex ?? 0
			};
		});
		if (props.series && props.series[0] && isObjectData(props.series[0].data) && props.categoryField) categoryData = props.series[0].data.map((item) => item[props.categoryField]);
	} else if (props.data) if (isObjectData(props.data)) if (props.seriesField) {
		const groups = groupDataByField(props.data, props.seriesField);
		const groupEntries = Object.entries(groups);
		allSeriesData = groupEntries.map(([, groupData]) => groupData.map((item) => item[props.valueField]));
		series = groupEntries.map(([name, groupData], index) => {
			const seriesData = groupData.map((item) => item[props.valueField]);
			return {
				name,
				type: "bar",
				data: seriesData,
				stack: props.stack ? "defaultStack" : void 0,
				barWidth: props.barWidth,
				barGap: props.barGap,
				itemStyle: { borderRadius: props.borderRadius },
				label: createLabelConfig(seriesData, allSeriesData, index),
				yAxisIndex: 0
			};
		});
		const seen = new Set();
		categoryData = [];
		for (const item of props.data) {
			const value = item[props.categoryField];
			if (value != null && !seen.has(value)) {
				seen.add(value);
				categoryData.push(value);
			}
		}
	} else {
		if (Array.isArray(props.valueField)) {
			allSeriesData = props.valueField.map((field) => props.data.map((item) => item[field]));
			series = props.valueField.map((field, index) => {
				const seriesData = props.data.map((item) => item[field]);
				return {
					name: field,
					type: "bar",
					data: seriesData,
					stack: props.stack ? "defaultStack" : void 0,
					barWidth: props.barWidth,
					barGap: props.barGap,
					itemStyle: { borderRadius: props.borderRadius },
					label: createLabelConfig(seriesData, allSeriesData, index),
					yAxisIndex: 0
				};
			});
		} else {
			const seriesData = props.data.map((item) => item[props.valueField]);
			allSeriesData = [seriesData];
			series = [{
				type: "bar",
				data: seriesData,
				stack: props.stack ? "defaultStack" : void 0,
				barWidth: props.barWidth,
				barGap: props.barGap,
				itemStyle: { borderRadius: props.borderRadius },
				label: createLabelConfig(seriesData, allSeriesData, 0)
			}];
		}
		if (props.data) categoryData = props.data.map((item) => item[props.categoryField]);
	}
	else {
		allSeriesData = [props.data];
		series = [{
			type: "bar",
			data: props.data,
			stack: props.stack ? "defaultStack" : void 0,
			barWidth: props.barWidth,
			barGap: props.barGap,
			itemStyle: { borderRadius: props.borderRadius },
			label: createLabelConfig(props.data, allSeriesData, 0)
		}];
	}
	if (props.showPercentage && props.stack && series.length > 1) {
		const totalsByCategory = [];
		const categoryCount = Math.max(...series.map((s) => s.data.length));
		const originalData = series.map((s) => [...s.data]);
		for (let i = 0; i < categoryCount; i++) {
			let sum = 0;
			for (const seriesItem of series) sum += seriesItem.data[i] || 0;
			totalsByCategory.push(sum);
		}
		series = series.map((seriesItem, seriesIndex) => ({
			...seriesItem,
			data: seriesItem.data.map((value, index) => {
				const total = totalsByCategory[index];
				return total === void 0 || total <= 0 ? 0 : value / total;
			}),
			label: {
				show: props.showLabels || props.showAbsoluteValues || props.showPercentageLabels,
				position: props.orientation === "horizontal" ? "right" : "top",
				formatter: (params) => {
					const originalValue = originalData[seriesIndex]?.[params.dataIndex];
					const percentageValue = Math.round(params.value * 100);
					if (props.showAbsoluteValues && props.showPercentageLabels) return `${originalValue} (${percentageValue}%)`;
					else if (props.showPercentageLabels) return `${percentageValue}%`;
					else if (props.showAbsoluteValues || props.showLabels) return originalValue;
					return `${percentageValue}%`;
				}
			}
		}));
	}
	if (props.sortBy && props.sortBy !== "none") {}
	const isHorizontal = props.orientation === "horizontal";
	if ((props.stackType === "percent" || props.showPercentage) && props.stack) {
		const yAxisOptions = isHorizontal ? buildAxisOption(Array.isArray(props.yAxis) ? props.yAxis[0] : props.yAxis, "categorical", props.theme) : buildAxisOption(Array.isArray(props.yAxis) ? props.yAxis[0] : props.yAxis, "numeric", props.theme);
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
			} : Array.isArray(props.yAxis) ? props.yAxis.map((axis) => ({
				...buildAxisOption(axis, "numeric", props.theme),
				...yAxisOptions
			})) : yAxisOptions,
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
			...buildAxisOption(Array.isArray(props.yAxis) ? props.yAxis[0] : props.yAxis, "categorical", props.theme),
			data: categoryData,
			boundaryGap: true
		} : Array.isArray(props.yAxis) ? props.yAxis.map((axis) => buildAxisOption(axis, "numeric", props.theme)) : buildAxisOption(props.yAxis, "numeric", props.theme),
		series,
		legend: buildLegendOption(props.legend, !!props.title, !!props.subtitle, false, props.theme),
		tooltip: buildTooltipOption(props.tooltip, props.theme),
		...props.customOption
	};
}

//#endregion
//#region src/utils/chart-builders/pie-chart.ts
function wrapLongText(text, maxLength = 25) {
	if (!text || text.length <= maxLength) return text;
	const words = text.split(/(\s+|[-–—])/);
	const lines = [];
	let currentLine = "";
	for (const word of words) {
		const testLine = currentLine + word;
		if (testLine.length <= maxLength) currentLine = testLine;
		else if (currentLine) {
			lines.push(currentLine.trim());
			currentLine = word;
		} else {
			lines.push(word);
			currentLine = "";
		}
	}
	if (currentLine) lines.push(currentLine.trim());
	return lines.join("\n");
}
function buildPieChartOption(props) {
	const baseOption = buildBaseOption(props);
	const isDark = props.theme === "dark";
	let data = [];
	const wrapLength = props.labelWrapLength || 25;
	if (props.data && isObjectData(props.data)) if (props.nameField && props.valueField) data = props.data.map((item) => ({
		name: wrapLongText(item[props.nameField], wrapLength),
		value: item[props.valueField],
		originalName: item[props.nameField]
	}));
	else {
		const firstItem = props.data[0];
		if (firstItem) {
			const keys = Object.keys(firstItem);
			data = props.data.map((item) => ({
				name: wrapLongText(item[keys[0]], wrapLength),
				value: item[keys[1]],
				originalName: item[keys[0]]
			}));
		}
	}
	else if (props.data) data = props.data.map((item) => ({
		...item,
		name: wrapLongText(item.name || "", wrapLength),
		originalName: item.name || item.originalName || ""
	}));
	const radius = Array.isArray(props.radius) ? props.radius : ["0%", (props.radius || 75) + "%"];
	const customCenter = props.customOption?.series?.[0]?.center || props.customOption?.center;
	const customRadius = props.customOption?.series?.[0]?.radius || props.customOption?.radius;
	const hasTitle = !!props.title;
	const hasSubtitle = !!props.subtitle;
	const hasLegend = props.legend && props.legend.show !== false;
	const legendPosition = props.legend?.position || "top";
	let centerY = "50%";
	let centerX = "50%";
	const isDefaultCenter = customCenter && Array.isArray(customCenter) && customCenter[0] === "50%" && customCenter[1] === "50%";
	if (!customCenter || isDefaultCenter) {
		if (hasTitle && hasSubtitle) centerY = legendPosition === "top" ? "60%" : "55%";
		else if (hasTitle || hasLegend && legendPosition === "top") centerY = "55%";
	}
	const finalCenter = customCenter && !isDefaultCenter ? customCenter : [centerX, centerY];
	return {
		...baseOption,
		...props.title && { title: {
			text: props.title,
			...props.subtitle && { subtext: props.subtitle },
			left: props.titlePosition || "center",
			top: 10,
			textStyle: {
				color: isDark ? "#ffffff" : "#333333",
				fontSize: 16,
				fontWeight: "bold"
			},
			subtextStyle: {
				color: isDark ? "#cccccc" : "#666666",
				fontSize: 12
			},
			itemGap: 8
		} },
		series: [{
			type: "pie",
			data,
			radius: customRadius || radius,
			center: finalCenter,
			startAngle: props.startAngle || 90,
			...props.roseType ? { roseType: "area" } : {},
			label: {
				show: props.showLabels !== false,
				position: props.labelPosition || "outside",
				formatter: props.labelFormat || (props.showPercentages ? "{b}: {d}%" : "{b}: {c}"),
				color: isDark ? "#ffffff" : "#333333",
				fontSize: 12,
				fontWeight: "normal",
				distanceToLabelLine: 5,
				alignTo: "none",
				bleedMargin: 10,
				lineHeight: 16,
				rich: {
					name: {
						color: isDark ? "#ffffff" : "#333333",
						fontSize: 12,
						lineHeight: 16
					},
					value: {
						color: isDark ? "#cccccc" : "#666666",
						fontSize: 11
					}
				}
			},
			labelLine: {
				show: (props.labelPosition || "outside") === "outside",
				length: 15,
				length2: 10,
				smooth: false,
				lineStyle: {
					color: isDark ? "#666666" : "#cccccc",
					width: 1
				}
			},
			selectedMode: props.selectedMode || false,
			...props.emphasis !== false ? { emphasis: {
				focus: "self",
				label: {
					fontSize: 13,
					fontWeight: "bold"
				}
			} } : {}
		}],
		legend: buildLegendOption(props.legend, !!props.title, !!props.subtitle, false, props.theme),
		tooltip: {
			...buildTooltipOption(props.tooltip, props.theme),
			extraCssText: "max-width: 300px; white-space: normal; word-wrap: break-word;",
			formatter: (params) => {
				const originalName = params.data.originalName || params.name;
				const value = params.value;
				const percent = params.percent;
				return `<div style="padding: 8px;">
          <strong>${originalName}</strong><br/>
          Value: ${typeof value === "number" ? value.toLocaleString() : value}<br/>
          Percentage: ${percent}%
        </div>`;
			}
		},
		...props.customOption
	};
}

//#endregion
//#region src/utils/chart-builders/scatter-chart.ts
/**
* Build jitter configuration for ECharts 6 scatter series
* Jittering adds random offsets to prevent point overlap while maintaining axis accuracy
*/
function buildJitterConfig(jitter) {
	if (!jitter) return void 0;
	if (jitter === true) return { jitter: .4 };
	const config = {};
	if (jitter.width !== void 0) config.jitter = jitter.width;
	if (jitter.height !== void 0) config.jitterHeight = jitter.height;
	return Object.keys(config).length > 0 ? config : { jitter: .4 };
}
function buildScatterChartOption(props) {
	const baseOption = buildBaseOption(props);
	const globalJitterConfig = buildJitterConfig(props.jitter);
	let series = [];
	if (props.series) series = props.series.map((s) => {
		const seriesJitterConfig = s.jitter !== void 0 ? buildJitterConfig(s.jitter) : globalJitterConfig;
		return {
			name: s.name,
			type: "scatter",
			data: s.data,
			itemStyle: {
				color: s.color,
				opacity: props.pointOpacity || .8
			},
			symbolSize: s.pointSize || props.pointSize || 10,
			symbol: s.pointShape || props.pointShape || "circle",
			...seriesJitterConfig,
			...s.jitterOverlap !== void 0 ? { jitterOverlap: s.jitterOverlap } : props.jitterOverlap !== void 0 ? { jitterOverlap: props.jitterOverlap } : {}
		};
	});
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
				itemStyle: { opacity: props.pointOpacity || .8 },
				...globalJitterConfig,
				...props.jitterOverlap !== void 0 && { jitterOverlap: props.jitterOverlap }
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
			itemStyle: { opacity: props.pointOpacity || .8 },
			...globalJitterConfig,
			...props.jitterOverlap !== void 0 && { jitterOverlap: props.jitterOverlap }
		}];
	}
	else series = [{
		type: "scatter",
		data: [...props.data],
		symbolSize: props.pointSize || 10,
		symbol: props.pointShape || "circle",
		itemStyle: { opacity: props.pointOpacity || .8 },
		...globalJitterConfig,
		...props.jitterOverlap !== void 0 && { jitterOverlap: props.jitterOverlap }
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

//#endregion
//#region src/utils/chart-builders/stacked-area-chart.ts
function buildStackedAreaChartOption(props) {
	const baseOption = buildBaseOption(props);
	let series = [];
	let xAxisData = [];
	if (props.series && props.data) {
		series = props.series.map((s, index) => ({
			name: s.name,
			type: "line",
			data: isObjectData(s.data) && props.yField ? s.data.map((item) => item[props.yField]) : s.data,
			smooth: s.smooth ?? props.smooth,
			lineStyle: {
				width: s.strokeWidth ?? props.strokeWidth ?? 2,
				type: mapStrokeStyleToECharts(s.strokeStyle ?? props.strokeStyle)
			},
			itemStyle: { color: s.color },
			areaStyle: {
				opacity: props.opacity ?? .7,
				...props.areaGradient && { color: {
					type: "linear",
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [{
						offset: 0,
						color: s.color || `rgba(${index * 50 % 255}, ${index * 80 % 255}, ${index * 120 % 255}, 0.8)`
					}, {
						offset: 1,
						color: s.color || `rgba(${index * 50 % 255}, ${index * 80 % 255}, ${index * 120 % 255}, 0.1)`
					}]
				} }
			},
			emphasis: {
				focus: "series",
				areaStyle: { opacity: Math.min((props.opacity ?? .7) + .2, 1) }
			},
			triggerLineEvent: true,
			symbol: (s.showPoints ?? props.showPoints) !== false ? s.pointShape ?? props.pointShape ?? "circle" : "none",
			symbolSize: s.pointSize ?? props.pointSize ?? 4,
			yAxisIndex: s.yAxisIndex ?? 0,
			stack: props.stacked ? "Total" : void 0,
			...props.stackType === "percent" && {
				stack: "Total",
				areaStyle: {
					...series[index]?.areaStyle,
					opacity: .7
				}
			}
		}));
		if (props.series && props.series[0] && isObjectData(props.series[0].data) && props.xField) xAxisData = props.series[0].data.map((item) => item[props.xField]);
	} else if (props.data) if (isObjectData(props.data)) if (props.seriesField) {
		const groups = groupDataByField(props.data, props.seriesField);
		series = Object.entries(groups).map(([name, groupData]) => {
			const seriesSpecificConfig = props.seriesConfig?.[name] || {};
			return {
				name,
				type: "line",
				data: groupData.map((item) => item[props.yField]),
				smooth: seriesSpecificConfig.smooth ?? props.smooth,
				lineStyle: {
					width: seriesSpecificConfig.strokeWidth ?? props.strokeWidth ?? 2,
					type: mapStrokeStyleToECharts(seriesSpecificConfig.strokeStyle ?? props.strokeStyle)
				},
				itemStyle: seriesSpecificConfig.color ? { color: seriesSpecificConfig.color } : void 0,
				areaStyle: {
					opacity: props.opacity ?? .7,
					...props.areaGradient && seriesSpecificConfig.color && { color: {
						type: "linear",
						x: 0,
						y: 0,
						x2: 0,
						y2: 1,
						colorStops: [{
							offset: 0,
							color: seriesSpecificConfig.color + "CC"
						}, {
							offset: 1,
							color: seriesSpecificConfig.color + "1A"
						}]
					} }
				},
				symbol: (seriesSpecificConfig.showPoints ?? props.showPoints) !== false ? seriesSpecificConfig.pointShape ?? props.pointShape ?? "circle" : "none",
				symbolSize: seriesSpecificConfig.pointSize ?? props.pointSize ?? 4,
				yAxisIndex: seriesSpecificConfig.yAxisIndex ?? 0,
				stack: props.stacked ? "Total" : void 0
			};
		});
		const seen = new Set();
		xAxisData = [];
		for (const item of props.data) {
			const value = item[props.xField];
			if (value != null && !seen.has(value)) {
				seen.add(value);
				xAxisData.push(value);
			}
		}
	} else {
		if (Array.isArray(props.yField)) series = props.yField.map((field) => {
			const seriesSpecificConfig = props.seriesConfig?.[field] || {};
			return {
				name: field,
				type: "line",
				data: props.data.map((item) => item[field]),
				smooth: seriesSpecificConfig.smooth ?? props.smooth,
				lineStyle: {
					width: seriesSpecificConfig.strokeWidth ?? props.strokeWidth ?? 2,
					type: mapStrokeStyleToECharts(seriesSpecificConfig.strokeStyle ?? props.strokeStyle)
				},
				itemStyle: seriesSpecificConfig.color ? { color: seriesSpecificConfig.color } : void 0,
				areaStyle: {
					opacity: props.opacity ?? .7,
					...props.areaGradient && seriesSpecificConfig.color && { color: {
						type: "linear",
						x: 0,
						y: 0,
						x2: 0,
						y2: 1,
						colorStops: [{
							offset: 0,
							color: seriesSpecificConfig.color + "CC"
						}, {
							offset: 1,
							color: seriesSpecificConfig.color + "1A"
						}]
					} }
				},
				emphasis: {
					focus: "series",
					areaStyle: { opacity: Math.min((props.opacity ?? .7) + .2, 1) }
				},
				triggerLineEvent: true,
				symbol: (seriesSpecificConfig.showPoints ?? props.showPoints) !== false ? seriesSpecificConfig.pointShape ?? props.pointShape ?? "circle" : "none",
				symbolSize: seriesSpecificConfig.pointSize ?? props.pointSize ?? 4,
				yAxisIndex: seriesSpecificConfig.yAxisIndex ?? 0,
				stack: props.stacked ? "Total" : void 0
			};
		});
		else series = [{
			type: "line",
			data: props.data.map((item) => item[props.yField]),
			smooth: props.smooth,
			lineStyle: {
				width: props.strokeWidth ?? 2,
				type: mapStrokeStyleToECharts(props.strokeStyle)
			},
			areaStyle: {
				opacity: props.opacity ?? .7,
				...props.areaGradient && { color: {
					type: "linear",
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [{
						offset: 0,
						color: "rgba(64, 158, 255, 0.8)"
					}, {
						offset: 1,
						color: "rgba(64, 158, 255, 0.1)"
					}]
				} }
			},
			emphasis: {
				focus: "series",
				areaStyle: { opacity: Math.min((props.opacity ?? .7) + .2, 1) }
			},
			triggerLineEvent: true,
			symbol: props.showPoints !== false ? props.pointShape || "circle" : "none",
			symbolSize: props.pointSize || 4,
			stack: props.stacked ? "Total" : void 0
		}];
		if (props.data) xAxisData = props.data.map((item) => item[props.xField]);
	}
	else series = [{
		type: "line",
		data: props.data,
		smooth: props.smooth,
		lineStyle: {
			width: props.strokeWidth ?? 2,
			type: mapStrokeStyleToECharts(props.strokeStyle)
		},
		areaStyle: {
			opacity: props.opacity ?? .7,
			...props.areaGradient && { color: {
				type: "linear",
				x: 0,
				y: 0,
				x2: 0,
				y2: 1,
				colorStops: [{
					offset: 0,
					color: "rgba(64, 158, 255, 0.8)"
				}, {
					offset: 1,
					color: "rgba(64, 158, 255, 0.1)"
				}]
			} }
		},
		emphasis: {
			focus: "series",
			areaStyle: { opacity: Math.min((props.opacity ?? .7) + .2, 1) }
		},
		triggerLineEvent: true,
		symbol: props.showPoints !== false ? props.pointShape || "circle" : "none",
		symbolSize: props.pointSize || 4,
		stack: props.stacked ? "Total" : void 0
	}];
	if (props.stackType === "percent") series = series.map((s) => ({
		...s,
		stack: "Total",
		areaStyle: {
			...s.areaStyle,
			opacity: .7
		}
	}));
	return {
		...baseOption,
		grid: calculateGridSpacing(props.legend, !!props.title, !!props.subtitle, !!props.zoom),
		xAxis: {
			...buildAxisOption(props.xAxis, "categorical", props.theme),
			data: xAxisData
		},
		yAxis: Array.isArray(props.yAxis) ? props.yAxis.map((axis) => ({
			...buildAxisOption(axis, "numeric", props.theme),
			...props.stackType === "percent" && {
				axisLabel: {
					...buildAxisOption(axis, "numeric", props.theme).axisLabel,
					formatter: "{value}%"
				},
				max: 100
			}
		})) : {
			...buildAxisOption(props.yAxis, "numeric", props.theme),
			...props.stackType === "percent" && {
				axisLabel: {
					...buildAxisOption(props.yAxis, "numeric", props.theme).axisLabel,
					formatter: "{value}%"
				},
				max: 100
			}
		},
		series,
		legend: buildLegendOption(props.legend, !!props.title, !!props.subtitle, !!props.zoom, props.theme),
		tooltip: {
			...buildTooltipOption(props.tooltip, props.theme),
			...props.stackType === "percent" && {
				trigger: "axis",
				axisPointer: { type: "cross" },
				formatter: function(params) {
					if (!Array.isArray(params)) return "";
					let total = 0;
					params.forEach((param) => {
						total += param.value;
					});
					let result = params[0].name + "<br/>";
					params.forEach((param) => {
						const percentage = total > 0 ? (param.value / total * 100).toFixed(1) : "0.0";
						result += `${param.marker}${param.seriesName}: ${param.value} (${percentage}%)<br/>`;
					});
					return result;
				}
			}
		},
		...props.zoom && { dataZoom: [{ type: "inside" }, { type: "slider" }] },
		...props.brush && { brush: {} },
		...props.customOption
	};
}

//#endregion
//#region src/utils/chart-builders/gantt-chart.ts
function buildGanttChartOption(props) {
	const baseOption = buildBaseOption(props);
	const isDark = props.theme === "dark";
	let tasks = [];
	let categories = [];
	if (props.tasks && props.categories) {
		tasks = [...props.tasks];
		categories = [...props.categories];
	} else if (props.data) if (Array.isArray(props.data) && isObjectData(props.data)) {
		const flatData = props.data;
		const idField = props.idField || "id";
		const nameField = props.nameField || "name";
		const categoryField = props.categoryField || "category";
		const startTimeField = props.startTimeField || "startTime";
		const endTimeField = props.endTimeField || "endTime";
		const colorField = props.colorField || "color";
		const statusField = props.statusField || "status";
		const priorityField = props.priorityField || "priority";
		const progressField = props.progressField || "progress";
		const assigneeField = props.assigneeField || "assignee";
		const categorySet = new Set();
		flatData.forEach((item) => {
			const category = String(item[categoryField] || "");
			if (category) categorySet.add(category);
		});
		categories = Array.from(categorySet).map((name) => ({ name }));
		tasks = flatData.map((item) => {
			const taskProps = {
				id: String(item[idField] || ""),
				name: String(item[nameField] || ""),
				category: String(item[categoryField] || ""),
				startTime: item[startTimeField] || new Date(),
				endTime: item[endTimeField] || new Date()
			};
			if (item[colorField]) taskProps.color = String(item[colorField]);
			if (item[statusField]) taskProps.status = String(item[statusField]);
			if (item[priorityField] !== void 0) taskProps.priority = item[priorityField];
			if (item[progressField] !== void 0) taskProps.progress = Number(item[progressField]);
			if (item[assigneeField]) taskProps.assignee = String(item[assigneeField]);
			return taskProps;
		});
	} else {
		const structuredData = props.data;
		tasks = structuredData.tasks && Array.isArray(structuredData.tasks) ? [...structuredData.tasks] : [];
		categories = structuredData.categories && Array.isArray(structuredData.categories) ? [...structuredData.categories] : [];
	}
	if (props.sortBy === "category" || props.groupByCategory) categories.sort((a, b) => {
		const orderA = a.order ?? 0;
		const orderB = b.order ?? 0;
		if (orderA !== orderB) return orderA - orderB;
		return a.name.localeCompare(b.name);
	});
	if (props.sortBy) tasks.sort((a, b) => {
		let aVal, bVal;
		switch (props.sortBy) {
			case "startTime":
				aVal = new Date(a.startTime).getTime();
				bVal = new Date(b.startTime).getTime();
				break;
			case "endTime":
				aVal = new Date(a.endTime).getTime();
				bVal = new Date(b.endTime).getTime();
				break;
			case "name":
				aVal = a.name;
				bVal = b.name;
				break;
			case "priority":
				const priorityMap = {
					low: 1,
					medium: 2,
					high: 3,
					critical: 4
				};
				aVal = typeof a.priority === "number" ? a.priority : priorityMap[a.priority] || 0;
				bVal = typeof b.priority === "number" ? b.priority : priorityMap[b.priority] || 0;
				break;
			default: return 0;
		}
		const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
		return props.sortOrder === "desc" ? -result : result;
	});
	if (props.filterByStatus && props.filterByStatus.length > 0) tasks = tasks.filter((task) => task.status && props.filterByStatus.includes(task.status));
	if (props.filterByPriority && props.filterByPriority.length > 0) tasks = tasks.filter((task) => task.priority && props.filterByPriority.includes(task.priority));
	const categoryMap = new Map(categories.map((cat, index) => [cat.name, index]));
	const defaultTaskBarStyle = {
		height: .6,
		borderRadius: 3,
		borderWidth: 1,
		borderColor: isDark ? "#404040" : "#e0e0e0",
		showProgress: props.showTaskProgress !== false,
		textStyle: {
			color: isDark ? "#ffffff" : "#000000",
			fontSize: 12,
			position: "inside",
			showDuration: false,
			showProgress: false
		},
		hoverStyle: {
			elevation: 2,
			opacity: .9
		}
	};
	const taskBarStyle = {
		...defaultTaskBarStyle,
		...props.taskBarStyle
	};
	const defaultCategoryLabelStyle = {
		width: props.categoryWidth || 120,
		backgroundColor: isDark ? "#2a2a2a" : "#f5f5f5",
		textColor: isDark ? "#ffffff" : "#333333",
		fontSize: 12,
		fontWeight: "normal",
		padding: [6, 12],
		borderRadius: 4,
		borderColor: isDark ? "#404040" : "#e0e0e0",
		borderWidth: 1,
		position: "left",
		shape: "rounded"
	};
	const categoryLabelStyle = {
		...defaultCategoryLabelStyle,
		...props.categoryLabelStyle
	};
	const defaultTimelineStyle = {
		position: "top",
		showGrid: true,
		gridStyle: {
			color: isDark ? "#404040" : "#e9e9e9",
			width: 1,
			type: "solid",
			opacity: .8
		},
		tickStyle: {
			color: isDark ? "#666666" : "#999999",
			width: 1,
			length: 5
		},
		labelStyle: {
			color: isDark ? "#cccccc" : "#666666",
			fontSize: 12,
			fontWeight: "normal"
		}
	};
	const timelineStyle = {
		...defaultTimelineStyle,
		...props.timelineStyle
	};
	const defaultStatusStyles = {
		"planned": {
			backgroundColor: isDark ? "#404040" : "#e0e0e0",
			color: isDark ? "#cccccc" : "#666666",
			borderColor: isDark ? "#666666" : "#cccccc"
		},
		"in-progress": {
			backgroundColor: "#4CAF50",
			color: "#ffffff",
			borderColor: "#45a049"
		},
		"completed": {
			backgroundColor: "#2196F3",
			color: "#ffffff",
			borderColor: "#1976D2"
		},
		"delayed": {
			backgroundColor: "#FF9800",
			color: "#ffffff",
			borderColor: "#F57C00"
		},
		"cancelled": {
			backgroundColor: "#f44336",
			color: "#ffffff",
			borderColor: "#d32f2f"
		}
	};
	const statusStyles = {
		...defaultStatusStyles,
		...props.statusStyles
	};
	const defaultPriorityStyles = {
		"low": {
			backgroundColor: isDark ? "#2c3e50" : "#ecf0f1",
			borderColor: isDark ? "#34495e" : "#bdc3c7"
		},
		"medium": {
			backgroundColor: "#3498db",
			borderColor: "#2980b9"
		},
		"high": {
			backgroundColor: "#e67e22",
			borderColor: "#d35400"
		},
		"critical": {
			backgroundColor: "#e74c3c",
			borderColor: "#c0392b",
			glowColor: "#ff6b6b"
		}
	};
	const priorityStyles = {
		...defaultPriorityStyles,
		...props.priorityStyles
	};
	const processedTasks = tasks.map((task, taskIndex) => {
		const categoryIndex = categoryMap.get(task.category) ?? 0;
		const startTime = new Date(task.startTime).getTime();
		const endTime = new Date(task.endTime).getTime();
		const statusStyle = task.status ? statusStyles[task.status] : null;
		const priorityStyle = task.priority ? priorityStyles[String(task.priority)] : null;
		const customStyle = task.style;
		const taskColor = customStyle?.backgroundColor || statusStyle?.backgroundColor || priorityStyle?.backgroundColor || task.color || props.colorPalette && props.colorPalette[taskIndex % props.colorPalette.length] || COLOR_PALETTES.default[taskIndex % COLOR_PALETTES.default.length];
		return {
			name: task.name,
			value: [
				categoryIndex,
				startTime,
				endTime,
				task.name,
				task.id,
				taskColor,
				task.progress || 0,
				task.status || "",
				task.priority || "",
				task.assignee || ""
			],
			itemStyle: {
				color: taskColor,
				borderColor: customStyle?.borderColor || statusStyle?.borderColor || priorityStyle?.borderColor || taskBarStyle.borderColor,
				borderWidth: customStyle?.borderWidth || taskBarStyle.borderWidth,
				borderRadius: customStyle?.borderRadius || taskBarStyle.borderRadius,
				opacity: customStyle?.opacity
			},
			emphasis: { itemStyle: {
				opacity: taskBarStyle.hoverStyle?.opacity || 1,
				borderColor: taskBarStyle.hoverStyle?.borderColor,
				borderWidth: taskBarStyle.hoverStyle?.borderWidth || taskBarStyle.borderWidth + 1
			} }
		};
	});
	const renderTaskItem = (params, api) => {
		const categoryIndex = api.value(0);
		const startTime = api.value(1);
		const endTime = api.value(2);
		const _taskName = api.value(3);
		const _progress = api.value(6);
		const timeStart = api.coord([startTime, categoryIndex]);
		const timeEnd = api.coord([endTime, categoryIndex]);
		const barLength = Math.max(timeEnd[0] - timeStart[0], 2);
		const barHeight = api.size([0, 1])[1] * (typeof taskBarStyle.height === "number" ? taskBarStyle.height : .6);
		const x = timeStart[0];
		const y = timeStart[1] - barHeight / 2;
		return {
			type: "rect",
			shape: {
				x,
				y,
				width: barLength,
				height: barHeight
			},
			style: {
				fill: api.style().fill,
				stroke: api.style().stroke,
				lineWidth: api.style().lineWidth
			}
		};
	};
	const dataZoomConfig = [];
	if (props.dataZoom !== false) {
		const zoomConfig = typeof props.dataZoom === "boolean" ? {} : props.dataZoom || {};
		const showSlider = zoomConfig.type === "slider" || zoomConfig.type === "both" || zoomConfig.show !== false;
		if (showSlider) dataZoomConfig.push({
			type: "slider",
			xAxisIndex: 0,
			height: zoomConfig.height || 20,
			bottom: 0,
			start: 0,
			end: 50
		});
	}
	const todayMarkerSeries = [];
	if (props.todayMarker) {
		const todayConfig = typeof props.todayMarker === "boolean" ? {} : props.todayMarker;
		const today = new Date().getTime();
		todayMarkerSeries.push({
			type: "line",
			markLine: {
				silent: true,
				symbol: "none",
				data: [{ xAxis: today }],
				lineStyle: {
					color: todayConfig.color || "#ff4444",
					width: todayConfig.width || 2,
					type: todayConfig.style || "dashed"
				}
			}
		});
	}
	const titleHeight = props.title ? props.subtitle ? 65 : 45 : 0;
	return {
		...baseOption,
		grid: {
			show: timelineStyle.showGrid || false,
			left: categoryLabelStyle.width + 20 || 140,
			right: 20,
			top: titleHeight + (timelineStyle.position === "top" ? 50 : 20),
			bottom: (props.dataZoom !== false ? 50 : 30) + (timelineStyle.position === "bottom" ? 40 : 0),
			backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
			borderWidth: 0
		},
		xAxis: {
			type: "time",
			position: timelineStyle.position || "top",
			splitLine: {
				show: timelineStyle.showGrid || false,
				lineStyle: {
					color: timelineStyle.gridStyle?.color || (isDark ? "#404040" : "#e9e9e9"),
					width: timelineStyle.gridStyle?.width || 1,
					type: timelineStyle.gridStyle?.type || "solid",
					opacity: timelineStyle.gridStyle?.opacity || .8
				}
			},
			...props.timeRange && {
				min: new Date(props.timeRange[0]).getTime(),
				max: new Date(props.timeRange[1]).getTime()
			}
		},
		yAxis: {
			type: "category",
			data: categories.map((cat) => cat.label || cat.name),
			axisTick: { show: false },
			axisLine: { show: false },
			axisLabel: { show: false },
			splitLine: { show: false },
			inverse: true
		},
		...dataZoomConfig.length > 0 && { dataZoom: dataZoomConfig },
		series: [{
			type: "custom",
			renderItem: renderTaskItem,
			encode: {
				x: [1, 2],
				y: 0,
				tooltip: [
					0,
					1,
					2,
					3,
					4
				]
			},
			data: processedTasks,
			z: 10
		}, ...todayMarkerSeries],
		tooltip: props.tooltip ? buildTooltipOption(props.tooltip, props.theme) : {
			trigger: "item",
			formatter: (params) => {
				if (params.seriesIndex === 0) {
					const [categoryIndex, startTime, endTime, taskName, _taskId] = params.value;
					const start = new Date(startTime).toLocaleString();
					const end = new Date(endTime).toLocaleString();
					const duration = Math.round((endTime - startTime) / (1e3 * 60 * 60 * 24 * 10)) / 100;
					const category = categories[categoryIndex]?.name || "Unknown";
					return `
            <strong>${taskName}</strong><br/>
            Category: ${category}<br/>
            Start: ${start}<br/>
            End: ${end}<br/>
            Duration: ${duration} days
          `;
				}
				return "";
			}
		},
		...props.legend && { legend: buildLegendOption(props.legend, !!props.title, !!props.subtitle, false, props.theme) },
		...props.customOption
	};
}

//#endregion
//#region src/utils/negative-value-handling.ts
/**
* Analyzes data to detect negative values and calculate appropriate axis ranges
*/
function analyzeDataRange(data, fields) {
	const ranges = {};
	fields.forEach((field) => {
		let min = Infinity;
		let max = -Infinity;
		let hasNegative = false;
		data.forEach((item) => {
			const value = item[field];
			if (typeof value === "number" && !isNaN(value)) {
				min = Math.min(min, value);
				max = Math.max(max, value);
				if (value < 0) hasNegative = true;
			}
		});
		if (min !== Infinity && max !== -Infinity) {
			const range = max - min;
			const padding = range * .1;
			if (hasNegative) {
				min = Math.min(min - padding, 0);
				max = Math.max(max + padding, 0);
			} else {
				min = Math.max(0, min - padding);
				max = max + padding;
			}
			ranges[field] = {
				min,
				max,
				hasNegative
			};
		}
	});
	return ranges;
}
/**
* Enhances axis configuration with proper negative value support
*/
function enhanceAxisForNegativeValues(axisConfig, hasNegative) {
	if (!hasNegative) return axisConfig;
	return {
		...axisConfig,
		axisLine: {
			...axisConfig.axisLine,
			onZero: true,
			lineStyle: {
				color: "#666666",
				...axisConfig.axisLine?.lineStyle
			}
		},
		splitLine: {
			...axisConfig.splitLine,
			show: true,
			lineStyle: {
				color: ["#e6e6e6"],
				width: 1,
				type: "solid",
				...axisConfig.splitLine?.lineStyle
			}
		}
	};
}

//#endregion
//#region src/utils/chart-builders/combined-chart.ts
function buildCombinedChartOption(params) {
	const { data, xField, series, theme = "light", colorPalette, backgroundColor, title, subtitle, titlePosition = "center", xAxis, yAxis = [{ type: "value" }], legend, tooltip, zoom = false, brush = false, animate = true, animationDuration, customOption } = params;
	const xAxisData = isObjectData(data) ? data.map((item) => item[xField]) : [];
	const colors = colorPalette || COLOR_PALETTES[theme] || COLOR_PALETTES.default;
	const baseOption = buildBaseOption({
		theme,
		title,
		subtitle,
		titlePosition,
		backgroundColor,
		animate,
		animationDuration
	});
	const echartsSeriesData = series.map((seriesConfig, index) => {
		const { field, type, name, color, yAxisIndex = 0,...seriesOptions } = seriesConfig;
		const seriesData = isObjectData(data) ? data.map((item) => item[field]) : [];
		const baseSeriesConfig = {
			name,
			type,
			data: seriesData,
			color: color || colors[index % colors.length],
			yAxisIndex
		};
		if (type === "line") Object.assign(baseSeriesConfig, {
			smooth: seriesOptions.smooth || false,
			lineStyle: {
				width: seriesOptions.strokeWidth || 2,
				type: mapStrokeStyleToECharts(seriesOptions.strokeStyle || "solid")
			},
			symbol: seriesOptions.showPoints ? "circle" : "none",
			symbolSize: seriesOptions.pointSize || 4,
			areaStyle: seriesOptions.showArea ? { opacity: seriesOptions.areaOpacity || .3 } : void 0
		});
		else if (type === "bar") Object.assign(baseSeriesConfig, {
			barWidth: seriesOptions.barWidth,
			stack: seriesOptions.stack,
			label: seriesOptions.showLabels ? {
				show: true,
				position: "top"
			} : void 0
		});
		return baseSeriesConfig;
	});
	const builtXAxis = buildAxisOption({
		type: "category",
		boundaryGap: true,
		...xAxis
	});
	if (builtXAxis.type === "category") builtXAxis.data = xAxisData;
	const seriesFields = series.map((s) => s.field);
	const dataRanges = analyzeDataRange(data, seriesFields);
	const builtYAxis = yAxis.map((axisConfig, index) => {
		const seriesUsingThisAxis = series.filter((s) => (s.yAxisIndex || 0) === index);
		const fieldsForThisAxis = seriesUsingThisAxis.map((s) => s.field);
		let axisMin;
		let axisMax;
		let hasNegativeValues = false;
		fieldsForThisAxis.forEach((field) => {
			const range = dataRanges[field];
			if (range) {
				axisMin = axisMin === void 0 ? range.min : Math.min(axisMin, range.min);
				axisMax = axisMax === void 0 ? range.max : Math.max(axisMax, range.max);
				if (range.hasNegative) hasNegativeValues = true;
			}
		});
		let axisOptions = {
			type: "value",
			...axisConfig
		};
		if (axisMin !== void 0 && axisMax !== void 0) {
			if (axisConfig.min === void 0) axisOptions.min = axisMin;
			if (axisConfig.max === void 0) axisOptions.max = axisMax;
		}
		if (yAxis.length > 1 && index > 0) axisOptions.splitLine = { show: false };
		axisOptions = enhanceAxisForNegativeValues(axisOptions, hasNegativeValues);
		return buildAxisOption(axisOptions);
	});
	const builtLegend = legend !== false ? buildLegendOption({
		show: true,
		data: series.map((s) => s.name),
		...legend
	}, !!title, !!subtitle, zoom, theme) : void 0;
	const builtTooltip = buildTooltipOption({
		trigger: "axis",
		axisPointer: {
			type: "cross",
			crossStyle: { color: "#999" }
		},
		...tooltip
	});
	const dataZoom = zoom ? [{
		type: "slider",
		xAxisIndex: 0,
		show: true
	}, {
		type: "inside",
		xAxisIndex: 0
	}] : void 0;
	const brushConfig = brush ? {
		toolbox: { feature: { brush: { type: [
			"rect",
			"polygon",
			"lineX",
			"lineY",
			"keep",
			"clear"
		] } } },
		brush: { xAxisIndex: 0 }
	} : void 0;
	const option = {
		...baseOption,
		color: colors,
		xAxis: builtXAxis,
		yAxis: builtYAxis,
		series: echartsSeriesData,
		legend: builtLegend,
		tooltip: builtTooltip,
		dataZoom,
		...brushConfig,
		grid: {
			...calculateGridSpacing(legend, !!title, !!subtitle, zoom),
			right: yAxis.length > 1 ? "8%" : calculateGridSpacing(legend, !!title, !!subtitle, zoom).right,
			containLabel: true
		}
	};
	if (customOption) return {
		...option,
		...customOption
	};
	return option;
}

//#endregion
//#region src/utils/chart-builders/cluster-chart.ts
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
	let hasNegativeX = false;
	let hasNegativeY = false;
	sourceData.forEach(([x, y]) => {
		if (x !== void 0 && x < 0) hasNegativeX = true;
		if (y !== void 0 && y < 0) hasNegativeY = true;
	});
	const outputClusterIndexDimension = 2;
	const baseGrid = calculateGridSpacing(void 0, !!props.title, !!props.subtitle, false);
	const gridLeft = visualMapPosition === "left" ? 120 : baseGrid.left || 50;
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
			top: visualMapPosition === "bottom" ? "auto" : visualMapPosition === "top" ? props.title ? 50 : 10 : props.title ? 60 : "middle",
			...visualMapPosition === "left" && { left: 10 },
			...visualMapPosition === "right" && { right: 10 },
			...visualMapPosition === "bottom" && { bottom: 10 },
			min: 0,
			max: clusterCount,
			splitNumber: clusterCount,
			dimension: outputClusterIndexDimension,
			pieces
		},
		grid: {
			...baseGrid,
			left: gridLeft,
			containLabel: true
		},
		xAxis: enhanceAxisForNegativeValues({
			...buildAxisOption(props.xAxis, "numeric", props.theme),
			type: "value",
			scale: true
		}, hasNegativeX),
		yAxis: enhanceAxisForNegativeValues({
			...buildAxisOption(props.yAxis, "numeric", props.theme),
			type: "value",
			scale: true
		}, hasNegativeY),
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
//#region src/utils/chart-builders/calendar-heatmap-chart.ts
function buildCalendarHeatmapOption(props) {
	const baseOption = buildBaseOption(props);
	let calendarData = [];
	if (props.data && props.data.length > 0) if (isObjectData(props.data)) {
		const dateField = props.dateField || "date";
		const valueField = props.valueField || "value";
		calendarData = props.data.map((item) => {
			const dateValue = item[dateField];
			const formattedDate = typeof dateValue === "string" ? dateValue : dateValue ? new Date(dateValue).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
			return [formattedDate, Number(item[valueField]) || 0];
		});
	} else calendarData = props.data.map((item) => {
		const dateValue = item.date || item[0];
		const valueValue = item.value || item[1];
		const formattedDate = typeof dateValue === "string" ? dateValue : dateValue ? new Date(dateValue).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
		return [formattedDate, Number(valueValue) || 0];
	});
	let years = [];
	if (props.year) years = Array.isArray(props.year) ? [...props.year] : [props.year];
	else if (props.range) {
		const startYear = new Date(props.range[0]).getFullYear();
		const endYear = new Date(props.range[1]).getFullYear();
		for (let y = startYear; y <= endYear; y++) years.push(y);
	} else if (calendarData.length > 0) {
		const dataYears = new Set(calendarData.map(([date]) => new Date(date).getFullYear()));
		years = Array.from(dataYears).sort();
	} else years = [new Date().getFullYear()];
	const colorScale = props.colorScale || [
		"#ebedf0",
		"#c6e48b",
		"#7bc96f",
		"#239a3b",
		"#196127"
	];
	const defaultCellSize = props.orient === "vertical" ? [15, 15] : [20, 20];
	const cellSize = Array.isArray(props.cellSize) ? [props.cellSize[0] || 20, props.cellSize[1] || 20] : props.cellSize ? [props.cellSize, props.cellSize] : defaultCellSize;
	const values = calendarData.map(([, value]) => value);
	const minValue = Math.min(...values, 0);
	const maxValue = Math.max(...values, 1);
	const hasTitle = !!props.title;
	const hasSubtitle = !!props.subtitle;
	const isVertical = props.orient === "vertical";
	const titleHeight = hasTitle && hasSubtitle ? 60 : hasTitle ? 40 : 0;
	const monthLabelHeight = 25;
	const topPadding = titleHeight + monthLabelHeight + 10;
	const bottomPadding = isVertical ? 30 : 50;
	const calendars = years.map((year, index) => {
		const calendarConfig = {
			orient: props.orient || "horizontal",
			range: props.range || year.toString(),
			cellSize,
			dayLabel: {
				show: props.showWeekLabel !== false,
				firstDay: props.startOfWeek === "monday" ? 1 : 0
			},
			monthLabel: { show: props.showMonthLabel !== false },
			yearLabel: { show: props.showYearLabel !== false },
			splitLine: {
				show: true,
				lineStyle: {
					color: props.cellBorderColor || "#eee",
					width: props.cellBorderWidth || 1,
					type: "solid"
				}
			},
			itemStyle: {
				borderColor: props.cellBorderColor || "#eee",
				borderWidth: props.cellBorderWidth || 1
			}
		};
		if (isVertical) {
			calendarConfig.left = 80;
			calendarConfig.top = topPadding;
			calendarConfig.bottom = bottomPadding;
			calendarConfig.right = 100;
		} else if (years.length > 1) {
			const totalHeight = 100;
			const availableHeight = totalHeight - topPadding - bottomPadding;
			const heightPerYear = availableHeight / years.length;
			calendarConfig.top = topPadding + index * heightPerYear;
			calendarConfig.left = 50;
			calendarConfig.right = 30;
		} else {
			calendarConfig.top = topPadding;
			calendarConfig.left = 50;
			calendarConfig.right = 30;
			calendarConfig.bottom = bottomPadding;
		}
		return calendarConfig;
	});
	const series = years.map((year, index) => ({
		type: "heatmap",
		coordinateSystem: "calendar",
		calendarIndex: index,
		data: calendarData.filter(([date]) => new Date(date).getFullYear() === year),
		...props.showValues && { label: {
			show: true,
			formatter: props.valueFormat && typeof props.valueFormat === "function" ? (params) => props.valueFormat(params.value[1]) : props.valueFormat && typeof props.valueFormat === "string" ? (params) => {
				const value = params.value[1];
				if (props.valueFormat === "{value}") return value.toString();
				if (props.valueFormat === "{value:,.0f}") return value.toLocaleString();
				return value.toString();
			} : void 0
		} }
	}));
	const isDark = props.theme === "dark";
	return {
		...baseOption,
		calendar: calendars,
		series,
		visualMap: {
			type: "piecewise",
			orient: isVertical ? "vertical" : "horizontal",
			...isVertical ? {
				right: 20,
				top: topPadding,
				itemGap: 5
			} : {
				left: "center",
				bottom: 10
			},
			min: minValue,
			max: maxValue,
			splitNumber: props.splitNumber || colorScale.length - 1,
			inRange: { color: colorScale },
			textStyle: {
				color: isDark ? "#cccccc" : "#666666",
				fontSize: isVertical ? 11 : 12
			},
			itemSymbol: "rect",
			itemWidth: isVertical ? 15 : 20,
			itemHeight: isVertical ? 12 : 14
		},
		tooltip: props.tooltip ? buildTooltipOption(props.tooltip, props.theme) : {
			trigger: "item",
			formatter: (params) => {
				const [date, value] = params.value;
				const formattedDate = new Date(date).toLocaleDateString();
				const formattedValue = props.valueFormat && typeof props.valueFormat === "function" ? props.valueFormat(value) : value;
				return `${formattedDate}<br/>Value: ${formattedValue}`;
			},
			textStyle: { color: isDark ? "#ffffff" : "#333333" },
			backgroundColor: isDark ? "#333333" : "rgba(255, 255, 255, 0.95)",
			borderColor: isDark ? "#555555" : "#dddddd"
		},
		...props.customOption
	};
}

//#endregion
//#region src/utils/chart-builders/regression-chart.ts
function buildRegressionChartOption(props) {
	const baseOption = buildBaseOption(props);
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
	const method = props.method || "linear";
	const order = props.order || (method === "polynomial" ? 2 : void 0);
	const showPoints = props.showPoints !== false;
	const showLine = props.showLine !== false;
	const showEquation = props.showEquation !== false;
	const _showRSquared = props.showRSquared !== false;
	const pointSize = props.pointSize || 8;
	const pointShape = props.pointShape || "circle";
	const pointOpacity = props.pointOpacity || .7;
	const lineWidth = props.lineWidth || 2;
	const lineStyle = props.lineStyle || "solid";
	const lineColor = props.lineColor;
	const lineOpacity = props.lineOpacity || 1;
	const pointsLabel = props.pointsLabel || "Data Points";
	const regressionLabel = props.regressionLabel || "Regression Line";
	const datasets = [{ source: sourceData }];
	if (showLine) {
		const regressionConfig = {
			method,
			formulaOn: showEquation ? props.equationPosition === "top-left" || props.equationPosition === "bottom-left" ? "start" : "end" : false
		};
		if (method === "polynomial" && order !== void 0) regressionConfig.order = order;
		datasets.push({ transform: {
			type: "ecStat:regression",
			config: regressionConfig
		} });
	}
	const series = [];
	if (showPoints) series.push({
		name: pointsLabel,
		type: "scatter",
		datasetIndex: 0,
		symbolSize: pointSize,
		symbol: pointShape,
		itemStyle: { opacity: pointOpacity },
		emphasis: { focus: "series" }
	});
	if (showLine) {
		const lineSeriesStyle = {
			width: lineWidth,
			type: lineStyle === "dashed" ? "dashed" : lineStyle === "dotted" ? "dotted" : "solid",
			opacity: lineOpacity
		};
		if (lineColor) lineSeriesStyle.color = lineColor;
		series.push({
			name: regressionLabel,
			type: "line",
			datasetIndex: 1,
			symbolSize: 0,
			symbol: "none",
			lineStyle: lineSeriesStyle,
			emphasis: { focus: "series" },
			encode: { tooltip: [0, 1] }
		});
	}
	const equationGraphic = [];
	if (showEquation && showLine) {
		const position = props.equationPosition || "top-right";
		let x = "90%";
		let y = "10%";
		switch (position) {
			case "top-left":
				x = "5%";
				y = "15%";
				break;
			case "top-right":
				x = "90%";
				y = "15%";
				break;
			case "bottom-left":
				x = "5%";
				y = "85%";
				break;
			case "bottom-right":
				x = "90%";
				y = "85%";
				break;
		}
		equationGraphic.push({
			type: "text",
			left: x,
			top: y,
			style: {
				text: "Calculating equation...",
				fontSize: 12,
				fill: props.theme === "dark" ? "#cccccc" : "#666666"
			}
		});
	}
	return {
		...baseOption,
		dataset: datasets,
		grid: calculateGridSpacing(props.legend, !!props.title, !!props.subtitle, false),
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
		series,
		legend: buildLegendOption(props.legend, !!props.title, !!props.subtitle, false, props.theme),
		tooltip: buildTooltipOption(props.tooltip, props.theme),
		...equationGraphic.length > 0 && { graphic: equationGraphic },
		...props.customOption
	};
}

//#endregion
//#region src/utils/chart-builders/sankey-chart.ts
function buildSankeyChartOption(props) {
	const baseOption = buildBaseOption(props);
	let nodes = [];
	let links = [];
	if (props.nodes && props.links) {
		nodes = [...props.nodes];
		links = [...props.links];
	} else if (props.data) if (Array.isArray(props.data) && isObjectData(props.data)) {
		const flatData = props.data;
		const sourceField = props.sourceField || "source";
		const targetField = props.targetField || "target";
		const valueField = props.valueField || "value";
		const nodeSet = new Set();
		flatData.forEach((item) => {
			const source = String(item[sourceField] || "");
			const target = String(item[targetField] || "");
			if (source) nodeSet.add(source);
			if (target) nodeSet.add(target);
		});
		nodes = Array.from(nodeSet).map((name) => ({ name }));
		links = flatData.map((item) => ({
			source: String(item[sourceField] || ""),
			target: String(item[targetField] || ""),
			value: Number(item[valueField]) || 0
		}));
	} else {
		const structuredData = props.data;
		nodes = structuredData.nodes && Array.isArray(structuredData.nodes) ? [...structuredData.nodes] : [];
		links = structuredData.links && Array.isArray(structuredData.links) ? [...structuredData.links] : [];
	}
	const processedNodes = nodes.map((node, index) => {
		const processedNode = { ...node };
		if (props.nodeColors && props.nodeColors[index]) processedNode.itemStyle = {
			...processedNode.itemStyle,
			color: props.nodeColors[index]
		};
		if (props.nodeLabels !== false) processedNode.label = {
			show: true,
			position: props.nodeLabelPosition || (props.orient === "vertical" ? "bottom" : "right"),
			formatter: props.showNodeValues ? `{b}: {c}` : `{b}`,
			...processedNode.label
		};
		else processedNode.label = { show: false };
		return processedNode;
	});
	const processedLinks = links.map((link, index) => {
		const processedLink = { ...link };
		processedLink.lineStyle = {
			opacity: props.linkOpacity || .6,
			curveness: props.linkCurveness || .5,
			...processedLink.lineStyle
		};
		if (props.linkColors && props.linkColors[index]) processedLink.lineStyle.color = props.linkColors[index];
		if (props.showLinkLabels) processedLink.label = {
			show: true,
			formatter: "{c}",
			...processedLink.label
		};
		return processedLink;
	});
	const titleHeight = props.title ? props.subtitle ? 65 : 45 : 0;
	const series = {
		type: "sankey",
		layout: props.layout || "none",
		orient: props.orient || "horizontal",
		nodeAlign: props.nodeAlign || "justify",
		nodeGap: props.nodeGap || 8,
		nodeWidth: props.nodeWidth || 20,
		layoutIterations: props.iterations || 32,
		data: processedNodes,
		links: processedLinks,
		emphasis: {
			focus: props.focusMode || "adjacency",
			...props.blurScope && { blurScope: props.blurScope }
		},
		left: 50,
		top: titleHeight + 20,
		right: 50,
		bottom: 30
	};
	return {
		...baseOption,
		series: [series],
		...props.legend && { legend: buildLegendOption(props.legend, !!props.title, !!props.subtitle, false, props.theme) },
		tooltip: props.tooltip ? buildTooltipOption(props.tooltip, props.theme) : {
			trigger: "item",
			triggerOn: "mousemove",
			formatter: (params) => {
				if (params.dataType === "edge") return `${params.data.source} → ${params.data.target}<br/>Value: ${params.data.value}`;
				else return `${params.data.name}<br/>Value: ${params.data.value || "N/A"}`;
			}
		},
		...props.customOption
	};
}

//#endregion
//#region src/components/LineChart.tsx
/**
* Ergonomic LineChart component with intuitive props
*
* @example
* // Simple line chart with object data
* <LineChart
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
* <LineChart
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
const LineChart = (0, react.forwardRef)((props, ref) => {
	const { className } = props;
	const buildOption = (0, react.useMemo)(() => buildLineChartOption, []);
	const { containerRef, containerStyle, domProps, refMethods, renderError, renderLoading, error } = useChartComponent({
		props,
		buildOption,
		chartType: "line"
	});
	(0, react.useImperativeHandle)(ref, () => refMethods, [refMethods]);
	if (error) return renderError();
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: `aqc-charts-container ${className || ""}`,
		style: containerStyle,
		...domProps,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			ref: containerRef,
			style: {
				width: "100%",
				height: "100%"
			}
		}), renderLoading()]
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
* <BarChart
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
* <BarChart
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
* <BarChart
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
const BarChart = (0, react.forwardRef)((props, ref) => {
	const { className } = props;
	const buildOption = (0, react.useMemo)(() => buildBarChartOption, []);
	const { containerRef, containerStyle, domProps, refMethods, renderError, renderLoading, error } = useChartComponent({
		props,
		buildOption,
		chartType: "bar"
	});
	(0, react.useImperativeHandle)(ref, () => refMethods, [refMethods]);
	if (error) return renderError();
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: `aqc-charts-container ${className || ""}`,
		style: containerStyle,
		...domProps,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			ref: containerRef,
			style: {
				width: "100%",
				height: "100%"
			}
		}), renderLoading()]
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
* <PieChart
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
* <PieChart
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
* <PieChart
*   data={performanceData}
*   nameField="department"
*   valueField="score"
*   roseType
*   title="Performance by Department"
*   showLabels
* />
*/
const PieChart = (0, react.forwardRef)((props, ref) => {
	const { className } = props;
	const buildOption = (0, react.useMemo)(() => buildPieChartOption, []);
	const { containerRef, containerStyle, domProps, refMethods, renderError, renderLoading, error, getEChartsInstance } = useChartComponent({
		props,
		buildOption,
		chartType: "pie"
	});
	const selectSlice = (0, react.useCallback)((dataIndex) => {
		const chart = getEChartsInstance();
		if (!chart) return;
		chart.dispatchAction({
			type: "pieSelect",
			seriesIndex: 0,
			dataIndex
		});
	}, [getEChartsInstance]);
	const unselectSlice = (0, react.useCallback)((dataIndex) => {
		const chart = getEChartsInstance();
		if (!chart) return;
		chart.dispatchAction({
			type: "pieUnSelect",
			seriesIndex: 0,
			dataIndex
		});
	}, [getEChartsInstance]);
	(0, react.useImperativeHandle)(ref, () => ({
		...refMethods,
		selectSlice,
		unselectSlice
	}), [
		refMethods,
		selectSlice,
		unselectSlice
	]);
	if (error) return renderError();
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: `aqc-charts-container ${className || ""}`,
		style: containerStyle,
		...domProps,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			ref: containerRef,
			style: {
				width: "100%",
				height: "100%"
			}
		}), renderLoading()]
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
const ScatterChart = (0, react.forwardRef)((props, ref) => {
	const { className } = props;
	const buildOption = (0, react.useMemo)(() => buildScatterChartOption, []);
	const { containerRef, containerStyle, domProps, refMethods, renderError, renderLoading, error } = useChartComponent({
		props,
		buildOption,
		chartType: "scatter"
	});
	(0, react.useImperativeHandle)(ref, () => refMethods, [refMethods]);
	if (error) return renderError();
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: `aqc-charts-container ${className || ""}`,
		style: containerStyle,
		...domProps,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			ref: containerRef,
			style: {
				width: "100%",
				height: "100%"
			}
		}), renderLoading()]
	});
});
ScatterChart.displayName = "ScatterChart";

//#endregion
//#region src/components/StackedAreaChart.tsx
/**
* Ergonomic StackedAreaChart component with intuitive props
*
* @example
* // Simple stacked area chart
* <StackedAreaChart
*   data={[
*     { month: 'Jan', sales: 100, costs: 60 },
*     { month: 'Feb', sales: 120, costs: 70 },
*     { month: 'Mar', sales: 110, costs: 65 }
*   ]}
*   xField="month"
*   yField={['sales', 'costs']}
*   stacked
* />
*/
const StackedAreaChart = (0, react.forwardRef)((props, ref) => {
	const { className } = props;
	const buildOption = (0, react.useMemo)(() => buildStackedAreaChartOption, []);
	const { containerRef, containerStyle, domProps, refMethods, renderError, renderLoading, error } = useChartComponent({
		props,
		buildOption,
		chartType: "stacked-area"
	});
	(0, react.useImperativeHandle)(ref, () => refMethods, [refMethods]);
	if (error) return renderError();
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: `aqc-charts-container ${className || ""}`,
		style: containerStyle,
		...domProps,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			ref: containerRef,
			style: {
				width: "100%",
				height: "100%"
			}
		}), renderLoading()]
	});
});
StackedAreaChart.displayName = "StackedAreaChart";

//#endregion
//#region src/components/CombinedChart.tsx
/**
* Combined Chart component that can mix line and bar series in the same visualization
*
* @example
* // Combined chart with sales bars and temperature line
* <CombinedChart
*   data={[
*     { month: 'Jan', sales: 100, temperature: 15 },
*     { month: 'Feb', sales: 120, temperature: 18 },
*     { month: 'Mar', sales: 110, temperature: 22 }
*   ]}
*   xField="month"
*   series={[
*     { field: 'sales', type: 'bar', name: 'Sales', color: '#1890ff' },
*     { field: 'temperature', type: 'line', name: 'Temperature', color: '#ff4d4f', yAxisIndex: 1 }
*   ]}
*   yAxis={[
*     { name: 'Sales (units)', position: 'left' },
*     { name: 'Temperature (°C)', position: 'right' }
*   ]}
* />
*
* @example
* // Simple combined chart with default styling
* <CombinedChart
*   data={salesData}
*   xField="quarter"
*   series={[
*     { field: 'revenue', type: 'bar', name: 'Revenue' },
*     { field: 'growth', type: 'line', name: 'Growth Rate' }
*   ]}
* />
*/
const CombinedChart = (0, react.forwardRef)((props, ref) => {
	const { className } = props;
	const buildOption = (0, react.useCallback)((chartProps) => {
		return buildCombinedChartOption({
			data: chartProps.data || [],
			xField: chartProps.xField || "x",
			series: chartProps.series || [],
			theme: chartProps.theme,
			colorPalette: chartProps.colorPalette,
			backgroundColor: chartProps.backgroundColor,
			title: chartProps.title,
			subtitle: chartProps.subtitle,
			titlePosition: chartProps.titlePosition,
			xAxis: chartProps.xAxis,
			yAxis: chartProps.yAxis,
			legend: chartProps.legend,
			tooltip: chartProps.tooltip,
			zoom: chartProps.zoom,
			pan: chartProps.pan,
			brush: chartProps.brush,
			animate: chartProps.animate,
			animationDuration: chartProps.animationDuration,
			customOption: chartProps.customOption
		});
	}, []);
	const { containerRef, containerStyle, domProps, refMethods, renderError, renderLoading, error } = useChartComponent({
		props,
		buildOption,
		chartType: "combined"
	});
	(0, react.useImperativeHandle)(ref, () => refMethods, [refMethods]);
	if (error) return renderError();
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: `aqc-charts-container ${className || ""}`,
		style: containerStyle,
		...domProps,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			ref: containerRef,
			style: {
				width: "100%",
				height: "100%"
			}
		}), renderLoading()]
	});
});
CombinedChart.displayName = "CombinedChart";

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
const ClusterChart = (0, react.forwardRef)((props, ref) => {
	const { className } = props;
	const buildOption = (0, react.useMemo)(() => buildClusterChartOption, []);
	const { containerRef, containerStyle, domProps, refMethods, renderError, renderLoading, error } = useChartComponent({
		props,
		buildOption,
		chartType: "cluster"
	});
	(0, react.useImperativeHandle)(ref, () => refMethods, [refMethods]);
	if (error) return renderError();
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: `aqc-charts-container ${className || ""}`,
		style: containerStyle,
		...domProps,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			ref: containerRef,
			style: {
				width: "100%",
				height: "100%"
			}
		}), renderLoading()]
	});
});
ClusterChart.displayName = "ClusterChart";

//#endregion
//#region src/components/CalendarHeatmapChart.tsx
/**
* Ergonomic CalendarHeatmapChart component with intuitive props
*
* @example
* // Simple calendar heatmap with object data
* <CalendarHeatmapChart
*   data={[
*     { date: '2023-01-01', value: 10 },
*     { date: '2023-01-02', value: 25 },
*     { date: '2023-01-03', value: 15 }
*   ]}
*   year={2023}
*   colorScale={['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']}
* />
*
* @example
* // Multi-year calendar heatmap with custom fields
* <CalendarHeatmapChart
*   data={commitData}
*   dateField="commit_date"
*   valueField="commits_count"
*   year={[2022, 2023]}
*   showValues
*   cellSize={[20, 20]}
* />
*
* @example
* // Calendar heatmap with custom styling
* <CalendarHeatmapChart
*   data={activityData}
*   year={2023}
*   colorScale={['#f0f0f0', '#d6e685', '#8cc665', '#44a340', '#1e6823']}
*   cellBorderColor="#ccc"
*   orient="vertical"
*   showWeekLabel={false}
* />
*/
const CalendarHeatmapChart = (0, react.forwardRef)((props, ref) => {
	const { className } = props;
	const buildOption = (0, react.useMemo)(() => buildCalendarHeatmapOption, []);
	const { containerRef, containerStyle, domProps, refMethods, renderError, renderLoading, error } = useChartComponent({
		props,
		buildOption,
		chartType: "calendar-heatmap"
	});
	(0, react.useImperativeHandle)(ref, () => refMethods, [refMethods]);
	if (error) return renderError();
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: `aqc-charts-container ${className || ""}`,
		style: containerStyle,
		...domProps,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			ref: containerRef,
			style: {
				width: "100%",
				height: "100%"
			}
		}), renderLoading()]
	});
});
CalendarHeatmapChart.displayName = "CalendarHeatmapChart";

//#endregion
//#region src/components/SankeyChart.tsx
/**
* Ergonomic SankeyChart component with intuitive props
*
* @example
* // Simple sankey chart with nodes and links data structure
* <SankeyChart
*   data={{
*     nodes: [
*       { name: 'a' },
*       { name: 'b' },
*       { name: 'c' }
*     ],
*     links: [
*       { source: 'a', target: 'b', value: 10 },
*       { source: 'b', target: 'c', value: 15 }
*     ]
*   }}
*   title="Flow Diagram"
* />
*
* @example
* // Sankey chart with flat data structure
* <SankeyChart
*   data={[
*     { source: 'Product A', target: 'Sales', value: 120 },
*     { source: 'Product B', target: 'Sales', value: 80 },
*     { source: 'Sales', target: 'Profit', value: 150 }
*   ]}
*   sourceField="source"
*   targetField="target"
*   valueField="value"
*   orient="horizontal"
*   nodeAlign="left"
* />
*/
const SankeyChart = (0, react.forwardRef)((props, ref) => {
	const { className } = props;
	const buildOption = (0, react.useMemo)(() => buildSankeyChartOption, []);
	const { containerRef, containerStyle, domProps, refMethods, renderError, renderLoading, error, getEChartsInstance } = useChartComponent({
		props,
		buildOption,
		chartType: "sankey"
	});
	const focusNode = (0, react.useCallback)((nodeName) => {
		const chart = getEChartsInstance();
		if (!chart) return;
		const option = chart.getOption();
		const series = option.series?.[0];
		if (!series?.data) return;
		const nodeIndex = series.data.findIndex((node) => node.name === nodeName);
		if (nodeIndex >= 0) chart.dispatchAction({
			type: "highlight",
			seriesIndex: 0,
			dataIndex: nodeIndex
		});
	}, [getEChartsInstance]);
	(0, react.useImperativeHandle)(ref, () => ({
		...refMethods,
		focusNode
	}), [refMethods, focusNode]);
	if (error) return renderError();
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: `aqc-charts-container ${className || ""}`,
		style: containerStyle,
		...domProps,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			ref: containerRef,
			style: {
				width: "100%",
				height: "100%"
			}
		}), renderLoading()]
	});
});
SankeyChart.displayName = "SankeyChart";

//#endregion
//#region src/components/GanttChart.tsx
/**
* Ergonomic GanttChart component with extensive customization options
*
* @example
* // Simple project timeline with tasks and categories
* <GanttChart
*   data={{
*     tasks: [
*       {
*         id: 'task1',
*         name: 'Design Phase',
*         category: 'Development',
*         startTime: '2024-01-01',
*         endTime: '2024-01-15',
*         status: 'completed'
*       },
*       {
*         id: 'task2',
*         name: 'Implementation',
*         category: 'Development',
*         startTime: '2024-01-10',
*         endTime: '2024-02-01',
*         status: 'in-progress',
*         progress: 65
*       }
*     ],
*     categories: [
*       { name: 'Development', label: 'Development Team' },
*       { name: 'Marketing', label: 'Marketing Department' }
*     ]
*   }}
*   title="Project Timeline"
*   showTaskProgress
*   todayMarker
* />
*/
const GanttChart = (0, react.forwardRef)((props, ref) => {
	const { className, onTaskClick, onCategoryClick, onTimeRangeChange, onDataPointClick } = props;
	const buildOption = (0, react.useMemo)(() => buildGanttChartOption, []);
	const { containerRef, containerStyle, domProps, refMethods, renderError, renderLoading, error, getEChartsInstance } = useChartComponent({
		props,
		buildOption,
		chartType: "gantt"
	});
	const chartInstance = getEChartsInstance();
	(0, react.useEffect)(() => {
		if (!chartInstance) return;
		const handleClick = (params, chart) => {
			if (params.seriesIndex === 0) {
				const [_categoryIndex, startTime, endTime, taskName, taskId] = params.value;
				const taskData = {
					id: taskId,
					name: taskName,
					category: "",
					startTime: new Date(startTime),
					endTime: new Date(endTime)
				};
				onTaskClick?.(taskData, params);
				onDataPointClick?.(params, {
					chart,
					event: params
				});
			} else if (params.seriesIndex === 1) {
				const [_categoryIndex, categoryName, categoryLabel] = params.value;
				const categoryData = {
					name: categoryName,
					label: categoryLabel
				};
				onCategoryClick?.(categoryData, params);
			}
		};
		if (onTaskClick || onCategoryClick || onDataPointClick) chartInstance.on("click", handleClick);
		return () => {
			chartInstance.off("click", handleClick);
		};
	}, [
		chartInstance,
		onTaskClick,
		onCategoryClick,
		onDataPointClick
	]);
	const highlightTask = (0, react.useCallback)((taskId) => {
		const chart = getEChartsInstance();
		if (!chart) return;
		const option = chart.getOption();
		const taskSeries = option.series?.[0];
		if (!taskSeries?.data) return;
		const taskIndex = taskSeries.data.findIndex((item) => item.value[4] === taskId);
		if (taskIndex >= 0) chart.dispatchAction({
			type: "highlight",
			seriesIndex: 0,
			dataIndex: taskIndex
		});
	}, [getEChartsInstance]);
	const zoomToRange = (0, react.useCallback)((startTime, endTime) => {
		const chart = getEChartsInstance();
		if (!chart) return;
		const startMs = startTime.getTime();
		const endMs = endTime.getTime();
		chart.dispatchAction({
			type: "dataZoom",
			startValue: startMs,
			endValue: endMs
		});
		onTimeRangeChange?.(startTime, endTime);
	}, [getEChartsInstance, onTimeRangeChange]);
	const focusTask = (0, react.useCallback)((taskId) => {
		const chart = getEChartsInstance();
		if (!chart) return;
		const option = chart.getOption();
		const taskSeries = option.series?.[0];
		if (!taskSeries?.data) return;
		const task = taskSeries.data.find((item) => item.value[4] === taskId);
		if (task) {
			const [, startTime, endTime] = task.value;
			const buffer = (endTime - startTime) * .2;
			zoomToRange(new Date(startTime - buffer), new Date(endTime + buffer));
			highlightTask(taskId);
		}
	}, [
		getEChartsInstance,
		zoomToRange,
		highlightTask
	]);
	(0, react.useImperativeHandle)(ref, () => ({
		...refMethods,
		highlight: (dataIndex) => highlightTask(String(dataIndex)),
		focusTask,
		zoomToRange,
		highlightTask
	}), [
		refMethods,
		focusTask,
		zoomToRange,
		highlightTask
	]);
	if (error) return renderError();
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: `aqc-charts-container ${className || ""}`,
		style: containerStyle,
		...domProps,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			ref: containerRef,
			style: {
				width: "100%",
				height: "100%"
			}
		}), renderLoading()]
	});
});
GanttChart.displayName = "GanttChart";

//#endregion
//#region src/components/RegressionChart.tsx
/**
* Ergonomic RegressionChart component with intuitive props
*
* @example
* // Simple regression chart with array data
* <RegressionChart
*   data={[
*     [1, 2], [2, 4], [3, 6], [4, 8], [5, 10]
*   ]}
*   method="linear"
*   title="Linear Regression"
* />
*
* @example
* // Regression chart with object data
* <RegressionChart
*   data={[
*     { x: 1, y: 2.1 },
*     { x: 2, y: 3.9 },
*     { x: 3, y: 6.2 },
*     { x: 4, y: 7.8 },
*     { x: 5, y: 10.1 }
*   ]}
*   xField="x"
*   yField="y"
*   method="linear"
*   showEquation={true}
*   equationPosition="top-left"
* />
*
* @example
* // Polynomial regression with custom styling
* <RegressionChart
*   data={polynomialData}
*   method="polynomial"
*   order={3}
*   pointSize={10}
*   lineWidth={3}
*   lineColor="#ff6b6b"
*   showEquation={true}
*   showRSquared={true}
* />
*/
const RegressionChart = (0, react.forwardRef)((props, ref) => {
	const { className } = props;
	const buildOption = (0, react.useMemo)(() => buildRegressionChartOption, []);
	const { containerRef, containerStyle, domProps, refMethods, renderError, renderLoading, error } = useChartComponent({
		props,
		buildOption,
		chartType: "regression"
	});
	(0, react.useImperativeHandle)(ref, () => refMethods, [refMethods]);
	if (error) return renderError();
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: `aqc-charts-container ${className || ""}`,
		style: containerStyle,
		...domProps,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			ref: containerRef,
			style: {
				width: "100%",
				height: "100%"
			}
		}), renderLoading()]
	});
});
RegressionChart.displayName = "RegressionChart";

//#endregion
//#region src/components/GeoChart.tsx
const GeoChart = (0, react.forwardRef)(({ data, mapName, mapUrl, mapType = "geojson", mapSpecialAreas, chartType = "map", nameField = "name", valueField = "value", visualMap = {}, geo, roam = true, scaleLimit, itemStyle, showLabels = false, labelPosition = "inside", tooltip, toolbox, additionalSeries = [], grid, xAxis, yAxis, onSelectChanged, onMapLoad, onMapError, onLegendDoubleClick, onSeriesDoubleClick, legendDoubleClickDelay, enableLegendDoubleClickSelection, title,...restProps }, ref) => {
	const [isMapLoaded, setIsMapLoaded] = (0, react.useState)(false);
	const registeredMapsRef = (0, react.useRef)(new Set());
	const stableOnMapLoad = (0, react.useCallback)(() => {
		onMapLoad?.();
	}, [onMapLoad]);
	const stableOnMapError = (0, react.useCallback)((error) => {
		onMapError?.(error);
	}, [onMapError]);
	const loadMapData = (0, react.useCallback)(async () => {
		try {
			if (!mapUrl) {
				setIsMapLoaded(true);
				return;
			}
			const mapKey = `${mapName}-${mapUrl}-${mapType}`;
			if (registeredMapsRef.current.has(mapKey)) {
				console.log(`Map "${mapName}" already registered, skipping`);
				setIsMapLoaded(true);
				stableOnMapLoad();
				return;
			}
			const response = await fetch(mapUrl);
			if (!response.ok) throw new Error(`Failed to load map data: ${response.statusText}`);
			if (mapType === "svg") {
				const svgText = await response.text();
				console.log(`Registering SVG map "${mapName}" with ${svgText.length} characters`);
				require_OldPieChart.getEChartsModule().registerMap(mapName, { svg: svgText }, mapSpecialAreas);
				console.log(`SVG map "${mapName}" registered successfully`);
				await new Promise((resolve) => setTimeout(resolve, 200));
			} else {
				const geoJson = await response.json();
				console.log(`Registering GeoJSON map "${mapName}"`);
				require_OldPieChart.registerMap(mapName, geoJson, mapSpecialAreas);
				console.log(`GeoJSON map "${mapName}" registered successfully`);
			}
			registeredMapsRef.current.add(mapKey);
			setIsMapLoaded(true);
			stableOnMapLoad();
		} catch (error) {
			const mapError = error instanceof Error ? error : new Error("Unknown error loading map");
			stableOnMapError(mapError);
			console.error("Failed to load map data:", mapError);
		}
	}, [
		mapUrl,
		mapName,
		mapType,
		mapSpecialAreas,
		stableOnMapLoad,
		stableOnMapError
	]);
	(0, react.useEffect)(() => {
		setIsMapLoaded(false);
		loadMapData();
	}, [loadMapData]);
	const processedData = (0, react.useMemo)(() => {
		if (!data) return [];
		return data.map((item) => ({
			name: typeof item === "object" && nameField in item ? item[nameField] : item.name,
			value: typeof item === "object" && valueField in item ? item[valueField] : item.value
		}));
	}, [
		data,
		nameField,
		valueField
	]);
	const dataStats = (0, react.useMemo)(() => {
		const values = processedData.map((item) => Number(item.value)).filter((v) => !isNaN(v));
		return {
			min: Math.min(...values),
			max: Math.max(...values)
		};
	}, [processedData]);
	const chartOption = (0, react.useMemo)(() => {
		if (!isMapLoaded) return {};
		const option = { tooltip: {
			trigger: "item",
			showDelay: 200,
			transitionDuration: 300,
			formatter: "{b}: {c}",
			...tooltip
		} };
		if (chartType === "geo") {
			if (mapType === "svg") option.series = [{
				name: title || "Geographic Data",
				type: "map",
				map: mapName,
				roam,
				...scaleLimit && { scaleLimit },
				...itemStyle && { itemStyle },
				emphasis: {
					label: { show: showLabels },
					...itemStyle?.emphasis && { itemStyle: itemStyle.emphasis }
				},
				label: {
					show: showLabels,
					position: labelPosition
				},
				data: processedData,
				silent: false
			}];
			else {
				const geoConfig = {
					map: mapName,
					roam,
					layoutCenter: ["50%", "50%"],
					layoutSize: "100%",
					selectedMode: "single",
					itemStyle: { areaColor: void 0 },
					emphasis: { label: { show: showLabels } },
					select: {
						itemStyle: { areaColor: "#b50205" },
						label: { show: false }
					},
					...geo
				};
				if (geo?.regions && Array.isArray(geo.regions) && geo.regions.length > 0) geoConfig.regions = geo.regions;
				option.geo = geoConfig;
			}
			if (additionalSeries.length > 0) if (mapType === "svg") {
				const existingSeries = Array.isArray(option.series) ? option.series : option.series ? [option.series] : [];
				option.series = [...existingSeries, ...additionalSeries];
			} else option.series = [...additionalSeries];
			if (grid) option.grid = grid;
			if (xAxis) option.xAxis = xAxis;
			if (yAxis) option.yAxis = yAxis;
		} else {
			if (processedData.length > 0) option.visualMap = {
				show: true,
				left: "right",
				min: dataStats.min,
				max: dataStats.max,
				colors: [
					"#313695",
					"#4575b4",
					"#74add1",
					"#abd9e9",
					"#e0f3f8",
					"#ffffbf",
					"#fee090",
					"#fdae61",
					"#f46d43",
					"#d73027",
					"#a50026"
				],
				text: ["High", "Low"],
				calculable: true,
				orient: "vertical",
				...visualMap
			};
			option.series = [{
				name: title || "Geographic Data",
				type: "map",
				map: mapName,
				roam,
				...scaleLimit && { scaleLimit },
				...itemStyle && { itemStyle },
				emphasis: {
					label: { show: showLabels },
					...itemStyle?.emphasis && { itemStyle: itemStyle.emphasis }
				},
				label: {
					show: showLabels,
					position: labelPosition
				},
				data: processedData
			}];
		}
		if (toolbox?.show) option.toolbox = {
			show: true,
			left: "left",
			top: "top",
			feature: {
				...toolbox.features?.dataView && { dataView: { readOnly: false } },
				...toolbox.features?.restore && { restore: {} },
				...toolbox.features?.saveAsImage && { saveAsImage: {} }
			}
		};
		return option;
	}, [
		processedData,
		mapName,
		chartType,
		mapType,
		dataStats,
		visualMap,
		geo,
		roam,
		scaleLimit,
		itemStyle,
		showLabels,
		labelPosition,
		tooltip,
		toolbox,
		additionalSeries,
		grid,
		xAxis,
		yAxis,
		title,
		isMapLoaded
	]);
	const { theme: originalTheme,...filteredProps } = restProps;
	const validTheme = originalTheme === "auto" ? "light" : originalTheme || "light";
	const stableOnSelectChanged = (0, react.useCallback)((params) => {
		onSelectChanged?.(params);
	}, [onSelectChanged]);
	const handleChartReady = (0, react.useCallback)((chart) => {
		if (stableOnSelectChanged) chart.on("selectchanged", stableOnSelectChanged);
		restProps.onChartReady?.(chart);
	}, [stableOnSelectChanged, restProps.onChartReady]);
	if (!isMapLoaded) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		style: {
			width: filteredProps.width || "100%",
			height: filteredProps.height || 400,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: validTheme === "dark" ? "#2a2a2a" : "#f5f5f5",
			color: validTheme === "dark" ? "#fff" : "#333",
			border: `1px solid ${validTheme === "dark" ? "#444" : "#ddd"}`,
			borderRadius: "4px",
			fontSize: "14px"
		},
		children: "Loading map data..."
	});
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(require_OldPieChart.BaseChart, {
		ref,
		option: chartOption,
		theme: validTheme,
		onChartReady: handleChartReady,
		...onLegendDoubleClick && { onLegendDoubleClick },
		...onSeriesDoubleClick && { onSeriesDoubleClick },
		...legendDoubleClickDelay !== void 0 && { legendDoubleClickDelay },
		...enableLegendDoubleClickSelection !== void 0 && { enableLegendDoubleClickSelection },
		...title && { title },
		...filteredProps
	});
});
GeoChart.displayName = "GeoChart";

//#endregion
//#region src/components/ExportPreviewModal.tsx
/**
* Export Preview Modal - Shows a full-resolution chart preview before export
* 
* Features:
* - Portal-based modal (no DOM interference)
* - Configurable export dimensions (default: 1920x1080)
* - Preview scaling (50% for Full HD)
* - One-click export to PNG
* - Theme-aware styling
* - Escape key support
*/
function ExportPreviewModal({ isOpen, onClose, chartProps, chartComponent: ChartComponent, exportName = "chart-export.png", exportWidth = 1920, exportHeight = 1080, theme = "light" }) {
	const chartRef = (0, react.useRef)(null);
	const [isExporting, setIsExporting] = (0, react.useState)(false);
	(0, react.useEffect)(() => {
		const handleEscape = (e) => {
			if (e.key === "Escape") onClose();
		};
		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		}
		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isOpen, onClose]);
	const handleExport = async () => {
		if (!chartRef.current) return;
		setIsExporting(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 300));
			const chart = chartRef.current.getChart?.();
			if (chart) {
				const dataURL = chart.getDataURL({
					type: "png",
					pixelRatio: 1,
					backgroundColor: "#ffffff"
				});
				if (dataURL) {
					const link = document.createElement("a");
					link.download = exportName;
					link.href = dataURL;
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				}
			}
		} catch (error) {
			console.error("Export failed:", error);
		} finally {
			setIsExporting(false);
		}
	};
	if (!isOpen) return null;
	const previewScale = Math.min(.5, 960 / exportWidth, 540 / exportHeight);
	const previewWidth = exportWidth * previewScale;
	const previewHeight = exportHeight * previewScale;
	const fullHDChartProps = {
		...chartProps,
		width: exportWidth,
		height: exportHeight,
		customOption: {
			...chartProps.customOption,
			title: {
				textStyle: {
					fontSize: Math.round(32 * (exportWidth / 1920)),
					fontWeight: "bold"
				},
				top: Math.round(20 * (exportHeight / 1080)),
				left: "center",
				...chartProps.customOption?.title
			},
			xAxis: {
				axisLabel: {
					fontSize: Math.round(20 * (exportWidth / 1920)),
					fontWeight: "normal"
				},
				nameTextStyle: { fontSize: Math.round(24 * (exportWidth / 1920)) },
				...chartProps.customOption?.xAxis
			},
			yAxis: {
				axisLabel: {
					fontSize: Math.round(20 * (exportWidth / 1920)),
					fontWeight: "normal"
				},
				nameTextStyle: { fontSize: Math.round(24 * (exportWidth / 1920)) },
				...chartProps.customOption?.yAxis
			},
			legend: {
				textStyle: { fontSize: Math.round(20 * (exportWidth / 1920)) },
				...chartProps.customOption?.legend
			},
			grid: {
				top: Math.round(80 * (exportHeight / 1080)),
				left: Math.round(80 * (exportWidth / 1920)),
				right: Math.round(80 * (exportWidth / 1920)),
				bottom: Math.round(80 * (exportHeight / 1080)),
				...chartProps.customOption?.grid
			},
			toolbox: {
				show: false,
				...chartProps.customOption?.toolbox
			}
		}
	};
	const modalContent = /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		style: {
			position: "fixed",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: "rgba(0, 0, 0, 0.8)",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			zIndex: 1e4,
			padding: "20px"
		},
		onClick: (e) => {
			if (e.target === e.currentTarget) onClose();
		},
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			style: {
				backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
				borderRadius: "12px",
				padding: "24px",
				maxWidth: "95vw",
				maxHeight: "95vh",
				overflow: "auto",
				boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
				border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`
			},
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: "20px"
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("h3", {
						style: {
							margin: 0,
							color: theme === "dark" ? "#ffffff" : "#1f2937",
							fontSize: "20px",
							fontWeight: "600"
						},
						children: [
							"📺 Export Preview (",
							exportWidth,
							"×",
							exportHeight,
							")"
						]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						style: {
							margin: "4px 0 0 0",
							color: theme === "dark" ? "#9ca3af" : "#6b7280",
							fontSize: "14px"
						},
						children: "Preview your chart at full resolution with optimized scaling"
					})] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						onClick: onClose,
						style: {
							background: "none",
							border: "none",
							fontSize: "24px",
							cursor: "pointer",
							color: theme === "dark" ? "#9ca3af" : "#6b7280",
							padding: "4px",
							borderRadius: "4px"
						},
						title: "Close (Esc)",
						children: "✕"
					})]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					style: {
						width: `${previewWidth}px`,
						height: `${previewHeight}px`,
						border: `2px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
						borderRadius: "8px",
						overflow: "hidden",
						backgroundColor: theme === "dark" ? "#111827" : "#f9fafb"
					},
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: {
							transform: `scale(${previewScale})`,
							transformOrigin: "top left",
							width: `${exportWidth}px`,
							height: `${exportHeight}px`
						},
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ChartComponent, {
							ref: chartRef,
							...fullHDChartProps
						})
					})
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: {
						marginTop: "16px",
						padding: "12px",
						backgroundColor: theme === "dark" ? "#111827" : "#f3f4f6",
						borderRadius: "6px",
						fontSize: "13px",
						color: theme === "dark" ? "#d1d5db" : "#4b5563"
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "📋 Export Details:" }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("br", {}),
						"• Resolution: ",
						exportWidth,
						"×",
						exportHeight,
						" pixels • Format: PNG with white background • Quality: High resolution (1:1 pixel ratio) • Logos: Included as configured • Text: Auto-scaled for resolution"
					]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						gap: "12px",
						marginTop: "20px",
						justifyContent: "flex-end"
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						onClick: onClose,
						style: {
							padding: "10px 20px",
							fontSize: "14px",
							backgroundColor: "transparent",
							color: theme === "dark" ? "#9ca3af" : "#6b7280",
							border: `1px solid ${theme === "dark" ? "#4b5563" : "#d1d5db"}`,
							borderRadius: "6px",
							cursor: "pointer"
						},
						children: "Cancel"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						onClick: handleExport,
						disabled: isExporting,
						style: {
							padding: "10px 20px",
							fontSize: "14px",
							backgroundColor: theme === "dark" ? "#3b82f6" : "#2563eb",
							color: "#ffffff",
							border: "none",
							borderRadius: "6px",
							cursor: isExporting ? "wait" : "pointer",
							opacity: isExporting ? .7 : 1
						},
						children: isExporting ? "⏳ Exporting..." : "💾 Export PNG"
					})]
				})
			]
		})
	});
	return (0, react_dom.createPortal)(modalContent, document.body);
}

//#endregion
//#region src/hooks/useFullHDExport.ts
/**
* Custom hook for Full HD chart export functionality
* 
* @param chartProps - The chart props to export
* @param options - Export configuration options
* @returns Export modal state and controls
* 
* @example
* ```tsx
* function MyChart() {
*   const chartProps = { data, title: "My Chart", ... };
*   const { isExportModalOpen, openExportModal, closeExportModal, exportModalProps } = 
*     useFullHDExport(chartProps, { exportName: 'my-chart.png' });
* 
*   return (
*     <>
*       <BarChart {...chartProps} />
*       <button onClick={openExportModal}>Export Full HD</button>
*       <ExportPreviewModal {...exportModalProps} />
*     </>
*   );
* }
* ```
*/
function useFullHDExport(chartProps, options) {
	const [isExportModalOpen, setIsExportModalOpen] = (0, react.useState)(false);
	const { exportName = "chart-export.png", exportWidth = 1920, exportHeight = 1080, theme = "light", chartComponent } = options;
	const openExportModal = () => setIsExportModalOpen(true);
	const closeExportModal = () => setIsExportModalOpen(false);
	return {
		isExportModalOpen,
		openExportModal,
		closeExportModal,
		exportModalProps: {
			isOpen: isExportModalOpen,
			onClose: closeExportModal,
			chartProps,
			chartComponent,
			exportName,
			exportWidth,
			exportHeight,
			theme
		}
	};
}

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
//#region src/utils/legacy/regression.ts
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
//#region src/components/ChartErrorBoundary.tsx
/**
* Default fallback component for chart errors
*/
const DefaultErrorFallback = ({ error, retry, showDetails, className = "", style = {} }) => {
	const [showDetailedError, setShowDetailedError] = react.default.useState(false);
	const containerStyle = {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		minHeight: "200px",
		padding: "20px",
		border: "2px dashed #ff4d4f",
		borderRadius: "8px",
		backgroundColor: "#fff2f0",
		color: "#a8071a",
		fontFamily: "system-ui, -apple-system, sans-serif",
		...style
	};
	const iconStyle = {
		fontSize: "48px",
		marginBottom: "16px",
		opacity: .7
	};
	const titleStyle = {
		fontSize: "18px",
		fontWeight: "bold",
		marginBottom: "8px",
		textAlign: "center"
	};
	const messageStyle = {
		fontSize: "14px",
		marginBottom: "16px",
		textAlign: "center",
		lineHeight: 1.5,
		maxWidth: "400px"
	};
	const buttonStyle = {
		padding: "8px 16px",
		marginRight: "8px",
		backgroundColor: "#ff4d4f",
		color: "white",
		border: "none",
		borderRadius: "4px",
		cursor: "pointer",
		fontSize: "14px",
		fontWeight: "500"
	};
	const secondaryButtonStyle = {
		...buttonStyle,
		backgroundColor: "transparent",
		color: "#ff4d4f",
		border: "1px solid #ff4d4f"
	};
	const detailsStyle = {
		marginTop: "16px",
		padding: "12px",
		backgroundColor: "#ffeaea",
		border: "1px solid #ffccc7",
		borderRadius: "4px",
		fontFamily: "monospace",
		fontSize: "12px",
		maxWidth: "600px",
		overflow: "auto",
		whiteSpace: "pre-wrap"
	};
	const getErrorIcon = () => {
		switch (error.code) {
			case require_OldPieChart.ChartErrorCode.ECHARTS_LOAD_FAILED: return "🌐";
			case require_OldPieChart.ChartErrorCode.INVALID_DATA_FORMAT:
			case require_OldPieChart.ChartErrorCode.EMPTY_DATA: return "📊";
			case require_OldPieChart.ChartErrorCode.CHART_RENDER_FAILED: return "🎨";
			default: return "⚠️";
		}
	};
	const getErrorTitle = () => {
		if (error.recoverable) return "Chart Loading Failed";
		return "Chart Error";
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: `aqc-charts-error-boundary ${className}`,
		style: containerStyle,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: iconStyle,
				children: getErrorIcon()
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: titleStyle,
				children: getErrorTitle()
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: messageStyle,
				children: error.toUserMessage()
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [error.recoverable && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				style: buttonStyle,
				onClick: retry,
				onMouseOver: (e) => e.currentTarget.style.backgroundColor = "#d9363e",
				onMouseOut: (e) => e.currentTarget.style.backgroundColor = "#ff4d4f",
				children: "Try Again"
			}), showDetails && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				style: secondaryButtonStyle,
				onClick: () => setShowDetailedError(!showDetailedError),
				onMouseOver: (e) => e.currentTarget.style.backgroundColor = "#fff2f0",
				onMouseOut: (e) => e.currentTarget.style.backgroundColor = "transparent",
				children: showDetailedError ? "Hide Details" : "Show Details"
			})] }),
			showDetailedError && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: detailsStyle,
				children: error.toDetailedString()
			})
		]
	});
};
/**
* Chart Error Boundary Component
*/
var ChartErrorBoundary = class extends react.Component {
	retryTimeoutId = null;
	constructor(props) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
			errorId: ""
		};
	}
	static getDerivedStateFromError(error) {
		const chartError = require_OldPieChart.isChartError(error) ? error : require_OldPieChart.createChartError(error, require_OldPieChart.ChartErrorCode.UNKNOWN_ERROR);
		return {
			hasError: true,
			error: chartError,
			errorId: `error_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
		};
	}
	componentDidCatch(error, errorInfo) {
		const chartError = this.state.error;
		console.error("Chart Error Boundary caught an error:", {
			error: chartError.toDetailedString(),
			errorInfo,
			stack: error.stack
		});
		this.props.onError?.(chartError, errorInfo);
		this.reportError(chartError, errorInfo);
	}
	componentWillUnmount() {
		if (this.retryTimeoutId) clearTimeout(this.retryTimeoutId);
	}
	reportError = (error, errorInfo) => {
		if (typeof window !== "undefined" && window.reportError) window.reportError({
			error: error.toDetailedString(),
			errorInfo,
			timestamp: new Date().toISOString(),
			userAgent: navigator.userAgent,
			url: window.location.href
		});
	};
	handleRetry = () => {
		if (this.retryTimeoutId) clearTimeout(this.retryTimeoutId);
		this.retryTimeoutId = setTimeout(() => {
			this.setState({
				hasError: false,
				error: null,
				errorId: ""
			});
		}, 100);
	};
	render() {
		if (this.state.hasError && this.state.error) {
			if (this.props.fallback) return this.props.fallback(this.state.error, this.handleRetry);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(DefaultErrorFallback, {
				error: this.state.error,
				retry: this.handleRetry,
				showDetails: this.props.showErrorDetails ?? true,
				className: this.props.className,
				style: this.props.style
			});
		}
		return this.props.children;
	}
};
/**
* HOC to wrap components with error boundary
*/
function withChartErrorBoundary(Component$1, errorBoundaryProps) {
	const WrappedComponent = (props) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ChartErrorBoundary, {
		...errorBoundaryProps,
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Component$1, { ...props })
	});
	WrappedComponent.displayName = `withChartErrorBoundary(${Component$1.displayName || Component$1.name})`;
	return WrappedComponent;
}
/**
* Hook to manually trigger error boundary (for functional components)
*/
function useChartErrorHandler() {
	const [error, setError] = react.default.useState(null);
	react.default.useEffect(() => {
		if (error) throw error;
	}, [error]);
	const throwError = react.default.useCallback((error$1) => {
		const chartError = require_OldPieChart.isChartError(error$1) ? error$1 : require_OldPieChart.createChartError(error$1, require_OldPieChart.ChartErrorCode.UNKNOWN_ERROR);
		setError(chartError);
	}, []);
	const clearError = react.default.useCallback(() => {
		setError(null);
	}, []);
	return {
		throwError,
		clearError
	};
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
exports.BarChart = BarChart;
exports.BaseChart = require_OldPieChart.BaseChart;
exports.CalendarHeatmapChart = CalendarHeatmapChart;
exports.ChartError = require_OldPieChart.ChartError;
exports.ChartErrorBoundary = ChartErrorBoundary;
exports.ChartErrorCode = require_OldPieChart.ChartErrorCode;
exports.ChartInitError = require_OldPieChart.ChartInitError;
exports.ChartRenderError = require_OldPieChart.ChartRenderError;
exports.ClusterChart = ClusterChart;
exports.CombinedChart = CombinedChart;
exports.DataValidationError = require_OldPieChart.DataValidationError;
exports.EChartsLoadError = require_OldPieChart.EChartsLoadError;
exports.ExportPreviewModal = ExportPreviewModal;
exports.GanttChart = GanttChart;
exports.GeoChart = GeoChart;
exports.LineChart = LineChart;
exports.OldBarChart = require_OldPieChart.OldBarChart;
exports.OldCalendarHeatmapChart = require_OldPieChart.OldCalendarHeatmapChart;
exports.OldClusterChart = require_OldPieChart.OldClusterChart;
exports.OldGanttChart = require_OldPieChart.OldGanttChart;
exports.OldLineChart = require_OldPieChart.OldLineChart;
exports.OldPieChart = require_OldPieChart.OldPieChart;
exports.OldRegressionChart = require_OldPieChart.OldRegressionChart;
exports.OldSankeyChart = require_OldPieChart.OldSankeyChart;
exports.OldScatterChart = require_OldPieChart.OldScatterChart;
exports.OldStackedBarChart = require_OldPieChart.OldStackedBarChart;
exports.PieChart = PieChart;
exports.RegressionChart = RegressionChart;
exports.SankeyChart = SankeyChart;
exports.ScatterChart = ScatterChart;
exports.StackedAreaChart = StackedAreaChart;
exports.TransformError = require_OldPieChart.TransformError;
exports.assertValidation = require_OldPieChart.assertValidation;
exports.clusterPointsToScatterData = clusterPointsToScatterData;
exports.createChartError = require_OldPieChart.createChartError;
exports.darkTheme = darkTheme;
exports.disposeChart = require_OldPieChart.disposeChart;
exports.extractPoints = extractPoints;
exports.getEChartsModule = require_OldPieChart.getEChartsModule;
exports.getMap = require_OldPieChart.getMap;
exports.isChartError = require_OldPieChart.isChartError;
exports.isRecoverableError = require_OldPieChart.isRecoverableError;
exports.lightTheme = lightTheme;
exports.performKMeansClustering = performKMeansClustering;
exports.registerMap = require_OldPieChart.registerMap;
exports.safeAsync = require_OldPieChart.safeAsync;
exports.safeSync = require_OldPieChart.safeSync;
exports.useChartComponent = useChartComponent;
exports.useChartErrorHandler = useChartErrorHandler;
exports.useChartEvents = require_OldPieChart.useChartEvents;
exports.useChartInstance = require_OldPieChart.useChartInstance;
exports.useChartOptions = require_OldPieChart.useChartOptions;
exports.useChartResize = require_OldPieChart.useChartResize;
exports.useECharts = require_OldPieChart.useECharts;
exports.useFullHDExport = useFullHDExport;
exports.usePrefersDarkMode = require_OldPieChart.usePrefersDarkMode;
exports.useResolvedTheme = require_OldPieChart.useResolvedTheme;
exports.useSystemTheme = require_OldPieChart.useSystemTheme;
exports.validateChartData = require_OldPieChart.validateChartData;
exports.validateChartProps = require_OldPieChart.validateChartProps;
exports.validateDimensions = require_OldPieChart.validateDimensions;
exports.validateFieldMapping = require_OldPieChart.validateFieldMapping;
exports.validateInDevelopment = require_OldPieChart.validateInDevelopment;
exports.validateTheme = require_OldPieChart.validateTheme;
exports.withChartErrorBoundary = withChartErrorBoundary;