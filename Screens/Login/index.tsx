import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StatusBar } from 'expo-status-bar'
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons'
import i18n from '@/utils'
import { useDispatch } from 'react-redux'
import { userLogin } from '@/store/auth/authAction'
import { loginSuccess } from '@/store/auth/authSlice'
import { loginSessionName } from '@/utils/storage'

type Props = {
  navigation: any
}

export default function LoginScreen({
  navigation,
}: Props) {
  const {colors} = useTheme()
  
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loginErrMessage, setLoginErrMessage] = useState<string>('')

  const dispatch = useDispatch()

  async function getToken() {
    const token = await AsyncStorage.getItem(loginSessionName);
    const newToken = JSON.parse(token as string);
    if (newToken) {
      navigation.navigate("AllChat");
    }
  }

  useEffect(()=>{
    getToken()
  }, [])

  const loginHandler = async (): Promise<void> => {
    setLoginErrMessage('')
    const result = await dispatch(userLogin({email, password}) as any)
    // FAILED
    if(result.type === 'login/rejected'){
      setLoginErrMessage(result.error?.message ?? 'Invalid account')
      return
    }
    // SUCCESS
    const data = result.payload.data
    await AsyncStorage.setItem(
      loginSessionName,
      JSON.stringify({
        result: result.payload.result,
        message: result.payload.message,
        token: data.token,
        // device: null
      })
    )
    dispatch(loginSuccess(data))
    navigation.navigate('AllChat')
  };

  return (
    <View style={styles.container}>
        <View style={{ padding: 15 }}>
          <StatusBar />
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.goBackBtn}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={32} color="white" />
              <Text style={{ color: "#fff" }}>{i18n.t("Login.BackText")}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>REALM</Text>
          <Text style={styles.welcomeText}>{i18n.t("Login.WelcomeText")}</Text>
          <Text style={styles.shortDescription}>
            {i18n.t("Login.Description")}
          </Text>
        </View>
        <View style={[styles.formContainer, { backgroundColor: colors.card }]}>
          <View style={styles.inputBox}>
            <SimpleLineIcons
              name="envelope"
              size={16}
              color="black"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder={i18n.t("Login.YourEmail")}
              underlineColorAndroid="transparent"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </View>
          <View style={styles.inputBox}>
            <SimpleLineIcons
              name="lock"
              size={16}
              color="black"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder={i18n.t("Login.YourPassword")}
              underlineColorAndroid="transparent"
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
          </View>

          {/* <View style={styles.forgotPassBox}>
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={{ color: colors.text }}>Forgot Password?</Text>
            </TouchableOpacity>
          </View> */}

          <Text>{loginErrMessage}</Text>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => loginHandler()}
            >
              <Text style={styles.btnText}>{i18n.t("Login.LoginText")}</Text>
            </TouchableOpacity>
          </View>
          {/* 
          <View style={styles.signUpLink}>
            <Text style={{ color: colors.text }}>Don’t have an account? </Text>
            <TouchableOpacity>
              <Text style={styles.primaryText}> Sign Up</Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#01E05B",
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
  title: {
    fontSize: 26,
    color: "#ffff",
    marginTop: 10,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 25,
    color: "#ffff",
    marginTop: 10,
    marginBottom: 10,
  },
  shortDescription: {
    fontSize: 14,
    color: "#ffff",
  },
  formContainer: {
    backgroundColor: "#F9F8F8",
    padding: 15,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    flex: 1,
    justifyContent: "center",
  },
  forgotPassBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingTop: 10,
    paddingBottom: 30,
    margin: 5,
  },
  inputBox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
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
});