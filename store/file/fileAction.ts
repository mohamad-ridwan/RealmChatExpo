import { api } from "@/services/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getFiles = createAsyncThunk(
    "cloud-files",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await api.get("api/customer-service/cloud-storage", data);

            if (response.data.result) {
                return response.data;
            } else {
                return rejectWithValue(response.data);
            }
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);