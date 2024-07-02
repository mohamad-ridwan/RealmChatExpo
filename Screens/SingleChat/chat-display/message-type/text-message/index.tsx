import { Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

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
    // ON LOAD MORE MESSAGE
    const [defaultNumberOfLines, setDefaultNumberOfLines] = useState<number | undefined>(16)
    const [numberOfLines, setNumberOfLines] = useState<number>(0)
    const [onLoadMore, setOnLoadMore] = useState<boolean>(true)

    function handleLoadMore():void{
        setDefaultNumberOfLines(undefined)
        setOnLoadMore(false)
    }

    return (
        <>
            <Text
                style={styles}
                ellipsizeMode={ellipsizeMode}
                numberOfLines={defaultNumberOfLines}
                onTextLayout={(event) => {
                    const { lines } = event.nativeEvent
                    setNumberOfLines(lines?.length)
                }}
            >
                {v.message?.extendedTextMessage?.text}
            </Text>
            {numberOfLines > 16 && onLoadMore &&
                <TouchableOpacity onPress={handleLoadMore}>
                    <Text style={{ color: '#0077B6', fontSize: 14 }}>Read More</Text>
                </TouchableOpacity>
            }
        </>
    )
}