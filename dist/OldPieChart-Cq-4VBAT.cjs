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
const echarts = __toESM(require("echarts"));
const echarts_stat = __toESM(require("echarts-stat"));
const react = __toESM(require("react"));
const react_jsx_runtime = __toESM(require("react/jsx-runtime"));

//#region src/utils/echarts.ts
const ecStatTyped = echarts_stat;
if (ecStatTyped.transform) {
	if (ecStatTyped.transform.clustering) echarts$1.registerTransform(ecStatTyped.transform.clustering);
	if (ecStatTyped.transform.regression) echarts$1.registerTransform(ecStatTyped.transform.regression);
	if (ecStatTyped.transform.histogram) echarts$1.registerTransform(ecStatTyped.transform.histogram);
}
/**
* Dispose an ECharts instance
*/
function disposeChart(chart) {
	if (chart && !chart.isDisposed?.()) chart.dispose();
}
/**
* Get the ECharts module for advanced usage
* This provides access to registerTheme, registerMap, etc.
*/
function getEChartsModule() {
	return echarts$1;
}
/**
* Register a map for geo/map charts
*/
function registerMap(mapName, geoJson, specialAreas) {
	echarts$1.registerMap(mapName, geoJson, specialAreas);
}
/**
* Check if a map is registered
*/
function getMap(mapName) {
	return echarts$1.getMap(mapName);
}

//#endregion
//#region src/hooks/echarts/useChartInstance.ts
function useChartInstance({ containerRef, onChartReady }) {
	const [chartInstance, setChartInstance] = (0, react.useState)(null);
	const [isInitialized, setIsInitialized] = (0, react.useState)(false);
	const [error, setError] = (0, react.useState)(null);
	const onChartReadyRef = (0, react.useRef)(onChartReady);
	onChartReadyRef.current = onChartReady;
	const isMountedRef = (0, react.useRef)(true);
	const disposeChart$1 = (0, react.useCallback)(() => {
		if (chartInstance && !chartInstance.isDisposed?.()) chartInstance.dispose();
	}, [chartInstance]);
	(0, react.useEffect)(() => {
		isMountedRef.current = true;
		const container = containerRef.current;
		if (!container) return;
		const existingInstance = echarts.getInstanceByDom(container);
		if (existingInstance && !existingInstance.isDisposed?.()) {
			setChartInstance(existingInstance);
			setIsInitialized(true);
			setError(null);
			onChartReadyRef.current?.(existingInstance);
			return;
		}
		try {
			const chart = echarts.init(container, void 0, {
				renderer: "canvas",
				useDirtyRect: true
			});
			if (!isMountedRef.current) {
				chart.dispose();
				return;
			}
			setChartInstance(chart);
			setIsInitialized(true);
			setError(null);
			onChartReadyRef.current?.(chart);
		} catch (err) {
			if (isMountedRef.current) {
				setError(err instanceof Error ? err : new Error(String(err)));
				setIsInitialized(false);
			}
		}
		return () => {
			isMountedRef.current = false;
		};
	}, []);
	(0, react.useEffect)(() => {
		return () => {
			const container = containerRef.current;
			if (container) {
				const instance = echarts.getInstanceByDom(container);
				if (instance && !instance.isDisposed?.()) instance.dispose();
			}
		};
	}, []);
	const manualInit = (0, react.useCallback)(() => {
		const container = containerRef.current;
		if (!container) return;
		try {
			const chart = echarts.init(container, void 0, {
				renderer: "canvas",
				useDirtyRect: true
			});
			setChartInstance(chart);
			setIsInitialized(true);
			setError(null);
			onChartReadyRef.current?.(chart);
		} catch (err) {
			setError(err instanceof Error ? err : new Error(String(err)));
		}
	}, []);
	return {
		chartInstance,
		isInitialized,
		error,
		initChart: manualInit,
		disposeChart: disposeChart$1
	};
}

