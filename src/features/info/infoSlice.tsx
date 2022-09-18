import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { fetchSales } from '../infoAPI';


export const database = fetchSales();
export interface InfoState {
  product:string;
  description:string;
  tags:Array<string>;
  productImg: string;
}

const initialState: InfoState = {
  product: "",
  description: "",
  tags: [],
  productImg: "",
};


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

// call a selector to select a value from`
export const selectProduct = (state: RootState) => state.info.product;
export const selectDescription = (state: RootState) => state.info.description;
export const selectTags = (state: RootState) => state.info.tags;
export const selectImg = (state: RootState) => state.info.productImg;

export default infoSlice.reducer;
