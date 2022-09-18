import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { fetchSales } from '../infoAPI';

export interface GraphState {
  date:string[];
  retailSales:number[];
  wholeSales:number[];
  retailMargin:number[];
  unitsSold:number[];
}
const initialState: GraphState = {
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

export const dataSales = fetchSales().sales;

export const graphSlice = createSlice({
  name: 'sales',
  initialState,
  
  reducers: {
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

export const { getSales } = graphSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectDate = (state: RootState) => state.graph.date;
export const selectRetailSales = (state: RootState) => state.graph.retailSales;
export const selectWholeSales = (state: RootState) => state.graph.wholeSales;
export const selectRetailMargin = (state: RootState) => state.graph.retailMargin;
export const selectUnitsSold = (state: RootState) => state.graph.unitsSold;

export default graphSlice.reducer;
