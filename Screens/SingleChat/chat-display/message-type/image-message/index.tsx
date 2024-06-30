import { Image, Text, TouchableHighlight, View } from 'react-native'
import React from 'react'
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
    const dispatch = useDispatch() as any
    const {
        imagesViewerData
    } = useSelector((state: RootState) => state.chatSlice)

    function handleClickImage():void{
        const findIdx = imagesViewerData.findIndex((item:any)=>item.id === v?.key?.id)
        dispatch(setIsFullScreenViewer({index: findIdx}))
    }

    return (
        <View>
            <TouchableHighlight onPress={handleClickImage}>
                <Image
                    source={{ uri: generate ?? v.message.imageMessage.url }} style={{ width: 'auto', height: 200, resizeMode: 'cover' }}
                />
            </TouchableHighlight>
            {v?.message?.imageMessage?.caption &&
                <Text style={{ paddingTop: 5, paddingHorizontal: 5, color: fontColor, fontSize: 13.5 }}>
                    {v.message.imageMessage?.caption}
                </Text>
            }
        </View>
    )
}