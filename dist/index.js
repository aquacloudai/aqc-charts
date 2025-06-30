import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import * as echarts from "echarts";
import { jsx, jsxs } from "react/jsx-runtime";

//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function() {
	return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
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
//#region node_modules/echarts-stat/dist/ecStat.js
var require_ecStat = __commonJS({ "node_modules/echarts-stat/dist/ecStat.js"(exports, module) {
	(function webpackUniversalModuleDefinition(root, factory) {
		if (typeof exports === "object" && typeof module === "object") module.exports = factory();
		else if (typeof define === "function" && define.amd) define([], factory);
		else if (typeof exports === "object") exports["ecStat"] = factory();
		else root["ecStat"] = factory();
	})(void 0, function() {
		return function(modules) {
			var installedModules = {};
			function __webpack_require__(moduleId) {
				if (installedModules[moduleId]) return installedModules[moduleId].exports;
				var module$1 = installedModules[moduleId] = {
					exports: {},
					id: moduleId,
					loaded: false
				};
				modules[moduleId].call(module$1.exports, module$1, module$1.exports, __webpack_require__);
				module$1.loaded = true;
				return module$1.exports;
			}
			__webpack_require__.m = modules;
			__webpack_require__.c = installedModules;
			__webpack_require__.p = "";
			return __webpack_require__(0);
		}([
			function(module$1, exports$1, __webpack_require__) {
				var __WEBPACK_AMD_DEFINE_RESULT__;
				__WEBPACK_AMD_DEFINE_RESULT__ = function(require$1) {
					return {
						clustering: __webpack_require__(1),
						regression: __webpack_require__(5),
						statistics: __webpack_require__(6),
						histogram: __webpack_require__(15),
						transform: {
							regression: __webpack_require__(18),
							histogram: __webpack_require__(21),
							clustering: __webpack_require__(22)
						}
					};
				}.call(exports$1, __webpack_require__, exports$1, module$1), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module$1.exports = __WEBPACK_AMD_DEFINE_RESULT__);
			},
			function(module$1, exports$1, __webpack_require__) {
				var __WEBPACK_AMD_DEFINE_RESULT__;
				__WEBPACK_AMD_DEFINE_RESULT__ = function(require$1) {
					var dataProcess = __webpack_require__(2);
					var dataPreprocess = dataProcess.dataPreprocess;
					var normalizeDimensions = dataProcess.normalizeDimensions;
					var arrayUtil = __webpack_require__(3);
					var numberUtil = __webpack_require__(4);
					var arraySize = arrayUtil.size;
					var sumOfColumn = arrayUtil.sumOfColumn;
					var arraySum = arrayUtil.sum;
					var zeros = arrayUtil.zeros;
					var numberUtil = __webpack_require__(4);
					var isNumber = numberUtil.isNumber;
					var mathPow = Math.pow;
					var OutputType = {
						SINGLE: "single",
						MULTIPLE: "multiple"
					};
					/**
					* KMeans of clustering algorithm.
					* @param {Array.<Array.<number>>} data two-dimension array
					* @param {number} k the number of clusters in a dataset
					* @return {Object}
					*/
					function kMeans(data, k, dataMeta) {
						var clusterAssigned = zeros(data.length, 2);
						var centroids = createRandCent(k, calcExtents(data, dataMeta.dimensions));
						var clusterChanged = true;
						var minDist;
						var minIndex;
						var distIJ;
						var ptsInClust;
						while (clusterChanged) {
							clusterChanged = false;
							for (var i = 0; i < data.length; i++) {
								minDist = Infinity;
								minIndex = -1;
								for (var j = 0; j < k; j++) {
									distIJ = distEuclid(data[i], centroids[j], dataMeta);
									if (distIJ < minDist) {
										minDist = distIJ;
										minIndex = j;
									}
								}
								if (clusterAssigned[i][0] !== minIndex) clusterChanged = true;
								clusterAssigned[i][0] = minIndex;
								clusterAssigned[i][1] = minDist;
							}
							for (var i = 0; i < k; i++) {
								ptsInClust = [];
								for (var j = 0; j < clusterAssigned.length; j++) if (clusterAssigned[j][0] === i) ptsInClust.push(data[j]);
								centroids[i] = meanInColumns(ptsInClust, dataMeta);
							}
						}
						var clusterWithKmeans = {
							centroids,
							clusterAssigned
						};
						return clusterWithKmeans;
					}
					/**
					* Calculate the average of each column in a two-dimensional array
					* and returns the values as an array.
					*/
					function meanInColumns(dataList, dataMeta) {
						var meanArray = [];
						var sum;
						var mean;
						for (var j = 0; j < dataMeta.dimensions.length; j++) {
							var dimIdx = dataMeta.dimensions[j];
							sum = 0;
							for (var i = 0; i < dataList.length; i++) sum += dataList[i][dimIdx];
							mean = sum / dataList.length;
							meanArray.push(mean);
						}
						return meanArray;
					}
					/**
					* The combine of hierarchical clustering and k-means.
					* @param {Array} data two-dimension array.
					* @param {Object|number} [clusterCountOrConfig] config or clusterCountOrConfig.
					* @param {number} clusterCountOrConfig.clusterCount Mandatory.
					*        The number of clusters in a dataset. It has to be greater than 1.
					* @param {boolean} [clusterCountOrConfig.stepByStep=false] Optional.
					* @param {OutputType} [clusterCountOrConfig.outputType='multiple'] Optional.
					*        See `OutputType`.
					* @param {number} [clusterCountOrConfig.outputClusterIndexDimension] Mandatory.
					*        Only work in `OutputType.SINGLE`.
					* @param {number} [clusterCountOrConfig.outputCentroidDimensions] Optional.
					*        If specified, the centroid will be set to those dimensions of the result data one by one.
					*        By default not set centroid to result.
					*        Only work in `OutputType.SINGLE`.
					* @param {Array.<number>} [clusterCountOrConfig.dimensions] Optional.
					*        Target dimensions to calculate the regression.
					*        By default: use all of the data.
					* @return {Array} See `OutputType`.
					*/
					function hierarchicalKMeans(data, clusterCountOrConfig, stepByStep) {
						var config = (isNumber(clusterCountOrConfig) ? {
							clusterCount: clusterCountOrConfig,
							stepByStep
						} : clusterCountOrConfig) || { clusterCount: 2 };
						var k = config.clusterCount;
						if (k < 2) return;
						var dataMeta = parseDataMeta(data, config);
						var isOutputTypeSingle = dataMeta.outputType === OutputType.SINGLE;
						var dataSet = dataPreprocess(data, { dimensions: dataMeta.dimensions });
						var clusterAssment = zeros(dataSet.length, 2);
						var outputSingleData;
						var setClusterIndex;
						var getClusterIndex;
						function setDistance(dataIndex, dist$1) {
							clusterAssment[dataIndex][1] = dist$1;
						}
						function getDistance(dataIndex) {
							return clusterAssment[dataIndex][1];
						}
						if (isOutputTypeSingle) {
							outputSingleData = [];
							var outputClusterIndexDimension = dataMeta.outputClusterIndexDimension;
							setClusterIndex = function(dataIndex, clusterIndex) {
								outputSingleData[dataIndex][outputClusterIndexDimension] = clusterIndex;
							};
							getClusterIndex = function(dataIndex) {
								return outputSingleData[dataIndex][outputClusterIndexDimension];
							};
							for (var i = 0; i < dataSet.length; i++) {
								outputSingleData.push(dataSet[i].slice());
								setDistance(i, 0);
								setClusterIndex(i, 0);
							}
						} else {
							setClusterIndex = function(dataIndex, clusterIndex) {
								clusterAssment[dataIndex][0] = clusterIndex;
							};
							getClusterIndex = function(dataIndex) {
								return clusterAssment[dataIndex][0];
							};
						}
						var centroid0 = meanInColumns(dataSet, dataMeta);
						var centList = [centroid0];
						for (var i = 0; i < dataSet.length; i++) {
							var dist = distEuclid(dataSet[i], centroid0, dataMeta);
							setDistance(i, dist);
						}
						var lowestSSE;
						var ptsInClust;
						var ptsNotClust;
						var clusterInfo;
						var sseSplit;
						var sseNotSplit;
						var index = 1;
						var result = {
							data: outputSingleData,
							centroids: centList,
							isEnd: false
						};
						if (!isOutputTypeSingle) result.clusterAssment = clusterAssment;
						function oneStep() {
							if (index < k) {
								lowestSSE = Infinity;
								var centSplit;
								var newCentroid;
								var newClusterAss;
								for (var j = 0; j < centList.length; j++) {
									ptsInClust = [];
									ptsNotClust = [];
									for (var i$1 = 0; i$1 < dataSet.length; i$1++) if (getClusterIndex(i$1) === j) ptsInClust.push(dataSet[i$1]);
									else ptsNotClust.push(getDistance(i$1));
									clusterInfo = kMeans(ptsInClust, 2, dataMeta);
									sseSplit = sumOfColumn(clusterInfo.clusterAssigned, 1);
									sseNotSplit = arraySum(ptsNotClust);
									if (sseSplit + sseNotSplit < lowestSSE) {
										lowestSSE = sseNotSplit + sseSplit;
										centSplit = j;
										newCentroid = clusterInfo.centroids;
										newClusterAss = clusterInfo.clusterAssigned;
									}
								}
								for (var i$1 = 0; i$1 < newClusterAss.length; i$1++) if (newClusterAss[i$1][0] === 0) newClusterAss[i$1][0] = centSplit;
								else if (newClusterAss[i$1][0] === 1) newClusterAss[i$1][0] = centList.length;
								centList[centSplit] = newCentroid[0];
								centList.push(newCentroid[1]);
								for (var i$1 = 0, j = 0; i$1 < dataSet.length && j < newClusterAss.length; i$1++) if (getClusterIndex(i$1) === centSplit) {
									setClusterIndex(i$1, newClusterAss[j][0]);
									setDistance(i$1, newClusterAss[j++][1]);
								}
								var pointInClust = [];
								if (!isOutputTypeSingle) {
									for (var i$1 = 0; i$1 < centList.length; i$1++) {
										pointInClust[i$1] = [];
										for (var j = 0; j < dataSet.length; j++) if (getClusterIndex(j) === i$1) pointInClust[i$1].push(dataSet[j]);
									}
									result.pointsInCluster = pointInClust;
								}
								index++;
							} else result.isEnd = true;
						}
						if (!config.stepByStep) while (oneStep(), !result.isEnd);
						else result.next = function() {
							oneStep();
							setCentroidToResultData(result, dataMeta);
							return result;
						};
						setCentroidToResultData(result, dataMeta);
						return result;
					}
					function setCentroidToResultData(result, dataMeta) {
						var outputCentroidDimensions = dataMeta.outputCentroidDimensions;
						if (dataMeta.outputType !== OutputType.SINGLE || outputCentroidDimensions == null) return;
						var outputSingleData = result.data;
						var centroids = result.centroids;
						for (var i = 0; i < outputSingleData.length; i++) {
							var line = outputSingleData[i];
							var clusterIndex = line[dataMeta.outputClusterIndexDimension];
							var centroid = centroids[clusterIndex];
							var dimLen = Math.min(centroid.length, outputCentroidDimensions.length);
							for (var j = 0; j < dimLen; j++) line[outputCentroidDimensions[j]] = centroid[j];
						}
					}
					/**
					* Create random centroid of kmeans.
					*/
					function createRandCent(k, extents) {
						var centroids = zeros(k, extents.length);
						for (var j = 0; j < extents.length; j++) {
							var extentItem = extents[j];
							for (var i = 0; i < k; i++) centroids[i][j] = extentItem.min + extentItem.span * Math.random();
						}
						return centroids;
					}
					/**
					* Distance method for calculating similarity
					*/
					function distEuclid(dataItem, centroid, dataMeta) {
						var powerSum = 0;
						var dimensions = dataMeta.dimensions;
						var extents = dataMeta.rawExtents;
						for (var i = 0; i < dimensions.length; i++) {
							var span = extents[i].span;
							if (span) {
								var dimIdx = dimensions[i];
								var dist = (dataItem[dimIdx] - centroid[i]) / span;
								powerSum += mathPow(dist, 2);
							}
						}
						return powerSum;
					}
					function parseDataMeta(dataSet, config) {
						var size = arraySize(dataSet);
						if (size.length < 1) throw new Error("The input data of clustering should be two-dimension array.");
						var colCount = size[1];
						var defaultDimensions = [];
						for (var i = 0; i < colCount; i++) defaultDimensions.push(i);
						var dimensions = normalizeDimensions(config.dimensions, defaultDimensions);
						var outputType = config.outputType || OutputType.MULTIPLE;
						var outputClusterIndexDimension = config.outputClusterIndexDimension;
						if (outputType === OutputType.SINGLE && !numberUtil.isNumber(outputClusterIndexDimension)) throw new Error("outputClusterIndexDimension is required as a number.");
						var extents = calcExtents(dataSet, dimensions);
						return {
							dimensions,
							rawExtents: extents,
							outputType,
							outputClusterIndexDimension,
							outputCentroidDimensions: config.outputCentroidDimensions
						};
					}
					function calcExtents(dataSet, dimensions) {
						var extents = [];
						var dimLen = dimensions.length;
						for (var i = 0; i < dimLen; i++) extents.push({
							min: Infinity,
							max: -Infinity
						});
						for (var i = 0; i < dataSet.length; i++) {
							var line = dataSet[i];
							for (var j = 0; j < dimLen; j++) {
								var extentItem = extents[j];
								var val = line[dimensions[j]];
								extentItem.min > val && (extentItem.min = val);
								extentItem.max < val && (extentItem.max = val);
							}
						}
						for (var i = 0; i < dimLen; i++) extents[i].span = extents[i].max - extents[i].min;
						return extents;
					}
					return {
						OutputType,
						hierarchicalKMeans
					};
				}.call(exports$1, __webpack_require__, exports$1, module$1), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module$1.exports = __WEBPACK_AMD_DEFINE_RESULT__);
			},
			function(module$1, exports$1, __webpack_require__) {
				var __WEBPACK_AMD_DEFINE_RESULT__;
				__WEBPACK_AMD_DEFINE_RESULT__ = function(require$1) {
					var array = __webpack_require__(3);
					var isArray = array.isArray;
					var size = array.size;
					var number = __webpack_require__(4);
					var isNumber = number.isNumber;
					/**
					* @param  {Array.<number>|number} dimensions like `[2, 4]` or `4`
					* @param  {Array.<number>} [defaultDimensions=undefined] By default `undefined`.
					* @return {Array.<number>} number like `4` is normalized to `[4]`,
					*         `null`/`undefined` is normalized to `defaultDimensions`.
					*/
					function normalizeDimensions(dimensions, defaultDimensions) {
						return typeof dimensions === "number" ? [dimensions] : dimensions == null ? defaultDimensions : dimensions;
					}
					/**
					* Data preprocessing, filter the wrong data object.
					*  for example [12,] --- missing y value
					*              [,12] --- missing x value
					*              [12, b] --- incorrect y value
					*              ['a', 12] --- incorrect x value
					* @param  {Array.<Array>} data
					* @param  {Object?} [opt]
					* @param  {Array.<number>} [opt.dimensions] Optional. Like [2, 4],
					*         means that dimension index 2 and dimension index 4 need to be number.
					*         If null/undefined (by default), all dimensions need to be number.
					* @param  {boolean} [opt.toOneDimensionArray] Convert to one dimension array.
					*         Each value is from `opt.dimensions[0]` or dimension 0.
					* @return {Array.<Array.<number>>}
					*/
					function dataPreprocess(data, opt) {
						opt = opt || {};
						var dimensions = opt.dimensions;
						var numberDimensionMap = {};
						if (dimensions != null) for (var i = 0; i < dimensions.length; i++) numberDimensionMap[dimensions[i]] = true;
						var targetOneDim = opt.toOneDimensionArray ? dimensions ? dimensions[0] : 0 : null;
						function shouldBeNumberDimension(dimIdx) {
							return !dimensions || numberDimensionMap.hasOwnProperty(dimIdx);
						}
						if (!isArray(data)) throw new Error("Invalid data type, you should input an array");
						var predata = [];
						var arraySize = size(data);
						if (arraySize.length === 1) for (var i = 0; i < arraySize[0]; i++) {
							var item = data[i];
							if (isNumber(item)) predata.push(item);
						}
						else if (arraySize.length === 2) for (var i = 0; i < arraySize[0]; i++) {
							var isCorrect = true;
							var item = data[i];
							for (var j = 0; j < arraySize[1]; j++) if (shouldBeNumberDimension(j) && !isNumber(item[j])) isCorrect = false;
							if (isCorrect) predata.push(targetOneDim != null ? item[targetOneDim] : item);
						}
						return predata;
					}
					/**
					* @param {string|number} val
					* @return {number}
					*/
					function getPrecision(val) {
						var str = val.toString();
						var dotIndex = str.indexOf(".");
						return dotIndex < 0 ? 0 : str.length - 1 - dotIndex;
					}
					return {
						normalizeDimensions,
						dataPreprocess,
						getPrecision
					};
				}.call(exports$1, __webpack_require__, exports$1, module$1), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module$1.exports = __WEBPACK_AMD_DEFINE_RESULT__);
			},
			function(module$1, exports$1, __webpack_require__) {
				var __WEBPACK_AMD_DEFINE_RESULT__;
				__WEBPACK_AMD_DEFINE_RESULT__ = function(require$1) {
					var objToString = Object.prototype.toString;
					var arrayProto = Array.prototype;
					var nativeMap = arrayProto.map;
					/**
					* Get the size of a array
					* @param  {Array} data
					* @return {Array}
					*/
					function size(data) {
						var s = [];
						while (isArray(data)) {
							s.push(data.length);
							data = data[0];
						}
						return s;
					}
					/**
					* @param {*}  value
					* @return {boolean}
					*/
					function isArray(value) {
						return objToString.call(value) === "[object Array]";
					}
					/**
					* constructs a (m x n) array with all values 0
					* @param  {number} m  the row
					* @param  {number} n  the column
					* @return {Array}
					*/
					function zeros(m, n) {
						var zeroArray = [];
						for (var i = 0; i < m; i++) {
							zeroArray[i] = [];
							for (var j = 0; j < n; j++) zeroArray[i][j] = 0;
						}
						return zeroArray;
					}
					/**
					* Sums each element in the array.
					* Internal use, for performance considerations, to avoid
					* unnecessary judgments and calculations.
					* @param  {Array} vector
					* @return {number}
					*/
					function sum(vector) {
						var sum$1 = 0;
						for (var i = 0; i < vector.length; i++) sum$1 += vector[i];
						return sum$1;
					}
					/**
					* Computes the sum of the specified column elements in a two-dimensional array
					* @param  {Array.<Array>} dataList  two-dimensional array
					* @param  {number} n  the specified column, zero-based
					* @return {number}
					*/
					function sumOfColumn(dataList, n) {
						var sum$1 = 0;
						for (var i = 0; i < dataList.length; i++) sum$1 += dataList[i][n];
						return sum$1;
					}
					function ascending(a, b) {
						return a > b ? 1 : a < b ? -1 : a === b ? 0 : NaN;
					}
					/**
					* Binary search algorithm --- this bisector is specidfied to histogram, which every bin like that [a, b),
					* so the return value use to add 1.
					* @param  {Array.<number>} array
					* @param  {number} value
					* @param  {number} start
					* @param  {number} end
					* @return {number}
					*/
					function bisect(array, value, start, end) {
						if (start == null) start = 0;
						if (end == null) end = array.length;
						while (start < end) {
							var mid = Math.floor((start + end) / 2);
							var compare = ascending(array[mid], value);
							if (compare > 0) end = mid;
							else if (compare < 0) start = mid + 1;
							else return mid + 1;
						}
						return start;
					}
					/**
					* 数组映射
					* @memberOf module:zrender/core/util
					* @param {Array} obj
					* @param {Function} cb
					* @param {*} [context]
					* @return {Array}
					*/
					function map(obj, cb, context) {
						if (!(obj && cb)) return;
						if (obj.map && obj.map === nativeMap) return obj.map(cb, context);
						else {
							var result = [];
							for (var i = 0, len = obj.length; i < len; i++) result.push(cb.call(context, obj[i], i, obj));
							return result;
						}
					}
					return {
						size,
						isArray,
						zeros,
						sum,
						sumOfColumn,
						ascending,
						bisect,
						map
					};
				}.call(exports$1, __webpack_require__, exports$1, module$1), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module$1.exports = __WEBPACK_AMD_DEFINE_RESULT__);
			},
			function(module$1, exports$1, __webpack_require__) {
				var __WEBPACK_AMD_DEFINE_RESULT__;
				__WEBPACK_AMD_DEFINE_RESULT__ = function(require$1) {
					/**
					* Test whether value is a number.
					* @param  {*}  value
					* @return {boolean}
					*/
					function isNumber(value) {
						value = value === null ? NaN : +value;
						return typeof value === "number" && !isNaN(value);
					}
					/**
					* Test if a number is integer.
					* @param  {number}  value
					* @return {boolean}
					*/
					function isInteger(value) {
						return isFinite(value) && value === Math.round(value);
					}
					function quantityExponent(val) {
						if (val === 0) return 0;
						var exp = Math.floor(Math.log(val) / Math.LN10);
						if (val / Math.pow(10, exp) >= 10) exp++;
						return exp;
					}
					return {
						isNumber,
						isInteger,
						quantityExponent
					};
				}.call(exports$1, __webpack_require__, exports$1, module$1), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module$1.exports = __WEBPACK_AMD_DEFINE_RESULT__);
			},
			function(module$1, exports$1, __webpack_require__) {
				var __WEBPACK_AMD_DEFINE_RESULT__;
				__WEBPACK_AMD_DEFINE_RESULT__ = function(require$1) {
					var dataProcess = __webpack_require__(2);
					var dataPreprocess = dataProcess.dataPreprocess;
					var normalizeDimensions = dataProcess.normalizeDimensions;
					var regreMethods = {
						linear: function(predata, opt) {
							var xDimIdx = opt.dimensions[0];
							var yDimIdx = opt.dimensions[1];
							var sumX = 0;
							var sumY = 0;
							var sumXY = 0;
							var sumXX = 0;
							var len = predata.length;
							for (var i = 0; i < len; i++) {
								var rawItem = predata[i];
								sumX += rawItem[xDimIdx];
								sumY += rawItem[yDimIdx];
								sumXY += rawItem[xDimIdx] * rawItem[yDimIdx];
								sumXX += rawItem[xDimIdx] * rawItem[xDimIdx];
							}
							var gradient = (len * sumXY - sumX * sumY) / (len * sumXX - sumX * sumX);
							var intercept = sumY / len - gradient * sumX / len;
							var result = [];
							for (var j = 0; j < predata.length; j++) {
								var rawItem = predata[j];
								var resultItem = rawItem.slice();
								resultItem[xDimIdx] = rawItem[xDimIdx];
								resultItem[yDimIdx] = gradient * rawItem[xDimIdx] + intercept;
								result.push(resultItem);
							}
							var expression = "y = " + Math.round(gradient * 100) / 100 + "x + " + Math.round(intercept * 100) / 100;
							return {
								points: result,
								parameter: {
									gradient,
									intercept
								},
								expression
							};
						},
						linearThroughOrigin: function(predata, opt) {
							var xDimIdx = opt.dimensions[0];
							var yDimIdx = opt.dimensions[1];
							var sumXX = 0;
							var sumXY = 0;
							for (var i = 0; i < predata.length; i++) {
								var rawItem = predata[i];
								sumXX += rawItem[xDimIdx] * rawItem[xDimIdx];
								sumXY += rawItem[xDimIdx] * rawItem[yDimIdx];
							}
							var gradient = sumXY / sumXX;
							var result = [];
							for (var j = 0; j < predata.length; j++) {
								var rawItem = predata[j];
								var resultItem = rawItem.slice();
								resultItem[xDimIdx] = rawItem[xDimIdx];
								resultItem[yDimIdx] = rawItem[xDimIdx] * gradient;
								result.push(resultItem);
							}
							var expression = "y = " + Math.round(gradient * 100) / 100 + "x";
							return {
								points: result,
								parameter: { gradient },
								expression
							};
						},
						exponential: function(predata, opt) {
							var xDimIdx = opt.dimensions[0];
							var yDimIdx = opt.dimensions[1];
							var sumX = 0;
							var sumY = 0;
							var sumXXY = 0;
							var sumYlny = 0;
							var sumXYlny = 0;
							var sumXY = 0;
							for (var i = 0; i < predata.length; i++) {
								var rawItem = predata[i];
								sumX += rawItem[xDimIdx];
								sumY += rawItem[yDimIdx];
								sumXY += rawItem[xDimIdx] * rawItem[yDimIdx];
								sumXXY += rawItem[xDimIdx] * rawItem[xDimIdx] * rawItem[yDimIdx];
								sumYlny += rawItem[yDimIdx] * Math.log(rawItem[yDimIdx]);
								sumXYlny += rawItem[xDimIdx] * rawItem[yDimIdx] * Math.log(rawItem[yDimIdx]);
							}
							var denominator = sumY * sumXXY - sumXY * sumXY;
							var coefficient = Math.pow(Math.E, (sumXXY * sumYlny - sumXY * sumXYlny) / denominator);
							var index = (sumY * sumXYlny - sumXY * sumYlny) / denominator;
							var result = [];
							for (var j = 0; j < predata.length; j++) {
								var rawItem = predata[j];
								var resultItem = rawItem.slice();
								resultItem[xDimIdx] = rawItem[xDimIdx];
								resultItem[yDimIdx] = coefficient * Math.pow(Math.E, index * rawItem[xDimIdx]);
								result.push(resultItem);
							}
							var expression = "y = " + Math.round(coefficient * 100) / 100 + "e^(" + Math.round(index * 100) / 100 + "x)";
							return {
								points: result,
								parameter: {
									coefficient,
									index
								},
								expression
							};
						},
						logarithmic: function(predata, opt) {
							var xDimIdx = opt.dimensions[0];
							var yDimIdx = opt.dimensions[1];
							var sumlnx = 0;
							var sumYlnx = 0;
							var sumY = 0;
							var sumlnxlnx = 0;
							for (var i = 0; i < predata.length; i++) {
								var rawItem = predata[i];
								sumlnx += Math.log(rawItem[xDimIdx]);
								sumYlnx += rawItem[yDimIdx] * Math.log(rawItem[xDimIdx]);
								sumY += rawItem[yDimIdx];
								sumlnxlnx += Math.pow(Math.log(rawItem[xDimIdx]), 2);
							}
							var gradient = (i * sumYlnx - sumY * sumlnx) / (i * sumlnxlnx - sumlnx * sumlnx);
							var intercept = (sumY - gradient * sumlnx) / i;
							var result = [];
							for (var j = 0; j < predata.length; j++) {
								var rawItem = predata[j];
								var resultItem = rawItem.slice();
								resultItem[xDimIdx] = rawItem[xDimIdx];
								resultItem[yDimIdx] = gradient * Math.log(rawItem[xDimIdx]) + intercept;
								result.push(resultItem);
							}
							var expression = "y = " + Math.round(intercept * 100) / 100 + " + " + Math.round(gradient * 100) / 100 + "ln(x)";
							return {
								points: result,
								parameter: {
									gradient,
									intercept
								},
								expression
							};
						},
						polynomial: function(predata, opt) {
							var xDimIdx = opt.dimensions[0];
							var yDimIdx = opt.dimensions[1];
							var order = opt.order;
							if (order == null) order = 2;
							var coeMatrix = [];
							var lhs = [];
							var k = order + 1;
							for (var i = 0; i < k; i++) {
								var sumA = 0;
								for (var n = 0; n < predata.length; n++) {
									var rawItem = predata[n];
									sumA += rawItem[yDimIdx] * Math.pow(rawItem[xDimIdx], i);
								}
								lhs.push(sumA);
								var temp = [];
								for (var j = 0; j < k; j++) {
									var sumB = 0;
									for (var m = 0; m < predata.length; m++) sumB += Math.pow(predata[m][xDimIdx], i + j);
									temp.push(sumB);
								}
								coeMatrix.push(temp);
							}
							coeMatrix.push(lhs);
							var coeArray = gaussianElimination(coeMatrix, k);
							var result = [];
							for (var i = 0; i < predata.length; i++) {
								var value = 0;
								var rawItem = predata[i];
								for (var n = 0; n < coeArray.length; n++) value += coeArray[n] * Math.pow(rawItem[xDimIdx], n);
								var resultItem = rawItem.slice();
								resultItem[xDimIdx] = rawItem[xDimIdx];
								resultItem[yDimIdx] = value;
								result.push(resultItem);
							}
							var expression = "y = ";
							for (var i = coeArray.length - 1; i >= 0; i--) if (i > 1) expression += Math.round(coeArray[i] * Math.pow(10, i + 1)) / Math.pow(10, i + 1) + "x^" + i + " + ";
							else if (i === 1) expression += Math.round(coeArray[i] * 100) / 100 + "x + ";
							else expression += Math.round(coeArray[i] * 100) / 100;
							return {
								points: result,
								parameter: coeArray,
								expression
							};
						}
					};
					/**
					* Gaussian elimination
					* @param  {Array.<Array.<number>>} matrix   two-dimensional number array
					* @param  {number} number
					* @return {Array}
					*/
					function gaussianElimination(matrix, number) {
						for (var i = 0; i < matrix.length - 1; i++) {
							var maxColumn = i;
							for (var j = i + 1; j < matrix.length - 1; j++) if (Math.abs(matrix[i][j]) > Math.abs(matrix[i][maxColumn])) maxColumn = j;
							for (var k = i; k < matrix.length; k++) {
								var temp = matrix[k][i];
								matrix[k][i] = matrix[k][maxColumn];
								matrix[k][maxColumn] = temp;
							}
							for (var n = i + 1; n < matrix.length - 1; n++) for (var m = matrix.length - 1; m >= i; m--) matrix[m][n] -= matrix[m][i] / matrix[i][i] * matrix[i][n];
						}
						var data = new Array(number);
						var len = matrix.length - 1;
						for (var j = matrix.length - 2; j >= 0; j--) {
							var temp = 0;
							for (var i = j + 1; i < matrix.length - 1; i++) temp += matrix[i][j] * data[i];
							data[j] = (matrix[len][j] - temp) / matrix[j][j];
						}
						return data;
					}
					/**
					* @param  {string} regreMethod
					* @param  {Array.<Array.<number>>} data   two-dimensional number array
					* @param  {Object|number} [optOrOrder]  opt or order
					* @param  {number} [optOrOrder.order]  order of polynomials
					* @param  {Array.<number>|number} [optOrOrder.dimensions=[0, 1]]  Target dimensions to calculate the regression.
					*         By defualt: use [0, 1] as [x, y].
					* @return {Array}
					*/
					var regression = function(regreMethod, data, optOrOrder) {
						var opt = typeof optOrOrder === "number" ? { order: optOrOrder } : optOrOrder || {};
						var dimensions = normalizeDimensions(opt.dimensions, [0, 1]);
						var predata = dataPreprocess(data, { dimensions });
						var result = regreMethods[regreMethod](predata, {
							order: opt.order,
							dimensions
						});
						var xDimIdx = dimensions[0];
						result.points.sort(function(itemA, itemB) {
							return itemA[xDimIdx] - itemB[xDimIdx];
						});
						return result;
					};
					return regression;
				}.call(exports$1, __webpack_require__, exports$1, module$1), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module$1.exports = __WEBPACK_AMD_DEFINE_RESULT__);
			},
			function(module$1, exports$1, __webpack_require__) {
				var __WEBPACK_AMD_DEFINE_RESULT__;
				__WEBPACK_AMD_DEFINE_RESULT__ = function(require$1) {
					var statistics = {};
					statistics.max = __webpack_require__(7);
					statistics.deviation = __webpack_require__(8);
					statistics.mean = __webpack_require__(10);
					statistics.median = __webpack_require__(12);
					statistics.min = __webpack_require__(14);
					statistics.quantile = __webpack_require__(13);
					statistics.sampleVariance = __webpack_require__(9);
					statistics.sum = __webpack_require__(11);
					return statistics;
				}.call(exports$1, __webpack_require__, exports$1, module$1), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module$1.exports = __WEBPACK_AMD_DEFINE_RESULT__);
			},
			function(module$1, exports$1, __webpack_require__) {
				var __WEBPACK_AMD_DEFINE_RESULT__;
				__WEBPACK_AMD_DEFINE_RESULT__ = function(require$1) {
					var number = __webpack_require__(4);
					var isNumber = number.isNumber;
					/**
					* Is a method for computing the max value of a list of numbers,
					* which will filter other data types.
					* @param  {Array.<number>} data
					* @return {number}
					*/
					function max(data) {
						var maxData = -Infinity;
						for (var i = 0; i < data.length; i++) if (isNumber(data[i]) && data[i] > maxData) maxData = data[i];
						return maxData;
					}
					return max;
				}.call(exports$1, __webpack_require__, exports$1, module$1), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module$1.exports = __WEBPACK_AMD_DEFINE_RESULT__);
			},
			function(module$1, exports$1, __webpack_require__) {
				var __WEBPACK_AMD_DEFINE_RESULT__;
				__WEBPACK_AMD_DEFINE_RESULT__ = function(require$1) {
					var variance = __webpack_require__(9);
					/**
					* Computing the deviation
					* @param  {Array.<number>} data
					* @return {number}
					*/
					return function(data) {
						var squaredDeviation = variance(data);
						return squaredDeviation ? Math.sqrt(squaredDeviation) : squaredDeviation;
					};
				}.call(exports$1, __webpack_require__, exports$1, module$1), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module$1.exports = __WEBPACK_AMD_DEFINE_RESULT__);
			},
			function(module$1, exports$1, __webpack_require__) {
				var __WEBPACK_AMD_DEFINE_RESULT__;
				__WEBPACK_AMD_DEFINE_RESULT__ = function(require$1) {
					var number = __webpack_require__(4);
					var isNumber = number.isNumber;
					var mean = __webpack_require__(10);
					/**
					* Computing the variance of list of sample
					* @param  {Array.<number>} data
					* @return {number}
					*/
					function sampleVariance(data) {
						var len = data.length;
						if (!len || len < 2) return 0;
						if (data.length >= 2) {
							var meanValue = mean(data);
							var sum = 0;
							var temple;
							for (var i = 0; i < data.length; i++) if (isNumber(data[i])) {
								temple = data[i] - meanValue;
								sum += temple * temple;
							}
							return sum / (data.length - 1);
						}
					}
					return sampleVariance;
				}.call(exports$1, __webpack_require__, exports$1, module$1), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module$1.exports = __WEBPACK_AMD_DEFINE_RESULT__);
			},
			function(module$1, exports$1, __webpack_require__) {
				var __WEBPACK_AMD_DEFINE_RESULT__;
				__WEBPACK_AMD_DEFINE_RESULT__ = function(require$1) {
					var sum = __webpack_require__(11);
					/**
					* Is a method for computing the mean value of a list of numbers,
					* which will filter other data types.
					* @param  {Array.<number>} data
					* @return {number}
					*/
					function mean(data) {
						var len = data.length;
						if (!len) return 0;
						return sum(data) / data.length;
					}
					return mean;
				}.call(exports$1, __webpack_require__, exports$1, module$1), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module$1.exports = __WEBPACK_AMD_DEFINE_RESULT__);
			},
			function(module$1, exports$1, __webpack_require__) {
				var __WEBPACK_AMD_DEFINE_RESULT__;
				__WEBPACK_AMD_DEFINE_RESULT__ = function(require$1) {
					var number = __webpack_require__(4);
					var isNumber = number.isNumber;
					/**
					* Is a method for computing the sum of a list of numbers,
					* which will filter other data types.
					* @param  {Array.<number>} data
					* @return {number}
					*/
					function sum(data) {
						var len = data.length;
						if (!len) return 0;
						var sumData = 0;
						for (var i = 0; i < len; i++) if (isNumber(data[i])) sumData += data[i];
						return sumData;
					}
					return sum;
				}.call(exports$1, __webpack_require__, exports$1, module$1), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module$1.exports = __WEBPACK_AMD_DEFINE_RESULT__);
			},
			function(module$1, exports$1, __webpack_require__) {
				var __WEBPACK_AMD_DEFINE_RESULT__;
				__WEBPACK_AMD_DEFINE_RESULT__ = function(require$1) {
					var quantile = __webpack_require__(13);
					/**
					* Is a method for computing the median value of a sorted array of numbers
					* @param  {Array.<number>} data
					* @return {number}
					*/
					function median(data) {
						return quantile(data, .5);
					}
					return median;
				}.call(exports$1, __webpack_require__, exports$1, module$1), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module$1.exports = __WEBPACK_AMD_DEFINE_RESULT__);
			},
			function(module$1, exports$1, __webpack_require__) {
				var __WEBPACK_AMD_DEFINE_RESULT__;
				__WEBPACK_AMD_DEFINE_RESULT__ = function(require$1) {
					/**
					* Estimating quantiles from a sorted sample of numbers
					* @see https://en.wikipedia.org/wiki/Quantile#Estimating_quantiles_from_a_sample
					* R-7 method
					* @param  {Array.<number>} data  sorted array
					* @param  {number} p
					*/
					return function(data, p) {
						var len = data.length;
						if (!len) return 0;
						if (p <= 0 || len < 2) return data[0];
						if (p >= 1) return data[len - 1];
						var h = (len - 1) * p;
						var i = Math.floor(h);
						var a = data[i];
						var b = data[i + 1];
						return a + (b - a) * (h - i);
					};
				}.call(exports$1, __webpack_require__, exports$1, module$1), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module$1.exports = __WEBPACK_AMD_DEFINE_RESULT__);
			},
			function(module$1, exports$1, __webpack_require__) {
				var __WEBPACK_AMD_DEFINE_RESULT__;
				__WEBPACK_AMD_DEFINE_RESULT__ = function(require$1) {
					var number = __webpack_require__(4);
					var isNumber = number.isNumber;
					/**
					* Is a method for computing the min value of a list of numbers,
					* which will filter other data types.
					* @param  {Array.<number>} data
					* @return {number}
					*/
					function min(data) {
						var minData = Infinity;
						for (var i = 0; i < data.length; i++) if (isNumber(data[i]) && data[i] < minData) minData = data[i];
						return minData;
					}
					return min;
				}.call(exports$1, __webpack_require__, exports$1, module$1), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module$1.exports = __WEBPACK_AMD_DEFINE_RESULT__);
			},
			function(module$1, exports$1, __webpack_require__) {
				var __WEBPACK_AMD_DEFINE_RESULT__;
				__WEBPACK_AMD_DEFINE_RESULT__ = function(require$1) {
					var max = __webpack_require__(7);
					var min = __webpack_require__(14);
					var quantile = __webpack_require__(13);
					var deviation = __webpack_require__(8);
					var dataProcess = __webpack_require__(2);
					var dataPreprocess = dataProcess.dataPreprocess;
					var normalizeDimensions = dataProcess.normalizeDimensions;
					var array = __webpack_require__(3);
					var ascending = array.ascending;
					var map = array.map;
					var range = __webpack_require__(16);
					var bisect = array.bisect;
					var tickStep = __webpack_require__(17);
					/**
					* Compute bins for histogram
					* @param  {Array.<number>} data
					* @param  {Object|string} optOrMethod Optional settings or `method`.
					* @param  {Object|string} optOrMethod.method 'squareRoot' | 'scott' | 'freedmanDiaconis' | 'sturges'
					* @param  {Array.<number>|number} optOrMethod.dimensions If data is a 2-d array,
					*         which dimension will be used to calculate histogram.
					* @return {Object}
					*/
					function computeBins(data, optOrMethod) {
						var opt = typeof optOrMethod === "string" ? { method: optOrMethod } : optOrMethod || {};
						var threshold = opt.method == null ? thresholdMethod.squareRoot : thresholdMethod[opt.method];
						var dimensions = normalizeDimensions(opt.dimensions);
						var values = dataPreprocess(data, {
							dimensions,
							toOneDimensionArray: true
						});
						var maxValue = max(values);
						var minValue = min(values);
						var binsNumber = threshold(values, minValue, maxValue);
						var tickStepResult = tickStep(minValue, maxValue, binsNumber);
						var step = tickStepResult.step;
						var toFixedPrecision = tickStepResult.toFixedPrecision;
						var rangeArray = range(+(Math.ceil(minValue / step) * step).toFixed(toFixedPrecision), +(Math.floor(maxValue / step) * step).toFixed(toFixedPrecision), step, toFixedPrecision);
						var len = rangeArray.length;
						var bins = new Array(len + 1);
						for (var i = 0; i <= len; i++) {
							bins[i] = {};
							bins[i].sample = [];
							bins[i].x0 = i > 0 ? rangeArray[i - 1] : rangeArray[i] - minValue === step ? minValue : rangeArray[i] - step;
							bins[i].x1 = i < len ? rangeArray[i] : maxValue - rangeArray[i - 1] === step ? maxValue : rangeArray[i - 1] + step;
						}
						for (var i = 0; i < values.length; i++) if (minValue <= values[i] && values[i] <= maxValue) bins[bisect(rangeArray, values[i], 0, len)].sample.push(values[i]);
						var data = map(bins, function(bin) {
							return [
								+((bin.x0 + bin.x1) / 2).toFixed(toFixedPrecision),
								bin.sample.length,
								bin.x0,
								bin.x1,
								bin.x0 + " - " + bin.x1
							];
						});
						var customData = map(bins, function(bin) {
							return [
								bin.x0,
								bin.x1,
								bin.sample.length
							];
						});
						return {
							bins,
							data,
							customData
						};
					}
					/**
					* Four kinds of threshold methods used to
					* compute how much bins the histogram should be divided
					* @see  https://en.wikipedia.org/wiki/Histogram
					* @type {Object}
					*/
					var thresholdMethod = {
						squareRoot: function(data) {
							var bins = Math.ceil(Math.sqrt(data.length));
							return bins > 50 ? 50 : bins;
						},
						scott: function(data, min$1, max$1) {
							return Math.ceil((max$1 - min$1) / (3.5 * deviation(data) * Math.pow(data.length, -1 / 3)));
						},
						freedmanDiaconis: function(data, min$1, max$1) {
							data.sort(ascending);
							return Math.ceil((max$1 - min$1) / (2 * (quantile(data, .75) - quantile(data, .25)) * Math.pow(data.length, -1 / 3)));
						},
						sturges: function(data) {
							return Math.ceil(Math.log(data.length) / Math.LN2) + 1;
						}
					};
					return computeBins;
				}.call(exports$1, __webpack_require__, exports$1, module$1), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module$1.exports = __WEBPACK_AMD_DEFINE_RESULT__);
			},
			function(module$1, exports$1, __webpack_require__) {
				var __WEBPACK_AMD_DEFINE_RESULT__;
				__WEBPACK_AMD_DEFINE_RESULT__ = function(require$1) {
					var dataProcess = __webpack_require__(2);
					var getPrecision = dataProcess.getPrecision;
					/**
					* Computing range array.
					* Adding param precision to fix range value, avoiding range[i] = 0.7000000001.
					* @param  {number} start
					* @param  {number} end
					* @param  {number} step
					* @param  {number} precision
					* @return {Array.<number>}
					*/
					return function(start, end, step, precision) {
						var len = arguments.length;
						if (len < 2) {
							end = start;
							start = 0;
							step = 1;
						} else if (len < 3) step = 1;
						else if (len < 4) {
							step = +step;
							precision = getPrecision(step);
						} else precision = +precision;
						var n = Math.ceil(((end - start) / step).toFixed(precision));
						var range = new Array(n + 1);
						for (var i = 0; i < n + 1; i++) range[i] = +(start + i * step).toFixed(precision);
						return range;
					};
				}.call(exports$1, __webpack_require__, exports$1, module$1), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module$1.exports = __WEBPACK_AMD_DEFINE_RESULT__);
			},
			function(module$1, exports$1, __webpack_require__) {
				var __WEBPACK_AMD_DEFINE_RESULT__;
				__WEBPACK_AMD_DEFINE_RESULT__ = function(require$1) {
					var numberUtil = __webpack_require__(4);
					/**
					* Computing the length of step
					* @see  https://github.com/d3/d3-array/blob/master/src/ticks.js
					* @param {number} start
					* @param {number} stop
					* @param {number} count
					*/
					return function(start, stop, count) {
						var step0 = Math.abs(stop - start) / count;
						var precision = numberUtil.quantityExponent(step0);
						var step1 = Math.pow(10, precision);
						var error = step0 / step1;
						if (error >= Math.sqrt(50)) step1 *= 10;
						else if (error >= Math.sqrt(10)) step1 *= 5;
						else if (error >= Math.sqrt(2)) step1 *= 2;
						var toFixedPrecision = precision < 0 ? -precision : 0;
						var resultStep = +(stop >= start ? step1 : -step1).toFixed(toFixedPrecision);
						return {
							step: resultStep,
							toFixedPrecision
						};
					};
				}.call(exports$1, __webpack_require__, exports$1, module$1), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module$1.exports = __WEBPACK_AMD_DEFINE_RESULT__);
			},
			function(module$1, exports$1, __webpack_require__) {
				var __WEBPACK_AMD_DEFINE_RESULT__;
				__WEBPACK_AMD_DEFINE_RESULT__ = function(require$1) {
					var regression = __webpack_require__(5);
					var transformHelper = __webpack_require__(19);
					var FORMULA_DIMENSION = 2;
					return {
						type: "ecStat:regression",
						transform: function transform(params) {
							var upstream = params.upstream;
							var config = params.config || {};
							var method = config.method || "linear";
							var result = regression(method, upstream.cloneRawData(), {
								order: config.order,
								dimensions: transformHelper.normalizeExistingDimensions(params, config.dimensions)
							});
							var points = result.points;
							var formulaOn = config.formulaOn;
							if (formulaOn == null) formulaOn = "end";
							var dimensions;
							if (formulaOn !== "none") {
								for (var i = 0; i < points.length; i++) points[i][FORMULA_DIMENSION] = formulaOn === "start" && i === 0 || formulaOn === "all" || formulaOn === "end" && i === points.length - 1 ? result.expression : "";
								dimensions = upstream.cloneAllDimensionInfo();
								dimensions[FORMULA_DIMENSION] = {};
							}
							return [{
								dimensions,
								data: points
							}];
						}
					};
				}.call(exports$1, __webpack_require__, exports$1, module$1), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module$1.exports = __WEBPACK_AMD_DEFINE_RESULT__);
			},
			function(module$1, exports$1, __webpack_require__) {
				var __WEBPACK_AMD_DEFINE_RESULT__;
				__WEBPACK_AMD_DEFINE_RESULT__ = function(require$1) {
					var arrayUtil = __webpack_require__(3);
					var numberUtil = __webpack_require__(4);
					var objectUtil = __webpack_require__(20);
					/**
					* type DimensionLoose = DimensionIndex | DimensionName;
					* type DimensionIndex = number;
					* type DimensionName = string;
					*
					* @param {object} transformParams The parameter of echarts transfrom.
					* @param {DimensionLoose | DimensionLoose[]} dimensionsConfig
					* @return {DimensionIndex | DimensionIndex[]}
					*/
					function normalizeExistingDimensions(transformParams, dimensionsConfig) {
						if (dimensionsConfig == null) return;
						var upstream = transformParams.upstream;
						if (arrayUtil.isArray(dimensionsConfig)) {
							var result = [];
							for (var i = 0; i < dimensionsConfig.length; i++) {
								var dimInfo = upstream.getDimensionInfo(dimensionsConfig[i]);
								validateDimensionExists(dimInfo, dimensionsConfig[i]);
								result[i] = dimInfo.index;
							}
							return result;
						} else {
							var dimInfo = upstream.getDimensionInfo(dimensionsConfig);
							validateDimensionExists(dimInfo, dimensionsConfig);
							return dimInfo.index;
						}
						function validateDimensionExists(dimInfo$1, dimConfig) {
							if (!dimInfo$1) throw new Error("Can not find dimension by " + dimConfig);
						}
					}
					/**
					* @param {object} transformParams The parameter of echarts transfrom.
					* @param {(DimensionIndex | {name: DimensionName, index: DimensionIndex})[]} dimensionsConfig
					* @param {{name: DimensionName | DimensionName[], index: DimensionIndex | DimensionIndex[]}}
					*/
					function normalizeNewDimensions(dimensionsConfig) {
						if (arrayUtil.isArray(dimensionsConfig)) {
							var names = [];
							var indices = [];
							for (var i = 0; i < dimensionsConfig.length; i++) {
								var item = parseDimensionNewItem(dimensionsConfig[i]);
								names.push(item.name);
								indices.push(item.index);
							}
							return {
								name: names,
								index: indices
							};
						} else if (dimensionsConfig != null) return parseDimensionNewItem(dimensionsConfig);
						function parseDimensionNewItem(dimConfig) {
							if (numberUtil.isNumber(dimConfig)) return { index: dimConfig };
							else if (objectUtil.isObject(dimConfig) && numberUtil.isNumber(dimConfig.index)) return dimConfig;
							throw new Error("Illegle new dimensions config. Expect `{ name: string, index: number }`.");
						}
					}
					return {
						normalizeExistingDimensions,
						normalizeNewDimensions
					};
				}.call(exports$1, __webpack_require__, exports$1, module$1), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module$1.exports = __WEBPACK_AMD_DEFINE_RESULT__);
			},
			function(module$1, exports$1, __webpack_require__) {
				var __WEBPACK_AMD_DEFINE_RESULT__;
				__WEBPACK_AMD_DEFINE_RESULT__ = function(require$1) {
					function extend(target, source) {
						if (Object.assign) Object.assign(target, source);
						else for (var key in source) if (source.hasOwnProperty(key)) target[key] = source[key];
						return target;
					}
					function isObject(value) {
						const type = typeof value;
						return type === "function" || !!value && type === "object";
					}
					return {
						extend,
						isObject
					};
				}.call(exports$1, __webpack_require__, exports$1, module$1), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module$1.exports = __WEBPACK_AMD_DEFINE_RESULT__);
			},
			function(module$1, exports$1, __webpack_require__) {
				var __WEBPACK_AMD_DEFINE_RESULT__;
				__WEBPACK_AMD_DEFINE_RESULT__ = function(require$1) {
					var histogram = __webpack_require__(15);
					var transformHelper = __webpack_require__(19);
					return {
						type: "ecStat:histogram",
						transform: function transform(params) {
							var upstream = params.upstream;
							var config = params.config || {};
							var result = histogram(upstream.cloneRawData(), {
								method: config.method,
								dimensions: transformHelper.normalizeExistingDimensions(params, config.dimensions)
							});
							return [{
								dimensions: [
									"MeanOfV0V1",
									"VCount",
									"V0",
									"V1",
									"DisplayableName"
								],
								data: result.data
							}, { data: result.customData }];
						}
					};
				}.call(exports$1, __webpack_require__, exports$1, module$1), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module$1.exports = __WEBPACK_AMD_DEFINE_RESULT__);
			},
			function(module$1, exports$1, __webpack_require__) {
				var __WEBPACK_AMD_DEFINE_RESULT__;
				__WEBPACK_AMD_DEFINE_RESULT__ = function(require$1) {
					var clustering = __webpack_require__(1);
					var numberUtil = __webpack_require__(4);
					var transformHelper = __webpack_require__(19);
					var isNumber = numberUtil.isNumber;
					return {
						type: "ecStat:clustering",
						transform: function transform(params) {
							var upstream = params.upstream;
							var config = params.config || {};
							var clusterCount = config.clusterCount;
							if (!isNumber(clusterCount) || clusterCount <= 0) throw new Error("config param \"clusterCount\" need to be specified as an interger greater than 1.");
							if (clusterCount === 1) return [{}, { data: [] }];
							var outputClusterIndexDimension = transformHelper.normalizeNewDimensions(config.outputClusterIndexDimension);
							var outputCentroidDimensions = transformHelper.normalizeNewDimensions(config.outputCentroidDimensions);
							if (outputClusterIndexDimension == null) throw new Error("outputClusterIndexDimension is required as a number.");
							var result = clustering.hierarchicalKMeans(upstream.cloneRawData(), {
								clusterCount,
								stepByStep: false,
								dimensions: transformHelper.normalizeExistingDimensions(params, config.dimensions),
								outputType: clustering.OutputType.SINGLE,
								outputClusterIndexDimension: outputClusterIndexDimension.index,
								outputCentroidDimensions: (outputCentroidDimensions || {}).index
							});
							var sourceDimAll = upstream.cloneAllDimensionInfo();
							var resultDimsDef = [];
							for (var i = 0; i < sourceDimAll.length; i++) {
								var sourceDimItem = sourceDimAll[i];
								resultDimsDef.push(sourceDimItem.name);
							}
							resultDimsDef[outputClusterIndexDimension.index] = outputClusterIndexDimension.name;
							if (outputCentroidDimensions) {
								for (var i = 0; i < outputCentroidDimensions.index.length; i++) if (outputCentroidDimensions.name[i] != null) resultDimsDef[outputCentroidDimensions.index[i]] = outputCentroidDimensions.name[i];
							}
							return [{
								dimensions: resultDimsDef,
								data: result.data
							}, { data: result.centroids }];
						}
					};
				}.call(exports$1, __webpack_require__, exports$1, module$1), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module$1.exports = __WEBPACK_AMD_DEFINE_RESULT__);
			}
		]);
	});
} });

