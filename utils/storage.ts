import AsyncStorage from "@react-native-async-storage/async-storage"

export const loginSessionName: 'currentuser' = 'currentuser'
export const themeName: 'currentTheme' = 'currentTheme'
export const notificationName: 'isNotification' = 'isNotification'

export type ThemeColorT = 'dark' | 'light'

export const setThemeColor = async (color: ThemeColorT): Promise<void>=>{
    await AsyncStorage.setItem(themeName, color)
}