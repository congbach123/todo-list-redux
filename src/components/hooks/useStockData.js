// src/hooks/useStockData.js
import { useState, useEffect, useCallback } from 'react';
import { fetchStockData } from '@services/stockService';

export const useStockData = (initialSymbol = 'AAPL', days = 30) => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStock, setSelectedStock] = useState(initialSymbol);

  // Calculate current value and change
  const getCurrentValue = useCallback(() => {
    if (stockData.length === 0) return { value: 0, change: 0, percentage: 0 };

    const current = stockData[stockData.length - 1].value;
    const previous = stockData.length > 1 ? stockData[stockData.length - 2].value : current;
    const change = current - previous;
    const percentage = previous !== 0 ? (change / previous) * 100 : 0;

    return { value: current, change, percentage };
  }, [stockData]);

  // Fetch data function
  const loadStockData = useCallback(
    async (symbol) => {
      setLoading(true);
      setError(null);

      const { data, error: apiError } = await fetchStockData(symbol, days);

      if (apiError) {
        setError(apiError);
        setStockData([]);
      } else {
        setStockData(data);
        setError(null);
      }

      setLoading(false);
    },
    [days]
  );

  // Effect to load data when symbol changes
  useEffect(() => {
    loadStockData(selectedStock);
  }, [selectedStock, loadStockData]);

  // Function to change selected stock
  const changeStock = useCallback((newSymbol) => {
    setSelectedStock(newSymbol);
  }, []);

  // Function to refresh current data
  const refreshData = useCallback(() => {
    loadStockData(selectedStock);
  }, [selectedStock, loadStockData]);

  const currentValue = getCurrentValue();

  return {
    // Data
    stockData,
    selectedStock,
    currentValue,

    // State
    loading,
    error,

    // Actions
    changeStock,
    refreshData,

    // Computed
    lastUpdated: stockData.length > 0 ? stockData[stockData.length - 1].date : null,
    hasData: stockData.length > 0,
  };
};
