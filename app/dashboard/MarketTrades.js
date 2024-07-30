import { Table } from "flowbite-react"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import _ from "lodash"

export const MarketTrades = () => {
    const supabase = createClient();
    const [marketTrades, setMarketTrades] = useState([])
    
    console.log("market trades", marketTrades)
    
    useEffect(() => {
        supabase
            .from('trades')
            .select('time, price, quantity, orders!inner(symbol, orderType, tradeType)')
            .then(data => setMarketTrades(_.orderBy(data.data, ['time'], ['desc'])))
        
        const channel = supabase
            .channel("market-trades")
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'trades' }, async (payload) => {
                console.log('Change received!', payload.new)
                const {error, data} = await supabase
                    .from('orders')
                    .select('symbol, orderType, tradeType')
                    .eq('id', payload.new.order_id)
                console.log("matched order data:", data)
                setMarketTrades(list => list.concat({orders: data[0], ...payload.new}))
            })
            .subscribe()
        return () => supabase.removeChannel(channel)
    }, [])

    return (
        <div>
            <Table>
                <Table.Head>
                    <Table.HeadCell>Symbol</Table.HeadCell>
                    <Table.HeadCell>Type</Table.HeadCell>
                    <Table.HeadCell>Side</Table.HeadCell>
                    <Table.HeadCell>Price</Table.HeadCell>
                    <Table.HeadCell>Quantity</Table.HeadCell>
                    <Table.HeadCell>Time</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {
                        marketTrades.map(trade => 
                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell>{trade.orders.symbol.toUpperCase()}</Table.Cell>
                                <Table.Cell>{trade.orders.tradeType}</Table.Cell>
                                <Table.Cell>{trade.orders.orderType}</Table.Cell>
                                <Table.Cell>{trade.price}</Table.Cell>
                                <Table.Cell>{trade.quantity}</Table.Cell>
                                <Table.Cell>{trade.time}</Table.Cell>
                            </Table.Row>
                        )
                    }
                </Table.Body>
            </Table>
        </div>
    )
}