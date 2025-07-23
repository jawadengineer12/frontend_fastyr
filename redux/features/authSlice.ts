import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  forgotPassword,
  verifyPin,
  resetPassword,
} from "../../libs/api";

interface AuthState {
  isAuthenticated: boolean;
  user: {
    email: string;
    firstName?: string;
    lastName?: string;
    userEmail?: string;
  } | null;
  otpSent: boolean;
  isVerified: boolean;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  resetEmail: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  otpSent: false,
  isVerified: false,
  token: null,
  status: "idle",
  error: null,
  resetEmail: null,
};

export const signup = createAsyncThunk(
  "auth/signup",
  async (
    userData: { userName: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await registerUser(userData);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await loginUser({
        username: credentials.email,
        password: credentials.password,
      });
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const sendForgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await forgotPassword(email);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (data: { email: string; pin_code: string }, { rejectWithValue }) => {
    try {
      const response = await verifyPin(data);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const resetUserPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    data: { email: string; new_password: string; confirm_password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await resetPassword(data);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signOut: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.otpSent = false;
      state.isVerified = false;
      state.token = null;
      state.resetEmail = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
      }
    },
    hydrateToken: (state) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("access_token");
        if (token) {
          state.token = token;
        }
      }
    },
    setResetEmail: (state, action: PayloadAction<string>) => {
      state.resetEmail = action.payload;
      state.otpSent = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.token = action.payload.access_token;
        state.user = {
          email: action.payload.userEmail,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          userEmail: action.payload.userEmail,
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", action.payload.access_token);
        }
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(sendForgotPassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(sendForgotPassword.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.otpSent = true;
        state.resetEmail = action.meta.arg; // Store email from the action
        state.error = null;
      })
      .addCase(sendForgotPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(verifyOTP.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.status = "succeeded";
        state.isVerified = true;
        state.error = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(resetUserPassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(resetUserPassword.fulfilled, (state) => {
        state.status = "succeeded";
        state.otpSent = false;
        state.isVerified = false;
        state.resetEmail = null;
        state.error = null;
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { signOut, hydrateToken, setResetEmail } = authSlice.actions;
export default authSlice.reducer;
