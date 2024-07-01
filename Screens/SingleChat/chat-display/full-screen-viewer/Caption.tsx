import { View, Text, StyleSheet } from 'react-native'
import React, { ReactNode, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

type Props = {
    children?: ReactNode
}

export default function Caption({
    children
}: Props) {
    const {
        imagesViewerData: currentImages,
        singleUserChat: currentSingleUserChat,
        activeIdxFullScreenViewer
    } = useSelector((state: RootState) => state.chatSlice)
    const singleUserChat = currentSingleUserChat as any

    const currentCaption = useMemo(() => {
        const currentImg = currentImages.find((item, i) => i === activeIdxFullScreenViewer) as any
        const currentMessage = singleUserChat.messages.find((item: any) => item.key.id === currentImg.id)
        return currentMessage?.message?.imageMessage?.caption ?? currentMessage?.message?.videoMessage?.caption
    }, [currentImages, currentSingleUserChat, activeIdxFullScreenViewer])

    const currentType = useMemo(() => {
        const currentImg = currentImages.find((item, i) => i === activeIdxFullScreenViewer) as any
        const currentMessage = singleUserChat.messages.find((item: any) => item.key.id === currentImg.id)
        return currentMessage?.message?.videoMessage ? 'video/mp4' : null
    }, [currentImages, currentSingleUserChat, activeIdxFullScreenViewer])

    return (
        <View style={{
            ...styles.container,
            paddingVertical: currentCaption ? 10 : 0
        }}>
            <Text style={styles.caption} numberOfLines={8}>{currentCaption}</Text>

            {currentType === 'video/mp4' &&
                <>{children}</>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1
    },
    caption: {
        fontSize: 16,
        color: 'white',
        maxWidth: 350,
        maxHeight: 300,
        textAlign: 'left'
    }
})