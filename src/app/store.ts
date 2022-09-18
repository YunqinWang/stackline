import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import infoReducer from '../features/info/infoSlice';
import graphReducer from '../features/graph/graphSlice';

export const store = configureStore({
  reducer: {
    info: infoReducer,
    graph:graphReducer,
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
