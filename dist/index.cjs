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
const react_jsx_runtime = __toESM(require("react/jsx-runtime"));

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
//#region src/utils/EChartsLoader.ts
let loadingPromise = null;
let isLoaded = false;
let loadAttempts = 0;
/**
* Wait for a specified amount of time
*/
function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
* Load a script with timeout and retry logic
*/
function loadScript(src, name, timeout = 3e4) {
	return new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.src = src;
		script.async = true;
		let timeoutId;
		let isResolved = false;
		const cleanup = () => {
			if (timeoutId) clearTimeout(timeoutId);
			script.onload = null;
			script.onerror = null;
		};
		script.onload = () => {
			if (!isResolved) {
				isResolved = true;
				cleanup();
				resolve();
			}
		};
		script.onerror = () => {
			if (!isResolved) {
				isResolved = true;
				cleanup();
				reject(new Error(`Failed to load ${name} from ${src}`));
			}
		};
		timeoutId = setTimeout(() => {
			if (!isResolved) {
				isResolved = true;
				cleanup();
				reject(new Error(`Timeout loading ${name} from ${src}`));
			}
		}, timeout);
		document.head.appendChild(script);
	});
}
/**
* Load ECharts dynamically from CDN with enhanced error handling
*/
async function loadECharts(options = {}) {
	if (isLoaded && window.echarts && window.ecStat) return window.echarts;
	if (loadingPromise) return loadingPromise;
	const { version = "5.6.0", retryAttempts = 3, retryDelay = 1e3, timeout = 3e4 } = options;
	loadingPromise = safeAsync(async () => {
		if (window.echarts && window.ecStat) {
			isLoaded = true;
			return window.echarts;
		}
		let lastError = null;
		for (let attempt = 0; attempt < retryAttempts; attempt++) try {
			loadAttempts++;
			await Promise.all([loadScript(`https://cdn.jsdelivr.net/npm/echarts@${version}/dist/echarts.min.js`, "ECharts", timeout), loadScript("https://cdn.jsdelivr.net/npm/echarts-stat@1.2.0/dist/ecStat.min.js", "ecStat", timeout)]);
			if (!window.echarts) throw new Error("ECharts library not available after loading");
			if (!window.ecStat) throw new Error("ecStat library not available after loading");
			try {
				if (window.ecStat.transform.clustering) window.echarts.registerTransform(window.ecStat.transform.clustering);
				if (window.ecStat.transform.regression) window.echarts.registerTransform(window.ecStat.transform.regression);
				if (window.ecStat.transform.histogram) window.echarts.registerTransform(window.ecStat.transform.histogram);
			} catch (transformError) {
				throw new TransformError("ecStat registration", transformError, {
					echartsVersion: version,
					attempt: attempt + 1,
					availableTransforms: Object.keys(window.ecStat?.transform || {})
				});
			}
			isLoaded = true;
			return window.echarts;
		} catch (error) {
			lastError = error;
			if (attempt < retryAttempts - 1) {
				console.warn(`ECharts loading attempt ${attempt + 1} failed, retrying in ${retryDelay}ms...`, error);
				await delay(retryDelay * (attempt + 1));
			}
		}
		throw new EChartsLoadError(lastError || new Error("Unknown loading error"), {
			version,
			attempts: retryAttempts,
			totalLoadAttempts: loadAttempts,
			userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
			online: typeof navigator !== "undefined" ? navigator.onLine : true
		});
	}, ChartErrorCode.ECHARTS_LOAD_FAILED, {
		version,
		retryAttempts
	});
	return loadingPromise;
}

