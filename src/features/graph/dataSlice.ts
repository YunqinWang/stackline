import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { fetchSales } from '../infoAPI';

export interface DataState {
  product:string;
  description:string;
  tags:Array<string>;
  productImg: string;
  date:string[];
  retailSales:number[];
  wholeSales:number[];
  retailMargin:number[];
  unitsSold:number[];
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
};

const monthName = ['January', 'February', 'March','April', 'May', 'June', 'July', 
'August', 'September', 'October', 'November', 'December']


function labelSanitizer(labelList:string[]){
  let cleanedLabelList:string[] = [];
  let allMonthNum:number[] = [];

  labelList.forEach((item)=>{
    let itemDate = new Date(item);
    itemDate.setDate(itemDate.getDate()+1);
    let itemMonth = itemDate.getMonth();
    let currentLength = allMonthNum.length;

    if (currentLength==0 || itemMonth != allMonthNum[currentLength-1]){
      allMonthNum.push (itemMonth);
      cleanedLabelList.push(monthName[itemMonth]);
    }
    else{
      cleanedLabelList.push (" ");
    }
  })
  return cleanedLabelList;
}

export const database = fetchSales(); // entire database
export const dataSales = database.sales; // sales data




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
    }
  },
});

export const { getInfo, getSales } = dataSlice.actions;

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
