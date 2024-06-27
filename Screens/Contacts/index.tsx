import { View, Text, StyleSheet, Dimensions, Modal, Alert, TouchableOpacity, TextInput, ActivityIndicator, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from '@react-navigation/native';
import { AvatarGenerator } from 'random-avatar-generator';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { StatusBar } from 'expo-status-bar';
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import i18n from '@/utils';

type Props = {
    navigation: any
}

export default function ContactsScreen({
    navigation
}: Props) {
    const { colors } = useTheme();
    const [isShowSearch, setIsShowSearch] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [newContact, setNewContact] = useState('')
    const [userError, setUserError] = useState('')
    const [spinner, setSpinner] = useState(false)

    const generator = new AvatarGenerator()

    const {
        contacts,
        loader,
    } = useSelector((state: RootState) => state.contactSlice)
    const {isDark} = useSelector((state: RootState)=>state.themeSlice)

    const dispatch = useDispatch() as any

    async function addContact():Promise<void>{

    }

    return (
        <View style={[styles.container, { backgroundColor: colors.card }]}>
            <StatusBar />

            {showModal ? (
                <View style={styles.centeredView}>
                    <Modal style={{ borderWidth: 0 }}
                        animationType="slide"
                        transparent={true}
                        visible={showModal}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                            setShowModal(!showModal);
                        }}>
                        <View style={styles.centeredView}>
                            <View style={[styles.modalView, { backgroundColor: isDark ? 'rgba(78,90,120,1)' : 'white' }]}>
                                {userError ? (
                                    <Text>{userError}</Text>
                                ) : (null)}

                                <View style={styles.modalHeader}>
                                    <View><Text style={{ color: isDark ? 'white' : 'rgba(75,9,150,1)' }}>New Chat</Text></View>
                                    <TouchableOpacity onPress={() => setShowModal(!showModal)}><Text style={styles.modalIcon}><FontAwesome name="times-circle-o" size={20} color={'#18bd33'} /></Text></TouchableOpacity>
                                </View>

                                <View style={styles.modalBody}>
                                    <Text style={[styles.inputLabel, { color: isDark ? 'white' : 'rgba(75,9,150,1)' }]}>
                                        Enter Whatsapp Number
                                    </Text>
                                    <View style={styles.inputBox}>
                                        <TextInput
                                            style={styles.input}
                                            keyboardType='numeric'
                                            onChangeText={(text) => setNewContact(text)}
                                            underlineColorAndroid="transparent"
                                        />
                                    </View>
                                </View>
                                <View style={styles.modalFooter}>
                                    <TouchableOpacity onPress={() => setShowModal(!showModal)} style={styles.modalCancel}><Text style={{ color: 'white' }}>Cancel</Text></TouchableOpacity>
                                    <TouchableOpacity style={styles.modalChat} onPress={() => addContact()}>
                                        {spinner ? (
                                            <ActivityIndicator style={{ position: 'relative', zIndex: 99 }} size="small" color="#01E05B" />
                                        ) : (<Text style={{ color: 'white' }}>Chat</Text>)}
                                    </TouchableOpacity>
                                </View>

                                {/* <Button title="submit" onPress={()=>addUser()}/>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setShowModal(!showModal)}>
              <Text style={styles.textStyle}>Go Back</Text>
            </Pressable> */}
                            </View>
                        </View>



                    </Modal>

                </View>
            ) : (null)}
            <View style={styles.head}>
                {isShowSearch ? (
                    <View style={styles.searchBox}>
                        <Ionicons name="search" size={24} color="#01E05B" />
                        <TextInput
                            style={styles.searchInput}
                            selectTextOnFocus={isShowSearch}
                            placeholder={i18n.t("Contacts.SearchContacts")}
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
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="chevron-back" size={30} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={{ color: colors.text }}>
                            {i18n.t("Contacts.ContactsText")}
                        </Text>

                        <TouchableOpacity
                            style={styles.goBackBtn}
                            // onPress={() => navigation.goBack()}
                            onPress={() => setIsShowSearch(!isShowSearch)}
                        >
                            <Ionicons name="search" size={24} color="#01E05B" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <TouchableOpacity
                style={{
                    padding: 15,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }}
                onPress={() => setShowModal(!showModal)}
            >
                <View style={{ backgroundColor: "#01E05B", padding: 5 }}>
                    <Feather name="user-plus" size={28} color="#fff" />
                </View>
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: "700",
                        marginLeft: 10,
                        color: colors.text,
                    }}
                >
                    {i18n.t("Contacts.NewContact")}
                </Text>
            </TouchableOpacity>

            <View style={{ padding: 15 }}>
                <Text style={{ color: colors.text }}>
                    {i18n.t("Contacts.YourContacts")}
                </Text>
            </View>
            <ScrollView style={{ padding: 15 }}>

                {loader ? (
                    <ActivityIndicator size="large" color="#01E05B" />
                ) : (
                    <View>
                        {contacts &&
                            contacts
                                .filter((item: any) => {
                                    const regex = new RegExp(`${ searchText }`, "gi");
                                    return item.name.match(regex) || item.number.match(regex);
                                })
                                .map((v: any, i) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() =>
                                                navigation.navigate("SingleChat", { userData: v })
                                            }
                                            style={styles.item}
                                            key={i}
                                        >
                                            <View style={styles.leftSide}>
                                                <Image
                                                    source={{ uri: generator.generateRandomAvatar() }}
                                                    style={styles.avatar}
                                                    resizeMode={"contain"}
                                                />
                                            </View>
                                            <View style={styles.middle}>
                                                <Text style={{ color: colors.text }}>{v.name}</Text>
                                                <Text style={styles.number}>{v.number}</Text>
                                            </View>
                                            <View style={styles.rightSide}>
                                                <Ionicons
                                                    name="chevron-forward"
                                                    size={24}
                                                    color={colors.text}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                    </View>
                )}
            </ScrollView>
            <View style={styles.tab}>
                <TouchableOpacity onPress={() => navigation.navigate("Contacts")}>
                    <Ionicons name="people-outline" size={24} color="#01E05B" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("AllChat")}>
                    <Feather name="message-square" size={24} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                    <Feather name="settings" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    modalIcon:{

    },
    goBackBtn:{

    },
    container: {
        flex: 1,
        backgroundColor: "#F9F8F8",
    },
    head: {
        marginTop: 30,
        display: "flex",
        paddingTop: 10,
        paddingBottom: 10,
        padding: 15,
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

    // centeredView: {
    //     flex: 1,
    //     justifyContent: "center",
    //     alignItems: "center",
    //     backgroundColor: "rgba(0,0,0,0.7)",
    // },
    // modalView: {
    //     backgroundColor: "#fff",
    //     // margin: 20,
    //     padding: 5,
    //     width: "80%",
    //     // alignItems: "center",
    //     shadowColor: "#000",
    //     shadowOffset: {
    //         width: 0,
    //         height: 2,
    //     },
    //     shadowOpacity: 0.25,
    //     elevation: 5,
    //     // padding: 10,
    //     borderRadius: 10,
    // },
    btnBox: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10,
    },
    // input: {
    //     width: "80%",
    //     borderWidth: 0.5,
    //     marginRight: 5,
    //     fontSize: 16,
    //     padding: 2,
    // },
    sendBtn: {
        backgroundColor: "#01E05B",
        padding: 8,
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
    number: {
        color: "#CDCDCD",
        paddingTop: 5,
    },
    rightSide: {
        padding: 5,
    },
    tab: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 25,
    },

    modalLabel: {
        color: 'rgba(75,9,150,1)',
    },
    modalFooter: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 12,
        width: Dimensions.get('window').width - 50,
        paddingBottom: 12
    },
    modalCancel: {
        paddingHorizontal: 15,
        paddingVertical: 7,
        backgroundColor: '#4e5a66',
        color: '#fff',
        borderRadius: 5
    },
    modalChat: {
        paddingHorizontal: 21,
        paddingVertical: 7,
        backgroundColor: '#18bd33',
        borderRadius: 5,
        marginLeft: 10
    },

    modalBody: {
        width: Dimensions.get('window').width - 50,
        padding: 12
    },
    modalHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: Dimensions.get('window').width - 50,
        borderBottomWidth: 1,
        borderColor: 'rgba(230,230,230,1)',
        padding: 12
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
        width: Dimensions.get('window').width,
        zIndex: 99,
        position: 'absolute'
    },
    modalView: {
        width: Dimensions.get('window').width - 50,
        borderRadius: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 30
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
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
        marginBottom: 10,
        marginTop: 10,
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
});