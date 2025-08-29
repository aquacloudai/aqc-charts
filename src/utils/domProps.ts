// Utility to filter out chart-specific props that shouldn't be passed to DOM elements
export const filterDOMProps = (props: Record<string, any>): Record<string, any> => {
  const {
    // Common chart props that shouldn't be passed to DOM
    data,
    series,
    seriesField,
    categoryField,
    valueField,
    xField,
    yField,
    nameField,
    sizeField,
    colorField,
    seriesConfig,
    theme,
    colorPalette,
    backgroundColor,
    title,
    subtitle,
    titlePosition,
    logo,
    smooth,
    strokeWidth,
    strokeStyle,
    showPoints,
    pointSize,
    pointShape,
    showArea,
    areaOpacity,
    areaGradient,
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
    customOption,
    responsive,
    maintainAspectRatio,
    onChartReady,
    onDataPointClick,
    onDataPointHover,
    zoom,
    pan,
    brush,
    radius,
    startAngle,
    roseType,
    labelPosition,
    showValues,
    showPercentages,
    labelFormat,
    selectedMode,
    emphasis,
    pointOpacity,
    showTrendline,
    trendlineType,
    stacked,
    opacity,
    disabled,
    // Add any other chart-specific props that might be passed
    grouped,
    // Filter out any other props that start with 'on' and aren't standard DOM events
    ...filteredProps
  } = props;

  // Keep only valid DOM props
  const domProps: Record<string, any> = {};
  Object.keys(filteredProps).forEach(key => {
    // Keep standard HTML attributes and data-* attributes
    if (
      key === 'id' ||
      key === 'className' ||
      key === 'style' ||
      key.startsWith('data-') ||
      key.startsWith('aria-') ||
      key === 'role' ||
      key === 'tabIndex' ||
      // Standard DOM events
      key === 'onClick' ||
      key === 'onMouseEnter' ||
      key === 'onMouseLeave' ||
      key === 'onFocus' ||
      key === 'onBlur' ||
      key === 'onKeyDown' ||
      key === 'onKeyUp' ||
      key === 'onKeyPress'
    ) {
      domProps[key] = filteredProps[key];
    }
  });

  return domProps;
};