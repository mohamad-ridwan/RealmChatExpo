import axios from "axios";

export const api = axios.create({
    baseURL: "https://new-client.realm.chat/",
})