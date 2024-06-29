import { View } from 'react-native'
import React from 'react'
import TextMessage from '../message-type/text-message'
import MessageInfo from './MessageInfo'
import ImageMessage from '../message-type/image-message'
import Document from '../message-type/document'
import VideoMessage from '../message-type/video-message'

type Props = {
    styles: any
    v: any
}

export default function FromMe({
    styles,
    v
}: Props) {
    return (
        <View style={styles.contactMessage}>
            <View style={styles.contactTextMessageBox}>
                {/* TEXT */}
                {v.message?.extendedTextMessage?.text && <TextMessage v={v} styles={{ marginTop: 5, flex: 1, fontSize: 13 }}/>}
                {/* IMAGE */}
                {v.message?.imageMessage?.url && <ImageMessage v={v}/>}
                {/* VIDEO */}
                {v.message?.videoMessage?.url && <VideoMessage v={v}/>}
                {/* DOCUMENT FILE */}
                {v.message?.documentMessage?.title?.includes('.pdf') && <Document v={v}/>}
                {v.message?.documentMessage?.title?.includes('.mp3') && <Document v={v}/>}

                {/* MESSAGE INFO */}
                <MessageInfo v={v}/>
            </View>
        </View>
    )
}