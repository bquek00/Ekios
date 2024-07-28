'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <nav className="bg-white py-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="text-white font-bold text-lg">
            <Image
                  src="/images/ekios.png"
                  width={100}
                  height={100}
                  alt="echios"
            />
          </div>

          {/* Login Button */}
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => {router.push('/login')}}
          >
            Login
          </button>
        </div>
      </nav>

      {/* Poster Section */}
      <div 
        className="bg-gray-900 text-white flex-1 flex items-center"
        style={{
          backgroundImage: `url('/images/background.jpg')`, backgroundSize: "cover"
        }}
      >
        <div className="container mx-auto flex">
          <div className="w-1/2">
            <h1 className="text-4xl font-bold mb-4">Changing the world</h1>
            <p className="text-lg mb-8">
              Empowering Investors with Effortless Stock Insights.
            </p>
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => {router.push('/login')}}
            >
              Try it out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}