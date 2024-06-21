import { createSlice } from "@reduxjs/toolkit";
import { getDevices } from "./deviceAction";

const initialState = {
    device: null,
    devices: [],
    loading: false,
}

const deviceSlice = createSlice({
    name: "device",
    initialState: initialState,
    reducers: {
        setDevice: (state, { payload }) => {
            state.device = payload;
        },
    },
    extraReducers(builder) {
        builder.addCase(getDevices.fulfilled, (state, action)=>{
            state.devices = action.payload.data
        }),
        builder.addCase(getDevices.rejected, (state, action)=>{
            state.devices = []
        })
    },
});

export const { setDevice } = deviceSlice.actions;

export default deviceSlice.reducer;