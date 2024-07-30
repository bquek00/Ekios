import { Table } from "flowbite-react"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import _ from "lodash"

export const Trades = ({user}) => {
    const supabase = createClient();
    const [trades, setTrades] = useState([])

    console.log("trades", trades)

    useEffect(() => {
        if (user) {
            // console.log(user)
            // console.log(selectedStock)
            supabase
                .from('trades')
                .select('time, price, quantity, orders!inner(symbol, orderType, tradeType)')
                .eq('orders.uid', user.id)
                .then(data => setTrades(_.orderBy(data.data, ['time'], ['asc'])))
            
            const channel = supabase
                .channel("trades")
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, async (payload) => {
                    console.log('Change received!', payload)
                    const {error, data} = await supabase
                        .from('orders')
                        .select('symbol, orderType, tradeType')
                        .eq('id', payload.id)
                    setTrades(list => list.concat({...data, ...payload}))
                })
                .subscribe()
            return () => supabase.removeChannel(channel)
        }
    }, [user])

    return (
        <div className="overflow-y-scroll">
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
                        trades.map(trade => 
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