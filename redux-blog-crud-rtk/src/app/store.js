import { configureStore } from "@reduxjs/toolkit";
import { apiSlice, userApiSlice } from "../features/api/apiSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer
  },
  middleware: getDefaultMiddleware => 
      getDefaultMiddleware().concat(apiSlice.middleware, userApiSlice.middleware)
})