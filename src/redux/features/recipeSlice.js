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

export const addRecipe = createAsyncThunk('recipe/addRecipe', async (recipeData) => {
    try {
        const response = await axiosConfig.post('/recipes', recipeData);
        return response.data;
    } catch (error) {
        throw (
            error.response.data.message || 'Something went wrong'
        )
    }
});

export const updateRecipe = createAsyncThunk(
    'recipe/updatedRecipe',
    async ({ id, updateRecipeData }, { rejectWithValue }) => {
        try {
            console.log("🚀 Recipe ID to update:", id); // Should log RECIPE-001 or similar

            const response = await axiosConfig.put(`/recipes/${id}`, updateRecipeData);
            return response.data;
        } catch (error) {
            console.error("❌ Update Error:", error);
            return rejectWithValue(
                error.response?.data?.message || "Something went wrong"
            );
        }
    }
);

export const deleteRecipe = createAsyncThunk(
    'recipe/deleteRecipe',
    async ({ id }, { rejectWithValue }) => {
        try {
            const response = await axiosConfig.delete(`/recipes/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Something went wrong"
            );
        }
    }
);


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
            .addCase(addRecipe.pending, (state) => {
                state.loading = true;
            })
            .addCase(addRecipe.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                toast.success(state.message);
            })
            .addCase(addRecipe.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(state.error);
            })
            .addCase(updateRecipe.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateRecipe.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                toast.success(state.message);
            })
            .addCase(updateRecipe.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(state.error);
            })
            .addCase(deleteRecipe.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteRecipe.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                toast.success(state.message);
            })
            .addCase(deleteRecipe.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(state.error);
            })
    }
});

export default recipeSlice.reducer;