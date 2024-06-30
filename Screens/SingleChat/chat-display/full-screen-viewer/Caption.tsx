import { View, Text, StyleSheet } from 'react-native'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

export default function Caption() {
    const {
        imagesViewerData: currentImages,
        singleUserChat: currentSingleUserChat,
        activeIdxFullScreenViewer
    } = useSelector((state: RootState) => state.chatSlice)
    const singleUserChat = currentSingleUserChat as any

    const currentCaption = useMemo(() => {
        const currentImg = currentImages.find((item, i) => i === activeIdxFullScreenViewer) as any
        const currentMessage = singleUserChat.messages.find((item: any) => item.key.id === currentImg.id)
        return currentMessage?.message?.imageMessage?.caption
    }, [currentImages, currentSingleUserChat, activeIdxFullScreenViewer])

    return (
        <View style={styles.container}>
            <Text style={styles.caption} numberOfLines={4}>{currentCaption}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%'
    },
    caption: {
        fontSize: 16,
        color: 'white',
        maxWidth: 350,
        maxHeight: 200,
        textAlign: 'left'
    }
})