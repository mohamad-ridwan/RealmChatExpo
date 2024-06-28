import { Image, Text, View } from 'react-native'
import React from 'react'

type Props = {
    v?: any
    generate?: any
}

export default function ImageMessage({
    v,
    generate
}: Props) {
    return (
        <View>
            <Image source={{ uri: generate ?? v.message.imageMessage.url }} style={{ width: 'auto', height: 200, resizeMode: 'cover' }} />
            {v?.message?.imageMessage?.caption &&
                <Text style={{ paddingTop: 5, paddingHorizontal: 5, marginBottom: -13 }}>
                    {v.message.imageMessage?.caption}
                </Text>
            }
        </View>
    )
}