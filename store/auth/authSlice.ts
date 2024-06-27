import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { getProfile, userLogin } from "./authAction"

const initialState = {
    user: {},
    isLogin: false,
    loginErr: "",
    isMatch_pass: "",
    islogin: "",
    currentuser: "",
    valid_error: "",
    error: "",
    loader: true,
    devices: [],
    message: "",
    profileupdateerror: "",
    profileupdatestatus: "",
    // auth obj
    isAuthenticated: false,
    loginSuccess: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        userLoaded(state, action: PayloadAction<any>) {
            state.user = action.payload
        },
        loginSuccess(state, action: PayloadAction<any>) {
            state.loginSuccess = action.payload
            state.loader = false
        }
    },
    extraReducers(builder) {
        builder.addCase(userLogin.fulfilled, (state, action) => {
            state.isLogin = action.payload
        }),
        builder.addCase(getProfile.fulfilled, (state, action) => {
            state.user = action.payload.user
            state.isLogin = true
        }),
        builder.addCase(getProfile.rejected, (state, action) => {
            state.isLogin = false
        })
    },
})

export const {
    userLoaded,
    loginSuccess
} = authSlice.actions
export default authSlice.reducer