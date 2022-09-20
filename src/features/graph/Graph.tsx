// draw the line garph and bar chart

import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  DataState,
  getSales,
  selectDate,
  selectRetailSales,
  selectWholeSales,
  selectRetailMargin,
  selectUnitsSold,
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
  monthName.forEach((d,i)=>{
    monthList.push (
      <li key={i}>{d.toUpperCase()}</li>
    )
  })
  return monthList;
}

// draw graph
export function Graph() {
  // create an object of DataState type
  let productInstance = {} as DataState;

  // call the reducer to update the sales data
  const dispatch = useAppDispatch();
  dispatch(getSales());

  productInstance.date = useAppSelector(selectDate);
  productInstance.retailSales = useAppSelector(selectRetailSales);
  productInstance.wholeSales = useAppSelector(selectWholeSales);
  productInstance.retailMargin = useAppSelector(selectRetailMargin);
  productInstance.unitsSold = useAppSelector(selectUnitsSold);

  // get min and max values of two sales data
  // used to set the y axis scale of sales line graph
  const yMaxSales = getMaxOfTwoArray(productInstance.retailSales, productInstance.retailMargin);
  const yMinSales = getMinOfTwoArray(productInstance.retailSales, productInstance.retailMargin);

  // get max value of the sold unit data
  // used to set the y axis scale of units chart graph
  const yMaxUnits = getMaxOfTwoArray(productInstance.unitsSold, productInstance.unitsSold);

   // used to scale the line graph, 2 means the max value of yxis is the 2*max,
  const lineScaleMax = 2
  // used to scale the line graph, 3 means the max value of yxis is the 3*max,
  const chartScaleMax = 3

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
        min: -yMaxSales*(lineScaleMax+1)+yMinSales,
        max: yMaxSales*lineScaleMax,
        type: 'linear' as const,
        display: false,
        position: 'left' as const,
      },
      yUnit: {
        min: 0,
        max: yMaxUnits*chartScaleMax,
        type: 'linear' as const,
        display: false,
        position: 'right' as const,
      },
    },
  }
  const labels =   productInstance.date
  // graph data, draw Reatil Sales and Retailer Margin with lines
  // draw Sold Units with chart
  const graphData ={
    labels,
    datasets: [
      {
        type: 'line' as const,
        label: 'Retail Sales',
        data: productInstance.retailSales,
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
        data:  productInstance.retailMargin,
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
        data: productInstance.unitsSold,
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
