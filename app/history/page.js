"use client"

import React, { useState, useEffect, useContext } from 'react'
import NavBar from "./Navbar"
import { createClient } from '@/utils/supabase/client'
import axios from 'axios'
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import Select from 'react-select'
import { StockContext } from '@/contexts/selectedStockContext'
import { OpenOrders } from './OpenOrders'
import { UserTrades } from './UserTrades'

export default function HistoryPage() {
  const supabase = createClient()
  const [user, setUser] = useState(null)

  useEffect(() => {
    axios('/api/stock-list').then((res) => res.data).then(response => {
        supabase.auth.getUser().then(({data}) => {
          setUser(data.user)
        })
      })
  }, []);


  return (
    <div className="h-screen bg-gray-100 overflow-hidden flex flex-col">
      <NavBar />
      <div className="p-4 overflow-auto">
        <div className="h-1/2 overflow-auto flex flex-col">
            <h2 className="text-2xl font-bold">Open Orders</h2>
            <div className="overflow-scroll">
                <OpenOrders user={user} />
            </div>
        </div>
        <div className="h-1/2 overflow-auto flex flex-col">
            <h2 className="text-2xl font-bold">Trades</h2>
            <div className="overflow-scroll">
                <UserTrades user={user} />
            </div>
        </div>
      </div>
    </div>
  );
}
