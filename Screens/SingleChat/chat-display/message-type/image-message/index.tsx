import { Image, Text, View } from 'react-native'
import React from 'react'

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
    return (
        <View>
            <Image source={{ uri: generate ?? v.message.imageMessage.url }} style={{ width: 'auto', height: 200, resizeMode: 'cover' }} />
            {v?.message?.imageMessage?.caption &&
                <Text style={{ paddingTop: 5, paddingHorizontal: 5, color: fontColor, fontSize: 13.5 }}>
                    {v.message.imageMessage?.caption}
                </Text>
            }
        </View>
    )
}