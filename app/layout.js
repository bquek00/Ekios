'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { useState } from "react"
import { StockContext } from '@/contexts/selectedStockContext'

const inter = Inter({ subsets: ['latin'] })

// export const metadata = {
//   title: 'Ekios',
//   description: 'Simplified trading platform for investors',
// }

export default function RootLayout({
  children,
}) {
  const [selectedStock, setSelectedStock] = useState('')
  // const [stockList, setStockList] = useState([])

  const selectValidStock = (stockList, stock) => {
    if (stockList.includes(stock)) {
      setSelectedStock(stock)
    }
  }

  return (
    <html lang="en">
      <head>
        <title>Ekios</title>
      </head>
      <meta name="description" content="Simplified trading platform for investors"></meta>
      <StockContext.Provider value={{selectedStock, selectValidStock}}>
        <body className={inter.className}>{children}</body>
      </StockContext.Provider>
    </html>
  )
}
