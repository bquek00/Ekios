'use client'

import React, { useState, useEffect } from 'react'
import NavBar from "./Navbar"
import { createClient } from '@/utils/supabase/client'
import axios from 'axios'
import TradeForm from './TradeForm'

export default function Home() {
  const supabase = createClient()
  const [symbols, setSymbols] = useState([])
  const [user, setUser] = useState(null)
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavBar symbols={symbols} />
      <div className="p-4 flex-1 overflow-auto grid grid-rows-2">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-xl font-bold mb-2">Stock Chart</h2>
            {/* Stock chart content goes here */}
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
