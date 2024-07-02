import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import FromOther from './fromOther'
import FromMe from './fromMe'
import FullScreenViewer from './full-screen-viewer'

type Props = {
    scrollRef: any
    loader: boolean
    singleUserChat: any
    styles: any
    onBtnToBottom: boolean
    setOnBtnToBottom: Dispatch<SetStateAction<boolean>>
}

export default function ChatDisplay({
    scrollRef,
    loader,
    singleUserChat,
    styles,
    onBtnToBottom,
    setOnBtnToBottom
}: Props) {
    const [currentHeight, setCurrentHeight] = useState<number>(0)
    const [currentLayoutHeight, setCurrentLayoutHeight] = useState<number>(0)

    useEffect(() => {
        if (scrollRef) {
            scrollRef.current.scrollToEnd({ animated: true })
        }
    }, [scrollRef, singleUserChat])

    function handleScroll(event: any): void {
        const offsetY = Math.floor(event.nativeEvent.contentOffset.y) + Math.floor(currentLayoutHeight)
        if (offsetY > (currentHeight - 300)) {
            setOnBtnToBottom(false)
            return
        }
        setOnBtnToBottom(true)
    }

    return (
        <ScrollView
            ref={scrollRef}
            onScroll={handleScroll}
            onLayout={(event) => {
                const { x, y, height, width } = event.nativeEvent.layout;
                setCurrentLayoutHeight(height)
            }}
            onContentSizeChange={(w, h) => {
                setCurrentHeight(Math.floor(h))
            }}
        // onContentSizeChange={() => scrollRef.current.scrollToEnd({ animated: true })}
        >
            {loader ? (
                <ActivityIndicator size="large" color="#01E05B" />
            ) : (
                <View style={{
                    paddingBottom: 20
                }}>
                    {/* Full Screen Viewer */}
                    <FullScreenViewer />
                    <Text style={{ textAlign: "center" }}>
                        {singleUserChat?.messages?.length === 0 ? "No Recent Chat Found!" : ""}
                    </Text>
                    {singleUserChat?.messages &&
                        singleUserChat.messages
                            .slice()
                            .reverse()
                            .map((v: any, i: any) => {
                                if (v.key.fromMe === false) {
                                    return (
                                        <FromOther
                                            key={i}
                                            v={v}
                                            styles={styles}
                                        />
                                    );
                                } else {
                                    return (
                                        <FromMe
                                            key={i}
                                            v={v}
                                            styles={styles}
                                        />
                                    );
                                }
                            })}
                </View>
            )}
        </ScrollView>
    )
}