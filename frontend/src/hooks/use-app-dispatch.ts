import { useDispatch } from "react-redux";

import type { AppDispatch } from "../types/store";

export const useAppDispatch: () => AppDispatch = useDispatch;
