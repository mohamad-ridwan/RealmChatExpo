import { Text } from 'react-native'
import React from 'react'

type Props = {
    v: any
    styles: any
    ellipsizeMode?: "head" | "tail" | "middle" | "clip" | undefined
}

export default function TextMessage({
    v,
    styles,
    ellipsizeMode
}: Props) {
    return (
        <Text
            style={styles}
            ellipsizeMode={ellipsizeMode}
        >
            {v.message?.extendedTextMessage?.text}
        </Text>
    )
}