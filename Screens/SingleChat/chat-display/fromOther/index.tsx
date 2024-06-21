import { View, Image } from 'react-native'
import React from 'react'
import MessageInfo from './MessageInfo'
import TextMessage from '../message-type/text-message'

type Props = {
    styles: any
    v: any
}

export default function FromOther({
    styles,
    v
}: Props) {
    return (
        <View style={styles.userMessage}>
            {/* <Image
                source={{
                    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNR7FvvC_9X1l2xqi2rdkStAHaSRMmg89O_g&usqp=CAU",
                }}
                style={styles.avatarMessage}
                resizeMode={"contain"}
            /> */}

            <View style={styles.userTextMessageBox}>
                {/* TEXT */}
                {v.message?.extendedTextMessage?.text &&
                    <TextMessage
                        v={v}
                        styles={{
                            color: "black",
                            flex: 1,
                        }}
                        ellipsizeMode="tail"
                    />
                }
                {/* DOCUMENT */}
                {v?.hasMedia ? (

                    <Image source={{ uri: `data: ${v.media.mimetype};base64,${v.media.data}` }} style={{ height: 100 }} />
                ) : (null)}
                {/* MESSAGE INFO */}
                <MessageInfo v={v} />
            </View>
        </View>
    )
}