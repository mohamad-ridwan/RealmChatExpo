import { createSlice } from "@reduxjs/toolkit"
import { getChats, getMessages } from "./chatAction"

const initialState = {
    chats: [],
    singleUserChat: {},
    userChat: null,
    currentChatUser: null,
    newChatUser: "",
    loader: true,
    error: null,
    filtered: null,
    filteredConversation: null,
    chatImages: [],
    loadingResult: null,
    handleChatResult: null,
    handleChatUser: null,
    latest: [],
    prevChats: [],
    checkNumber: null,
    contacts: [],
    recentChats: [],
    currentPlaySound:{
        mediaKey: ''
    },
    currentPlayVideo: ''
}

const chatSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setLoader: (state, { payload }) => {
            state.loader = payload
        },
        setRecentChats: (state, { payload }) => {
            state.recentChats = payload;
        },
        setSingleUserChat: (state, { payload }) => {
            state.singleUserChat = payload
        },
        setCurrentPlaySound: (state, {payload})=>{
            state.currentPlaySound = payload
        },
        setCurrentPlayVideo: (state, {payload})=>{
            state.currentPlayVideo = payload
        },
        setJid: (state, {payload})=>{
            state.singleUserChat = {
                ...state.singleUserChat,
                jid: payload
            }
        },
        addNewMessages: (state, { payload }) => {
            const singleUserChat = (state.singleUserChat as any)?.messages
            const _messages = [...singleUserChat];
            const _listMessages: any = { ...state.singleUserChat };

            _messages?.unshift(payload);

            // _listMessages.messages = _messages;
            state.singleUserChat = {
                ...state.singleUserChat,
                messages: _messages
            }
        }
    },
    extraReducers(builder) {
        builder.addCase(getChats.fulfilled, (state, action) => {
            state.recentChats = action.payload
            state.loader = false
        }),
            builder.addCase(getChats.rejected, (state, action) => {
                state.recentChats = []
                state.loader = false
            }),
            builder.addCase(getMessages.fulfilled, (state, action) => {
                state.singleUserChat ={
                    ...state.singleUserChat,
                    ...action.payload
                }
                state.loader = false
            })
        builder.addCase(getMessages.rejected, (state, action) => {
            state.loader = false
        })
    },
})

export const {
    setLoader,
    setRecentChats,
    setSingleUserChat,
    addNewMessages,
    setCurrentPlaySound,
    setCurrentPlayVideo,
    setJid
} = chatSlice.actions
export default chatSlice.reducer