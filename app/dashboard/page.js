'use client'

import React from 'react'
import NavBar from "./Navbar"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="p-4">
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
            <h2 className="text-xl font-bold mb-2">Buy/Sell Orders</h2>
            {/* Buy/Sell orders content goes here */}
          </div>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl font-bold mb-2">Traded Orders</h2>
          {/* Traded orders list content goes here */}
        </div>
      </div>
    </div>
  );
}
