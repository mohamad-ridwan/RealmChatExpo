import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { DarkTheme, DefaultTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '@/Screens/Home'
import LoginScreen from '@/Screens/Login'
import AllChatScreen from '@/Screens/AllChat'
import SingleChatScreens from '@/Screens/SingleChat'
import socketClient from '@/services/socket'
import ContactsScreen from '@/Screens/Contacts'
import SettingsScreen from '@/Screens/Settings'
import DeviceScreens from '@/Screens/Devices'
import ProfileSettingScreen from '@/Screens/ProfileSetting'
import CameraScreen from '@/Screens/Camera'

const Stack = createStackNavigator();

export default function Navigation() {
    const { devices } = useSelector((state: RootState) => state.deviceSlice)
    const isDark = useSelector((state: RootState) => state.themeSlice.isDark)
    const appTheme = isDark ? DarkTheme : DefaultTheme

    useEffect(() => {
        if (devices.length) {
            const _devices: any = [];

            devices.map((item: any) => {
                _devices.push(item.device_key);
            });

            socketClient.emit("device-list", { id: socketClient.id, devices: _devices });
        }
    }, [devices])

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name='Home' component={HomeScreen} />
            <Stack.Screen name='Login' component={LoginScreen} />
            <Stack.Screen name='AllChat' component={AllChatScreen} />
            <Stack.Screen name='SingleChat' component={SingleChatScreens} />
            <Stack.Screen name='Contacts' component={ContactsScreen} />
            <Stack.Screen name='Settings' component={SettingsScreen} />
            <Stack.Screen name='Devices' component={DeviceScreens} />
            <Stack.Screen name='ProfileSetting' component={ProfileSettingScreen} />
            <Stack.Screen name='Camera' component={CameraScreen} />
        </Stack.Navigator>
    )
}