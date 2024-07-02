import { api } from "@/services/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const userLogin = createAsyncThunk(
    "login",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await api.post(
                `api/customer-service/login?token=${data.token}`,
                data
            )
            if (response.data.result) {
                return response.data
            }
            return rejectWithValue(response.data)
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getProfile = createAsyncThunk(
    "user-profile",
    async ({authToken}: any, { rejectWithValue }) => {
        try {
            const data = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            };

            const response = await api.post("api/customer-service/profile", {}, data);

            if (response.data.result) {
                api.defaults.headers.common["Authorization"] =
                    "Bearer " + authToken;

                return response.data;
            } else {
                return rejectWithValue(response.data);
            }
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);