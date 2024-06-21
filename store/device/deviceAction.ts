import { loginSessionName } from "@/utils/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getDevices = createAsyncThunk(
  "get-devices",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem(loginSessionName)
      const newToken = JSON.parse(token as string)
      const response = await axios.get("https://new-client.realm.chat/api/customer-service/device", {
        headers: {
          'Authorization': `Bearer ${newToken.token}`
        }
      });
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
