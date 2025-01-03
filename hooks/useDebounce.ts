import React from "react";

export function useDebounce<T>(value: T, delay = 700) {
    const [debounceValue, setDebounceValue] = React.useState<T>(value);
  
    React.useEffect(() => {
      const timeout = setTimeout(() => {
        setDebounceValue(value);
      }, delay);
  
      return () => clearTimeout(timeout);
    }, [value, delay]);
  
    return debounceValue
  }
  