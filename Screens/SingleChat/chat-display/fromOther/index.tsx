import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MessageInfo from './MessageInfo'
import TextMessage from '../message-type/text-message'
import ImageMessage from '../message-type/image-message'
import Document from '../message-type/document'
import { useDispatch } from 'react-redux'
import { downloadMedia } from '@/store/chat/chatAction'
import VideoMessage from '../message-type/video-message'
import AudioMessage from '../message-type/audio-message'

type Props = {
    styles: any
    v: any
}

export default function FromOther({
    styles,
    v,
}: Props) {
    const [generateImg, setGenerateImg] = useState<any>('')
    const [generateVideo, setGenerateVideo] = useState<any>('')
    const [generateDocument, setGenerateDocument] = useState<any>('')
    const [generateAudio, setGenerateAudio] = useState<any>('')

    const dispatch = useDispatch() as any

    function handleGetType(url: string): void {
        if (v?.message?.imageMessage) {
            setGenerateImg(`data:image/jpeg;base64,${url}`)
        } else if (v?.message?.videoMessage) {
            setGenerateVideo(`data:video/mp4;base64,${url}`)
        } else if (v?.message?.documentMessage) {
            setGenerateDocument(url)
        } else if (v?.message?.audioMessage) {
            setGenerateAudio(`data:audio/mpeg;base64,${url}`)
        }
    }

    async function generateFiles(): Promise<void> {
        const result = await dispatch(downloadMedia({ id: v.key.mediaKey, deviceId: v.key.deviceId }))
        if (result.type === 'team-inbox/media/fulfilled') {
            handleGetType(result.payload)
        }
    }

    useEffect(() => {
        if (v?.key?.mediaKey) {
            generateFiles()
        }
    }, [v])

    return (
        <View style={styles.userMessage}>
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
                {/* IMAGE */}
                {v.message?.imageMessage && generateImg && <ImageMessage generate={generateImg} v={v}/>}
                {/* VIDEO */}
                {v.message?.videoMessage && generateVideo && <VideoMessage generate={generateVideo} v={v} />}
                {/* DOCUMENT FILE */}
                {v.message?.documentMessage && generateDocument && <Document generate={generateDocument} v={v}/>}
                {/* {v.message?.documentMessage && generateAudio && <Document />} */}
                {/* AUDIO */}
                {v.message?.audioMessage && generateAudio &&
                    <AudioMessage
                        urlAudio={generateAudio}
                        v={v}
                    />}

                {/* MESSAGE INFO */}
                <MessageInfo v={v} />
            </View>
        </View>
    )
}