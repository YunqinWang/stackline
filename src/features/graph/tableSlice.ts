import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { fetchSales } from '../infoAPI';
import {MouseEvent} from 'react';
import React, { useState } from 'react';

const dataSales = fetchSales().sales; // sales data

export interface tableState {
  sortedSales:{};
  sortKey:SortKeys;
  sortOrder:SortOrder;
}
const initialState: tableState = {
  sortedSales:dataSales,
  sortKey:'weekEnding',
  sortOrder:'ascn',
};

type Data = typeof dataSales;
type SortKeys = keyof Data[0];
type SortOrder = 'ascn' | 'desc';




export const tableSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setSortParams: (state) => {
        
    }
  }
})

export const { setSortParams } = tableSlice.actions;

export default tableSlice.reducer;