import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import React from 'react'
import FromOther from './fromOther'
import FromMe from './fromMe'
import FullScreenViewer from './full-screen-viewer'

type Props = {
    scrollRef: any
    loader: boolean
    singleUserChat: any
    styles: any
}

export default function ChatDisplay({
    scrollRef,
    loader,
    singleUserChat,
    styles
}: Props) {

    return (
        <ScrollView
            ref={scrollRef}
            onContentSizeChange={() => scrollRef.current.scrollToEnd({ animated: true })}
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