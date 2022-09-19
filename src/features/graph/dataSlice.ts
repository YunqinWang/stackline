import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { fetchSales } from '../infoAPI';

export interface DataState {
  product:string;
  description:string;
  tags:string[];
  productImg: string;
  date:string[];
  retailSales:number[];
  wholeSales:number[];
  retailMargin:number[];
  unitsSold:number[];

  sortField:Accessor;
  order:string;
  dataSales:TableData
}
const initialState: DataState = {
  product: "",
  description: "",
  tags: [],
  productImg: "",
  date:[],
  retailSales: [],
  wholeSales:[],
  retailMargin:[],
  unitsSold:[],

  sortField:"weekEnding",
  order:"asc",
  dataSales:fetchSales().sales,
}

const database = fetchSales(); // entire database
const databaseSales = database.sales; // sales data

// type of header, accessor, and entire table
export type Header = typeof database.sales[0];
export type Accessor = keyof Header
export type TableData= typeof database.sales

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    // get basic info
    getInfo: (state) => {
      state.product = database.title;
      state.description = database.subtitle;
      state.tags = database.tags;
      state.productImg = database.image;
    },
 
    // get sales data
    getSales: (state) => {
      state.date =[];
      state.retailSales=[];
      state.wholeSales=[];
      state.retailMargin=[];
      state.unitsSold=[];
      
      databaseSales.forEach((d,i)=>{
        state.date.push(d.weekEnding);
        state.retailSales.push(d.retailSales);
        state.wholeSales.push(d.wholesaleSales);
        state.retailMargin.push(d.retailerMargin);
        state.unitsSold.push(d.unitsSold);
      })
      state.dataSales=databaseSales;
    },
    
    // handle the sorting of the table
    handleSorting : (state, action) => {
      // get the selected field and current order
      state.sortField = action.payload.accessor;
      state.order = action.payload.sortOrder;
      // sort 
      const sorted = [...state.dataSales].sort((a, b) => {
        return (
         a[state.sortField].toString().localeCompare(b[state.sortField].toString(), "en", {
          numeric: true,
         }) * (state.order === "asc" ? 1 : -1)
        );
       });
       state.dataSales = sorted;
     },
    }
});

export const { getInfo, getSales, handleSorting} = dataSlice.actions;

// call a selector to select a value from the state
export const selectProduct = (state: RootState) => state.data.product;
export const selectDescription = (state: RootState) => state.data.description;
export const selectTags = (state: RootState) => state.data.tags;
export const selectImg = (state: RootState) => state.data.productImg;

export const selectDate = (state: RootState) => state.data.date;
export const selectRetailSales = (state: RootState) => state.data.retailSales;
export const selectWholeSales = (state: RootState) => state.data.wholeSales;
export const selectRetailMargin = (state: RootState) => state.data.retailMargin;
export const selectUnitsSold = (state: RootState) => state.data.unitsSold;

export const selectDataSales = (state: RootState) => state.data.dataSales;
export default dataSlice.reducer;


