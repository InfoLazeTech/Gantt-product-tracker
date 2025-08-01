import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosConfig from "../axiosConfig";
import { toast } from "react-toastify";

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axiosConfig.post("/item", productData);
      return response.data;
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

export const fetchProduct = createAsyncThunk(
  "product/fetchProduct",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosConfig.get("/item");
      return response.data;
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

export const fetchProductupdate = createAsyncThunk(
  "product/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosConfig.put(`/item/${id}`);
      return response.data;
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

export const updateProcessItem = createAsyncThunk(
  "product/updateProcessItem",
  async ({ itemId, processId, updateItemData }, { rejectWithValue }) => {
    try {
      const response = await axiosConfig.put(
        `/item/${itemId}/process/${processId}`,
        updateItemData
      );
      return response.data;
    } catch (error) {
      console.error("❌ Update Error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const fetchCustomerProduct = createAsyncThunk(
  "product/fetchCustomerProduct",
  async ({ PONumber, RefNumber }) => {
    try {
      const response = await axiosConfig.get(
        `/checkItem?PONumber=${PONumber}&RefNumber=${RefNumber}`
      );
      return response.data;
    } catch (error) {
      throw error.response.data.message || "Something went wrong";
    }
  }
);

// Thunk for updating PO
export const updatePo = createAsyncThunk(
  "item/updatePo",
  async ({ itemId, data }, { rejectWithValue }) => {
    try {
      const response = await axiosConfig.put(`/item/${itemId}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const deletePo = createAsyncThunk(
  "item/delete",
  async ({ itemId }, { rejectWithValue }) => {
    try {
      const response = await axiosConfig.delete(`/item/${itemId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    poDetails: [],
    checkProduct: [],
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
      })
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.poDetails = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products.";
        toast.error(state.error);
      })
      .addCase(updateProcessItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProcessItem.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(updateProcessItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(state.error);
      })
      .addCase(fetchCustomerProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomerProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.checkProduct = action.payload;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(fetchCustomerProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(state.error);
      })
      .addCase(updatePo.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePo.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(updatePo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(state.error);
      })
      .addCase(deletePo.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePo.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.poDetails = state.poDetails.filter(
          (r) => r.itemId !== action.meta.arg.itemId
        );
        toast.success(state.message);
      })

      .addCase(deletePo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(state.error);
      });
  },
});

export default productSlice.reducer;
