import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosConfig from "../axiosConfig";

export const fetchRecipe = createAsyncThunk('recipe/fetchRecipe', async () => {
    try {
        const response = await axiosConfig.get('/recipes');
        return response.data;
    } catch (error) {
        throw (
            error.response.data.message || 'Something went wrong'
        )
    }
});

const recipeSlice = createSlice({
    name: 'recipe',
    initialState: {
        recipe: [],
        loading: false,
        error: null,
        message: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecipe.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRecipe.fulfilled, (state, action) => {
                state.loading = false;
                state.recipe = action.payload;
                state.message = action.payload.message;
                toast.success(state.message);
            })
            .addCase(fetchRecipe.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(state.error);
            })
    }
});

export default recipeSlice.reducer;