import { RootState } from "@/types/store";

const filtersState = (state: RootState) => state.recoveryFilters;
export const getRecoveryFiltersState = (state: RootState) => filtersState(state);