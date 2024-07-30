'use client'

import React, { useEffect, useState } from 'react';
import { Button, TextInput } from 'flowbite-react';
import { createClient } from '@/utils/supabase/client';

const TradeForm = ({user}) => {
    const [tradeType, setTradeType] = useState('buy');
    const [orderType, setOrderType] = useState('market');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const supabase = createClient();

    useEffect(() => {
        setQuantity('');
        setPrice('');
    }, [tradeType]);

    const submitOrder = async () => {
        if (!quantity) {
            console.error('Quantity is required');
            return;
        }
        if (orderType === 'limit' && !price) {
            console.error('Price is required for limit orders');
            return;
        }
        // axios.post('/api/orders', {
        //     tradeType,
        //     orderType,
        //     quantity,
        //     price,
        // }, {
        //     headers: {'content-type': 'application/json'},
        // }).then((response) => {
        //     console.log('Order submitted:', response.data);
        // }).catch((error) => {
        //     console.error('Error submitting order:', error);
        // });

        const { error } = await supabase
            .from('orders')
            .insert({ uid: user.id, tradeType, orderType, quantity, price })
    }

    return (
        <div className="max-w-md mx-auto space-y-4">
            <Button.Group className="w-full flex">
                <Button
                    className="w-1/2"
                    size="xs"
                    color={tradeType === 'buy' ? 'blue' : 'gray'}
                    onClick={() => setTradeType('buy')}
                >
                Buy
                </Button>
                <Button
                    className="w-1/2"
                    size="xs"
                    color={tradeType === 'sell' ? 'red' : 'gray'}
                    onClick={() => setTradeType('sell')}
                >
                Sell
                </Button>
            </Button.Group>

            <Button.Group className="w-full flex">
                <Button
                    color={orderType === 'market' ? 'blue' : 'gray'}
                    onClick={() => setOrderType('market')}
                    className='w-1/2'
                    size="xs"
                >
                    Market
                </Button>
                <Button
                    color={orderType === 'limit' ? 'blue' : 'gray'}
                    onClick={() => setOrderType('limit')}
                    className='w-1/2'
                    size="xs"
                >
                    Limit
                </Button>
            </Button.Group>

            <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <TextInput
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    sizing="sm"
                    required
                />
            </div>

            {orderType === 'limit' && (
                <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <TextInput
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    sizing="sm"
                    required
                />
                </div>
            )}

            <div className="sticky bottom-0 bg-white py-2">
                <Button type="submit" color="dark" className="w-full" size="xs" onClick={
                    () => {submitOrder()}
                }>
                    Submit
                </Button>
            </div>
        </div>
    );
};

export default TradeForm;
