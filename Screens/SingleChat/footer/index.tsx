import { View, TouchableOpacity, TextInput, Image, Text } from 'react-native'
import React, { Dispatch, SetStateAction, useMemo } from 'react'
import { Entypo, Ionicons } from '@expo/vector-icons'
import i18n from '@/utils'

type Props = {
    styles: any
    message: string
    setMessage: Dispatch<SetStateAction<string>>
    pickImage: () => void
    onSendMessages: () => void
    attachment: any
    setAttachment: Dispatch<SetStateAction<any>>
}

export default function Footer({
    styles,
    message,
    setMessage,
    pickImage,
    onSendMessages,
    attachment,
    setAttachment
}: Props) {

    const currentFile = useMemo(() => {
        if (attachment) {
            if (attachment?.file_type === 'image') {
                return <Image
                    source={{
                        uri: `https://new-client.realm.chat/cloud_storage/${attachment.file_url}`,
                    }}
                    style={styles.selectedImage}
                    resizeMode={"contain"}
                />
            } else if (attachment?.file_type === 'video') {
                return <Image
                    source={require('@/assets/icons/file/video.png')}
                    style={styles.selectedImage}
                    resizeMode={"contain"}
                />
            } else if (attachment?.file_type === 'document') {
                return <Image
                    source={require('@/assets/icons/file/document.png')}
                    style={styles.selectedImage}
                    resizeMode={"contain"}
                />
            } else if (attachment?.file_type === 'audio') {
                return <Image
                    source={require('@/assets/icons/file/audio.png')}
                    style={styles.selectedImage}
                    resizeMode={"contain"}
                />
            }
        }
        return <></>
    }, [attachment])

    return (
        <View style={styles.sendMessage}>
            {attachment ? (
                <View style={styles.selectedImageBox}>
                    <View style={{
                        gap: 4
                    }}>
                        {currentFile}
                        <Text style={{ fontSize: 12, width: 300 }} numberOfLines={1}>{attachment.file_name}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setAttachment(null)}>
                        <Ionicons name="close" size={24} color="#54656F" />
                    </TouchableOpacity>
                </View>
            ) : null}
            <View style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                marginHorizontal: 12,
                width: 'auto'
            }}>
                <TouchableOpacity onPress={() => pickImage()} style={{
                    marginBottom: 8
                }}>
                    <Entypo name="attachment" size={20} color="#54656F" />
                </TouchableOpacity>
                <View style={styles.messageBox}>
                    <TextInput
                        placeholder={i18n.t("Chats.WriteMessage")}
                        style={styles.messageInput}
                        value={message}
                        multiline
                        numberOfLines={2}
                        onChangeText={(text) => {
                            setMessage(text);
                        }}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => onSendMessages()}
                    disabled={message.trim() === "" && !attachment ? true : false}
                    style={{
                        marginBottom: 8
                    }}
                >
                    <Ionicons
                        name="send"
                        size={24}
                        color={message.trim() === "" && !attachment ? "gray" : "#37dd55"}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}