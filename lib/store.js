import { configureStore } from '@reduxjs/toolkit'
import axios from 'axios';

const selectedStock = createSlice({
	name: 'selectedStock',
    initialState: '',
    reducers: {
        selectStock: (_, action) => action.payload,
        clearStock: () => '',
    },
});

const fetchStockList = createAsyncThunk('stockList/fetchStockList', () => {
    return axios.get("/api/stock-list").then((res) => res.data);
})

const stockList = createSlice({
	name: 'stockList',
    initialState: {status: "idle", data: []},
    reducers: {
        // updateStockList: (_, action) => action.payload,
        clearStockList: (state) => { state.data = [] },
    },
});


export const makeStore = () => {
  return configureStore({
    reducer: {
        selectedStock,
        stockList
    },
    extraReducers: {
		[fetchStockList.pending](state) {
			state.status = "loading"
		},
		[fetchStockList.fulfilled](state, action) {
			state.data = action.payload
			state.status = "idle"
		}
	}
  })
}

export const { selectStock, clearStock } = selectedStock.actions
export const { clearStockList } = stockList.actions
export { fetchStockList }