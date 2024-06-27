import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loader: false,
    error: null,
    contacts: [],
}

const contactSlice = createSlice({
    name: "contact",
    initialState: initialState,
    reducers: {
        getAllContacts: (state, { payload }) => {
            state.contacts = payload;
        },
    },
    extraReducers(builder) {},
});

export const { getAllContacts } = contactSlice.actions;

export default contactSlice.reducer;