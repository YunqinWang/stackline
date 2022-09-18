import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  
} from './dataSlice';

import {
    setSortParams,
} from './tableSlice';

import styles from './Graph.module.css';


let labels:string[]=[]
let retail:number[]=[]
let whole:number[]=[]
let margin:number[]=[]
let units :number[]= []


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
export function Table() {
    const dateNumber = dateStringToNum(labels);
    const rows =setRow(labels,retail,whole,units,margin);
    return (
     <div className = {styles.graphBox}>
        <table>
          <thead>
            <tr>
              <td onClick={() => setSortParams("weekEnding")}>Week Ending</td>
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
  