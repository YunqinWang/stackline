import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  getSales,
  selectDate,
  selectRetailSales,
  selectWholeSales,
  selectRetailMargin,
  selectUnitsSold
} from './dataSlice';

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

// get max value form two array lists
function getMaxOfTwoArray(array1:number[], array2:number[]){
  const yMax1 = array1.reduce((a, b) => Math.max(a, b), -Infinity);
  const yMax2 = array2.reduce((a, b) => Math.max(a, b), -Infinity);
  return Math.max(yMax1,yMax2);
}

// get min value form two array lists
function getMinOfTwoArray(array1:number[], array2:number[]){
  const yMin1 = array1.reduce((a, b) => Math.min(a, b), Infinity);
  const yMin2 = array2.reduce((a, b) => Math.min(a, b), Infinity);
  return Math.min(yMin1,yMin2);
}

// return month name in <li> tag
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

let labels:string[]=[]
let retail:number[]=[]
let whole:number[]=[]
let margin:number[]=[]
let units :number[]= []

// draw graph
export function Graph() {
  // call the reducer to update the sales data
  const dispatch = useAppDispatch();
  dispatch(getSales());

  labels = useAppSelector(selectDate);
  retail = useAppSelector(selectRetailSales);
  whole = useAppSelector(selectWholeSales);
  margin = useAppSelector(selectRetailMargin);
  units = useAppSelector(selectUnitsSold);

  // get min and max values of two sales data
  // used to set the y axis scale of sales line graph
  const yMaxSales = getMaxOfTwoArray(retail, margin);
  const yMinSales = getMinOfTwoArray(retail, margin);

  // get max value of the sold unit data
  // used to set the y axis scale of units chart graph
  const yMaxUnits = getMaxOfTwoArray(units, units);

  // garph setting, like scale, axis, labels, etc
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

  // graph data, draw Reatil Sales and Retailer Margin with lines
  // draw Sold Units with chart
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

// convert date string to number
function dateStringToNum(dateArray:string[]){
  let dateList:number[]=[];
  dateArray.forEach((item)=>{
    let itemDate = new Date(item);
    itemDate.setDate(itemDate.getDate()+1);
    dateList.push(itemDate.getTime());
  })
  return dateList;
}

// set the table with rows
function setRow(date:string[], retail:number[], wholesale:number[], units:number[], margin:number[]){
    let rows:any[][] =[];
    for (let i=0;i<date.length;i++) {
      let eachRow:any[] = [date[i],retail[i],wholesale[i],units[i],margin[i]];
      rows.push(eachRow);
    }
    return rows;
}

// set a row with cells
function getRow(rows:number[][]){
  let allRows:JSX.Element[]=[];
  rows.forEach((row,i)=>{
    let rowItems =(
      <tr key={i}>{getItem(row)}</tr>
    )
    allRows.push(rowItems);
  })
  return allRows;
}

// set cells of a row with data
function getItem(row:number[]){
  let items:JSX.Element[]=[]
  row.forEach(cell => {
    items.push(
      <td>{cell}</td>
    )
  })
  return items;
}
export function Table() {
  const dateNumber = dateStringToNum(labels);
  const rows =setRow(labels,retail,whole,units,margin);
  return (
   <div className = {styles.graphBox}>
      <table>
        <thead>
          <tr>
            <td>Week Ending</td>
            <td>Retail Sales</td>
            <td>Wholesale Sales</td>
            <td>Units Sold</td>
            <td>Retailer Margin</td>
          </tr>
        </thead>
        <tbody>
          {getRow(rows)}
        </tbody>
      </table>
   </div>
  )
}
