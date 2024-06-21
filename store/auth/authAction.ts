import { api } from "@/services/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const userLogin = createAsyncThunk(
    "login",
    async (data: any, {rejectWithValue})=>{
        try {
            const response = await api.post(
                'api/customer-service/login',
                data
            )
            if(response.data.result){
                return response.data
            }
            return rejectWithValue(response.data)
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)