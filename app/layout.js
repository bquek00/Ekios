'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { useState, useContext, createContext } from "react"

const inter = Inter({ subsets: ['latin'] })
const StockContext = createContext();

// export const metadata = {
//   title: 'Ekios',
//   description: 'Simplified trading platform for investors',
// }

export default function RootLayout({
  children,
}) {
  // const [selectedStock, setSelectedStock] = useState('')
  // const [stockList, setStockList] = useState([])

  // const selectValidStock = () => {
  //   if 
  // }

  return (
    <html lang="en">
      <head>
        <title>Ekios</title>
      </head>
      <meta name="description" content="Simplified trading platform for investors"></meta>
      <StockContext.Provider value={1}>
        <body className={inter.className}>{children}</body>
      </StockContext.Provider>
    </html>
  )
}
