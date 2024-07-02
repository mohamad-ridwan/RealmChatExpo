import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Appearance } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import i18n from '@/utils';
import { useColorScheme } from '@/hooks/useColorScheme';
import { setThemeColor, themeName } from '@/utils/storage';

type Props = {
    navigation: any
}

export default function SettingsScreen({
    navigation
}: Props) {
    const { colors } = useTheme()
    const colorScheme = useColorScheme();
    const [isNotification, setIsNotification] = useState<boolean>(false)

    async function setNotification(): Promise<void> {
        const currentTheme = await AsyncStorage.getItem(themeName)
        if (currentTheme === 'true') {
            setIsNotification(true)
            return
        }
        setIsNotification(false)
    }

    useEffect(() => {
        setNotification()
    }, [])

    async function toggleNotification(): Promise<void> {
        const currentTheme = await AsyncStorage.getItem(themeName)
        if (currentTheme === 'true') {
            await AsyncStorage.setItem(themeName, 'false')
            setIsNotification(false)
            return
        }
        await AsyncStorage.setItem(themeName, 'true')
        setIsNotification(true)
    }

    async function toggleTheme(): Promise<void> {
        const currentTheme = await AsyncStorage.getItem(themeName)
        if (currentTheme === 'dark') {
            Appearance.setColorScheme('light')
            setThemeColor('light')
            return
        }
        if (currentTheme === 'light') {
            Appearance.setColorScheme('dark')
            setThemeColor('dark')
            return
        }
        Appearance.setColorScheme('dark')
        setThemeColor('dark')
    }

    function logOutHandler(): void {
        AsyncStorage.removeItem('currentuser')
        navigation.navigate('Home')
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.card }]}>
            <StatusBar />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={32} color={colors.text} />
                </TouchableOpacity>
            </View>
            <Text style={[styles.title, { color: colors.text }]}>
                {i18n.t("Settings.SettingsText")}
            </Text>

            <View style={styles.setting}>
                <View style={styles.settingTypeHeader}>
                    <MaterialCommunityIcons
                        name="account"
                        size={24}
                        color={colors.text}
                    />
                    <Text style={{ color: colors.text }}>
                        {i18n.t("Settings.Account")}
                    </Text>
                </View>
                <View style={[styles.line, { borderBottomColor: colors.text }]} />
                <TouchableOpacity
                    onPress={() => navigation.navigate("ProfileSetting")}
                    style={styles.settingItem}
                >
                    <Text style={{ color: colors.text }}>
                        {i18n.t("Settings.Profile")}
                    </Text>
                    <Ionicons
                        name="chevron-forward-sharp"
                        size={24}
                        color={colors.text}
                    />
                </TouchableOpacity>
                {/* <TouchableOpacity
                    onPress={() => navigation.navigate("ResetPassword")}
                    style={styles.settingItem}
                >
                    <Text style={{ color: colors.text }}>
                        {i18n.t("Settings.ChangePasswordText")}
                    </Text>

                    <Ionicons
                        name="chevron-forward-sharp"
                        size={24}
                        color={colors.text}
                    />
                </TouchableOpacity> */}

                <TouchableOpacity
                    onPress={() => navigation.navigate("Devices")}
                    style={styles.settingItem}
                >
                    <Text style={{ color: colors.text }}>
                        {i18n.t("Settings.Devices")}
                    </Text>
                    <Ionicons
                        name="chevron-forward-sharp"
                        size={24}
                        color={colors.text}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.setting}>
                <View style={styles.settingTypeHeader}>
                    <Ionicons
                        name="notifications-outline"
                        size={24}
                        color={colors.text}
                    />
                    <Text style={{ color: colors.text }}>
                        {i18n.t("Settings.Notifications")}
                    </Text>
                </View>
                <View style={[styles.line, { borderBottomColor: colors.text }]} />
                <View style={styles.settingItem}>
                    <Text style={{ color: colors.text }}>
                        {i18n.t("Settings.Notifications")}
                    </Text>
                    <Switch
                        trackColor={{ false: colorScheme === 'dark' ? 'white' : colors.background, true: colorScheme === 'dark' ? 'white' : colors.background }}
                        thumbColor={isNotification ? "#0EE263" : "#EBEDF3"}
                        ios_backgroundColor="#fff"
                        onValueChange={toggleNotification}
                        value={isNotification}
                    />
                </View>
                {/* <View style={styles.settingItem}>
                    <Text style={{ color: colors.text }}>
                        {i18n.t("Settings.AppNotifications")}
                    </Text>
                    <Switch
                        trackColor={{ false: "#FFF", true: "#FFF" }}
                        thumbColor={false ? "#0EE263" : "#EBEDF3"}
                        ios_backgroundColor="#fffs"
                        onValueChange={toggleSwitch}
                        value={false}
                    />
                </View> */}
            </View>

            <View style={styles.setting}>
                <View style={styles.settingTypeHeader}>
                    <MaterialCommunityIcons
                        name="card-plus-outline"
                        size={24}
                        color={colors.text}
                    />
                    <Text style={{ color: colors.text }}>
                        {i18n.t("Settings.MoreText")}
                    </Text>
                </View>
                <View style={[styles.line, { borderBottomColor: colors.text }]} />

                {/* <TouchableOpacity style={styles.settingItem}>
                    <Text style={{ color: colors.text }}>
                        {i18n.t("Settings.MoreText")}
                    </Text>
                    <Ionicons
                        name="chevron-forward-sharp"
                        size={24}
                        color={colors.text}
                    />
                </TouchableOpacity> */}

                {/* <TouchableOpacity style={styles.settingItem}>
          <Text style={{ color: colors.text }}>Country</Text>
          <Ionicons
            name="chevron-forward-sharp"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity> */}

                <View style={styles.settingItem}>
                    <Text style={{ color: colors.text }}>
                        {colorScheme === 'dark'
                            ? `${i18n.t("Settings.LightMode")}`
                            : `${i18n.t("Settings.DarkMode")}`}
                    </Text>
                    <Switch
                        trackColor={{ false: "#000", true: "#FFF" }}
                        thumbColor={colorScheme === 'dark' ? "#FFF" : "#000"}
                        // thumbColor={colorScheme === "dark" ? "#0EE263" : "#EBEDF3"}
                        ios_backgroundColor="#fffs"
                        onValueChange={toggleTheme}
                        value={colorScheme === 'dark'}
                    />
                </View>
            </View>

            <View style={styles.btnContainer}>
                <TouchableOpacity
                    style={styles.loginBtn}
                    onPress={() => logOutHandler()}
                >
                    <AntDesign name="logout" size={24} color="white" />
                    <Text style={styles.btnText}>{i18n.t("Settings.Logout")}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#F9F8F8",
        padding: 5,
    },
    header: {
        marginTop: 30,
        display: "flex",
        paddingTop: 10,
    },
    title: {
        fontSize: 34,
        color: "#000",
        paddingLeft: 10,
        marginBottom: 30,
    },
    setting: {
        marginBottom: 30,
    },
    settingTypeHeader: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginRight: 10,
        marginLeft: 10,
    },
    line: {
        marginRight: 10,
        marginLeft: 10,
        borderBottomWidth: 1,
        paddingTop: 5,
    },
    settingItem: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        margin: 10,
    },
    btnContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    loginBtn: {
        backgroundColor: "#01E05B",
        textAlign: "center",
        width: "30%",
        padding: 8,
        marginBottom: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    btnText: {
        color: "#fff",
        marginLeft: 4,
    },
});