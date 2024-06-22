import { Image } from 'react-native'
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
        <Image source={{ uri: generate ?? v.message.imageMessage.url }} style={{ width: 'auto', height: 200, resizeMode: 'cover' }} />
    )
}