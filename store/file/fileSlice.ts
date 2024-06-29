import { createSlice } from "@reduxjs/toolkit";
import { getFiles } from "./fileAction";

const initialState = {
    files: null,
    pagination: null
}

const fileSlice = createSlice({
    name: "file",
    initialState: initialState,
    reducers: {
        setFiles: (state, { payload }) => {
            state.files = payload;
        },
    },
    extraReducers(builder) {
        builder.addCase(getFiles.fulfilled, (state, action) => {
            state.files = action.payload.data
            state.pagination = action.payload.pagination
        })
        builder.addCase(getFiles.rejected, (state, action) => {
            state.files = null
            state.pagination = null
        })
    }
});

export const { setFiles } = fileSlice.actions;

export default fileSlice.reducer;