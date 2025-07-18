import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosConfig from "../axiosConfig";

export const createProduct = createAsyncThunk(
    "item/createProduct",
    async (productData) => {
        try {
            const response = await axiosConfig.post("/item", productData);
            return response.data;
        } catch (error) {
            throw error.response.data.message || "Something went wrong";
        }
    }
);

const itemSlice = createSlice({
    name: "item",
    initialState: {
        loading: false,
        error: null,
        message: null,
    }
})