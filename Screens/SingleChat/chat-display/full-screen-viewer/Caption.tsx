import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { ReactNode, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

type Props = {
    children?: ReactNode
}

export default function Caption({
    children
}: Props) {
    const [defaultNumberOfLines, setDefaultNumberOfLines] = useState<number | undefined>(12)
    const [numberOfLines, setNumberOfLines] = useState<number>(0)
    const [onLoadMore, setOnLoadMore] = useState<boolean>(true)

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

    function handleLoadMore(): void {
        setDefaultNumberOfLines(24)
        setOnLoadMore(false)
    }

    return (
        <View style={{
            ...styles.container,
            paddingVertical: currentCaption ? 10 : 0
        }}>
            <Text
                style={styles.caption}
                numberOfLines={defaultNumberOfLines}
                onTextLayout={(event) => {
                    const { lines } = event.nativeEvent
                    setNumberOfLines(lines?.length)
                }}
            >{currentCaption}</Text>
            {numberOfLines > 16 && onLoadMore &&
                <TouchableOpacity onPress={handleLoadMore}>
                    <Text style={{ color: 'white', marginLeft: 5, fontSize: 14, textAlign: 'left', borderBottomWidth: 1, borderBottomColor: 'white' }}>Read More</Text>
                </TouchableOpacity>
            }

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
        maxHeight: 500,
        textAlign: 'left'
    }
})