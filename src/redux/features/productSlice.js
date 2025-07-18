import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosConfig from "../axiosConfig";
import { toast } from "react-toastify";

// --- CREATE PRODUCT ASYNC ACTION ---
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axiosConfig.post("/item", productData);
      return response.data; // <-- actual created item
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Something went wrong";
      return rejectWithValue(message);
    }
  }
);

// --- SLICE ---
const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    error: null,
    message: null,
    createdItem: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.createdItem = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.createdItem = action.payload;
        state.message = "Production order created successfully!";
        toast.success(state.message);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create product.";
        toast.error(state.error);
      });
  },
});

export default productSlice.reducer;
