// Utility to filter out chart-specific props that shouldn't be passed to DOM elements
export const filterDOMProps = (props: Record<string, any>): Record<string, any> => {
  const domProps: Record<string, any> = {};
  
  // Only keep standard HTML attributes and DOM event handlers
  Object.keys(props).forEach(key => {
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
      domProps[key] = props[key];
    }
  });

  return domProps;
};