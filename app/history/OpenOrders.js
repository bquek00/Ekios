import { Table } from "flowbite-react"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import _ from "lodash"

export const OpenOrders = ({user}) => {
    const supabase = createClient();
    const [openOrders, setOpenOrders] = useState([])

    console.log("open orders", openOrders)

    useEffect(() => {
        if (user) {
            supabase
                .from('orders')
                .select('tradeType, orderType, price, quantity, time')
                .eq('uid', user.id)
                .eq('status', 'open')
                .then(data => setOpenOrders(_.orderBy(data.data, ['time'], ['desc'])))

            console.log("@trace")
            
            const channel = supabase
                .channel("orders")
                .on('postgres_changes', { event: '*', schema: '*', table: 'orders' }, payload => {
                    console.log('Change received!', payload.new)
                    supabase
                        .from('orders')
                        .select('tradeType, orderType, price, quantity, time')
                        .eq('uid', user.id)
                        .eq('status', 'open')
                        .then(data => setOpenOrders(_.orderBy(data.data, ['time'], ['desc'])))
                })
                .subscribe()
            return () => supabase.removeChannel(channel)
        }
    }, [user])

    return (
        <div className="overflow-y-scroll">
            <Table>
                <Table.Head>
                    <Table.HeadCell>Type</Table.HeadCell>
                    <Table.HeadCell>Side</Table.HeadCell>
                    <Table.HeadCell>Price</Table.HeadCell>
                    <Table.HeadCell>Quantity</Table.HeadCell>
                    <Table.HeadCell>Time</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {
                        ...openOrders.map(order => 
                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell>{order.tradeType}</Table.Cell>
                                <Table.Cell>{order.orderType}</Table.Cell>
                                <Table.Cell>{order.price}</Table.Cell>
                                <Table.Cell>{order.quantity}</Table.Cell>
                                <Table.Cell>{order.time}</Table.Cell>
                            </Table.Row>
                        )
                    }
                </Table.Body>
            </Table>
        </div>
    )
}