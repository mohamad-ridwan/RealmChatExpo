import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import i18n from '@/utils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginSessionName } from '@/utils/storage';
import { getProfile } from '@/store/auth/authAction';

type Props = {
    navigation: any
}

export default function ProfileSettingScreen({
    navigation
}: Props) {
    const { colors } = useTheme();
    const [modalVisible, setModalVisible] = useState(false);
    const [localStorageData, setLocalStorageData] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [phone, setPhone] = useState("")
    const [currentProfilePicture, setCurrentProfilePicture] = useState('')
    const [image, setImage] = useState(null)

    const { user: currentUser } = useSelector((state: RootState) => state.authSlice)
    const user = currentUser as any
    const dispatch = useDispatch() as any

    const loader = false

    async function getCurrentUser(): Promise<void> {
        const response = await AsyncStorage.getItem(loginSessionName) as any
        const result = await JSON.parse(response)

        if (result && result?.result === false) {
            Alert.alert('Account not found!')
            navigation.goBack()
            return
        }

        const currentUser = await dispatch(getProfile({ authToken: result.token }))
        if (currentUser.type === 'user-profile/rejected') {
            Alert.alert('Account not found!')
            navigation.goBack()
            return
        }
    }

    useEffect(() => {
        getCurrentUser()
    }, [])

    useEffect(()=>{
        if(user?.name){
            setName(user.name)
            setUserName(user?.username ?? '')
            setEmail(user?.email ?? '')
            setCurrentProfilePicture(user?.profilePicture ?? '')
            setPhone(user?.phone ?? '')
        }
    }, [user])

    function updateProfileHandle(): void {

    }

    return (
        <View style={[styles.container, { backgroundColor: colors.card }]}>
            <StatusBar
                // barStyle="default"
                hidden={false}
                backgroundColor="white"
                translucent={false}
            />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={32} color={colors.text} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text
                        style={{ color: colors.text, fontSize: 18, textAlign: "center" }}
                    >
                        {user?.name}
                    </Text>
                </View>
            </View>

            {(currentProfilePicture || image) &&
                <View style={styles.avatarBox}>
                    <Image
                        source={{ uri: (currentProfilePicture || image) as string }}
                        style={styles.avatar}
                        resizeMode={"contain"}
                    />
                </View>
            }

            {loader ? (
                <View>
                    <ActivityIndicator size="large" color="#01E05B" />
                </View>
            ) : (
                <View style={{ padding: 15 }}>
                    <Text style={[styles.inputLabel, { color: colors.text }]}>
                        {i18n.t("Profile.Name")}
                    </Text>
                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={(text) => setName(text)}
                            underlineColorAndroid="transparent"
                            readOnly
                        />
                    </View>

                    <Text style={[styles.inputLabel, { color: colors.text }]}>
                        {i18n.t("Profile.Username")}
                    </Text>
                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.input}
                            value={userName}
                            onChangeText={(text) => setUserName(text)}
                            underlineColorAndroid="transparent"
                            readOnly
                        />
                    </View>

                    <Text style={[styles.inputLabel, { color: colors.text }]}>
                        {i18n.t("Profile.Email")}
                    </Text>
                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            underlineColorAndroid="transparent"
                            readOnly
                        />
                    </View>

                    <Text style={[styles.inputLabel, { color: colors.text }]}>
                        {i18n.t("Profile.Phone")}
                    </Text>
                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={(text) => setPhone(text)}
                            underlineColorAndroid="transparent"
                            readOnly
                        />
                    </View>

                    {/* <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text style={[styles.inputLabel, { color: colors.text }]}>
                            {i18n.t("Profile.Password")}
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("ResetPassword")}
                        >
                            <Text style={[styles.inputLabel, { color: colors.text }]}>
                                {i18n.t("Profile.EditText")}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.input}
                            value="45353453535"
                            underlineColorAndroid="transparent"
                            secureTextEntry={true}
                            editable={false}
                        />
                    </View> */}
                </View>
            )}
            {/* <View style={styles.btnContainer}>
                <TouchableOpacity
                    style={styles.loginBtn}
                    onPress={() => updateProfileHandle()}
                >
                    <Text style={styles.btnText}> {i18n.t("Profile.SaveText")}</Text>
                </TouchableOpacity>
            </View> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        // marginTop: 30,
        display: "flex",
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        padding: 15,
    },
    avatarBox: {
        // display: "flex",
        // flexDirection: "row",
        // alignItems: "center",
        // justifyContent: "center",
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 80,
        alignSelf: "center",
    },

    pickerBtn: {
        position: "relative",
        bottom: 20,
        right: 0,
        backgroundColor: "white",
        width: 32,
        height: 32,
        borderRadius: 50,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 5,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    inputLabel: {
        paddingBottom: 5,
        paddingTop: 5,
    },
    inputBox: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 5,
        marginBottom: 20,
    },

    input: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        backgroundColor: "white",
        color: "#424242",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.7)",
    },
    modalView: {
        backgroundColor: "#fff",
        // margin: 20,
        padding: 5,
        width: "80%",
        // alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        elevation: 5,
    },
    rows: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
    },
    modalButtonText: {
        paddingLeft: 10,
    },
    btnContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        margin: 10,
    },
    loginBtn: {
        backgroundColor: "#01E05B",
        alignItems: "center",
        textAlign: "center",
        width: 100,
        padding: 16,
        marginTop: 10,
        marginBottom: 10,
    },
    btnText: {
        color: "#fff",
    },
});