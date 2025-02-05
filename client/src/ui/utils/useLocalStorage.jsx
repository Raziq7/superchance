import { useState, useEffect } from 'react';

/**
 * Custom hook for managing localStorage with React state.
 * @param {string} key - The key in localStorage to use.
 * @param {*} initialValue - The initial value to use if the key is not in localStorage.
 * @returns {[any, Function]} - Returns the current value and a function to update it.
 */
function useLocalStorage(key, initialValue) {
  // Get the initial value from localStorage or use the provided initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage key", key, error);
      return initialValue;
    }
  });

  // Update localStorage whenever the storedValue changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error("Error writing to localStorage key", key, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
