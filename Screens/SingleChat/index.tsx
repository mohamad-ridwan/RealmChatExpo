import { View, StyleSheet, Platform } from 'react-native'
import { Audio } from 'expo-av';
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

const notificationCategories = [
    {
        identifier: 'message',
        actions: [
            {
                identifier: 'markAsRead',
                buttonTitle: 'Mark as Read',
                options: {
                    opensAppToForeground: true,
                },
            },
            {
                identifier: 'reply',
                buttonTitle: 'Reply',
                textInput: {
                    submitButtonTitle: 'Send',
                    placeholder: 'Type your reply...',
                },
                options: {
                    opensAppToForeground: true,
                },
            },
        ],
    },
];

async function sendPushNotification(expoPushToken: string) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Original Title',
        body: 'And here is the body!',
        data: { someData: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
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
    // NOTIFICATION
    const [expoPushToken, setExpoPushToken] = useState('');
    const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(
        undefined
    );
    const [isUpdateToken, setIsUpdateToken] = useState<boolean>(false)
    const [messageIsUpdate, setMessageIsUpdate] = useState<any>(null)
    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

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
            fileUrl: image !== "" ? image : null,
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

    async function scheduleNotification() {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "You've got mail! 📬",
                body: 'Swipe down to see more options.',
                categoryIdentifier: 'message', // Specify the category identifier
            },
            trigger: {
                seconds: 2,
            },
        });
    }

    useEffect(() => {
        const subscription = Notifications.addPushTokenListener((token) => {
            console.log('new token', token)
        });
        return () => subscription.remove();
    }, []);

    function handleRegistrationError(errorMessage: string) {
        alert(errorMessage);
        throw new Error(errorMessage);
    }

    async function schedulePushNotification() {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "You've got mail! 📬",
                body: 'Here is the notification body',
                data: { data: 'goes here', test: { test1: 'more data' } },
                sound: true
            },
            trigger: { seconds: 2 },
        });
    }

    // async function getCategoryNotifications(): Promise<void> {
    //     await Notifications.setNotificationCategoryAsync(notificationCategories[0].identifier, notificationCategories[0].actions);
    // }

    async function registerForPushNotificationsAsync() {
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
                sound: 'notif.wav'
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                handleRegistrationError('Permission not granted to get push token for push notification!');
                return;
            }
            const projectId =
                Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
            if (!projectId) {
                handleRegistrationError('Project ID not found');
            }
            try {
                const pushTokenString = (
                    await Notifications.getExpoPushTokenAsync()
                ).data;
                // console.log(pushTokenString);

                return pushTokenString;
            } catch (e: unknown) {
                handleRegistrationError(`${e}`);
            }
        } else {
            handleRegistrationError('Must use physical device for push notifications');
        }
    }

    useEffect(() => {
        registerForPushNotificationsAsync()
            .then(token => {
                setExpoPushToken(token ?? '')
            })
            .catch((error: any) => setExpoPushToken(`${error}`));

        if (Platform.OS === 'android') {
            Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
        }
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        // responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        //     const actionIdentifier = response.actionIdentifier;
        //     const userText = response.notification.request.content

        //     if (actionIdentifier === 'markAsRead') {
        //         console.log('Notification marked as read');
        //     } else if (actionIdentifier === 'reply') {
        //         console.log('User replied:', response);
        //     }
        // });

        return () => {
            notificationListener.current &&
                Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current &&
                Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

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

    useEffect(()=>{
        if(messageIsUpdate){
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