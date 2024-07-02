import { View, StyleSheet, ImageBackground } from 'react-native'
import { Audio } from 'expo-av';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addNewMessages, setLoader, setSingleUserChat } from '@/store/chat/chatSlice';
import { getMessages } from '@/store/chat/chatAction';
import socketClient from '@/services/socket';
import Header from './header';
import ChatDisplay from './chat-display';
import Footer from './footer';
import UploadFile from './upload-file';
import ButtonToEndChat from './ButtonToEndChat';

type Props = {
    route: any
    navigation: any
}

export default function SingleChatScreens({
    route,
    navigation
}: Props) {
    const { colors } = useTheme();

    const scrollRef = useRef() as any

    const [inputValue, setInputValue] = useState("");
    const [message, setMessage] = useState("");
    const [isShowSearch, setIsShowSearch] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [socket, setSocket] = useState('')
    const [userId, setUserId] = useState('')
    // SOUND MESSAGE INSIDE
    const [sound, setSound] = useState<any>();
    const [isPlaying, setIsPlaying] = useState(false);
    const [messageIsUpdate, setMessageIsUpdate] = useState<any>(null)
    // UPLOAD FILE
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [attachment, setAttachment] = useState<any>(null)

    const [onBtnToBottom, setOnBtnToBottom] = useState<boolean>(false)
    const [footerHeight, setFooterHeight] = useState<number>(0)

    const { userData, device } = route.params
    const { devices } = useSelector((state: RootState) => state.deviceSlice)
    const {
        singleUserChat: currentSingleUserChat,
        loader,
        recentChats: currentRecentChats
    } = useSelector((state: RootState) => state.chatSlice)
    const singleUserChat: any = currentSingleUserChat
    const recentChats: any = currentRecentChats
    const dispatch = useDispatch() as any

    // GET SINGLE CHAT HERE
    function loadMessagesAPI(): void {
        const body = {
            deviceId: device?.device_key ?? null,
            chatId: singleUserChat?.jid
        }
        dispatch(getMessages({ data: body }))
    }

    // CREATE SOUND MESSAGE INSIDE
    const loadAudio = async () => {
        const { sound } = await Audio.Sound.createAsync(require('@/assets/audio/sound-message-inside.mp3'));
        setSound(sound);
        sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    };

    const onPlaybackStatusUpdate = (status: any) => {
        if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
        }
    };

    useEffect(() => {
        loadAudio()
        dispatch(setLoader(true))
        loadMessagesAPI()
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [])

    // IMAGE PICKER
    async function pickImage(): Promise<void> {
        setModalVisible(!modalVisible)
        // No permissions request is necessary for launching the image library
        // let result = await ImagePicker.launchImageLibraryAsync({
        //     mediaTypes: ImagePicker.MediaTypeOptions.All,
        //     allowsEditing: true,
        //     aspect: [4, 4],
        //     quality: 1,
        //     base64: true
        // });

        // if (!result.canceled) {
        //     if (result.assets[0]?.base64) {
        //         setImage(`data:image/jpeg;base64,${result.assets[0].base64}`)
        //     } else {
        //         setImage(result.assets[0].uri);
        //     }
        // }
    }
    // -----IMAGE PICKER-----

    async function onSendMessages(): Promise<void> {
        // if (message.trim() === '') {
        //     return
        // }

        const _data = {
            accountid: device?.device_key,
            number: userData?.chat_id,
            message: message,
            type: 'text',
            fileUrl: attachment ?
                `https://new-client.realm.chat/cloud_storage/${attachment.file_url}`
                : null,
            messageId: `${Math.random().toString(36).substring(2, 36)}${Math.random()
                .toString(36)
                .substring(2, 36)}${Math.random()
                    .toString(36)
                    .substring(2, 36)}${Math.random().toString(36).substring(2, 36)}`
        }

        await socketClient.emit("send-message", _data);

        let res: any = null

        function createDataToNewMessage(
            message: any
        ): any {
            res = {
                device_id: device?.device_key,
                jid: userData?.chat_id,
                messages: {
                    key: {
                        MetaMessageID: '',
                        deviceId: device?.device_key,
                        directMediaLink: '',
                        fromMe: true,
                        id: _data.messageId,
                        isOfficial: true,
                        participant: userData?.chat_id,
                        remoteJid: userData?.chat_id
                    },
                    message,
                    messageTimestamp: new Date().getTime(),
                    statusText: "PENDING",
                    status: 1
                },
            }
        }

        if (attachment?.file_type === "image") {
            createDataToNewMessage({
                imageMessage: {
                    caption: _data.message,
                    url: _data.fileUrl
                },
            })
        } else if (attachment?.file_type === "video") {
            createDataToNewMessage({
                videoMessage: {
                    caption: _data.message,
                    url: _data.fileUrl
                },
            })
        } else if (attachment?.file_type === "document") {
            createDataToNewMessage({
                documentMessage: {
                    title: attachment?.file_url,
                    url: _data.fileUrl
                },
            })
        } else if (attachment?.file_type === "audio") {
            createDataToNewMessage({
                documentMessage: {
                    title: attachment?.file_url,
                    url: _data.fileUrl
                },
            })
        } else {
            createDataToNewMessage({
                extendedTextMessage: {
                    text: _data.message,
                },
            })
        }

        let _singleUserChat = { ...singleUserChat }

        if (_singleUserChat) {
            _singleUserChat.messages = [res?.messages, ..._singleUserChat?.messages]
        }

        if (userData?.chat_id === res?.jid) {
            dispatch(setSingleUserChat(_singleUserChat))
        }

        setMessage('')
        setAttachment(null)
    }

    // useEffect(() => {
    //     if (recentChats) {
    //         if (singleUserChat) {
    //             let _singleUserChat = {
    //                 ...recentChats.find((e: any) => e.jid === userData?.chat_id),
    //             };

    //             if (_singleUserChat) {
    //                 dispatch(setSingleUserChat(_singleUserChat));
    //             }
    //         }
    //     }
    // }, [recentChats])

    // UPDATE MESSAGE ON SOCKET.IO
    const playSoundToNotif = useCallback(async () => {
        if (sound) {
            if (isPlaying) {
                await sound.replayAsync()
            } else {
                await sound.playAsync();
            }
        }
    }, [sound, isPlaying])

    const chat_id = useMemo(() => {
        const jid = singleUserChat?.jid
        const chat_id = jid?.replace("@s.whatsapp.net", "")

        return chat_id
    }, [])

    const updateMessage = useCallback((res: any, chat_id: any) => {
        if (
            device?.device_key === res.device_id &&
            // (Number(userData?.chat_id?.replace("@s.whatsapp.net", "")) === Number(res.jid))
            chat_id == res.jid
        ) {
            dispatch(addNewMessages(res.messages))
        }
    }, [])

    useEffect(() => {
        if (messageIsUpdate) {
            updateMessage(messageIsUpdate, chat_id)
        }
    }, [messageIsUpdate])

    useEffect(() => {
        socketClient.on("message-update", ((res: any) => {
            setMessageIsUpdate(res)
        }))
    }, [])

    // useEffect(() => {
    //     socketClient.on("message-update", (res: any) => {
    //         if (
    //             device?.device_key === res.device_id &&
    //             userData?.chat_id?.replace("@s.whatsapp.net", "") === res.jid
    //         ) {
    //             playSoundToNotif()
    //         }
    //     })
    // }, [userData, sound, isPlaying])
    // ---- UPDATE MESSAGE ON SOCKET.IO

    const currentBottomBtn = useMemo(() => {
        const height = Math.floor(footerHeight)
        return height + 20
    }, [footerHeight])

    function handleToBottom(): void {
        scrollRef.current.scrollToEnd({ animated: true })
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.card }]}>
            <ImageBackground source={require('@/assets/images/bg-chat.png')} style={{
                flex: 1,
            }}>
                <View style={{
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                    zIndex: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.1)'
                }} />
                {/* MODAL UPLOAD FILE / SEND FILE */}
                <UploadFile
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    setAttachment={setAttachment}
                    attachment={attachment}
                />
                <Header
                    isShowSearch={isShowSearch}
                    styles={styles}
                    setSearchText={setSearchText}
                    setIsShowSearch={setIsShowSearch}
                    navigation={navigation}
                    route={route}
                />

                <ChatDisplay
                    scrollRef={scrollRef}
                    loader={loader}
                    singleUserChat={singleUserChat}
                    styles={styles}
                    onBtnToBottom={onBtnToBottom}
                    setOnBtnToBottom={setOnBtnToBottom}
                />

                <Footer
                    styles={styles}
                    message={message}
                    setMessage={setMessage}
                    pickImage={pickImage}
                    onSendMessages={onSendMessages}
                    attachment={attachment}
                    setAttachment={setAttachment}
                    setFooterHeight={setFooterHeight}
                />
            </ImageBackground>
            {/* Button To Bottom */}
            {onBtnToBottom &&
                <ButtonToEndChat
                    currentBottomBtn={currentBottomBtn}
                    handleToBottom={handleToBottom}
                />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    head: {
        marginTop: 20,
        display: "flex",
    },
    goBackBtn: {

    },
    header: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    item: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        marginBottom: 8,
        borderBottomColor: "#CDCDCD",
        borderBottomWidth: 1,
    },
    leftSide: {
        padding: 5,
    },
    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        // borderWidth: 1,
        borderRadius: 5,
        padding: 2,
    },
    searchInput: {
        flex: 1,
        padding: 5,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 80,
    },
    middle: {
        flex: 1,
        padding: 5,
    },

    avatarMessage: {
        width: 30,
        height: 30,
        borderRadius: 100,
        margin: 5,
        marginBottom: 0,
    },

    userMessage: {
        paddingHorizontal: 5,
        paddingVertical: 2,
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
    },
    userTextMessageBox: {
        backgroundColor: "white",
        padding: 10,
        borderTopEndRadius: 10,
        borderBottomEndRadius: 10,
        borderTopStartRadius: 10,
        maxWidth: 250,
        width: "100%",
    },
    contactMessage: {
        marginTop: 2,
        marginRight: 5,
        display: "flex",
        flexDirection: "row",
        // alignItems: "flex-end",
        justifyContent: "flex-end",
    },
    contactTextMessageBox: {
        backgroundColor: "#D9FDD3",
        padding: 10,
        borderTopEndRadius: 10,
        borderBottomEndRadius: 0,
        borderBottomStartRadius: 10,
        borderTopStartRadius: 10,
        maxWidth: 250,
        width: "100%",
    },
    message: {
        color: "#CDCDCD",
        paddingTop: 5,
    },
    rightSide: {
        padding: 5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
    selectedImageBox: {
        padding: 10,
        // backgroundColor: "#e0e0e0",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 10
    },
    selectedImage: {
        width: 100,
        height: 100,
    },
    sendMessage: {
        // backgroundColor: "#F0F2F5",
        paddingTop: 10,
        paddingBottom: 10,
    },
    messageBox: {
        // backgroundColor: "#EAECF2",
        paddingLeft: 10,
        paddingRight: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 8,
        width: '80%'
    },
    messageInput: {
        minHeight: 40,
        maxHeight: 130,
        marginRight: 5,
        marginLeft: 5,
        width: '100%',
    },
});