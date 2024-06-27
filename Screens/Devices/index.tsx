import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useTheme } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons'
import i18n from '@/utils'
import { setDevice } from '@/store/device/deviceSlice'

type Props = {
    navigation: any
}

export default function DeviceScreens({
    navigation
}: Props) {
    const { colors } = useTheme();
    const [showModal, setShowModal] = useState(false);
    const [updatePermission, setUpdatePermission] = useState(false);

    const { devices, device: currentDevice } = useSelector((state: RootState) => state.deviceSlice)
    const device = currentDevice as any

    const dispatch = useDispatch() as any

    async function handleSelectDevice(updateDevice: any): Promise<void> {
        dispatch(setDevice(updateDevice))
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.card }]}>
            <View style={{ padding: 15 }}>
                <StatusBar />

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={showModal}
                    onRequestClose={() => {
                        setShowModal(!showModal);
                    }}
                >
                    <View style={[styles.centeredView]}>
                        <View style={styles.modalView}>
                            <Text style={[styles.modalText, { color: colors.text }]}>
                                Do you want to use this Device (device name) for Realm?
                            </Text>
                            <View style={styles.modalBtnContainer}>
                                <TouchableOpacity
                                    onPress={() => setUpdatePermission(true)}
                                    style={[styles.modalBtn, styles.confirmBtn]}
                                >
                                    <Text style={{ color: colors.text }}>Yes</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.modalBtn, styles.cancelmBtn]}
                                    onPress={() => setUpdatePermission(false)}
                                >
                                    <Text style={{ color: colors.text }}>No</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.goBackBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="chevron-back" size={32} color={colors.text} />
                        <Text style={{ color: colors.text }}>
                            {i18n.t("Devices.BackText")}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text style={[styles.title, { color: colors.text }]}>
                    {i18n.t("Devices.DevicesText")}
                </Text>

                <View style={styles.spacer} />

                <ScrollView style={styles.styleScroll}>
                    <View style={{
                        marginBottom: 100
                    }}>
                        {devices.map((v: any, i) => {
                            return (
                                <View style={styles.device} key={i}>
                                    <Text style={[styles.deviceTitle, { color: colors.text }]}>
                                        {v.name}
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.selectDeviceBtn}
                                        onPress={() => handleSelectDevice(v)}
                                        disabled={v.device_key === device?.device_key}
                                    >
                                        <Text style={{ flex: 1 }}>{v.device_key}</Text>
                                        {v.device_key === device?.device_key ? (
                                            <Text style={{ color: "#01E05B" }}>
                                                {i18n.t("Devices.SelectedText")}
                                            </Text>
                                        ) : null}
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>

                {/* <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.btnText}>Save</Text>
          </TouchableOpacity>
        </View> */}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    modalText: {

    },
    styleScroll: {
        paddingVertical: 20,
        height: '90%'
    },
    container: {
        flex: 1,
        backgroundColor: "#F9F8F8",
    },
    header: {
        marginTop: 30,
        display: "flex",
        paddingTop: 10,
        paddingBottom: 10,
    },
    goBackBtn: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    spacer: {
        height: 40,
    },
    title: {
        fontSize: 26,
        color: "#000",
    },

    shortDescription: {
        fontSize: 14,
        color: "#000",
        marginBottom: 100,
        marginTop: 10,
    },

    device: {
        margin: 5,
    },
    deviceTitle: {
        paddingBottom: 5,
    },
    selectDeviceBtn: {
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 5,
        padding: 18,
        display: "flex",
        flexDirection: "row",
    },

    inputIcon: {
        padding: 10,
    },
    input: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 0,
        backgroundColor: "#fff",
        color: "#424242",
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

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        backgroundColor: "#ffff",
        padding: 20,
        width: "95%",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        elevation: 5,
    },
    modalBtnContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
    },
    modalBtn: {
        padding: 10,
        width: 80,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
    },
    confirmBtn: {
        backgroundColor: "#01E05B",
    },
    cancelmBtn: {
        backgroundColor: "red",
    },
});