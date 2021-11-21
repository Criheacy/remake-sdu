import { configureStore } from '@reduxjs/toolkit';
import storyReducer from "./story.slice";
import variableReducer from "./variable.slice";

const store = configureStore({
  reducer: {
    story: storyReducer,
    variable: variableReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;