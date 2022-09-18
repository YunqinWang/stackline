import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import dataReducer from '../features/graph/dataSlice';
import tableReducer from '../features/graph/tableSlice';

export const store = configureStore({
  reducer: {
    data:dataReducer,
    table:tableReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
