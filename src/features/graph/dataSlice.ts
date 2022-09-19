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

  tableData:TableData;
  sortField:Accessor;
  order:string;
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

  tableData:[],
  sortField:"weekEnding",
  order:"desc",
}

const database = fetchSales(); // entire database
export const dataSales = database.sales; // sales data
type Header = typeof dataSales[0];
type Accessor = keyof Header
type TableData= typeof dataSales

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
      
      dataSales.forEach((d)=>{
        state.date.push(d.weekEnding);
        state.retailSales.push(d.retailSales);
        state.wholeSales.push(d.wholesaleSales);
        state.retailMargin.push(d.retailerMargin);
        state.unitsSold.push(d.unitsSold);
      })
    },

    sortTable:(state, action)=>{
      console.log(sortTable);
      const sortOrder =
      action.payload === state.sortField && state.order === "asc" ? "desc" : "asc";
      state.sortField = action.payload;
      state.order = sortOrder;
      handleSorting();
    },
    
    getTableData:(state)=>{
      state.tableData =fetchSales().sales;
    },

    handleSorting : (state) => {
      // state.sortField = action.payload;
       const sorted = [...dataSales].sort((a, b) => {
        return (
         a[state.sortField].toString().localeCompare(b[state.sortField].toString(), "en", {
          numeric: true,
         }) * (state.order === "asc" ? 1 : -1)
        );
       });
       state.tableData = sorted;
     },
    }
});

export const { getInfo, getSales, getTableData, handleSorting, sortTable} = dataSlice.actions;

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

export default dataSlice.reducer;


