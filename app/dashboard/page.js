"use client"

import React, { useState, useEffect } from 'react';
import NavBar from "./NavBar";
import { createClient } from '@/utils/supabase/client';
import TradeForm from './TradeForm';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';

const Home = () => {
  const supabase = createClient();
  const [symbols, setSymbols] = useState([]);
  const [user, setUser] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [searchSymbol, setSearchSymbol] = useState('TSLA');
  const [currentSymbol, setCurrentSymbol] = useState('TSLA');

  const fetchHistoricalData = async (symbol) => {
    try {
      const response = await fetch(`/api/stocks?symbol=${symbol}`);
      const data = await response.json();
      console.log("Fetched data:", data);
      const historicalResponse = data.historicalData;
      setHistoricalData(historicalResponse);

      const symbolsResponse = [...new Set(historicalResponse.map(data => data.symbol))];
      setSymbols(symbolsResponse);

      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      console.log("User data:", user);
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };

  useEffect(() => {
    fetchHistoricalData(currentSymbol);

    // Simulate user authentication
    const simulateUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      console.log("Simulated User data:", user);
    };
    simulateUser();
  }, [currentSymbol]);

  useEffect(() => {
    console.log("Historical Data:", historicalData);
  }, [historicalData]);

  const handleSearchChange = (event) => {
    setSearchSymbol(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setCurrentSymbol(searchSymbol);
  };

  const chartData = {
    labels: historicalData.map(data => new Date(data.date).toISOString()),
    datasets: [
      {
        label: `${currentSymbol} Close Price`,
        data: historicalData.map(data => data.close),
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
      },
      y: {
        beginAtZero: false,
      },
    },
    events: [], // Disable all interactions with the chart
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavBar symbols={symbols} />
      <div className="p-4 flex-1 overflow-auto grid grid-rows-2">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-xl font-bold mb-2">Stock Chart</h2>
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <input
                type="text"
                value={searchSymbol}
                onChange={handleSearchChange}
                className="p-2 border rounded w-full"
                placeholder="Enter stock symbol (e.g., TSLA)"
              />
              <button type="submit" className="mt-2 p-2 bg-blue-500 text-white rounded">
                Search
              </button>
            </form>
            {historicalData.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <p>Loading chart...</p>
            )}
          </div>
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-xl font-bold mb-2">Open Orders</h2>
            {/* Open orders list content goes here */}
          </div>
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-xl font-bold mb-2">Spot Trading</h2>
            <TradeForm user={user} />
          </div>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl font-bold mb-2 h-full">Traded Orders</h2>
          {/* Traded orders list content goes here */}
        </div>
      </div>
    </div>
  );
}

export default Home;
