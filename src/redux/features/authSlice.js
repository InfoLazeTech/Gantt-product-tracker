import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import React from "react";
import axiosConfig from "../axiosConfig";
import { toast } from "react-toastify";

export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (loginData) => {
    try {
      const response = await axiosConfig.post("/login", loginData);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data?.error || error.message || "something went wrong"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
    message: null, 
  },
  reducers: {
    logout: (state) => {
      state.user = null;  
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      toast.info("Logged Out Successfully");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload;
        state.isAuthenticated = true;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload?.message || "Invalid email or password";
        toast.error(state.error);
      });
  },
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated; 
