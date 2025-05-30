// src/services/stockService.js
import axios from 'axios';

const API_KEY = 'WWNOYSAIGB19ES9Y';
const BASE_URL = 'https://www.alphavantage.co/query';

// Helper function to create consistent response format
const createResponse = (data = null, error = null) => ({ data, error });

// Helper function for better error messages
const getErrorMessage = (err) => {
  if (err.response) {
    return `API Error: ${err.response.status} ${err.response.statusText}`;
  } else if (err.request) {
    return 'Network Error: No response from financial service. Check your connection.';
  } else {
    return 'Error: Could not fetch financial data';
  }
};

// Transform raw API data to our format
const transformStockData = (rawData, days = 30) => {
  const timeSeries = rawData['Time Series (Daily)'];
  if (!timeSeries) return [];

  return Object.entries(timeSeries)
    .slice(0, days)
    .map(([date, values]) => ({
      date,
      value: parseFloat(values['4. close']),
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      volume: parseInt(values['5. volume']),
    }))
    .reverse(); // Most recent first
};

// Main API function
export const fetchStockData = async (symbol, days = 30, retries = 1) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol,
        apikey: API_KEY,
      },
      timeout: 10000, // 10 second timeout
    });

    const data = response.data;

    // Handle API limit reached
    if (data.Information) {
      return createResponse(null, 'API call frequency limit reached. Please try again later.');
    }

    // Handle invalid symbol or other API errors
    if (data.Note) {
      return createResponse(null, 'API limit reached. Please wait a moment and try again.');
    }

    // Handle missing data
    if (!data['Time Series (Daily)']) {
      return createResponse(null, `No data found for symbol: ${symbol}`);
    }

    // Transform and return successful data
    const transformedData = transformStockData(data, days);
    return createResponse(transformedData);
  } catch (error) {
    console.error('Stock API Error:', error);

    // Retry logic
    if (retries > 0 && !error.response) {
      console.log(`Retrying... attempts left: ${retries}`);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
      return fetchStockData(symbol, days, retries - 1);
    }

    return createResponse(null, getErrorMessage(error));
  }
};

// Get available stock symbols (you can expand this)
export const getAvailableStocks = () => [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'NFLX', name: 'Netflix Inc.' },
];

// Utility function to format currency
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
};
