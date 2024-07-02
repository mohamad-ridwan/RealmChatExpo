import { View, Text, Dimensions, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useTheme } from '@react-navigation/native'
import { FontAwesome } from '@expo/vector-icons'

export default function ChatItem(props: any) {
    const { colors } = useTheme()
    return (
        <TouchableOpacity onPress={() => props.onPress()} style={styles.item} >
            <View style={styles.item}>

                <View style={styles.userContent}>
                    <View>
                        {props.data.profilePicture ?
                            <Image
                                source={{
                                    uri: props.data.profilePicture,
                                }}
                                style={styles.avatar}
                                resizeMode={"contain"}
                            /> :
                            <Image
                                source={require('@/assets/icons/profile-user.png')}
                                style={styles.avatar}
                                resizeMode={"contain"}
                            />
                        }

                    </View>
                    <View style={styles.detail}>
                        <Text style={{ color: colors.text }}>{props.data.pushName ?? props.data.chat_id}</Text>
                        {props.data.unreadCount > 0 ? (
                            <Text style={styles.messageBold} numberOfLines={1}>
                                {props.data.message}
                            </Text>
                        ) : (
                            <Text style={styles.message} numberOfLines={1}>
                                {props.data.message}
                            </Text>
                        )}

                    </View>

                </View>

                <View style={styles.dateWrapper}>
                    {/* <Text style={{ color: colors.text }}>{format(props.data.timestamp * 1000)}</Text> */}
                    <Text style={{ color: colors.text }}>{props.data.unread_count}</Text>
                    {props.data.unread_count > 0 ? (
                        <FontAwesome name="circle" size={10} style={{ textAlign: 'right', marginTop: 5 }} color='rgb(1, 224, 91)' />

                    ) : (
                        <FontAwesome name="circle" size={10} style={{ textAlign: 'right', marginTop: 5 }} color='white' />

                    )}
                </View>

            </View>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    userContent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 5


    },
    item: {

        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: 'space-between',
        marginTop: 8,
        marginBottom: 8,

        width: Dimensions.get('window').width,
    },
    detail: {

    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 5,
    },
    middle: {
        flex: 1,
        padding: 5,
    },
    message: {
        color: "#CDCDCD",
        paddingTop: 5,
    },
    messageBold: {
        color: "#777",
        paddingTop: 5,
        fontWeight: 'bold'
    },
    rightSide: {
        padding: 5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
    dateWrapper: {
        paddingRight: 10
    }
});