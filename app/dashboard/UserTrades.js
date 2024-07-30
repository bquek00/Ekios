import { Table } from "flowbite-react"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import _ from "lodash"

export const UserTrades = ({user}) => {
    const supabase = createClient();
    const [userTrades, setUserTrades] = useState([])

    console.log("user trades", userTrades)

    useEffect(() => {
        if (user) {
            // console.log(user)
            // console.log(selectedStock)
            supabase
                .from('trades')
                .select('time, price, quantity, orders!inner(symbol, orderType, tradeType)')
                .eq('orders.uid', user.id)
                .then(data => setUserTrades(_.orderBy(data.data, ['time'], ['desc'])))
            
            const channel = supabase
                .channel("user-trades")
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'trades' }, async (payload) => {
                    console.log('Change received!', payload.new)
                    const {error, data} = await supabase
                        .from('orders')
                        .select('uid, symbol, orderType, tradeType')
                        .eq('id', payload.new.order_id)
                    if (data[0].uid == user.id)
                        setUserTrades(list => list.concat({orders: data[0], ...payload.new}))
                })
                .subscribe()
            return () => supabase.removeChannel(channel)
        }
    }, [user])

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
                <Table.Body className="divide-y overflow-y-scroll">
                    {
                        userTrades.map(trade => 
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