import { User } from "@/types/user";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const loadFromLocalStorage = <T>(key: string): T | null => {
  try {
    const serializedState = localStorage.getItem(key);
    if (!serializedState) return null;

    // Check if it's JSON-like (starts with `{` or `[`)
    if (serializedState.startsWith("{") || serializedState.startsWith("[")) {
      return JSON.parse(serializedState) as T;
    }

    // Return plain strings for tokens or other non-JSON data
    return serializedState as unknown as T;
  } catch (error) {
    console.error(`Error loading key "${key}" from localStorage:`, error);
    return null;
  }
};

type TAuthSlice = {
  user?: User | null;
  token: string | null;
};

const initialState: TAuthSlice = {
  user: loadFromLocalStorage<User>("user"),
  token: loadFromLocalStorage<string>("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserCredentials(state, action: PayloadAction<TAuthSlice>) {
      const { user, token } = action.payload;

      if (token && user) {
        state.user = user;
        state.token = token;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.reload();
    },
  },
});

export const authState = authSlice.reducer;
export const { setUserCredentials, logout } = authSlice.actions;
