import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FinancialChartCard = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStock, setSelectedStock] = useState('AAPL');

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);

        const apiKey = 'WWNOYSAIGB19ES9Y';

        const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${selectedStock}&apikey=${apiKey}`);

        const data = response.data;

        // check data exists
        if (data['Time Series (Daily)']) {
          // Process the data
          const processedData = Object.entries(data['Time Series (Daily)'])
            .slice(0, 30) // Get the last 30 days
            .map(([date, values]) => ({
              date,
              value: parseFloat(values['4. close']),
            }))
            .reverse();

          setStockData(processedData);
          setError(null);
        } else if (data.Information) {
          // API limit reached
          setError('API call frequency limit reached. Please try again later.');
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (err) {
        console.error('Error fetching stock data:', err);

        if (err.response) {
          setError(`Failed to fetch data: ${err.response.status} ${err.response.statusText}`);
        } else if (err.request) {
          setError('No response from financial service. Check your connection.');
        } else {
          setError('Could not fetch financial data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [selectedStock]);

  const handleStockChange = (e) => {
    setSelectedStock(e.target.value);
  };

  // Format number
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Calculate current value and change
  const getCurrentValue = () => {
    if (stockData.length === 0) return { value: 0, change: 0, percentage: 0 };

    const current = stockData[stockData.length - 1].value;
    const previous = stockData.length > 1 ? stockData[stockData.length - 2].value : current;
    const change = current - previous;
    const percentage = (change / previous) * 100;

    return { value: current, change, percentage };
  };

  const { value, change, percentage } = getCurrentValue();

  return (
    <div className="bg-gradient-to-r from-green-400 to-teal-500 rounded-xl shadow-lg overflow-hidden">
      <div className="p-5 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Financial Chart</h2>
          <select
            value={selectedStock}
            onChange={handleStockChange}
            className="bg-white bg-opacity-20 text-white rounded px-2 py-1 text-sm">
            <option
              className="text-black"
              value="AAPL">
              Apple (AAPL)
            </option>
            <option
              className="text-black"
              value="MSFT">
              Microsoft (MSFT)
            </option>
            <option
              className="text-black"
              value="GOOGL">
              Google (GOOGL)
            </option>
            <option
              className="text-black"
              value="AMZN">
              Amazon (AMZN)
            </option>
            <option
              className="text-black"
              value="META">
              Meta (META)
            </option>
          </select>
        </div>

        {loading ? (
          <div className="animate-pulse h-64 bg-white bg-opacity-10 rounded"></div>
        ) : error ? (
          <div className="bg-white bg-opacity-20 p-4 rounded">
            <p className="text-center">{error}</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{formatCurrency(value)}</h3>
                <p className={`text-sm ${change >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                  {change >= 0 ? '▲' : '▼'} {formatCurrency(Math.abs(change))} ({percentage.toFixed(2)}%)
                </p>
              </div>
              <div className="text-sm">
                <p>Last updated: {stockData.length > 0 ? stockData[stockData.length - 1].date : 'N/A'}</p>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer
                width="100%"
                height="100%">
                <LineChart
                  data={stockData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255, 255, 255, 0.2)"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: 'white', fontSize: 10 }}
                    tickFormatter={(value) => value.substring(5)} // Show only month-day
                  />
                  <YAxis
                    tick={{ fill: 'white', fontSize: 10 }}
                    domain={['dataMin - 5', 'dataMax + 5']}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', borderColor: '#111' }}
                    labelStyle={{ color: 'white' }}
                    formatter={(value) => [formatCurrency(value), 'Price']}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#ffffff"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, fill: '#FFF', stroke: '#0F0' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FinancialChartCard;
