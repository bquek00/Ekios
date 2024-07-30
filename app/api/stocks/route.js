import yahooFinance from 'yahoo-finance2';

export async function GET(request) {
    const url = new URL(request.url);
    const params = url.searchParams;
    const message = params.get('symbol');

    const query = message
      const queryOptions= { period1: '2024-07-01'}
      const historicalData = await yahooFinance.historical(query, queryOptions);
      //return JSON.stringify(historicalData);
  
    return new Response(JSON.stringify({ historicalData}), {
      headers: { 'Content-Type': 'application/json' },
    });
  }