import { configureStore } from "@reduxjs/toolkit";

import { IS_DEVELOPMENT } from "../const/common";
import { api } from "../services";

import { events } from "./slices/events";
import { authState } from "./slices/authSlice";
import { sites } from "./slices/sites";
import { filters } from "./slices/filters";
import { recoveryFilters } from "./slices/recovery";

export const store = configureStore({
  reducer: {
    events,
    authState,
    sites,
    filters,
    recoveryFilters,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
  devTools: IS_DEVELOPMENT,
});
