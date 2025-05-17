import { formatDate, getLastWeekDate } from "@/utils/general-helpers";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type State = {
  startTime: string;
  endTime: string;
};

const date = new Date();

const initialState: State = {
  startTime: formatDate(getLastWeekDate(date)),
  endTime: formatDate(new Date()),
};

const recoverySlice = createSlice({
  name: "recovery",
  initialState,
  reducers: {
    setRecoveryFilters(state, action: PayloadAction<Partial<State>>) {
      Object.assign(state, action.payload);
    },
    clearRecoveryFilters(state, action: PayloadAction<(keyof State)[]>) {
      const filtersToClear = action.payload;

      filtersToClear.forEach((filterKey) => {
        if (filterKey in initialState) {
          // Reset the specified filter to its initial value
          state[filterKey] = initialState[filterKey];
        }
      });
    },
  },
});

export const recoveryFilters = recoverySlice.reducer;

export const { setRecoveryFilters, clearRecoveryFilters } =
  recoverySlice.actions;
