import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useStockData } from '../hooks/useStockData';
import { getAvailableStocks, formatCurrency } from '@services/stockService';

const FinancialChartCard = () => {
  const { stockData, selectedStock, currentValue, loading, error, changeStock, refreshData, lastUpdated, hasData } = useStockData('AAPL', 30);

  const availableStocks = getAvailableStocks();
  const { value, change, percentage } = currentValue;

  const handleStockChange = (e) => {
    changeStock(e.target.value);
  };

  return (
    <div className="bg-gradient-to-r from-green-400 to-teal-500 rounded-xl shadow-lg overflow-hidden">
      <div className="p-5 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Financial Chart</h2>
          <div className="flex gap-2 items-center">
            <select
              value={selectedStock}
              onChange={handleStockChange}
              disabled={loading}
              className="bg-white bg-opacity-20 text-white rounded px-2 py-1 text-sm disabled:opacity-50">
              {availableStocks.map((stock) => (
                <option
                  key={stock.symbol}
                  className="text-black"
                  value={stock.symbol}>
                  {stock.name} ({stock.symbol})
                </option>
              ))}
            </select>
            <button
              onClick={refreshData}
              disabled={loading}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded text-sm disabled:opacity-50"
              title="Refresh data">
              ↻
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="animate-pulse h-6 bg-white bg-opacity-10 rounded w-1/3"></div>
            <div className="animate-pulse h-64 bg-white bg-opacity-10 rounded"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500 bg-opacity-20 border border-red-400 p-4 rounded">
            <p className="text-center text-red-100">{error}</p>
            <button
              onClick={refreshData}
              className="mt-2 w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm">
              Try Again
            </button>
          </div>
        ) : hasData ? (
          <>
            <div className="mb-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{formatCurrency(value)}</h3>
                <p className={`text-sm ${change >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                  {change >= 0 ? '▲' : '▼'} {formatCurrency(Math.abs(change))} ({percentage.toFixed(2)}%)
                </p>
              </div>
              <div className="text-sm text-right">
                <p>Last updated:</p>
                <p className="font-mono">{lastUpdated || 'N/A'}</p>
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
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      borderColor: '#111',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'white' }}
                    formatter={(value, name) => [formatCurrency(value), 'Close Price']}
                    labelFormatter={(date) => `Date: ${date}`}
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
        ) : (
          <div className="bg-yellow-500 bg-opacity-20 border border-yellow-400 p-4 rounded">
            <p className="text-center text-yellow-100">No data available for {selectedStock}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialChartCard;
