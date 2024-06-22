import { View, StyleSheet } from 'react-native'
import { Audio } from 'expo-av';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addNewMessages, setLoader, setSingleUserChat } from '@/store/chat/chatSlice';
import { getMessages } from '@/store/chat/chatAction';
import moment from 'moment';
import socketClient from '@/services/socket';
import Header from './header';
import ChatDisplay from './chat-display';
import Footer from './footer';

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
    const [image, setImage] = useState("");
    const [socket, setSocket] = useState('')
    const [userId, setUserId] = useState('')
    // SOUND MESSAGE INSIDE
    const [sound, setSound] = useState<any>();
    const [isPlaying, setIsPlaying] = useState(false);

    const { userData, device } = route.params
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
            chatId: userData.chat_id
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

    async function pickImage(): Promise<void> {

    }

    async function onSendMessages(): Promise<void> {
        if (message.trim() === '') {
            return
        }

        const _data = {
            accountid: device?.device_key,
            number: userData?.chat_id,
            message: message,
            type: 'text',
            fileUrl: null,
            messageId: `${Math.random().toString(36).substring(2, 36)}${Math.random()
                .toString(36)
                .substring(2, 36)}${Math.random()
                    .toString(36)
                    .substring(2, 36)}${Math.random().toString(36).substring(2, 36)}`
        }

        await socketClient.emit("send-message", _data);

        let res: any = null

        res = {
            device_id: device?.device_key,
            jid: userData?.chat_id,
            messages: {
                key: {
                    fromMe: true,
                    id: _data.messageId,
                    remoteJid: userData?.chat_id
                },
                message: {
                    extendedTextMessage: {
                        text: _data.message,
                    },
                },
                messageTimestamp: `${moment().unix()}`,
                status: "PENDING",
            },
            status: 0
        }

        let _singleUserChat = { ...singleUserChat }

        if (_singleUserChat) {
            _singleUserChat.messages = [res?.messages, ..._singleUserChat?.messages]
        }

        if (userData?.chat_id === res?.jid) {
            dispatch(setSingleUserChat(_singleUserChat))
        }

        setMessage('')
    }

    useEffect(() => {
        if (recentChats) {
            if (singleUserChat) {
                let _singleUserChat = {
                    ...recentChats.find((e: any) => e.jid === userData?.chat_id),
                };

                if (_singleUserChat) {
                    dispatch(setSingleUserChat(_singleUserChat));
                }
            }
        }
    }, [recentChats])

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

    useEffect(() => {
        socketClient.on("message-update", (res: any) => {
            console.log("RESPONSE", res);
            if (
                device?.device_key === res.device_id &&
                userData?.chat_id?.replace("@s.whatsapp.net", "") === res.jid
            ) {
                dispatch(addNewMessages(res.messages))
            }
        })
    }, [userData])

    useEffect(() => {
        socketClient.on("message-update", (res: any) => {
            if (
                device?.device_key === res.device_id &&
                userData?.chat_id?.replace("@s.whatsapp.net", "") === res.jid
            ) {
                playSoundToNotif()
            }
        })
    }, [userData, sound, isPlaying])
    // ---- UPDATE MESSAGE ON SOCKET.IO

    return (
        <View style={[styles.container, { backgroundColor: colors.card }]}>
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
            />

            <Footer
                styles={styles}
                message={message}
                setMessage={setMessage}
                pickImage={pickImage}
                onSendMessages={onSendMessages}
                image={image}
                setImage={setImage}
            />
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
        marginTop: 5,
        padding: 5,
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
    },
    userTextMessageBox: {
        backgroundColor: "#ddd",
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
        backgroundColor: "#01E05B",
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
        backgroundColor: "#e0e0e0",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    selectedImage: {
        width: 100,
        height: 100,
    },
    sendMessage: {
        backgroundColor: "#fff",
        paddingTop: 10,
        paddingBottom: 10,
    },
    messageBox: {
        backgroundColor: "#EAECF2",
        paddingLeft: 10,
        paddingRight: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    messageInput: {
        height: 50,
        marginRight: 5,
        marginLeft: 5,
        flex: 1,
    },
});