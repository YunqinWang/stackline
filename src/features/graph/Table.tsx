import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {Line} from 'react-chartjs-2';
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
import {
  getSales,
  selectDate,
  selectRetailSales,
  selectWholeSales,
  selectRetailMargin,
  selectUnitsSold
} from './graphSlice';

import styles from './Graph.module.css';
import { truncate } from 'fs/promises';

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
};

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

export function Graph() {
  const dispatch = useAppDispatch();
  dispatch(getSales());

  const labels = useAppSelector(selectDate);
  const retail = useAppSelector(selectRetailSales);
  const whole = useAppSelector(selectWholeSales);
  const margin = useAppSelector(selectRetailMargin);
  const units = useAppSelector(selectUnitsSold);

  const yMaxSales = getMaxOfTwoArray(retail, margin);
  const yMinSales = getMinOfTwoArray(retail, margin);

  const yMaxUnits = getMaxOfTwoArray(units, units);

  const options1 = {
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
        <Chart type ="bar" className = {styles.graph} options={options1} data= {graphData} />
      </div>
      <ul className = {styles.monthLabel}>
        {getMonthLi()}
      </ul>
   </div>
  )
}
