import { PayloadAction, createSlice } from "@reduxjs/toolkit"

const initialState = {
    isDark: false,
}

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        themeMode(state, action: PayloadAction<any>) {
            state.isDark = action.payload
        },
        handleThemeToggle(state, action: PayloadAction<void>) {
            state.isDark = !state.isDark
        }
    }
})

export const {
    themeMode,
    handleThemeToggle
} = themeSlice.actions
export default themeSlice.reducer