import React, { ReactNode, useEffect } from 'react'
import { Appearance } from 'react-native'
import { setThemeColor, themeName } from '@/utils/storage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useColorScheme } from '@/hooks/useColorScheme';

type Props = {
    children: ReactNode
}

export default function ThemeConfig({children}: Props) {
    const colorScheme = useColorScheme();

    async function handleSetTheme(): Promise<void> {
        const currentTheme = await AsyncStorage.getItem(themeName)
        if(colorScheme === 'dark'){
            Appearance.setColorScheme('dark')
            setThemeColor('dark')
            return
        }
        if(currentTheme){
            Appearance.setColorScheme(currentTheme as any)
            return
        }
    }

    useEffect(() => {
        handleSetTheme()
    }, [])

    return (
        <>{children}</>
    )
}