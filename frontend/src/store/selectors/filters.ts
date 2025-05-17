import { RootState } from "@/types/store";

const filtersState = (state: RootState) => state.filters;
export const getFiltersState = (state: RootState) => filtersState(state);