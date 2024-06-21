import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { Dispatch, SetStateAction } from 'react'
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import i18n from '@/utils';
import { useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setSingleUserChat } from '@/store/chat/chatSlice';

type Props = {
    isShowSearch: boolean
    styles: any
    setSearchText: Dispatch<SetStateAction<string>>
    setIsShowSearch: Dispatch<SetStateAction<boolean>>
    navigation: any
    route: any
}

export default function Header({
    isShowSearch,
    styles,
    setSearchText,
    setIsShowSearch,
    navigation,
    route
}: Props) {
    const { colors } = useTheme();

    const { userData } = route.params

    const dispatch = useDispatch() as any

    return (
        <View style={{ padding: 15 }}>
            <StatusBar />

            <View style={styles.head}>
                {isShowSearch ? (
                    <View style={styles.searchBox}>
                        <Ionicons name="search" size={24} color="#01E05B" />
                        <TextInput
                            style={styles.searchInput}
                            selectTextOnFocus={isShowSearch}
                            placeholder={i18n.t("Chats.SearchConversation")}
                            onChangeText={(text) => setSearchText(text)}
                            autoFocus
                        />
                        <TouchableOpacity
                            onPress={() => {
                                setIsShowSearch(!isShowSearch);
                                setSearchText("");
                            }}
                        >
                            <Ionicons name="close" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.goBackBtn}
                            onPress={() => {
                                navigation.goBack()
                                dispatch(setSingleUserChat(null))
                            }}
                        >
                            <Ionicons name="chevron-back" size={32} color={colors.text} />
                        </TouchableOpacity>

                        <View style={styles.leftSide}>
                            <Image
                                source={require("@/assets/icons/profile-user.png")}
                                // source={{
                                //     uri: userData.profilePicture,
                                // }}
                                style={styles.avatar}
                                resizeMode={"contain"}
                            />
                        </View>

                        <View style={styles.middle}>
                            <Text style={{ color: colors.text }}>{userData.push_name ?? userData.chat_id}</Text>
                            <Text style={styles.message}>Online</Text>
                        </View>

                        <View style={styles.rightSide}>
                            <TouchableOpacity
                                style={styles.goBackBtn}
                                // onPress={() => navigation.navigate("ProfileSetting")}
                                onPress={() => {
                                    setIsShowSearch(!isShowSearch);
                                }}
                            >
                                <Ionicons name="search" size={24} color="#01E05B" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </View>
    )
}