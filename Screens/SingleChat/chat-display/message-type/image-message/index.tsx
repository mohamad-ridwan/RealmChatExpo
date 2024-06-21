import { Image } from 'react-native'
import React from 'react'

type Props = {
    v: any
}

export default function ImageMessage({
    v
}: Props) {
    return (
        <Image source={{ uri: v.message.imageMessage.url }} style={{ width: 'auto', height: 200, resizeMode: 'cover' }} />
    )
}