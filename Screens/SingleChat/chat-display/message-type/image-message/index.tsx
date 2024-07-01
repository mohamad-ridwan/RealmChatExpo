import { ActivityIndicator, Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsFullScreenViewer } from '@/store/chat/chatSlice'
import { RootState } from '@/store'

type Props = {
    v?: any
    generate?: any
    fontColor?: string
}

export default function ImageMessage({
    v,
    generate,
    fontColor
}: Props) {
    const [isPreloading, setIsPreloading] = useState<boolean>(true)

    const dispatch = useDispatch() as any
    const {
        imagesViewerData
    } = useSelector((state: RootState) => state.chatSlice)

    function handleClickImage(): void {
        const findIdx = imagesViewerData.findIndex((item: any) => item?.id === v?.key?.id)
        dispatch(setIsFullScreenViewer({ index: findIdx < 0 ? 0 : findIdx }))
    }

    useEffect(()=>{
        if(generate?.length > 0 || v.message?.imageMessage?.url){
            setTimeout(() => {
                setIsPreloading(false)
            }, 0);
        }
    },[generate, v])

    return (
        <View>
            {isPreloading ?
                <View style={styles.containerPlaceholder}>
                    <ActivityIndicator
                        animating
                        color={"gray"}
                        size="large"
                    />
                </View>
                :
                <TouchableHighlight onPress={handleClickImage}>
                    <Image
                        source={{ uri: generate ?? v.message.imageMessage.url }} style={{ width: 'auto', height: 200, resizeMode: 'cover' }}
                    />
                </TouchableHighlight>
            }
            {v?.message?.imageMessage?.caption &&
                <Text style={{ paddingTop: 5, paddingHorizontal: 5, color: fontColor, fontSize: 13.5 }}>
                    {v.message.imageMessage?.caption}
                </Text>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    containerPlaceholder: {
        height: 200,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    }
})