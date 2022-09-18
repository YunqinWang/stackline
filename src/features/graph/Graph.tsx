import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  getSales,
  selectDate,
  selectRetailSales,
  selectWholeSales,
  selectRetailMargin,
  selectUnitsSold
} from './graphSlice';

import styles from './Graph.module.css';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);

export const options = {
  responsive: true,
  maintainAspectRatio:false,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  stacked: false,
  plugins: {
    title: {
      display: false,
      text: 'Retail Sales',
    },
  },
  elements: {
    point:{
        radius: 0,
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Month'
      }
    },
    xMonth:{
      display: false,
    },
    ySales: {
      min: -5000000,
      max: 5000000,
      type: 'linear' as const,
      display: false,
      position: 'left' as const,
    },
    yUnit: {
      type: 'linear' as const,
      display: false,
      position: 'right' as const,
      grid: {
        drawOnChartArea: false,
      },
    },
  },
}

function getMaxOfTwoArray(array1:number[], array2:number[]){
  const yMax1 = array1.reduce((a, b) => Math.max(a, b), -Infinity);
  const yMax2 = array2.reduce((a, b) => Math.max(a, b), -Infinity);
  return Math.max(yMax1,yMax2);
}

function getMinOfTwoArray(array1:number[], array2:number[]){
  const yMin1 = array1.reduce((a, b) => Math.min(a, b), Infinity);
  const yMin2 = array2.reduce((a, b) => Math.min(a, b), Infinity);
  return Math.min(yMin1,yMin2);
}

function getMonthLi(){
  const monthName = ['Jan', 'Feb', 'Mar','Apr', 'May', 'Jun', 'Jul', 
  'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  let monthList: JSX.Element[] = [];
  monthName.forEach((d)=>{
    monthList.push (
      <li>{d.toUpperCase()}</li>
    )
  })
  return monthList;
}



function sortRow(numArray:number[],rowArray:number[][],largeToSmall:boolean) {
  let i=0;
  while(i!=numArray.length){
    let j=i;
    while(j>0 && largeToSmall? numArray[j]<numArray[j-1]: numArray[j]>numArray[j-1]){
      swap(numArray[j], numArray[j-1]);
      swap(rowArray[j], rowArray[j-1]);
      j--;
    }
    i++;
  }
}
function swap(a:any,b:any){
  let temp =a;
  a=b;
  b=temp;
}

function dateStringToNum(dateArray:string[]){
  let dateList:number[]=[];
  dateArray.forEach((item)=>{
    let itemDate = new Date(item);
    itemDate.setDate(itemDate.getDate()+1);
    dateList.push(itemDate.getTime());
  })
  return dateList;
}

function setRow(date:string[], retail:number[], wholesale:number[], units:number[], margin:number[]){
    let rows:any[][] =[];
    for (let i=0;i<date.length;i++) {
      let eachRow:any[] = [date[i],retail[i],wholesale[i],units[i],margin[i]];
      rows.push(eachRow);
    }
    return rows;
}

function getRow(rows:number[][]){
  let allRows:JSX.Element[]=[];
  rows.forEach((row)=>{
    let rowItems =(
      <tr>{getItem(row)}</tr>
    )
    allRows.push(rowItems);
  })
  return allRows;
}

function getItem(row:number[]){
  let items:JSX.Element[]=[]
  row.forEach(cell => {
    items.push(
      <td>{cell}</td>
    )
  })
  return items;
}

let labels:string[]=[];
let retail:number[]=[];
let whole:number[]=[]
let margin:number[]=[]
let units :number[]= []
export function Graph() {
  const dispatch = useAppDispatch();
  dispatch(getSales());

  labels = useAppSelector(selectDate);
  retail = useAppSelector(selectRetailSales);
  whole = useAppSelector(selectWholeSales);
  margin = useAppSelector(selectRetailMargin);
  units = useAppSelector(selectUnitsSold);

  const yMaxSales = getMaxOfTwoArray(retail, margin);
  const yMinSales = getMinOfTwoArray(retail, margin);

  const yMaxUnits = getMaxOfTwoArray(units, units);

  const options = {
    responsive: true,
    maintainAspectRatio:false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: false,
        text: 'Retail Sales',
      },
    },
    elements: {
      point:{
          radius: 0,
      },
    },
    scales: {
      xMonth:{
        display: false,
      },
      ySales: {
        min: -yMaxSales*3+yMinSales,
        max: yMaxSales*2,
        type: 'linear' as const,
        display: false,
        position: 'left' as const,
      },
      yUnit: {
        min: 0,
        max: yMaxUnits*3,
        type: 'linear' as const,
        display: false,
        position: 'right' as const,
      },
    },
  }
  const graphData ={
    labels,
    datasets: [
      {
        type: 'line' as const,
        label: 'Retail Sales',
        data: retail,
        borderColor: '#3fa5f6',
        backgroundColor: '#3fa5f6',
        borderWidth: 3,
        xAxisID:'xMonth',
        yAxisID: 'ySales',
        lineTension: 0.3,
      },
      {
        type: 'line' as const,
        label: 'Retailer Margin',
        data:  margin,
        borderColor: '#b2bace',
        backgroundColor: '#b2bace',
        borderWidth: 3,
        xAxisID:'xMonth',
        yAxisID: 'ySales',
        lineTension: 0.3,
      },
      {
        type: 'bar' as const,
        label: 'Units Sold',
        data: units,
        backgroundColor:'#d5e4f9',
        borderWidth: 0,
        xAxisID:'xMonth',
        yAxisID: 'yUnit',
      },
    ],
  }

  return (
   <div className = {styles.graphBox}>
      <h3  className = {styles.graphTitle}>Retail Sales</h3>
      <div className = {styles.graphCanvas}>
        <Chart type ="bar" className = {styles.graph} options={options} data= {graphData} />
      </div>
      <ul className = {styles.monthLabel}>
        {getMonthLi()}
      </ul>
   </div>
  )
}
export function Table() {


  const dateNumber = dateStringToNum(labels);
  

  const rows =setRow(labels,retail,whole,units,margin);
  console.log(rows);

  return (
   <div className = {styles.graphBox}>
      <table>
        {getRow(rows)}
      </table>
   </div>
  )
}
