import { View, Text, Dimensions, StyleSheet, Image } from 'react-native'
import React, { useEffect } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useTheme } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StatusBar } from 'expo-status-bar'
import i18n from '@/utils'
import { loginSessionName } from '@/utils/storage'

type Props = {
  navigation: any
}

const {height, width} = Dimensions.get('window')

export default function HomeScreen({
  navigation
}: Props) {
  const {colors} = useTheme()
  async function getToken(): Promise<void>{
    const token = await AsyncStorage.getItem(loginSessionName)
    const newToken = JSON.parse(token as string)
    if(newToken){
      navigation.navigate('AllChat')
    }
  }
  useEffect(()=>{
    getToken()
  }, [])

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.curviedHeader}>
        <View style={styles.curvied} />
      </View>

      {/* <TouchableOpacity onPress={() => i18n.changeLanguage("de")}>
        <Text>Switch</Text>
      </TouchableOpacity> */}
      <Image
        style={styles.logo}
        source={require('@/assets/images/realmLogo.png')}
      />
      <View style={{ display: "flex", alignItems: "flex-start" }}>
        <Image
          style={styles.whatsAppLogoRight}
          source={require('@/assets/images/WhatsAppIconRedesignRight.png')}
        />
      </View>

      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.btnText}>{i18n.t("Login.LoginText")}</Text>
        </TouchableOpacity>
      </View>

      {/* <View style={styles.signUpLink}>
        <Text style={{ color: colors.text }}>Don’t have an account? </Text>
        <TouchableOpacity>
          <Text style={styles.primaryText}> Sign Up</Text>
        </TouchableOpacity>
      </View> */}

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <Image
          style={styles.whatsAppLogoLeft}
          source={require('@/assets/images/WhatsAppIconRedesignLeft.png')}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  curviedHeader: {
    width: 1 * width,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    top: 0,
  },
  curvied: {
    height: 140,
    minWidth: 300,
    transform: [{ scaleX: 2 }],
    borderBottomStartRadius: 500,
    borderBottomEndRadius: 500,
    overflow: "hidden",
    backgroundColor: "#01E05B",
  },
  logo: {
    width: 277,
    height: 109,
    alignSelf: "center",
    marginTop: height / 6,
  },
  whatsAppLogoRight: {
    width: 108,
    height: 108,
    marginTop: 20,
    marginBottom: 20,
  },
  btnContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loginBtn: {
    backgroundColor: "#01E05B",
    alignItems: "center",
    textAlign: "center",
    width: "100%",
    padding: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  btnText: {
    color: "#fff",
  },
  signUpLink: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  primaryText: {
    color: "#01E05B",
  },
  whatsAppLogoLeft: {
    width: 62,
    height: 62,
    marginTop: 10,
    marginBottom: 10,
  },
});