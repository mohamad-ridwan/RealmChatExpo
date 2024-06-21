import { configureStore } from '@reduxjs/toolkit'
import authSlice from './auth/authSlice'
import themeSlice from './theme/themeSlice'
import chatSlice from './chat/chatSlice'
import deviceSlice from './device/deviceSlice'

export const store = configureStore({
  reducer: {
    authSlice,
    themeSlice,
    chatSlice,
    deviceSlice
  },
  middleware: (getDefaultMiddleware)=>getDefaultMiddleware({serializableCheck: false}),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch