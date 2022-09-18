import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { fetchSales } from '../infoAPI';

export interface InfoState {
  product:string;
  description:string;
  tags:Array<string>;
  productImg: string;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: InfoState = {
  product: "",
  description: "",
  tags: [],
  productImg: "",
  status: 'idle',
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
// export const incrementAsync = createAsyncThunk(
//   'sales/fetchSales',
//   async () => {
//     const response = await fetchSales();
//     // The value we return becomes the `fulfilled` action payload
//      return response;
//   }
// );

export const database = fetchSales();
export const infoSlice = createSlice({
  name: 'info',
  initialState,
  reducers: {
    getInfo: (state) => {
      state.product = database.title;
      state.description = database.subtitle;
      state.tags = database.tags;
      state.productImg = database.image;
    }
  },
});

export const { getInfo } = infoSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectProduct = (state: RootState) => state.info.product;
export const selectDescription = (state: RootState) => state.info.description;
export const selectTags = (state: RootState) => state.info.tags;
export const selectImg = (state: RootState) => state.info.productImg;

export default infoSlice.reducer;
