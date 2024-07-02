import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons'
import { useTheme } from '@react-navigation/native'
import { useColorScheme } from '@/hooks/useColorScheme';

type Props = {
    currentBottomBtn: number
    handleToBottom: () => void
}

export default function ButtonToEndChat({
    currentBottomBtn,
    handleToBottom
}: Props) {
    const colorScheme = useColorScheme();
    const { colors } = useTheme();

    return (
        <View style={{
            position: 'absolute',
            bottom: currentBottomBtn,
            right: 20,
            borderRadius: 30,
            height: 30,
            width: 30,
            zIndex: 1,
            backgroundColor: colorScheme === 'dark' ? '#252526' : 'white',
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 50 },
            shadowOpacity: 0.9,
            shadowRadius: 1,
        }}>
            <TouchableOpacity onPress={handleToBottom}>
                <FontAwesome name="angle-double-down" size={22} color={colors.text} />
            </TouchableOpacity>
        </View>
    )
}