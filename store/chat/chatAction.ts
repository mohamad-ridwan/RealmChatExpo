import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getChats = createAsyncThunk(
    'chat-list2',
    async ({ id, data }: any, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `https://new-api.realm.chat/team-inbox/chat-list2/${id}`,
                data
            );
            return response.data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getMessages = createAsyncThunk(
    "chat-messages",
    async ({ data }: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                'https://new-api.realm.chat/team-inbox/chat-messages',
                data
            );

            return response.data;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const downloadMedia = createAsyncThunk(
    "team-inbox/media",
    async ({ id, deviceId }: any, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `https://new-api.realm.chat/team-inbox/media/${id}/${deviceId}`
            );

            if (response.data) {
                return response.data;
            } else {
                return rejectWithValue(response.data)
            }
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);