//#endregion
//#region src/hooks/echarts/useChartResize.ts
function useChartResize({ chartInstance, containerRef, debounceMs = 100 }) {
	const resizeTimeoutRef = (0, react.useRef)(void 0);
	const handleResize = (0, react.useCallback)(() => {
		if (resizeTimeoutRef.current !== void 0) clearTimeout(resizeTimeoutRef.current);
		resizeTimeoutRef.current = setTimeout(() => {
			if (chartInstance) try {
				chartInstance.resize();
			} catch (error) {
				console.warn("Failed to resize chart:", error);
			}
		}, debounceMs);
	}, [chartInstance, debounceMs]);
	(0, react.useEffect)(() => {
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
//#region src/utils/errors.ts
/**
* Custom error types for AQC Charts library
* Provides specific error classes with helpful context for debugging
*/
let ChartErrorCode = /* @__PURE__ */ function(ChartErrorCode$1) {
	ChartErrorCode$1["ECHARTS_LOAD_FAILED"] = "ECHARTS_LOAD_FAILED";
	ChartErrorCode$1["CHART_INIT_FAILED"] = "CHART_INIT_FAILED";
	ChartErrorCode$1["CONTAINER_NOT_FOUND"] = "CONTAINER_NOT_FOUND";
	ChartErrorCode$1["INVALID_DATA_FORMAT"] = "INVALID_DATA_FORMAT";
	ChartErrorCode$1["EMPTY_DATA"] = "EMPTY_DATA";
	ChartErrorCode$1["MISSING_REQUIRED_FIELD"] = "MISSING_REQUIRED_FIELD";
	ChartErrorCode$1["INVALID_CHART_OPTION"] = "INVALID_CHART_OPTION";
	ChartErrorCode$1["INVALID_THEME"] = "INVALID_THEME";
	ChartErrorCode$1["UNSUPPORTED_CHART_TYPE"] = "UNSUPPORTED_CHART_TYPE";
	ChartErrorCode$1["CHART_RENDER_FAILED"] = "CHART_RENDER_FAILED";
	ChartErrorCode$1["CHART_UPDATE_FAILED"] = "CHART_UPDATE_FAILED";
	ChartErrorCode$1["CHART_RESIZE_FAILED"] = "CHART_RESIZE_FAILED";
	ChartErrorCode$1["ECSTAT_TRANSFORM_FAILED"] = "ECSTAT_TRANSFORM_FAILED";
	ChartErrorCode$1["DATA_TRANSFORM_FAILED"] = "DATA_TRANSFORM_FAILED";
	ChartErrorCode$1["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
	return ChartErrorCode$1;
}({});
/**
* Base class for all chart-related errors
*/
var ChartError = class ChartError extends Error {
	code;
	context;
	cause;
	recoverable;
	suggestions;
	constructor(details) {
		super(details.message);
		this.name = "ChartError";
		this.code = details.code;
		this.context = details.context ?? {};
		this.cause = details.cause;
		this.recoverable = details.recoverable ?? false;
		this.suggestions = details.suggestions ?? [];
		if (Error.captureStackTrace) Error.captureStackTrace(this, ChartError);
	}
	/**
	* Convert error to a user-friendly format
	*/
	toUserMessage() {
		const baseMessage = this.message;
		const suggestions = this.suggestions.length > 0 ? `\n\nSuggestions:\n${this.suggestions.map((s) => `• ${s}`).join("\n")}` : "";
		return `${baseMessage}${suggestions}`;
	}
	/**
	* Convert error to detailed format for debugging
	*/
	toDetailedString() {
		const details = [`ChartError [${this.code}]: ${this.message}`, `Recoverable: ${this.recoverable}`];
		if (Object.keys(this.context).length > 0) details.push(`Context: ${JSON.stringify(this.context, null, 2)}`);
		if (this.suggestions.length > 0) details.push(`Suggestions:\n${this.suggestions.map((s) => `  • ${s}`).join("\n")}`);
		if (this.cause) details.push(`Caused by: ${this.cause.message}`);
		return details.join("\n");
	}
};
/**
* Specific error class for ECharts loading failures
*/
var EChartsLoadError = class extends ChartError {
	constructor(cause, context) {
		super({
			code: ChartErrorCode.ECHARTS_LOAD_FAILED,
			message: "Failed to load ECharts library from CDN",
			context,
			cause,
			recoverable: true,
			suggestions: [
				"Check your internet connection",
				"Verify that CDN is accessible",
				"Try refreshing the page",
				"Consider using a local ECharts build"
			]
		});
		this.name = "EChartsLoadError";
	}
};
/**
* Specific error class for chart initialization failures
*/
var ChartInitError = class extends ChartError {
	constructor(cause, context) {
		super({
			code: ChartErrorCode.CHART_INIT_FAILED,
			message: "Failed to initialize chart instance",
			context,
			cause,
			recoverable: true,
			suggestions: [
				"Ensure the container element exists",
				"Verify container has non-zero dimensions",
				"Check if ECharts is properly loaded"
			]
		});
		this.name = "ChartInitError";
	}
};
/**
* Specific error class for data validation failures
*/
var DataValidationError = class extends ChartError {
	constructor(message, context, suggestions) {
		super({
			code: ChartErrorCode.INVALID_DATA_FORMAT,
			message: `Data validation failed: ${message}`,
			context,
			recoverable: true,
			suggestions: suggestions || [
				"Check the data format matches the expected structure",
				"Ensure required fields are present",
				"Verify data types are correct"
			]
		});
		this.name = "DataValidationError";
	}
};
/**
* Specific error class for chart rendering failures
*/
var ChartRenderError = class extends ChartError {
	constructor(cause, context) {
		super({
			code: ChartErrorCode.CHART_RENDER_FAILED,
			message: "Failed to render chart",
			context,
			cause,
			recoverable: true,
			suggestions: [
				"Check if the chart options are valid",
				"Verify the data format is correct",
				"Ensure the container is properly sized"
			]
		});
		this.name = "ChartRenderError";
	}
};
/**
* Specific error class for transform failures
*/
var TransformError = class extends ChartError {
	constructor(transformType, cause, context) {
		super({
			code: ChartErrorCode.DATA_TRANSFORM_FAILED,
			message: `Failed to apply ${transformType} transform`,
			context,
			cause,
			recoverable: true,
			suggestions: [
				"Check if the data is compatible with the transform",
				"Verify transform parameters are correct",
				"Ensure ecStat is properly loaded"
			]
		});
		this.name = "TransformError";
	}
};
/**
* Utility function to create ChartError from unknown error
*/
function createChartError(error, code = ChartErrorCode.UNKNOWN_ERROR, context) {
	if (error instanceof ChartError) return error;
	if (error instanceof Error) return new ChartError({
		code,
		message: error.message,
		context,
		cause: error,
		recoverable: true
	});
	return new ChartError({
		code,
		message: String(error) || "An unknown error occurred",
		context,
		recoverable: false
	});
}
/**
* Utility function to safely handle async operations with proper error wrapping
*/
async function safeAsync(operation, errorCode, context) {
	try {
		return await operation();
	} catch (error) {
		throw createChartError(error, errorCode, context);
	}
}
/**
* Utility function to safely handle sync operations with proper error wrapping
*/
function safeSync(operation, errorCode, context) {
	try {
		return operation();
	} catch (error) {
		throw createChartError(error, errorCode, context);
	}
}
/**
* Type guard to check if an error is a ChartError
*/
function isChartError(error) {
	return error instanceof ChartError;
}
/**
* Type guard to check if an error is recoverable
*/
function isRecoverableError(error) {
	return isChartError(error) && error.recoverable;
}

//#endregion
//#region src/hooks/echarts/useChartOptions.ts
/**
* Safe JSON stringify that handles circular references
*/
function safeStringify(value) {
	try {
		return JSON.stringify(value);
	} catch {
		if (value === null) return "null";
		if (Array.isArray(value)) return `[Array:${value.length}]`;
		if (typeof value === "object") return `[Object:${Object.keys(value).length}]`;
		return String(value);
	}
}
/**
* Fast structural hash for chart options.
* Uses a simple but effective hashing approach that's much faster than deep comparison
* for large datasets while still catching meaningful changes.
*/
function computeOptionHash(option) {
	if (option == null) return "null";
	if (typeof option !== "object") return String(option);
	const obj = option;
	if (Array.isArray(obj)) {
		if (obj.length === 0) return "[]";
		const first = safeStringify(obj[0]);
		const last = obj.length > 1 ? safeStringify(obj[obj.length - 1]) : "";
		const mid = obj.length > 2 ? safeStringify(obj[Math.floor(obj.length / 2)]) : "";
		return `[${obj.length}:${first}:${mid}:${last}]`;
	}
	const keys = Object.keys(obj).sort();
	const parts = [];
	for (const key of keys) {
		const value = obj[key];
		if (Array.isArray(value)) parts.push(`${key}:[${value.length}]`);
		else if (typeof value === "object" && value !== null) parts.push(`${key}:{${Object.keys(value).length}}`);
		else parts.push(`${key}:${String(value)}`);
	}
	return `{${parts.join(",")}}`;
}
/**
* Efficient comparison for ECharts options.
* Uses fast structural hash for large objects, falls back to deep comparison for small ones.
*/
function optionsEqual(a, b) {
	if (a === b) return true;
	if (a == null || b == null) return a === b;
	if (typeof a !== typeof b) return false;
	if (typeof a !== "object") return a === b;
	return computeOptionHash(a) === computeOptionHash(b);
}
/**
* Deep comparison for theme objects (usually small).
* - Handles arrays and objects
* - Protects against circular references with depth limit
*/
function deepEqual(a, b, depth = 0) {
	if (depth > 10) return false;
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (typeof a !== typeof b) return false;
	if (typeof a !== "object") return false;
	if (Array.isArray(a)) {
		if (!Array.isArray(b) || a.length !== b.length) return false;
		return a.every((item, i) => deepEqual(item, b[i], depth + 1));
	}
	const objA = a;
	const objB = b;
	const keysA = Object.keys(objA);
	if (keysA.length !== Object.keys(objB).length) return false;
	return keysA.every((key) => key in objB && deepEqual(objA[key], objB[key], depth + 1));
}
function useChartOptions({ chartInstance, option, theme, notMerge = true, lazyUpdate = true }) {
	const lastChartInstanceRef = (0, react.useRef)(null);
	const lastOptionRef = (0, react.useRef)(null);
	(0, react.useEffect)(() => {
		if (!chartInstance || !option) return;
		const isNewChartInstance = lastChartInstanceRef.current !== chartInstance;
		const hasOptionChanged = !optionsEqual(lastOptionRef.current, option);
		if (isNewChartInstance) lastChartInstanceRef.current = chartInstance;
		if (isNewChartInstance || hasOptionChanged) {
			lastOptionRef.current = option;
			try {
				chartInstance.setOption(option, {
					notMerge: isNewChartInstance ? true : notMerge,
					lazyUpdate
				});
			} catch (error) {
				const chartError = createChartError(error, ChartErrorCode.CHART_UPDATE_FAILED, {
					isNewChartInstance,
					notMerge: isNewChartInstance ? true : notMerge,
					lazyUpdate,
					optionKeys: typeof option === "object" && option !== null ? Object.keys(option) : "not-object"
				});
				console.error("Failed to set chart options:", chartError.toDetailedString());
				throw chartError;
			}
		}
	}, [
		chartInstance,
		option,
		notMerge,
		lazyUpdate
	]);
	const lastThemeRef = (0, react.useRef)(void 0);
	(0, react.useEffect)(() => {
		if (!chartInstance || theme === void 0) return;
		const themeChanged = typeof theme === "object" ? !deepEqual(lastThemeRef.current, theme) : lastThemeRef.current !== theme;
		if (!themeChanged) return;
		lastThemeRef.current = theme;
		try {
			const chartWithTheme = chartInstance;
			if (chartWithTheme.setTheme) chartWithTheme.setTheme(theme, { transition: {
				duration: 300,
				easing: "cubicOut"
			} });
			else if (typeof theme === "object") {
				const currentOption = chartInstance.getOption();
				if (currentOption && typeof currentOption === "object") {
					const themedOption = {
						...currentOption,
						...theme
					};
					chartInstance.setOption(themedOption, { notMerge: true });
				}
			}
		} catch (error) {
			const chartError = createChartError(error, ChartErrorCode.INVALID_THEME, {
				themeType: typeof theme,
				themeKeys: typeof theme === "object" ? Object.keys(theme) : "not-object"
			});
			console.error("Failed to apply theme:", chartError.toDetailedString());
		}
	}, [chartInstance, theme]);
}

//#endregion
//#region src/hooks/echarts/useChartEvents.ts
function useChartEvents({ chartInstance, events = {} }) {
	const handlersRef = (0, react.useRef)(new Map());
	(0, react.useEffect)(() => {
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
	const containerRef = (0, react.useRef)(null);
	const { chartInstance, isInitialized, error, disposeChart: disposeChart$1 } = useChartInstance({
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
	const isLoading = (0, react.useMemo)(() => {
		return !isInitialized || externalLoading;
	}, [isInitialized, externalLoading]);
	const showLoading = (0, react.useCallback)(() => {
		if (chartInstance && isInitialized) chartInstance.showLoading("default", {
			text: "Loading...",
			color: "#1890ff",
			textColor: "#000",
			maskColor: "rgba(255, 255, 255, 0.8)",
			zlevel: 0
		});
	}, [chartInstance, isInitialized]);
	const hideLoading = (0, react.useCallback)(() => {
		if (chartInstance && isInitialized) chartInstance.hideLoading();
	}, [chartInstance, isInitialized]);
	(0, react.useEffect)(() => {
		if (externalLoading) showLoading();
		else hideLoading();
	}, [
		externalLoading,
		showLoading,
		hideLoading
	]);
	const getEChartsInstance = (0, react.useCallback)(() => {
		return chartInstance;
	}, [chartInstance]);
	const refresh = (0, react.useCallback)(() => {
		if (chartInstance && option) {
			chartInstance.clear();
			chartInstance.setOption(option, { notMerge: true });
		}
	}, [chartInstance, option]);
	const clear = (0, react.useCallback)(() => {
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
		dispose: disposeChart$1
	};
}

//#endregion
//#region src/hooks/useLegendDoubleClick.ts
function useLegendDoubleClick({ chartInstance, onLegendDoubleClick, onSeriesDoubleClick, delay = 300, enableAutoSelection = false }) {
	const clickTimeout = (0, react.useRef)(null);
	const lastClickTime = (0, react.useRef)(0);
	const lastClickedItem = (0, react.useRef)(null);
	const lastClickType = (0, react.useRef)(null);
	const selectedLegends = (0, react.useRef)(new Set());
	const allLegendsVisible = (0, react.useRef)(true);
	const prevChartInstanceRef = (0, react.useRef)(null);
	(0, react.useEffect)(() => {
		if (chartInstance !== prevChartInstanceRef.current) {
			if (clickTimeout.current) {
				clearTimeout(clickTimeout.current);
				clickTimeout.current = null;
			}
			lastClickTime.current = 0;
			lastClickedItem.current = null;
			lastClickType.current = null;
			selectedLegends.current.clear();
			allLegendsVisible.current = true;
			prevChartInstanceRef.current = chartInstance;
		}
	}, [chartInstance]);
	const handleItemClick = (0, react.useCallback)((params, event, type = "legend") => {
		if (!chartInstance) return;
		if (!onLegendDoubleClick && !onSeriesDoubleClick && !enableAutoSelection) return;
		const itemName = type === "series" ? params.seriesName || params.name : params.name;
		const currentTime = Date.now();
		const isShiftClick = event?.shiftKey === true;
		const option = chartInstance.getOption();
		const legends = option.legend;
		let legendData = [];
		if (Array.isArray(legends) && legends.length > 0 && legends[0]) legendData = legends[0].data || [];
		else if (legends && !Array.isArray(legends)) legendData = legends.data || [];
		if (legendData.length === 0) {
			const series = option.series;
			if (Array.isArray(series)) legendData = series.map((s) => s.name).filter((name) => Boolean(name));
		}
		const allLegendNames = legendData.map((item) => typeof item === "string" ? item : item.name).filter(Boolean);
		if (isShiftClick && enableAutoSelection) {
			if (clickTimeout.current) {
				clearTimeout(clickTimeout.current);
				clickTimeout.current = null;
			}
			if (selectedLegends.current.has(itemName)) {
				selectedLegends.current.delete(itemName);
				chartInstance.dispatchAction({
					type: "legendUnSelect",
					name: itemName
				});
			} else {
				selectedLegends.current.add(itemName);
				if (allLegendsVisible.current) {
					for (const name of allLegendNames) if (name !== itemName) chartInstance.dispatchAction({
						type: "legendUnSelect",
						name
					});
					allLegendsVisible.current = false;
				}
				chartInstance.dispatchAction({
					type: "legendSelect",
					name: itemName
				});
			}
			if (selectedLegends.current.size === 0) {
				for (const name of allLegendNames) chartInstance.dispatchAction({
					type: "legendSelect",
					name
				});
				allLegendsVisible.current = true;
			}
			return;
		}
		if (clickTimeout.current) {
			clearTimeout(clickTimeout.current);
			clickTimeout.current = null;
		}
		if (lastClickedItem.current === itemName && lastClickType.current === type && currentTime - lastClickTime.current < delay) {
			if (type === "legend") onLegendDoubleClick?.(itemName, chartInstance);
			else onSeriesDoubleClick?.(itemName, chartInstance);
			if (enableAutoSelection) if (allLegendsVisible.current) {
				selectedLegends.current.clear();
				selectedLegends.current.add(itemName);
				for (const name of allLegendNames) if (name !== itemName) chartInstance.dispatchAction({
					type: "legendUnSelect",
					name
				});
				chartInstance.dispatchAction({
					type: "legendSelect",
					name: itemName
				});
				allLegendsVisible.current = false;
			} else {
				selectedLegends.current.clear();
				for (const name of allLegendNames) chartInstance.dispatchAction({
					type: "legendSelect",
					name
				});
				allLegendsVisible.current = true;
			}
			lastClickTime.current = 0;
			lastClickedItem.current = null;
			lastClickType.current = null;
		} else {
			lastClickTime.current = currentTime;
			lastClickedItem.current = itemName;
			lastClickType.current = type;
			clickTimeout.current = setTimeout(() => {
				lastClickTime.current = 0;
				lastClickedItem.current = null;
				lastClickType.current = null;
				clickTimeout.current = null;
			}, delay);
		}
	}, [
		chartInstance,
		onLegendDoubleClick,
		onSeriesDoubleClick,
		delay,
		enableAutoSelection
	]);
	const handleLegendClick = (0, react.useCallback)((params, event) => {
		handleItemClick(params, event, "legend");
	}, [handleItemClick]);
	const handleSeriesClick = (0, react.useCallback)((params, event) => {
		handleItemClick(params, event, "series");
	}, [handleItemClick]);
	const cleanup = (0, react.useCallback)(() => {
		if (clickTimeout.current) {
			clearTimeout(clickTimeout.current);
			clickTimeout.current = null;
		}
	}, []);
	return {
		handleLegendClick,
		handleSeriesClick,
		cleanup
	};
}

//#endregion
//#region src/hooks/useSystemTheme.ts
/**
* Subscribes to system color scheme changes using the prefers-color-scheme media query.
* Returns 'dark' or 'light' based on the user's system preference.
*
* This hook leverages ECharts 6's dynamic theme switching capabilities
* for smooth theme transitions without chart re-initialization.
*/
const darkModeQuery = typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)") : null;
function subscribe(callback) {
	if (!darkModeQuery) return () => {};
	darkModeQuery.addEventListener("change", callback);
	return () => darkModeQuery.removeEventListener("change", callback);
}
function getSnapshot() {
	return darkModeQuery?.matches ?? false;
}
function getServerSnapshot() {
	return false;
}
/**
* Hook that returns the current system color scheme preference.
* Automatically updates when the user changes their system preference.
*
* @returns 'dark' | 'light' - The current system color scheme
*
* @example
* ```tsx
* const systemTheme = useSystemTheme();
* // Returns 'dark' or 'light' based on system preference
* ```
*/
function useSystemTheme() {
	const isDark = (0, react.useSyncExternalStore)(subscribe, getSnapshot, getServerSnapshot);
	return isDark ? "dark" : "light";
}
/**
* Hook that resolves a theme value, handling 'auto' by detecting system preference.
*
* @param theme - The theme value ('light', 'dark', 'auto', or a custom theme object)
* @returns The resolved theme value (never 'auto')
*
* @example
* ```tsx
* const resolvedTheme = useResolvedTheme('auto');
* // Returns 'dark' or 'light' based on system preference
*
* const explicitTheme = useResolvedTheme('dark');
* // Returns 'dark' (passes through explicit values)
* ```
*/
function useResolvedTheme(theme) {
	const systemTheme = useSystemTheme();
	if (theme === "auto") return systemTheme;
	return theme ?? "light";
}
/**
* Returns whether the system prefers dark mode.
*
* @returns boolean - true if system prefers dark mode
*/
function usePrefersDarkMode() {
	return (0, react.useSyncExternalStore)(subscribe, getSnapshot, getServerSnapshot);
}

//#endregion
//#region src/utils/validation.ts
/**
* Create a validation result
*/
function createValidationResult(isValid = true, errors = [], warnings = []) {
	return {
		isValid,
		errors,
		warnings
	};
}
/**
* Combine multiple validation results
*/
function combineValidationResults(...results) {
	const errors = [];
	const warnings = [];
	let isValid = true;
	for (const result of results) {
		if (!result.isValid) isValid = false;
		errors.push(...result.errors);
		warnings.push(...result.warnings);
	}
	return {
		isValid,
		errors,
		warnings
	};
}
/**
* Validate that a value is not null or undefined
*/
function validateRequired(value, fieldName) {
	if (value === null || value === void 0) return createValidationResult(false, [`${fieldName} is required`]);
	return createValidationResult();
}
/**
* Validate chart data for basic requirements
*/
function validateChartData(data) {
	const result = validateRequired(data, "data");
	if (!result.isValid) return result;
	if (!Array.isArray(data)) return createValidationResult(false, ["data must be an array"]);
	if (data.length === 0) return createValidationResult(false, ["data cannot be empty"]);
	const warnings = [];
	if (data.length > 1e4) warnings.push("Large dataset detected (>10k items), consider data aggregation for better performance");
	const firstItem = data[0];
	const firstItemType = typeof firstItem;
	for (let i = 1; i < Math.min(data.length, 100); i++) if (typeof data[i] !== firstItemType) {
		warnings.push("Inconsistent data types detected in dataset");
		break;
	}
	return createValidationResult(true, [], warnings);
}
/**
* Validate field mapping for ergonomic charts
*/
function validateFieldMapping(data, fieldName, fieldValue) {
	if (!fieldValue) return createValidationResult();
	const errors = [];
	const fields = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
	if (data.length > 0 && typeof data[0] === "object" && data[0] !== null) {
		const sampleObject = data[0];
		for (const field of fields) if (!(field in sampleObject)) errors.push(`Field '${field}' not found in data objects. Available fields: ${Object.keys(sampleObject).join(", ")}`);
	}
	return createValidationResult(errors.length === 0, errors);
}
/**
* Validate dimensions (width/height)
*/
function validateDimensions(width, height) {
	const errors = [];
	const warnings = [];
	if (width !== void 0) {
		if (typeof width === "number" && width <= 0) errors.push("Width must be a positive number");
		else if (typeof width === "string" && width !== "100%" && !width.match(/^\d+(?:px|%|em|rem|vw|vh)$/)) warnings.push("Width should be a valid CSS dimension (e.g., \"100%\", \"400px\")");
	}
	if (height !== void 0) {
		if (typeof height === "number" && height <= 0) errors.push("Height must be a positive number");
		else if (typeof height === "string" && !height.match(/^\d+(?:px|%|em|rem|vw|vh)$/)) warnings.push("Height should be a valid CSS dimension (e.g., \"400px\", \"50vh\")");
	}
	return createValidationResult(errors.length === 0, errors, warnings);
}
/**
* Validate theme value
*/
function validateTheme(theme) {
	if (theme === void 0 || theme === null) return createValidationResult();
	if (typeof theme === "string") {
		const validThemes = ["light", "dark"];
		if (!validThemes.includes(theme)) return createValidationResult(false, [`Invalid theme '${theme}'. Valid themes: ${validThemes.join(", ")}`]);
	} else if (typeof theme === "object") {
		const themeObj = theme;
		const warnings = [];
		if (!themeObj.backgroundColor) warnings.push("Custom theme is missing backgroundColor property");
		if (!themeObj.color) warnings.push("Custom theme is missing color palette");
		return createValidationResult(true, [], warnings);
	} else return createValidationResult(false, ["Theme must be a string or object"]);
	return createValidationResult();
}
/**
* Main validation function for chart props
*/
function validateChartProps(props) {
	const results = [];
	if ("data" in props) results.push(validateChartData(props.data));
	if ("width" in props || "height" in props) results.push(validateDimensions(props.width, props.height));
	if ("theme" in props) results.push(validateTheme(props.theme));
	return combineValidationResults(...results);
}
/**
* Utility function to throw DataValidationError if validation fails
*/
function assertValidation(result, context) {
	if (!result.isValid) throw new DataValidationError(result.errors.join("; "), context, ["Check the data format and required fields", "Refer to the documentation for examples"]);
	if (result.warnings.length > 0) console.warn("AQC Charts validation warnings:", result.warnings);
}
/**
* Development mode validator that logs detailed information
*/
function validateInDevelopment(value, validator, context = "component") {
	{
		const result = validator(value);
		if (!result.isValid) console.error(`AQC Charts validation failed in ${context}:`, result.errors);
		if (result.warnings.length > 0) console.warn(`AQC Charts validation warnings in ${context}:`, result.warnings);
	}
	return value;
}

//#endregion
//#region src/utils/logo.ts
const calculateLogoPosition = (logo, chartWidth, chartHeight) => {
	const logoWidth = logo.width || 100;
	const logoHeight = logo.height || 50;
	const padding = 10;
	if (logo.x !== void 0 && logo.y !== void 0) return {
		x: logo.x,
		y: logo.y
	};
	switch (logo.position || "bottom-right") {
		case "top-left": return {
			x: padding,
			y: padding
		};
		case "top-right": return {
			x: chartWidth - logoWidth - padding,
			y: padding
		};
		case "bottom-left": return {
			x: padding,
			y: chartHeight - logoHeight - padding
		};
		case "bottom-right": return {
			x: chartWidth - logoWidth - padding,
			y: chartHeight - logoHeight - padding
		};
		case "center": return {
			x: (chartWidth - logoWidth) / 2,
			y: (chartHeight - logoHeight) / 2
		};
		default: return {
			x: chartWidth - logoWidth - padding,
			y: chartHeight - logoHeight - padding
		};
	}
};
const createLogoGraphic = (logo, chartWidth, chartHeight) => {
	const position = calculateLogoPosition(logo, chartWidth, chartHeight);
	return {
		type: "image",
		style: {
			image: logo.src,
			x: position.x,
			y: position.y,
			width: logo.width || 100,
			height: logo.height || 50,
			opacity: logo.opacity || 1
		},
		z: 1e3,
		silent: true
	};
};
const addLogoToOption = (option, logo, chartWidth, chartHeight) => {
	if (!logo) return option;
	const logoGraphic = createLogoGraphic(logo, chartWidth, chartHeight);
	return {
		...option,
		graphic: [...Array.isArray(option.graphic) ? option.graphic : option.graphic ? [option.graphic] : [], logoGraphic]
	};
};
const removeLogoFromOption = (option) => {
	if (!option.graphic) return option;
	const filteredGraphics = Array.isArray(option.graphic) ? option.graphic.filter((graphic) => graphic.type !== "image") : option.graphic.type !== "image" ? [option.graphic] : [];
	return {
		...option,
		graphic: filteredGraphics.length > 0 ? filteredGraphics : void 0
	};
};

//#endregion
//#region src/components/BaseChart.tsx
const BaseChart = (0, react.forwardRef)(({ title, width = "100%", height = 400, theme: themeProp = "light", loading: externalLoading = false, notMerge = false, lazyUpdate = true, logo, onChartReady, onClick, onDoubleClick, onMouseOver, onMouseOut, onDataZoom, onBrush, onLegendDoubleClick, onSeriesDoubleClick, legendDoubleClickDelay = 300, enableLegendDoubleClickSelection = false, className = "", style = {}, option, renderer: _renderer = "canvas", locale: _locale = "en",...restProps }, ref) => {
	const theme = useResolvedTheme(themeProp);
	(0, react.useMemo)(() => {
		try {
			const dimensionResult = validateDimensions(width, height);
			if (dimensionResult.warnings.length > 0) console.warn("AQC Charts BaseChart validation warnings:", dimensionResult.warnings);
			assertValidation(dimensionResult, {
				component: "BaseChart",
				width,
				height
			});
			const themeResult = validateTheme(theme);
			if (themeResult.warnings.length > 0) console.warn("AQC Charts BaseChart theme warnings:", themeResult.warnings);
			assertValidation(themeResult, {
				component: "BaseChart",
				theme
			});
			if (option && typeof option === "object") {
				const optionKeys = Object.keys(option);
				if (optionKeys.length === 0) console.warn("AQC Charts: Empty chart option provided");
			}
		} catch (error$1) {
			console.error("AQC Charts BaseChart validation failed:", error$1);
		}
	}, [
		width,
		height,
		theme,
		option
	]);
	const chartOption = (0, react.useMemo)(() => {
		let processedOption = option;
		if (title && typeof title === "string") processedOption = {
			...processedOption,
			title: {
				...processedOption.title,
				text: title,
				left: "center"
			}
		};
		if (logo && !logo.onSaveOnly) {
			const chartWidth = typeof width === "number" ? width : 600;
			const chartHeight = typeof height === "number" ? height : 400;
			processedOption = addLogoToOption(processedOption, logo, chartWidth, chartHeight);
		}
		return processedOption;
	}, [
		option,
		title,
		logo,
		width,
		height
	]);
	const { containerRef: echartsContainerRefFromHook, loading: chartLoading, error, refresh, getEChartsInstance, clear, resize: resizeChart, showLoading: showChartLoading, hideLoading: hideChartLoading, dispose } = useECharts({
		option: chartOption,
		theme,
		notMerge,
		lazyUpdate,
		onChartReady
	});
	const chart = getEChartsInstance();
	const { handleLegendClick, handleSeriesClick, cleanup: cleanupLegendDoubleClick } = useLegendDoubleClick({
		chartInstance: chart,
		onLegendDoubleClick,
		onSeriesDoubleClick,
		delay: legendDoubleClickDelay,
		enableAutoSelection: enableLegendDoubleClickSelection
	});
	const handlersRef = (0, react.useRef)({
		onClick,
		onDoubleClick,
		onMouseOver,
		onMouseOut,
		onDataZoom,
		onBrush,
		onChartReady,
		onLegendDoubleClick,
		onSeriesDoubleClick,
		handleLegendClick,
		handleSeriesClick
	});
	(0, react.useEffect)(() => {
		handlersRef.current = {
			onClick,
			onDoubleClick,
			onMouseOver,
			onMouseOut,
			onDataZoom,
			onBrush,
			onChartReady,
			onLegendDoubleClick,
			onSeriesDoubleClick,
			handleLegendClick,
			handleSeriesClick
		};
	});
	(0, react.useEffect)(() => {
		if (!chart) return;
		const handlers = handlersRef.current;
		const eventCleanup = [];
		let pendingLegendClick = null;
		let pendingTimeout = null;
		const clickHandler = (params) => {
			handlers.onClick?.(params, chart);
			if (handlers.onSeriesDoubleClick || enableLegendDoubleClickSelection) handlers.handleSeriesClick(params);
		};
		chart.on("click", clickHandler);
		eventCleanup.push(() => chart.off("click", clickHandler));
		const dblclickHandler = (params) => {
			handlers.onDoubleClick?.(params, chart);
		};
		chart.on("dblclick", dblclickHandler);
		eventCleanup.push(() => chart.off("dblclick", dblclickHandler));
		const mouseOverHandler = (params) => handlers.onMouseOver?.(params, chart);
		const mouseOutHandler = (params) => handlers.onMouseOut?.(params, chart);
		chart.on("mouseover", mouseOverHandler);
		chart.on("mouseout", mouseOutHandler);
		eventCleanup.push(() => {
			chart.off("mouseover", mouseOverHandler);
			chart.off("mouseout", mouseOutHandler);
		});
		const dataZoomHandler = (params) => handlers.onDataZoom?.(params, chart);
		const brushHandler = (params) => handlers.onBrush?.(params, chart);
		chart.on("datazoom", dataZoomHandler);
		chart.on("brush", brushHandler);
		eventCleanup.push(() => {
			chart.off("datazoom", dataZoomHandler);
			chart.off("brush", brushHandler);
		});
		if (handlers.onLegendDoubleClick || enableLegendDoubleClickSelection) {
			const legendHandler = (params) => {
				const legendParams = params;
				pendingLegendClick = legendParams.name;
				handlers.handleLegendClick(legendParams);
				if (pendingTimeout) clearTimeout(pendingTimeout);
				pendingTimeout = setTimeout(() => {
					pendingLegendClick = null;
				}, 100);
			};
			chart.on("legendselectchanged", legendHandler);
			eventCleanup.push(() => chart.off("legendselectchanged", legendHandler));
			const containerElement = chart.getDom();
			if (containerElement) {
				const domClickHandler = (event) => {
					const target = event.target;
					if (target?.closest?.(".echarts-legend") && pendingLegendClick) {
						handlers.handleLegendClick({ name: pendingLegendClick }, event);
						pendingLegendClick = null;
					}
				};
				containerElement.addEventListener("click", domClickHandler);
				eventCleanup.push(() => containerElement.removeEventListener("click", domClickHandler));
			}
		}
		handlers.onChartReady?.(chart);
		return () => {
			eventCleanup.forEach((cleanup) => cleanup());
			cleanupLegendDoubleClick();
			if (pendingTimeout) clearTimeout(pendingTimeout);
		};
	}, [
		chart,
		enableLegendDoubleClickSelection,
		cleanupLegendDoubleClick
	]);
	(0, react.useEffect)(() => {
		if (chart) if (externalLoading) chart.showLoading();
		else chart.hideLoading();
	}, [chart, externalLoading]);
	const exportImage = (0, react.useCallback)((opts) => {
		const chartInstance = getEChartsInstance();
		if (!chartInstance) return "";
		if (logo?.onSaveOnly) {
			const currentOption = chartInstance.getOption();
			const chartWidth = typeof width === "number" ? width : 600;
			const chartHeight = typeof height === "number" ? height : 400;
			const optionWithLogo = addLogoToOption(currentOption, logo, chartWidth, chartHeight);
			chartInstance.setOption(optionWithLogo, {
				notMerge: false,
				lazyUpdate: false
			});
			const dataURL = chartInstance.getDataURL({
				type: opts?.type || "png",
				pixelRatio: opts?.pixelRatio || 1,
				backgroundColor: opts?.backgroundColor || "#fff",
				...opts?.excludeComponents && { excludeComponents: opts.excludeComponents }
			});
			const optionWithoutLogo = removeLogoFromOption(currentOption);
			chartInstance.setOption(optionWithoutLogo, {
				notMerge: false,
				lazyUpdate: false
			});
			return dataURL;
		}
		return chartInstance.getDataURL({
			type: opts?.type || "png",
			pixelRatio: opts?.pixelRatio || 1,
			backgroundColor: opts?.backgroundColor || "#fff",
			...opts?.excludeComponents && { excludeComponents: opts.excludeComponents }
		});
	}, [
		getEChartsInstance,
		logo,
		width,
		height
	]);
	const saveAsImage = (0, react.useCallback)((filename, opts) => {
		const dataURL = exportImage(opts);
		if (!dataURL) return;
		const link = document.createElement("a");
		link.download = filename || `chart.${opts?.type || "png"}`;
		link.href = dataURL;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}, [exportImage]);
	(0, react.useImperativeHandle)(ref, () => ({
		getEChartsInstance,
		refresh,
		clear,
		resize: resizeChart,
		showLoading: showChartLoading,
		hideLoading: hideChartLoading,
		dispose,
		exportImage,
		saveAsImage
	}), [
		getEChartsInstance,
		refresh,
		clear,
		resizeChart,
		showChartLoading,
		hideChartLoading,
		dispose,
		exportImage,
		saveAsImage
	]);
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
	if (error) {
		const errorMessage = isChartError(error) ? error.toUserMessage() : error?.message || "Unknown error";
		const isRecoverable = isChartError(error) && error.recoverable;
		return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			className: `aqc-charts-error ${className}`,
			style: containerStyle,
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					height: "100%",
					color: "#ff4d4f",
					fontSize: "14px",
					padding: "20px",
					textAlign: "center"
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: {
							marginBottom: "8px",
							fontSize: "16px"
						},
						children: isRecoverable ? "⚠️" : "❌"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: { marginBottom: isRecoverable ? "12px" : "0" },
						children: errorMessage
					}),
					isRecoverable && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: {
							fontSize: "12px",
							color: "#ff7875",
							fontStyle: "italic"
						},
						children: "This error is recoverable. Try refreshing the component."
					})
				]
			})
		});
	}
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: `aqc-charts-container ${className}`,
		style: containerStyle,
		...restProps,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			ref: echartsContainerRefFromHook,
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
//#region src/components/legacy/OldCalendarHeatmapChart.tsx
const OldCalendarHeatmapChart = (0, react.forwardRef)(({ data, year, calendar = {}, visualMap = {}, tooltipFormatter, title,...props }, ref) => {
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
OldCalendarHeatmapChart.displayName = "OldCalendarHeatmapChart";

//#endregion
//#region src/components/legacy/OldStackedBarChart.tsx
const OldStackedBarChart = (0, react.forwardRef)(({ data, horizontal = false, showPercentage = false, showValues = false, barWidth = "60%", barMaxWidth, stackName = "total", showLegend = true, legend, tooltip, xAxis, yAxis, grid, series: customSeries,...props }, ref) => {
	const series = (0, react.useMemo)(() => {
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
	const chartOption = (0, react.useMemo)(() => ({
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
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BaseChart, {
		ref,
		option: chartOption,
		...props
	});
});
OldStackedBarChart.displayName = "OldStackedBarChart";

//#endregion
//#region src/utils/legacy/chartHelpers.ts
/**
* Create a basic line chart option
* @deprecated Use the LineChart component instead
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
* @deprecated Use the SankeyChart component instead
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
* @deprecated Use spread operator or a proper merge utility instead
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
const OldSankeyChart = (0, react.forwardRef)(({ data, layout = "none", orient = "horizontal", nodeAlign = "justify", nodeGap = 8, nodeWidth = 20, iterations = 32, title, option: customOption,...props }, ref) => {
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
OldSankeyChart.displayName = "OldSankeyChart";

//#endregion
//#region src/components/legacy/OldScatterChart.tsx
const OldScatterChart = (0, react.forwardRef)(({ data, symbolSize = 10, symbol = "circle", large = false, largeThreshold = 2e3, progressive = 400, progressiveThreshold = 3e3, enableAdvancedFeatures = false, title, option: customOption, series: customSeries,...props }, ref) => {
	const chartOption = (0, react.useMemo)(() => {
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
			...customOption
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
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BaseChart, {
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
const OldClusterChart = (0, react.forwardRef)(({ data, clusterCount = 6, outputClusterIndexDimension = 2, colors = DEFAULT_COLORS, symbolSize = 15, itemStyle = { borderColor: "#555" }, visualMapPosition = "left", gridLeft = 120, title, option: customOption,...props }, ref) => {
	const chartOption = (0, react.useMemo)(() => {
		if (!data?.data || !Array.isArray(data.data)) return { series: [] };
		const sourceData = data.data.map((point) => [point.value[0], point.value[1]]);
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
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BaseChart, {
		ref,
		option: chartOption,
		...props
	});
});
OldClusterChart.displayName = "OldClusterChart";

//#endregion
//#region src/components/legacy/OldRegressionChart.tsx
const OldRegressionChart = (0, react.forwardRef)(({ data, method = "linear", formulaOn = "end", scatterName = "scatter", lineName = "regression", scatterColor = "#5470c6", lineColor = "#91cc75", symbolSize = 8, showFormula = true, formulaFontSize = 16, formulaPosition = { dx: -20 }, splitLineStyle = "dashed", legendPosition = "bottom", title, option: customOption,...props }, ref) => {
	const chartOption = (0, react.useMemo)(() => {
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
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BaseChart, {
		ref,
		option: chartOption,
		...props
	});
});
OldRegressionChart.displayName = "OldRegressionChart";

//#endregion
//#region src/components/legacy/OldGanttChart.tsx
const OldGanttChart = (0, react.forwardRef)(({ data, heightRatio = .6, showDataZoom = true, draggable: _draggable = false, showLegend = false, legend, tooltip, xAxis, yAxis, grid, onTaskDrag: _onTaskDrag,...props }, ref) => {
	const processedData = (0, react.useMemo)(() => {
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
	const renderGanttItem = (0, react.useMemo)(() => {
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
	const renderAxisLabelItem = (0, react.useMemo)(() => {
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
	const chartOption = (0, react.useMemo)(() => ({
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
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BaseChart, {
		ref,
		option: chartOption,
		...props
	});
});
OldGanttChart.displayName = "OldGanttChart";

//#endregion
//#region src/components/legacy/OldLineChart.tsx
const OldLineChart = (0, react.forwardRef)(({ data, smooth = false, area = false, stack = false, symbol = true, symbolSize = 4, connectNulls = false, title, option: customOption, series: customSeries,...props }, ref) => {
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
			...customOption
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
OldLineChart.displayName = "OldLineChart";

//#endregion
//#region src/components/legacy/OldBarChart.tsx
const OldBarChart = (0, react.forwardRef)(({ data, horizontal = false, stack = false, showValues = false, barWidth, barMaxWidth, showLegend = true, legend, tooltip, xAxis, yAxis, grid, series: customSeries,...props }, ref) => {
	const series = (0, react.useMemo)(() => {
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
	const chartOption = (0, react.useMemo)(() => ({
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
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BaseChart, {
		ref,
		option: chartOption,
		...props
	});
});
OldBarChart.displayName = "OldBarChart";

//#endregion
//#region src/components/legacy/OldPieChart.tsx
const OldPieChart = (0, react.forwardRef)(({ data, radius = ["40%", "70%"], center = ["50%", "50%"], roseType = false, showLabels = true, showLegend = true, legend, series: customSeries,...props }, ref) => {
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
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BaseChart, {
		ref,
		option: chartOption,
		...props
	});
});
OldPieChart.displayName = "OldPieChart";

//#endregion
Object.defineProperty(exports, 'BaseChart', {
  enumerable: true,
  get: function () {
    return BaseChart;
  }
});
Object.defineProperty(exports, 'ChartError', {
  enumerable: true,
  get: function () {
    return ChartError;
  }
});
Object.defineProperty(exports, 'ChartErrorCode', {
  enumerable: true,
  get: function () {
    return ChartErrorCode;
  }
});
Object.defineProperty(exports, 'ChartInitError', {
  enumerable: true,
  get: function () {
    return ChartInitError;
  }
});
Object.defineProperty(exports, 'ChartRenderError', {
  enumerable: true,
  get: function () {
    return ChartRenderError;
  }
});
Object.defineProperty(exports, 'DataValidationError', {
  enumerable: true,
  get: function () {
    return DataValidationError;
  }
});
Object.defineProperty(exports, 'EChartsLoadError', {
  enumerable: true,
  get: function () {
    return EChartsLoadError;
  }
});
Object.defineProperty(exports, 'OldBarChart', {
  enumerable: true,
  get: function () {
    return OldBarChart;
  }
});
Object.defineProperty(exports, 'OldCalendarHeatmapChart', {
  enumerable: true,
  get: function () {
    return OldCalendarHeatmapChart;
  }
});
Object.defineProperty(exports, 'OldClusterChart', {
  enumerable: true,
  get: function () {
    return OldClusterChart;
  }
});
Object.defineProperty(exports, 'OldGanttChart', {
  enumerable: true,
  get: function () {
    return OldGanttChart;
  }
});
Object.defineProperty(exports, 'OldLineChart', {
  enumerable: true,
  get: function () {
    return OldLineChart;
  }
});
Object.defineProperty(exports, 'OldPieChart', {
  enumerable: true,
  get: function () {
    return OldPieChart;
  }
});
Object.defineProperty(exports, 'OldRegressionChart', {
  enumerable: true,
  get: function () {
    return OldRegressionChart;
  }
});
Object.defineProperty(exports, 'OldSankeyChart', {
  enumerable: true,
  get: function () {
    return OldSankeyChart;
  }
});
Object.defineProperty(exports, 'OldScatterChart', {
  enumerable: true,
  get: function () {
    return OldScatterChart;
  }
});
Object.defineProperty(exports, 'OldStackedBarChart', {
  enumerable: true,
  get: function () {
    return OldStackedBarChart;
  }
});
Object.defineProperty(exports, 'TransformError', {
  enumerable: true,
  get: function () {
    return TransformError;
  }
});
Object.defineProperty(exports, '__toESM', {
  enumerable: true,
  get: function () {
    return __toESM;
  }
});
Object.defineProperty(exports, 'addLogoToOption', {
  enumerable: true,
  get: function () {
    return addLogoToOption;
  }
});
Object.defineProperty(exports, 'assertValidation', {
  enumerable: true,
  get: function () {
    return assertValidation;
  }
});
Object.defineProperty(exports, 'createChartError', {
  enumerable: true,
  get: function () {
    return createChartError;
  }
});
Object.defineProperty(exports, 'createLogoGraphic', {
  enumerable: true,
  get: function () {
    return createLogoGraphic;
  }
});
Object.defineProperty(exports, 'disposeChart', {
  enumerable: true,
  get: function () {
    return disposeChart;
  }
});
Object.defineProperty(exports, 'getEChartsModule', {
  enumerable: true,
  get: function () {
    return getEChartsModule;
  }
});
Object.defineProperty(exports, 'getMap', {
  enumerable: true,
  get: function () {
    return getMap;
  }
});
Object.defineProperty(exports, 'isChartError', {
  enumerable: true,
  get: function () {
    return isChartError;
  }
});
Object.defineProperty(exports, 'isRecoverableError', {
  enumerable: true,
  get: function () {
    return isRecoverableError;
  }
});
Object.defineProperty(exports, 'registerMap', {
  enumerable: true,
  get: function () {
    return registerMap;
  }
});
Object.defineProperty(exports, 'removeLogoFromOption', {
  enumerable: true,
  get: function () {
    return removeLogoFromOption;
  }
});
Object.defineProperty(exports, 'safeAsync', {
  enumerable: true,
  get: function () {
    return safeAsync;
  }
});
Object.defineProperty(exports, 'safeSync', {
  enumerable: true,
  get: function () {
    return safeSync;
  }
});
Object.defineProperty(exports, 'useChartEvents', {
  enumerable: true,
  get: function () {
    return useChartEvents;
  }
});
Object.defineProperty(exports, 'useChartInstance', {
  enumerable: true,
  get: function () {
    return useChartInstance;
  }
});
Object.defineProperty(exports, 'useChartOptions', {
  enumerable: true,
  get: function () {
    return useChartOptions;
  }
});
Object.defineProperty(exports, 'useChartResize', {
  enumerable: true,
  get: function () {
    return useChartResize;
  }
});
Object.defineProperty(exports, 'useECharts', {
  enumerable: true,
  get: function () {
    return useECharts;
  }
});
Object.defineProperty(exports, 'useLegendDoubleClick', {
  enumerable: true,
  get: function () {
    return useLegendDoubleClick;
  }
});
Object.defineProperty(exports, 'usePrefersDarkMode', {
  enumerable: true,
  get: function () {
    return usePrefersDarkMode;
  }
});
Object.defineProperty(exports, 'useResolvedTheme', {
  enumerable: true,
  get: function () {
    return useResolvedTheme;
  }
});
Object.defineProperty(exports, 'useSystemTheme', {
  enumerable: true,
  get: function () {
    return useSystemTheme;
  }
});
Object.defineProperty(exports, 'validateChartData', {
  enumerable: true,
  get: function () {
    return validateChartData;
  }
});
Object.defineProperty(exports, 'validateChartProps', {
  enumerable: true,
  get: function () {
    return validateChartProps;
  }
});
Object.defineProperty(exports, 'validateDimensions', {
  enumerable: true,
  get: function () {
    return validateDimensions;
  }
});
Object.defineProperty(exports, 'validateFieldMapping', {
  enumerable: true,
  get: function () {
    return validateFieldMapping;
  }
});
Object.defineProperty(exports, 'validateInDevelopment', {
  enumerable: true,
  get: function () {
    return validateInDevelopment;
  }
});
Object.defineProperty(exports, 'validateTheme', {
  enumerable: true,
  get: function () {
    return validateTheme;
  }
});