import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  dataSales,
  getTableData,
  sortTable
} from './dataSlice';

import styles from './Table.module.css';

export function Table() {
    const dispatch = useAppDispatch();
    dispatch(getTableData());
  
    return (
     <div className = {styles.graphBox}>
        <table>
          <TableHead/>
          <TableBody/>
        </table>
     </div>
    )
  }
  
  // set the accessors
  type Header = typeof dataSales[0];
  type Accessor = keyof Header
  const weekEnding:Accessor ="weekEnding"
  const retailSales:Accessor ="retailSales"
  const wholesaleSales:Accessor ="wholesaleSales"
  const unitsSold:Accessor ="unitsSold"
  const retailerMargin:Accessor ="retailerMargin"
  
  // hader of the table
  const columns = [
    { label: "Week Ending", accessor: weekEnding },
    { label: "Retail Sales", accessor: retailSales },
    { label: "Wholesale Sales", accessor: wholesaleSales },
    { label: "Units Sold", accessor: unitsSold },
    { label: "Retailer Margin", accessor: retailerMargin },
   ];
  
  // return a TableHead element
  const TableHead = () => {
    const dispatch = useAppDispatch();
    
  
    const [sortField, setSortField] = useState("");
    const [order, setOrder] = useState("asc");
  
    // const handleSortingChange = (accessor:Accessor) => {
    //   const sortOrder = accessor === sortField && order === "asc" ? "desc" : "asc";
    //   setSortField(accessor);
    //   setOrder(sortOrder);
    //   handleSorting(accessor, sortOrder);
    //  };
  
    return (
     <thead>
      <tr>
       {columns.map(({ label, accessor }) => {
        return (
          <th key={accessor}
              onClick={() => {
                console.log(111);
                dispatch(sortTable(accessor))}}
          >
            {label}
          </th>
        )
       })}
      </tr>
     </thead>
    );
   };
   
  
  
  // used to format numbers
  const formatter = new Intl.NumberFormat();
  
  // return a TableBody element
  const TableBody = () => {
    return (
    <tbody>
    {dataSales.map((data,i) => {
      return (
      <tr key={i}>
        {columns.map(({accessor }) => {
        let tData = data[accessor];
        //format number e.g 1000 -> 1,000
        if (typeof tData === "number"){
          tData=formatter.format(tData);
        }
        return <td key={accessor}>{tData}</td>;
        })}
      </tr>
      );
    })}
    </tbody>
  );
  };