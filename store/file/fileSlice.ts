import { createSlice } from "@reduxjs/toolkit";
import { getFiles } from "./fileAction";

const initialState = {
    files: null
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
        builder.addCase(getFiles.fulfilled, (state, action)=>{
            state.files = action.payload.data
        })
        // builder.addCase(getDevices.rejected, (state, action)=>{
        //     state.files = null
        // })
    }
});

export const { setFiles } = fileSlice.actions;

export default fileSlice.reducer;