//#endregion
//#region src/hooks/echarts/useChartInstance.ts
function useChartInstance({ containerRef, onChartReady }) {
	const chartRef = (0, react.useRef)(null);
	const [isInitialized, setIsInitialized] = (0, react.useState)(false);
	const [error, setError] = (0, react.useState)(null);
	const disposeChart = (0, react.useCallback)(() => {
		if (chartRef.current) {
			chartRef.current.dispose();
			chartRef.current = null;
			setIsInitialized(false);
		}
	}, []);
	const initChart = (0, react.useCallback)(async () => {
		if (!containerRef.current) {
			const error$1 = createChartError(new Error("Container element not found"), ChartErrorCode.CONTAINER_NOT_FOUND, { containerRef: !!containerRef.current });
			setError(error$1);
			return;
		}
		try {
			const echarts = await loadECharts();
			disposeChart();
			if (!containerRef.current) throw new ChartInitError(new Error("Container element was removed during initialization"), { phase: "post-load" });
			const rect = containerRef.current.getBoundingClientRect();
			if (rect.width === 0 || rect.height === 0) console.warn("AQC Charts: Container has zero dimensions, chart may not render properly", {
				width: rect.width,
				height: rect.height
			});
			const chart = echarts.init(containerRef.current, void 0, {
				renderer: "canvas",
				useDirtyRect: true
			});
			if (!chart) throw new ChartInitError(new Error("ECharts.init returned null or undefined"), {
				containerDimensions: {
					width: rect.width,
					height: rect.height
				},
				containerElement: containerRef.current.tagName
			});
			chartRef.current = chart;
			setIsInitialized(true);
			setError(null);
			onChartReady?.(chart);
		} catch (err) {
			const error$1 = err instanceof ChartInitError ? err : createChartError(err, ChartErrorCode.CHART_INIT_FAILED, {
				containerExists: !!containerRef.current,
				containerDimensions: containerRef.current ? {
					width: containerRef.current.getBoundingClientRect().width,
					height: containerRef.current.getBoundingClientRect().height
				} : null
			});
			setError(error$1);
			setIsInitialized(false);
			console.error("Failed to initialize ECharts:", error$1);
		}
	}, [
		containerRef,
		onChartReady,
		disposeChart
	]);
	(0, react.useEffect)(() => {
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
	const lastChartInstanceRef = (0, react.useRef)(null);
	const lastOptionRef = (0, react.useRef)(null);
	(0, react.useEffect)(() => {
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
	(0, react.useEffect)(() => {
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
		dispose: disposeChart
	};
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
//#region src/components/BaseChart.tsx
const BaseChart = (0, react.forwardRef)(({ title, width = "100%", height = 400, theme = "light", loading: externalLoading = false, notMerge = false, lazyUpdate = true, onChartReady, onClick, onDoubleClick, onMouseOver, onMouseOut, onDataZoom, onBrush, className = "", style = {}, option, renderer: _renderer = "canvas", locale: _locale = "en",...restProps }, ref) => {
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

//#endregion
//#region src/utils/base-options.ts
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

//#endregion
//#region src/utils/chart-builders/line-chart.ts
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
			lineStyle: {
				width: s.strokeWidth ?? props.strokeWidth,
				type: mapStrokeStyleToECharts(s.strokeStyle ?? props.strokeStyle)
			},
			itemStyle: { color: s.color },
			areaStyle: s.showArea ?? props.showArea ? { opacity: props.areaOpacity || .3 } : void 0,
			symbol: (s.showPoints ?? props.showPoints) !== false ? s.pointShape ?? props.pointShape ?? "circle" : "none",
			symbolSize: s.pointSize ?? props.pointSize ?? 4
		}));
		if (props.series && props.series[0] && isObjectData(props.series[0].data) && props.xField) xAxisData = props.series[0].data.map((item) => item[props.xField]);
	} else if (props.data) if (isObjectData(props.data)) if (props.seriesField) {
		const groups = groupDataByField(props.data, props.seriesField);
		series = Object.entries(groups).map(([name, groupData]) => ({
			name,
			type: "line",
			data: groupData.map((item) => item[props.yField]),
			smooth: props.smooth,
			lineStyle: {
				width: props.strokeWidth,
				type: mapStrokeStyleToECharts(props.strokeStyle)
			},
			areaStyle: props.showArea ? { opacity: props.areaOpacity || .3 } : void 0,
			symbol: props.showPoints !== false ? props.pointShape || "circle" : "none",
			symbolSize: props.pointSize || 4
		}));
		xAxisData = props.data.map((item) => item[props.xField]);
	} else {
		if (Array.isArray(props.yField)) series = props.yField.map((field) => {
			const seriesSpecificConfig = props.seriesConfig?.[field] || {};
			return {
				name: field,
				type: "line",
				data: props.data.map((item) => item[field]),
				smooth: seriesSpecificConfig.smooth ?? props.smooth,
				lineStyle: {
					width: seriesSpecificConfig.strokeWidth ?? props.strokeWidth,
					type: mapStrokeStyleToECharts(seriesSpecificConfig.strokeStyle ?? props.strokeStyle)
				},
				itemStyle: seriesSpecificConfig.color ? { color: seriesSpecificConfig.color } : void 0,
				areaStyle: seriesSpecificConfig.showArea ?? props.showArea ? { opacity: seriesSpecificConfig.areaOpacity ?? (props.areaOpacity || .3) } : void 0,
				symbol: (seriesSpecificConfig.showPoints ?? props.showPoints) !== false ? seriesSpecificConfig.pointShape ?? props.pointShape ?? "circle" : "none",
				symbolSize: seriesSpecificConfig.pointSize ?? props.pointSize ?? 4
			};
		});
		else series = [{
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
		yAxis: buildAxisOption(props.yAxis, "numeric", props.theme),
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
				label: createLabelConfig(seriesData, allSeriesData, index)
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
				label: createLabelConfig(seriesData, allSeriesData, index)
			};
		});
		categoryData = props.data.map((item) => item[props.categoryField]);
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
					label: createLabelConfig(seriesData, allSeriesData, index)
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

//#endregion
//#region src/utils/chart-builders/pie-chart.ts
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

//#endregion
//#region src/utils/chart-builders/scatter-chart.ts
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
	return {
		...baseOption,
		grid: {
			show: timelineStyle.showGrid || false,
			left: categoryLabelStyle.width + 20 || 140,
			right: 20,
			top: timelineStyle.position === "top" ? 60 : 20,
			bottom: (props.dataZoom !== false ? 40 : 20) + (timelineStyle.position === "bottom" ? 40 : 0),
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
		legend: props.legend ? buildLegendOption(props.legend, !!props.title, !!props.subtitle, false, props.theme) : void 0,
		...props.customOption
	};
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
	const isVertical = props.orient === "vertical";
	const visualMapLegendConfig = {
		show: true,
		position: isVertical ? "right" : "bottom",
		orientation: isVertical ? "vertical" : "horizontal"
	};
	const gridSpacing = calculateGridSpacing(visualMapLegendConfig, hasTitle, false, false);
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
			calendarConfig.left = gridSpacing.left;
			calendarConfig.top = gridSpacing.top;
			calendarConfig.bottom = gridSpacing.bottom;
			calendarConfig.right = gridSpacing.right;
		} else if (years.length > 1) {
			const availableHeight = 100 - parseInt(gridSpacing.top) - parseInt(gridSpacing.bottom);
			calendarConfig.top = `${parseInt(gridSpacing.top) + index * (availableHeight / years.length)}%`;
			calendarConfig.height = `${Math.floor(availableHeight / years.length * .8)}%`;
			calendarConfig.left = gridSpacing.left;
			calendarConfig.right = gridSpacing.right;
		} else {
			calendarConfig.top = gridSpacing.top;
			calendarConfig.left = gridSpacing.left;
			calendarConfig.right = gridSpacing.right;
			calendarConfig.bottom = gridSpacing.bottom;
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
		visualMap: (() => {
			return {
				type: "piecewise",
				orient: isVertical ? "vertical" : "horizontal",
				...isVertical ? {
					right: "5%",
					top: hasTitle ? gridSpacing.top : "center",
					itemGap: 5
				} : {
					left: "center",
					bottom: years.length > 1 ? "3%" : "5%"
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
			};
		})(),
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
		left: "5%",
		top: props.title ? "15%" : "5%",
		right: "5%",
		bottom: "5%"
	};
	return {
		...baseOption,
		series: [series],
		legend: props.legend ? buildLegendOption(props.legend, !!props.title, !!props.subtitle, false, props.theme) : void 0,
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
const LineChart = (0, react.forwardRef)(({ width = "100%", height = 400, className, style, data, xField = "x", yField = "y", seriesField, series, seriesConfig, theme = "light", colorPalette, backgroundColor, title, subtitle, titlePosition = "center", smooth = false, strokeWidth = 2, strokeStyle = "solid", showPoints = true, pointSize = 4, pointShape = "circle", showArea = false, areaOpacity = .3, areaGradient = false, xAxis, yAxis, legend, tooltip, zoom = false, pan = false, brush = false, loading = false, disabled: _disabled = false, animate = true, animationDuration, onChartReady, onDataPointClick, onDataPointHover, customOption, responsive: _responsive = true,...restProps }, ref) => {
	const chartOption = (0, react.useMemo)(() => {
		return buildLineChartOption({
			data: data || void 0,
			xField,
			yField,
			seriesField,
			series,
			seriesConfig,
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
		seriesConfig,
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
	const chartEvents = (0, react.useMemo)(() => {
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
			seriesConfig,
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
	(0, react.useImperativeHandle)(ref, () => ({
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
	if (error) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: `aqc-charts-container ${className || ""}`,
		style: containerStyle,
		...restProps,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			ref: containerRef,
			style: {
				width: "100%",
				height: "100%"
			}
		}), (chartLoading || loading) && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
const BarChart = (0, react.forwardRef)(({ width = "100%", height = 400, className, style, data, categoryField = "category", valueField = "value", seriesField, series, theme = "light", colorPalette, backgroundColor, title, subtitle, titlePosition = "center", orientation = "vertical", barWidth, barGap, borderRadius = 0, stack = false, stackType = "normal", showPercentage = false, showLabels = false, showAbsoluteValues = false, showPercentageLabels = false, xAxis, yAxis, legend, tooltip, sortBy = "none", sortOrder = "asc", loading = false, disabled: _disabled = false, animate = true, animationDuration, onChartReady, onDataPointClick, onDataPointHover, customOption, responsive: _responsive = true,...restProps }, ref) => {
	const chartOption = (0, react.useMemo)(() => {
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
			showLabels,
			showAbsoluteValues,
			showPercentageLabels,
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
		showLabels,
		showAbsoluteValues,
		showPercentageLabels,
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
	const chartEvents = (0, react.useMemo)(() => {
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
			showLabels,
			showAbsoluteValues,
			showPercentageLabels,
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
	(0, react.useImperativeHandle)(ref, () => ({
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
	if (error) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: `aqc-charts-container ${className || ""}`,
		style: containerStyle,
		...restProps,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			ref: containerRef,
			style: {
				width: "100%",
				height: "100%"
			}
		}), (chartLoading || loading) && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
const PieChart = (0, react.forwardRef)(({ width = "100%", height = 400, className, style, data, nameField = "name", valueField = "value", theme = "light", colorPalette, backgroundColor, title, subtitle, titlePosition = "center", radius = 75, startAngle = 90, roseType = false, showLabels = true, labelPosition = "outside", showValues = false, showPercentages = true, labelFormat, legend, tooltip, selectedMode = false, emphasis = true, loading = false, disabled: _disabled = false, animate = true, animationDuration, onChartReady, onDataPointClick, onDataPointHover, customOption, responsive: _responsive = true,...restProps }, ref) => {
	const chartOption = (0, react.useMemo)(() => {
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
	const chartEvents = (0, react.useMemo)(() => {
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
	(0, react.useImperativeHandle)(ref, () => ({
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
	if (error) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: `aqc-charts-container ${className || ""}`,
		style: containerStyle,
		...restProps,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			ref: containerRef,
			style: {
				width: "100%",
				height: "100%"
			}
		}), (chartLoading || loading) && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
const ScatterChart = (0, react.forwardRef)(({ width = "100%", height = 400, className, style, data, xField = "x", yField = "y", sizeField, colorField, seriesField, series, theme = "light", colorPalette, backgroundColor, title, subtitle, titlePosition = "center", pointSize = 10, pointShape = "circle", pointOpacity = .8, xAxis, yAxis, legend, tooltip, showTrendline = false, trendlineType = "linear", loading = false, disabled: _disabled = false, animate = true, animationDuration, onChartReady, onDataPointClick, onDataPointHover, customOption, responsive: _responsive = true,...restProps }, ref) => {
	const chartOption = (0, react.useMemo)(() => {
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
	const chartEvents = (0, react.useMemo)(() => {
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
	(0, react.useImperativeHandle)(ref, () => ({
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
	if (error) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: `aqc-charts-container ${className || ""}`,
		style: containerStyle,
		...restProps,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			ref: containerRef,
			style: {
				width: "100%",
				height: "100%"
			}
		}), (chartLoading || loading) && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
const ClusterChart = (0, react.forwardRef)(({ width = "100%", height = 400, className, style, data, xField = "x", yField = "y", nameField, clusterCount = 6, clusterMethod = "kmeans", theme = "light", colorPalette, backgroundColor, title, subtitle, titlePosition = "center", pointSize = 15, pointOpacity = .8, showClusterCenters = false, centerSymbol = "diamond", centerSize = 20, clusterColors, showVisualMap = true, visualMapPosition = "left", xAxis, yAxis, legend, tooltip, loading = false, disabled: _disabled = false, animate = true, animationDuration, onChartReady, onDataPointClick, onDataPointHover, customOption, responsive: _responsive = true,...restProps }, ref) => {
	const dataKey = (0, react.useMemo)(() => JSON.stringify(data), [data]);
	const chartOption = (0, react.useMemo)(() => {
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
	const chartEvents = (0, react.useMemo)(() => {
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
	(0, react.useImperativeHandle)(ref, () => ({
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
	if (error) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: `aqc-charts-container ${className || ""}`,
		style: containerStyle,
		...restProps,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			ref: containerRef,
			style: {
				width: "100%",
				height: "100%"
			}
		}), (chartLoading || loading) && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
		})]
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
const CalendarHeatmapChart = (0, react.forwardRef)(({ width = "100%", height = 400, className, style, data, dateField = "date", valueField = "value", theme = "light", colorPalette, backgroundColor, title, subtitle, titlePosition = "center", year, range, startOfWeek = "sunday", cellSize, colorScale, showWeekLabel = true, showMonthLabel = true, showYearLabel = true, valueFormat, showValues = false, cellBorderColor, cellBorderWidth, splitNumber, orient = "horizontal", monthGap, yearGap, legend, tooltip, loading = false, disabled: _disabled = false, animate = true, animationDuration, onChartReady, onDataPointClick, onDataPointHover, customOption, responsive: _responsive = true,...restProps }, ref) => {
	const chartOption = (0, react.useMemo)(() => {
		return buildCalendarHeatmapOption({
			data: data || [],
			dateField,
			valueField,
			theme,
			colorPalette,
			backgroundColor,
			title,
			subtitle,
			titlePosition,
			year,
			range,
			startOfWeek,
			cellSize,
			colorScale,
			showWeekLabel,
			showMonthLabel,
			showYearLabel,
			valueFormat,
			showValues,
			cellBorderColor,
			cellBorderWidth,
			splitNumber,
			orient,
			monthGap,
			yearGap,
			legend,
			tooltip,
			animate,
			animationDuration,
			customOption
		});
	}, [
		data,
		dateField,
		valueField,
		theme,
		colorPalette,
		backgroundColor,
		title,
		subtitle,
		titlePosition,
		year,
		range,
		startOfWeek,
		cellSize,
		colorScale,
		showWeekLabel,
		showMonthLabel,
		showYearLabel,
		valueFormat,
		showValues,
		cellBorderColor,
		cellBorderWidth,
		splitNumber,
		orient,
		monthGap,
		yearGap,
		legend,
		tooltip,
		animate,
		animationDuration,
		customOption
	]);
	const chartEvents = (0, react.useMemo)(() => {
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
		const newOption = buildCalendarHeatmapOption({
			data: newData,
			dateField,
			valueField,
			theme,
			colorPalette,
			backgroundColor,
			title,
			subtitle,
			titlePosition,
			year,
			range,
			startOfWeek,
			cellSize,
			colorScale,
			showWeekLabel,
			showMonthLabel,
			showYearLabel,
			valueFormat,
			showValues,
			cellBorderColor,
			cellBorderWidth,
			splitNumber,
			orient,
			monthGap,
			yearGap,
			legend,
			tooltip,
			animate,
			animationDuration,
			customOption
		});
		chart.setOption(newOption);
	};
	(0, react.useImperativeHandle)(ref, () => ({
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
	if (error) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: `aqc-charts-container ${className || ""}`,
		style: containerStyle,
		...restProps,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			ref: containerRef,
			style: {
				width: "100%",
				height: "100%"
			}
		}), (chartLoading || loading) && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
		})]
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
* 
* @example
* // Highly customized sankey chart
* <SankeyChart
*   nodes={[
*     { name: 'Revenue', value: 1000 },
*     { name: 'Costs', value: 400 },
*     { name: 'Profit', value: 600 }
*   ]}
*   links={[
*     { source: 'Revenue', target: 'Costs', value: 400 },
*     { source: 'Revenue', target: 'Profit', value: 600 }
*   ]}
*   nodeColors={['#5470c6', '#91cc75', '#fac858']}
*   linkColors={['#ff6b6b', '#4ecdc4']}
*   linkOpacity={0.8}
*   linkCurveness={0.7}
*   showNodeValues
*   showLinkLabels
* />
*/
const SankeyChart = (0, react.forwardRef)(({ width = "100%", height = 400, className, style, data, sourceField = "source", targetField = "target", valueField = "value", nodeNameField, nodes, links, theme = "light", colorPalette, backgroundColor, title, subtitle, titlePosition = "center", layout = "none", orient = "horizontal", nodeAlign = "justify", nodeGap = 8, nodeWidth = 20, iterations = 32, nodeColors, showNodeValues = false, nodeLabels = true, nodeLabelPosition, linkColors, linkOpacity = .6, linkCurveness = .5, showLinkLabels = false, focusMode = "adjacency", blurScope, legend, tooltip, loading = false, disabled: _disabled = false, animate = true, animationDuration, onChartReady, onDataPointClick, onDataPointHover, customOption, responsive: _responsive = true,...restProps }, ref) => {
	const chartOption = (0, react.useMemo)(() => {
		return buildSankeyChartOption({
			data: data || void 0,
			sourceField,
			targetField,
			valueField,
			nodeNameField,
			nodes,
			links,
			theme,
			colorPalette,
			backgroundColor,
			title,
			subtitle,
			titlePosition,
			layout,
			orient,
			nodeAlign,
			nodeGap,
			nodeWidth,
			iterations,
			nodeColors,
			showNodeValues,
			nodeLabels,
			nodeLabelPosition,
			linkColors,
			linkOpacity,
			linkCurveness,
			showLinkLabels,
			focusMode,
			blurScope,
			legend,
			tooltip,
			animate,
			animationDuration,
			customOption
		});
	}, [
		data,
		sourceField,
		targetField,
		valueField,
		nodeNameField,
		nodes,
		links,
		theme,
		colorPalette,
		backgroundColor,
		title,
		subtitle,
		titlePosition,
		layout,
		orient,
		nodeAlign,
		nodeGap,
		nodeWidth,
		iterations,
		nodeColors,
		showNodeValues,
		nodeLabels,
		nodeLabelPosition,
		linkColors,
		linkOpacity,
		linkCurveness,
		showLinkLabels,
		focusMode,
		blurScope,
		legend,
		tooltip,
		animate,
		animationDuration,
		customOption
	]);
	const chartEvents = (0, react.useMemo)(() => {
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
	const focusNode = (nodeName) => {
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
	};
	const updateData = (newData) => {
		const chart = getEChartsInstance();
		if (!chart) return;
		const newOption = buildSankeyChartOption({
			data: newData,
			sourceField,
			targetField,
			valueField,
			nodeNameField,
			nodes,
			links,
			theme,
			colorPalette,
			backgroundColor,
			title,
			subtitle,
			titlePosition,
			layout,
			orient,
			nodeAlign,
			nodeGap,
			nodeWidth,
			iterations,
			nodeColors,
			showNodeValues,
			nodeLabels,
			nodeLabelPosition,
			linkColors,
			linkOpacity,
			linkCurveness,
			showLinkLabels,
			focusMode,
			blurScope,
			legend,
			tooltip,
			animate,
			animationDuration,
			customOption
		});
		chart.setOption(newOption);
	};
	(0, react.useImperativeHandle)(ref, () => ({
		getChart: getEChartsInstance,
		exportImage,
		resize,
		showLoading: () => showLoading(),
		hideLoading,
		highlight,
		clearHighlight,
		updateData,
		focusNode
	}), [
		getEChartsInstance,
		exportImage,
		resize,
		showLoading,
		hideLoading,
		highlight,
		clearHighlight,
		updateData,
		focusNode
	]);
	if (error) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: `aqc-charts-container ${className || ""}`,
		style: containerStyle,
		...restProps,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			ref: containerRef,
			style: {
				width: "100%",
				height: "100%"
			}
		}), (chartLoading || loading) && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
		})]
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
* 
* @example
* // Highly customized Gantt chart with status-based styling
* <GanttChart
*   tasks={projectTasks}
*   categories={departments}
*   title="Q1 Project Schedule"
*   theme="dark"
*   taskBarStyle={{
*     height: 0.8,
*     borderRadius: 6,
*     showProgress: true,
*     textStyle: { 
*       position: 'inside',
*       showDuration: true 
*     }
*   }}
*   categoryLabelStyle={{
*     width: 150,
*     shape: 'pill',
*     backgroundColor: '#2a2a2a',
*     textColor: '#ffffff'
*   }}
*   statusStyles={{
*     'completed': { backgroundColor: '#4CAF50' },
*     'in-progress': { backgroundColor: '#2196F3' },
*     'delayed': { backgroundColor: '#FF9800' }
*   }}
*   dataZoom={{ type: 'both' }}
*   sortBy="priority"
*   sortOrder="desc"
*   onTaskClick={(task) => console.log('Task clicked:', task)}
* />
*/
const GanttChart = (0, react.forwardRef)(({ width = "100%", height = 600, className, style, data, idField = "id", nameField = "name", categoryField = "category", startTimeField = "startTime", endTimeField = "endTime", colorField = "color", statusField = "status", priorityField = "priority", progressField = "progress", assigneeField = "assignee", tasks, categories, theme = "light", colorPalette, backgroundColor, title, subtitle, titlePosition = "center", categoryWidth = 120, taskHeight = .6, categorySpacing = 2, groupSpacing = 8, taskBarStyle, statusStyles, priorityStyles, categoryLabelStyle, showCategoryLabels = true, categoryColors, timelineStyle, timeRange, timeFormat, dataZoom = true, allowPan = true, allowZoom = true, initialZoomLevel, draggable = false, resizable = false, selectable = false, showTaskTooltips = true, showDependencies = false, showMilestones = false, milestoneStyle, todayMarker = false, showProgress = false, showTaskProgress = true, progressStyle, groupByCategory = false, groupByAssignee = false, filterByStatus, filterByPriority, sortBy, sortOrder = "asc", legend, tooltip, loading = false, disabled: _disabled = false, animate = true, animationDuration, onChartReady, onDataPointClick, onDataPointHover, onTaskClick, onTaskDrag: _onTaskDrag, onTaskResize: _onTaskResize, onCategoryClick, onTimeRangeChange, customOption, responsive: _responsive = true,...restProps }, ref) => {
	const chartOption = (0, react.useMemo)(() => {
		return buildGanttChartOption({
			data: data || void 0,
			idField,
			nameField,
			categoryField,
			startTimeField,
			endTimeField,
			colorField,
			statusField,
			priorityField,
			progressField,
			assigneeField,
			tasks,
			categories,
			theme,
			colorPalette,
			backgroundColor,
			title,
			subtitle,
			titlePosition,
			categoryWidth,
			taskHeight,
			categorySpacing,
			groupSpacing,
			taskBarStyle,
			statusStyles,
			priorityStyles,
			categoryLabelStyle,
			showCategoryLabels,
			categoryColors,
			timelineStyle,
			timeRange,
			timeFormat,
			dataZoom,
			allowPan,
			allowZoom,
			initialZoomLevel,
			draggable,
			resizable,
			selectable,
			showTaskTooltips,
			showDependencies,
			showMilestones,
			milestoneStyle,
			todayMarker,
			showProgress,
			showTaskProgress,
			progressStyle,
			groupByCategory,
			groupByAssignee,
			filterByStatus,
			filterByPriority,
			sortBy,
			sortOrder,
			legend,
			tooltip,
			animate,
			animationDuration,
			customOption
		});
	}, [
		data,
		idField,
		nameField,
		categoryField,
		startTimeField,
		endTimeField,
		colorField,
		statusField,
		priorityField,
		progressField,
		assigneeField,
		tasks,
		categories,
		theme,
		colorPalette,
		backgroundColor,
		title,
		subtitle,
		titlePosition,
		categoryWidth,
		taskHeight,
		categorySpacing,
		groupSpacing,
		taskBarStyle,
		statusStyles,
		priorityStyles,
		categoryLabelStyle,
		showCategoryLabels,
		categoryColors,
		timelineStyle,
		timeRange,
		timeFormat,
		dataZoom,
		allowPan,
		allowZoom,
		initialZoomLevel,
		draggable,
		resizable,
		selectable,
		showTaskTooltips,
		showDependencies,
		showMilestones,
		milestoneStyle,
		todayMarker,
		showProgress,
		showTaskProgress,
		progressStyle,
		groupByCategory,
		groupByAssignee,
		filterByStatus,
		filterByPriority,
		sortBy,
		sortOrder,
		legend,
		tooltip,
		animate,
		animationDuration,
		customOption
	]);
	const chartEvents = (0, react.useMemo)(() => {
		const events = {};
		if (onDataPointClick || onTaskClick) events.click = (params, chart) => {
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
		if (onDataPointHover) events.mouseover = (params, chart) => {
			onDataPointHover(params, {
				chart,
				event: params
			});
		};
		return Object.keys(events).length > 0 ? events : void 0;
	}, [
		onDataPointClick,
		onDataPointHover,
		onTaskClick,
		onCategoryClick
	]);
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
	const highlight = (taskId) => {
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
	};
	const clearHighlight = () => {
		const chart = getEChartsInstance();
		if (!chart) return;
		chart.dispatchAction({ type: "downplay" });
	};
	const zoomToRange = (startTime, endTime) => {
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
	};
	const focusTask = (taskId) => {
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
			highlight(taskId);
		}
	};
	const updateData = (newData) => {
		const chart = getEChartsInstance();
		if (!chart) return;
		const newOption = buildGanttChartOption({
			data: newData,
			idField,
			nameField,
			categoryField,
			startTimeField,
			endTimeField,
			colorField,
			statusField,
			priorityField,
			progressField,
			assigneeField,
			tasks,
			categories,
			theme,
			colorPalette,
			backgroundColor,
			title,
			subtitle,
			titlePosition,
			categoryWidth,
			taskHeight,
			categorySpacing,
			groupSpacing,
			taskBarStyle,
			statusStyles,
			priorityStyles,
			categoryLabelStyle,
			showCategoryLabels,
			categoryColors,
			timelineStyle,
			timeRange,
			timeFormat,
			dataZoom,
			allowPan,
			allowZoom,
			initialZoomLevel,
			draggable,
			resizable,
			selectable,
			showTaskTooltips,
			showDependencies,
			showMilestones,
			milestoneStyle,
			todayMarker,
			showProgress,
			showTaskProgress,
			progressStyle,
			groupByCategory,
			groupByAssignee,
			filterByStatus,
			filterByPriority,
			sortBy,
			sortOrder,
			legend,
			tooltip,
			animate,
			animationDuration,
			customOption
		});
		chart.setOption(newOption);
	};
	(0, react.useImperativeHandle)(ref, () => ({
		getChart: getEChartsInstance,
		exportImage,
		resize,
		showLoading: () => showLoading(),
		hideLoading,
		highlight: (dataIndex) => highlight(String(dataIndex)),
		clearHighlight,
		updateData,
		focusTask,
		zoomToRange,
		highlightTask: highlight
	}), [
		getEChartsInstance,
		exportImage,
		resize,
		showLoading,
		hideLoading,
		highlight,
		clearHighlight,
		updateData,
		focusTask,
		zoomToRange
	]);
	if (error) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: `aqc-charts-container ${className || ""}`,
		style: containerStyle,
		...restProps,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			ref: containerRef,
			style: {
				width: "100%",
				height: "100%"
			}
		}), (chartLoading || loading) && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
		})]
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
const RegressionChart = (0, react.forwardRef)(({ width = "100%", height = 400, className, style, data, xField = "x", yField = "y", method = "linear", order = 2, theme = "light", colorPalette, backgroundColor, title, subtitle, titlePosition = "center", pointSize = 8, pointShape = "circle", pointOpacity = .7, showPoints = true, lineWidth = 2, lineStyle = "solid", lineColor, lineOpacity = 1, showLine = true, showEquation = false, equationPosition = "top-right", showRSquared = true, equationFormatter, xAxis, yAxis, legend, tooltip, pointsLabel = "Data Points", regressionLabel = "Regression Line", loading = false, disabled: _disabled = false, animate = true, animationDuration, onChartReady, onDataPointClick, onDataPointHover, customOption, responsive: _responsive = true,...restProps }, ref) => {
	const chartOption = (0, react.useMemo)(() => {
		return buildRegressionChartOption({
			data: data || [],
			xField,
			yField,
			method,
			order,
			theme,
			colorPalette,
			backgroundColor,
			title,
			subtitle,
			titlePosition,
			pointSize,
			pointShape,
			pointOpacity,
			showPoints,
			lineWidth,
			lineStyle,
			lineColor,
			lineOpacity,
			showLine,
			showEquation,
			equationPosition,
			showRSquared,
			equationFormatter,
			xAxis: xAxis || void 0,
			yAxis: yAxis || void 0,
			legend,
			tooltip,
			pointsLabel,
			regressionLabel,
			animate,
			animationDuration,
			customOption
		});
	}, [
		data,
		xField,
		yField,
		method,
		order,
		theme,
		colorPalette,
		backgroundColor,
		title,
		subtitle,
		titlePosition,
		pointSize,
		pointShape,
		pointOpacity,
		showPoints,
		lineWidth,
		lineStyle,
		lineColor,
		lineOpacity,
		showLine,
		showEquation,
		equationPosition,
		showRSquared,
		equationFormatter,
		xAxis,
		yAxis,
		legend,
		tooltip,
		pointsLabel,
		regressionLabel,
		animate,
		animationDuration,
		customOption
	]);
	const chartEvents = (0, react.useMemo)(() => {
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
		const newOption = buildRegressionChartOption({
			data: newData,
			xField,
			yField,
			method,
			order,
			theme,
			colorPalette,
			backgroundColor,
			title,
			subtitle,
			titlePosition,
			pointSize,
			pointShape,
			pointOpacity,
			showPoints,
			lineWidth,
			lineStyle,
			lineColor,
			lineOpacity,
			showLine,
			showEquation,
			equationPosition,
			showRSquared,
			equationFormatter,
			xAxis: xAxis || void 0,
			yAxis: yAxis || void 0,
			legend,
			tooltip,
			pointsLabel,
			regressionLabel,
			animate,
			animationDuration,
			customOption
		});
		chart.setOption(newOption);
	};
	(0, react.useImperativeHandle)(ref, () => ({
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
	if (error) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: `aqc-charts-container ${className || ""}`,
		style: containerStyle,
		...restProps,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			ref: containerRef,
			style: {
				width: "100%",
				height: "100%"
			}
		}), (chartLoading || loading) && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
		})]
	});
});
RegressionChart.displayName = "RegressionChart";

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
			case ChartErrorCode.ECHARTS_LOAD_FAILED: return "🌐";
			case ChartErrorCode.INVALID_DATA_FORMAT:
			case ChartErrorCode.EMPTY_DATA: return "📊";
			case ChartErrorCode.CHART_RENDER_FAILED: return "🎨";
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
		const chartError = isChartError(error) ? error : createChartError(error, ChartErrorCode.UNKNOWN_ERROR);
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
		const chartError = isChartError(error$1) ? error$1 : createChartError(error$1, ChartErrorCode.UNKNOWN_ERROR);
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
exports.BaseChart = BaseChart;
exports.CalendarHeatmapChart = CalendarHeatmapChart;
exports.ChartError = ChartError;
exports.ChartErrorBoundary = ChartErrorBoundary;
exports.ChartErrorCode = ChartErrorCode;
exports.ChartInitError = ChartInitError;
exports.ChartRenderError = ChartRenderError;
exports.ClusterChart = ClusterChart;
exports.DataValidationError = DataValidationError;
exports.EChartsLoadError = EChartsLoadError;
exports.GanttChart = GanttChart;
exports.LineChart = LineChart;
exports.OldBarChart = OldBarChart;
exports.OldCalendarHeatmapChart = OldCalendarHeatmapChart;
exports.OldClusterChart = OldClusterChart;
exports.OldGanttChart = OldGanttChart;
exports.OldLineChart = OldLineChart;
exports.OldPieChart = OldPieChart;
exports.OldRegressionChart = OldRegressionChart;
exports.OldSankeyChart = OldSankeyChart;
exports.OldScatterChart = OldScatterChart;
exports.OldStackedBarChart = OldStackedBarChart;
exports.PieChart = PieChart;
exports.RegressionChart = RegressionChart;
exports.SankeyChart = SankeyChart;
exports.ScatterChart = ScatterChart;
exports.TransformError = TransformError;
exports.assertValidation = assertValidation;
exports.clusterPointsToScatterData = clusterPointsToScatterData;
exports.createChartError = createChartError;
exports.darkTheme = darkTheme;
exports.extractPoints = extractPoints;
exports.isChartError = isChartError;
exports.isRecoverableError = isRecoverableError;
exports.lightTheme = lightTheme;
exports.performKMeansClustering = performKMeansClustering;
exports.safeAsync = safeAsync;
exports.safeSync = safeSync;
exports.useChartErrorHandler = useChartErrorHandler;
exports.useChartEvents = useChartEvents;
exports.useChartInstance = useChartInstance;
exports.useChartOptions = useChartOptions;
exports.useChartResize = useChartResize;
exports.useECharts = useECharts;
exports.validateChartData = validateChartData;
exports.validateChartProps = validateChartProps;
exports.validateDimensions = validateDimensions;
exports.validateFieldMapping = validateFieldMapping;
exports.validateInDevelopment = validateInDevelopment;
exports.validateTheme = validateTheme;
exports.withChartErrorBoundary = withChartErrorBoundary;