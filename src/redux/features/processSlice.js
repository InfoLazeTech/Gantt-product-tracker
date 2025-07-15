import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosConfig from "../axiosConfig";
import { toast } from "react-toastify";

export const fetchProcess = createAsyncThunk(
  "process/fetchProcess",
  async () => {
    try {
      const response = await axiosConfig.get("/processes");
      return response.data;
    } catch (error) {
      throw error.response.data.message || "Something went wrong";
    }
  }
);

export const addProcess = createAsyncThunk(
  "process/addProcess",
  async (processData) => {
    try {
      const response = await axiosConfig.post("/processes", processData);
      return response.data;
    } catch (error) {
      throw error.response.data.message || "Something went wrong";
    }
  }
);
// This function updates an existing process
// It takes an object with id and processData as parameters

export const updateProcess = createAsyncThunk(
  "process/updateProcess",
  async ({ id, processData }) => {
    try {
      const response = await axiosConfig.put(`/processes/${id}`, processData);
      return response.data;
    } catch (error) {
      throw error.response.data.message || "Something went wrong";
    }
  }
  
);


const processSlice = createSlice({
  name: "process",
  initialState: {
    process: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProcess.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProcess.fulfilled, (state, action) => {
        state.loading = false;
        state.process = action.payload;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(fetchProcess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(state.error);
      })
      .addCase(addProcess.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProcess.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(addProcess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(state.error);
      })
      // Handle updateProcess
      .addCase(updateProcess.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProcess.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(updateProcess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(state.error);
      });
  },
});

export default processSlice.reducer;
