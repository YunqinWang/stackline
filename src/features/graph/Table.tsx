import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  Accessor,
  TableData,
  selectDataSales,
  handleSorting,
} from './dataSlice';

import styles from './Table.module.css';

let tableData:TableData = [];
export function Table() {
  tableData = useAppSelector(selectDataSales);
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

  const handleSortingChange = (accessor:Accessor) => {
    const sortOrder = accessor === sortField && order === "asc" ? "desc" : "asc";
    setSortField(accessor);
    setOrder(sortOrder);
    dispatch(handleSorting({accessor, sortOrder}));
    };

  return (
    <thead>
    <tr>
      {columns.map(({ label, accessor}) => {
        const cl =
        sortField === accessor && order === "asc"
        ? "up"
        : sortField === accessor && order === "desc"
        ? "down"
        : "default";
         
      return (
        <th key={accessor}
            className={cl}
            onClick={() => {
              handleSortingChange(accessor);
            }}
        >
          {label}
        </th>
      )
      })}
    </tr>
    </thead>
  );
};
  
// return a TableBody element
const TableBody = () => {
  tableData = useAppSelector(selectDataSales);
  console.log( tableData );
  return (
    <tbody>
    {tableData.map((data,i) => {
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

// used to format numbers
const formatter = new Intl.NumberFormat();