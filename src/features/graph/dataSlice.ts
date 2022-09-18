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

  sortOrder:SortOrder;
  sortKey:SortKeys;
  dataTable:number[][];
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

  sortOrder: "ascn",
  sortKey:"weekEnding",
  dataTable:[],
}


const database = fetchSales(); // entire database
const dataSales = database.sales; // sales data


type SortOrder = "ascn" | "desc";
type DataSales = typeof dataSales;
type SortKeys = keyof DataSales[0];


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

    setSortKey:(state, action) => {
      state.sortKey = action.payload;
    },
    // set the table with rows
    setTableData:(state)=> {
      let rows:number[][] =[];
      for (let i=0;i<state.date.length;i++) {
        let eachRow:any[] = [state.date[i],state.retailSales[i],state.wholeSales[i],
        state.unitsSold[i],state.retailMargin[i]];
        rows.push(eachRow);
      }
      state.dataTable = rows;
    }
  },
});

export const { getInfo, getSales, setSortKey, setTableData } = dataSlice.actions;

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

export const selectDataTable = (state: RootState) => state.data.dataTable;

export default dataSlice.reducer;