//#endregion
//#region node_modules/echarts-stat/index.js
var require_echarts_stat = __commonJS({ "node_modules/echarts-stat/index.js"(exports, module) {
	module.exports = require_ecStat();
} });

//#endregion
//#region src/hooks/useECharts.ts
var import_echarts_stat = __toESM(require_echarts_stat(), 1);
if (typeof window !== "undefined") try {
	const ecStatTransforms = import_echarts_stat.default.transform;
	if (ecStatTransforms) {
		if (ecStatTransforms.regression) {
			echarts.registerTransform(ecStatTransforms.regression);
			console.log("✓ Registered ecStat regression transform");
		}
		if (ecStatTransforms.clustering) {
			echarts.registerTransform(ecStatTransforms.clustering);
			console.log("✓ Registered ecStat clustering transform");
		}
		if (ecStatTransforms.histogram) {
			echarts.registerTransform(ecStatTransforms.histogram);
			console.log("✓ Registered ecStat histogram transform");
		}
	} else console.warn("ecStat.transform not found");
} catch (err) {
	console.warn("Failed to register ecStat transforms:", err);
}
const useECharts = (containerRef, option, theme = "light", opts = {}, notMerge = false, lazyUpdate = true) => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const chartRef = useRef(null);
	useEffect(() => {
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
	useEffect(() => {
		if (!chartRef.current || !option || loading) return;
		const timeoutId = setTimeout(() => {
			if (!chartRef.current) return;
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
		}, 0);
		return () => clearTimeout(timeoutId);
	}, [
		option,
		theme,
		notMerge,
		lazyUpdate,
		loading
	]);
	useEffect(() => {
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
const BaseChart = forwardRef(({ title, width = "100%", height = 400, theme = "light", loading: externalLoading = false, notMerge = false, lazyUpdate = true, onChartReady, onClick, onDoubleClick, onMouseOver, onMouseOut, onDataZoom, onBrush, className = "", style = {}, option, renderer = "canvas", locale = "en",...restProps }, ref) => {
	const echartsContainerRef = useRef(null);
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
	const { chart, loading: chartLoading, error, refresh } = useECharts(echartsContainerRef, chartOption, theme, {
		renderer,
		locale
	}, notMerge, lazyUpdate);
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
		getEChartsInstance: () => chart,
		refresh
	}), [chart, refresh]);
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
			children: ["Error: ", error]
		})
	});
	return /* @__PURE__ */ jsxs("div", {
		className: `aqc-charts-container ${className}`,
		style: containerStyle,
		...restProps,
		children: [/* @__PURE__ */ jsx("div", {
			ref: echartsContainerRef,
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
//#region src/components/LineChart.tsx
const LineChart = forwardRef(({ data, smooth = false, area = false, stack = false, symbol = true, symbolSize = 4, connectNulls = false, title, option: customOption, series: customSeries,...props }, ref) => {
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
LineChart.displayName = "LineChart";

//#endregion
//#region src/components/BarChart.tsx
const BarChart = forwardRef(({ data, horizontal = false, stack = false, showValues = false, barWidth, barMaxWidth, showLegend = true, legend, tooltip, xAxis, yAxis, grid, series: customSeries,...props }, ref) => {
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
BarChart.displayName = "BarChart";

//#endregion
//#region src/components/PieChart.tsx
const PieChart = forwardRef(({ data, radius = ["40%", "70%"], center = ["50%", "50%"], roseType = false, showLabels = true, showLegend = true, legend, series: customSeries,...props }, ref) => {
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
PieChart.displayName = "PieChart";

//#endregion
//#region src/components/CalendarHeatmapChart.tsx
const CalendarHeatmapChart = forwardRef(({ data, year, calendar = {}, visualMap = {}, tooltipFormatter, title,...props }, ref) => {
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
CalendarHeatmapChart.displayName = "CalendarHeatmapChart";

//#endregion
//#region src/components/StackedBarChart.tsx
const StackedBarChart = forwardRef(({ data, horizontal = false, showPercentage = false, showValues = false, barWidth = "60%", barMaxWidth, stackName = "total", grid, legendSelectable = true, title,...props }, ref) => {
	const chartOption = useMemo(() => {
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
	return /* @__PURE__ */ jsx(BaseChart, {
		ref,
		option: chartOption,
		...props
	});
});
StackedBarChart.displayName = "StackedBarChart";

//#endregion
//#region src/components/SankeyChart.tsx
const SankeyChart = forwardRef(({ data, layout = "none", orient = "horizontal", nodeAlign = "justify", nodeGap = 8, nodeWidth = 20, iterations = 32, title, option: customOption,...props }, ref) => {
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
SankeyChart.displayName = "SankeyChart";

//#endregion
//#region src/components/ScatterChart.tsx
const ScatterChart = forwardRef(({ data, symbolSize = 10, symbol = "circle", large = false, largeThreshold = 2e3, progressive = 400, progressiveThreshold = 3e3, enableAdvancedFeatures = false, title, option: customOption, series: customSeries,...props }, ref) => {
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
ScatterChart.displayName = "ScatterChart";

//#endregion
//#region src/components/ClusterChart.tsx
const DEFAULT_COLORS = [
	"#37A2DA",
	"#e06343",
	"#37a354",
	"#b55dba",
	"#b5bd48",
	"#8378EA",
	"#96BFFF"
];
const ClusterChart = forwardRef(({ data, clusterCount = 6, outputClusterIndexDimension = 2, colors = DEFAULT_COLORS, symbolSize = 15, itemStyle = { borderColor: "#555" }, visualMapPosition = "left", gridLeft = 120, title, option: customOption,...props }, ref) => {
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
ClusterChart.displayName = "ClusterChart";

//#endregion
//#region src/components/RegressionChart.tsx
const RegressionChart = forwardRef(({ data, method = "linear", formulaOn = "end", scatterName = "scatter", lineName = "regression", scatterColor = "#5470c6", lineColor = "#91cc75", symbolSize = 8, showFormula = true, formulaFontSize = 16, formulaPosition = { dx: -20 }, splitLineStyle = "dashed", legendPosition = "bottom", title, option: customOption,...props }, ref) => {
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
RegressionChart.displayName = "RegressionChart";

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
export { BarChart, BaseChart, CalendarHeatmapChart, ClusterChart, LineChart, PieChart, RegressionChart, SankeyChart, ScatterChart, StackedBarChart, clusterPointsToScatterData, darkTheme, extractPoints, lightTheme, performKMeansClustering, useECharts };