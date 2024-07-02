import { View, TouchableOpacity, TextInput, Image, Text } from 'react-native'
import React, { Dispatch, SetStateAction, useMemo } from 'react'
import { Entypo, Ionicons } from '@expo/vector-icons'
import i18n from '@/utils'
import { useTheme } from '@react-navigation/native'

type Props = {
    styles: any
    message: string
    setMessage: Dispatch<SetStateAction<string>>
    pickImage: () => void
    onSendMessages: () => void
    attachment: any
    setAttachment: Dispatch<SetStateAction<any>>
    setFooterHeight: Dispatch<SetStateAction<number>>
}

export default function Footer({
    styles,
    message,
    setMessage,
    pickImage,
    onSendMessages,
    attachment,
    setAttachment,
    setFooterHeight
}: Props) {
    const { colors } = useTheme();

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
        <View
            style={{
                ...styles.sendMessage,
                backgroundColor: colors.background
            }}
            onLayout={(event) => {
                const { x, y, height, width } = event.nativeEvent.layout;
                setFooterHeight(height)
            }}
        >
            {attachment ? (
                <View style={styles.selectedImageBox}>
                    <View style={{
                        gap: 4
                    }}>
                        {currentFile}
                        <Text style={{ fontSize: 12, width: 300, color: colors.text }} numberOfLines={1}>{attachment.file_name}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setAttachment(null)}>
                        <Ionicons name="close" size={24} color={colors.text} />
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
                <View style={{
                    ...styles.messageBox,
                    backgroundColor: colors.background
                }}>
                    <TextInput
                        placeholder={i18n.t("Chats.WriteMessage")}
                        style={{
                            ...styles.messageInput,
                            backgroundColor: colors.background,
                            color: colors.text
                        }}
                        value={message}
                        multiline
                        numberOfLines={2}
                        placeholderTextColor={colors.text}
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