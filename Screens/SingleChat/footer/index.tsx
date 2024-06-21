import { View, TouchableOpacity, TextInput, Image } from 'react-native'
import React, { Dispatch, SetStateAction } from 'react'
import { Entypo, Ionicons } from '@expo/vector-icons'
import i18n from '@/utils'

type Props = {
    styles: any
    message: string
    setMessage: Dispatch<SetStateAction<string>>
    pickImage: ()=>void
    onSendMessages: ()=>void
    image: any
    setImage: Dispatch<SetStateAction<any>>
}

export default function Footer({
    styles,
    message,
    setMessage,
    pickImage,
    onSendMessages,
    image,
    setImage
}: Props) {
    return (
        <View style={styles.sendMessage}>
            <View style={styles.messageBox}>
                <TouchableOpacity onPress={() => pickImage()}>
                    <Entypo name="attachment" size={20} color="black" />
                </TouchableOpacity>
                <TextInput
                    placeholder={i18n.t("Chats.WriteMessage")}
                    style={styles.messageInput}
                    value={message}
                    onChangeText={(text) => {
                        setMessage(text);
                    }}
                />
                <TouchableOpacity
                    onPress={() => onSendMessages()}
                    disabled={message.trim() === "" && image === "" ? true : false}
                >
                    <Ionicons
                        name="send"
                        size={24}
                        color={message.trim() === "" && image === "" ? "gray" : "#37dd55"}
                    />
                </TouchableOpacity>
            </View>
            {image !== "" ? (
                <View style={styles.selectedImageBox}>
                    <Image
                        source={{
                            uri: image,
                        }}
                        style={styles.selectedImage}
                        resizeMode={"contain"}
                    />
                    <TouchableOpacity onPress={() => setImage("")}>
                        <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            ) : null}
        </View>
    )
}