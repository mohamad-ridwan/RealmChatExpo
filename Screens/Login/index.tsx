import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants';
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

export default function LoginScreen({
  navigation,
}: Props) {
  const { colors } = useTheme()

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loginErrMessage, setLoginErrMessage] = useState<string>('')
  // NOTIFICATION
  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState<any>([])
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const dispatch = useDispatch()

  // NOTIFICATION CONFIGURE
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

  async function getCategoryNotifications(): Promise<void> {
    await Notifications.setNotificationCategoryAsync(notificationCategories[0].identifier, notificationCategories[0].actions);
  }

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
          await Notifications.getExpoPushTokenAsync({ projectId })
        ).data;

        return pushTokenString;
      } catch (e: unknown) {
        handleRegistrationError(`${e}`);
      }
    } else {
      handleRegistrationError('Must use physical device for push notifications');
    }
  }

  async function scheduleNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: 'Swipe down to see more options.',
        categoryIdentifier: 'message',
      },
      trigger: {
        seconds: 2,
      },
    });
  }

  // useEffect(() => {
  //     const subscription = Notifications.addPushTokenListener((token) => {
  //         console.log('new token', token)
  //     });
  //     return () => subscription.remove();
  // }, []);

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
  // ----- NOTIFICATION CONFIGURE

  async function getToken() {
    const token = await AsyncStorage.getItem(loginSessionName);
    const newToken = JSON.parse(token as string);
    if (newToken) {
      navigation.navigate("AllChat");
    }
  }

  useEffect(() => {
    getToken()
  }, [])

  const loginHandler = async (): Promise<void> => {
    setLoginErrMessage('')
    const result = await dispatch(userLogin({ email, password, token: expoPushToken }) as any)
    // FAILED
    if (result.type === 'login/rejected') {
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