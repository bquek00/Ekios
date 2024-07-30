"use client"

import React, { useState, useEffect, useContext } from 'react'
import NavBar from "./Navbar"
import { createClient } from '@/utils/supabase/client'
import axios from 'axios'
import TradeForm from './TradeForm'
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import Select from 'react-select'
import { StockContext } from '@/contexts/selectedStockContext'
import { OpenOrders } from './OpenOrders'
import { Trades } from './Trades'

export default function Home() {
  const supabase = createClient()
  const [symbols, setSymbols] = useState([])
  const [user, setUser] = useState(null)

  const [historicalData, setHistoricalData] = useState([]);
  const [searchSymbol, setSearchSymbol] = useState('TSLA');
  const [currentSymbol, setCurrentSymbol] = useState('TSLA');
  const { selectedStock, selectValidStock } = useContext(StockContext)


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

  useEffect(() => {
    // Define the authentication listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(event, session);

      if (event === 'INITIAL_SESSION') {
        try {
          // Fetch stock list when user signs in
          const response = await axios('/api/stock-list').then((res) => res.data);
          console.log('Stock list:', response);
          setSymbols(response);
          const { data: { user } } = await supabase.auth.getUser()
          setUser(user)
          console.log("user", user)
        } catch (error) {
          console.error('Error fetching stock list:', error);
        }
      } else if (event === 'SIGNED_OUT') {
        setSymbols([]);
        setUser(null)
      }
    });

    // Clean up the listener on component unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

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
      <div className="px-4 pt-4">
        <div className="bg-white p-4 flex justify-between">
          <h2 className="text-xl font-bold">{selectedStock.toUpperCase()}</h2>
          <Select 
            className="w-200" 
            options={symbols.map(symbol => ({label: symbol.toUpperCase(), value: symbol}))} 
            onChange={({value}) => {selectValidStock(symbols, value)}} 
          />
        </div>
      </div>
      <div className="p-4 flex-1 overflow-auto grid grid-rows-2">
        <div className="grid grid-cols-3 mb-4">
          <div className="bg-white p-4">
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
          <div className="bg-white p-4">
            <h2 className="text-xl font-bold mb-2">Open Orders</h2>
            <OpenOrders user={user} selectedStock={selectedStock} />
          </div>
          <div className="bg-white p-4">
            <h2 className="text-xl font-bold mb-2">Spot Trading</h2>
            <TradeForm user={user} />
          </div>
        </div>
        <div className="grid grid-cols-2 bg-white p-4">
          <div>
            <h2 className="text-xl font-bold mb-2">Trade History</h2>
            <Trades user={user} />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Market Trades</h2>
            {/* Traded orders list content goes here */}
          </div>
        </div>
      </div>
    </div>
  );
}
