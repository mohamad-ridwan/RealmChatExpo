import { View, Text, Dimensions, StyleSheet, Modal, TextInput, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native'
import * as Notifications from 'expo-notifications'
import React, { useCallback, useEffect, useState } from 'react'
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginSessionName } from '@/utils/storage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import i18n from '@/utils';
import ChatItem from '@/components/ChatItem';
import { getChats } from '@/store/chat/chatAction';
import { setJid, setLoader, setRecentChats } from '@/store/chat/chatSlice';
import { getDevices } from '@/store/device/deviceAction';
import { setDevice } from '@/store/device/deviceSlice';

type Props = {
  navigation: any
}

export default function AllChatScreen({
  navigation
}: Props) {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [isShowSearch, setIsShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [userNumber, setUserNumber] = useState('')
  const [userError, setUserError] = useState('')
  const [chatCount, setChatCount] = useState(0)

  const [modalVisible, setModalVisible] = useState(false);
  const [activePage, setActivePage] = useState(1)
  const [itemsCountPerPage, setItemsCountPerPage] = useState(20)
  const [flatlistReady, setFlatlistReady] = useState(false)
  const [socket, setSocket] = useState<any>('')

  const isDark = useSelector((state: RootState) => state.themeSlice.isDark)
  const { recentChats, loader } = useSelector((state: RootState) => state.chatSlice)
  const { devices, device: currentDevice } = useSelector((state: RootState) => state.deviceSlice)
  const device: any = currentDevice
  const dispatch = useDispatch() as any

  const error = ''

  const onRefresh = React.useCallback(() => {
    console.log('refresh')
    dispatch(setLoader(true))

  }, []);

  // GET device
  // untuk sementara
  const handleGetDevices = () => {
    dispatch(getDevices());
  }

  useEffect(() => {
    handleGetDevices()
  }, [])

  const getDevice = () => {
    const findDevice = devices[0]
    dispatch(setDevice(findDevice))
  }

  useEffect(() => {
    if (devices.length > 0) {
      getDevice()
    }
  }, [devices])

  // get all chats
  async function handleGetChats(): Promise<void> {
    const result = await dispatch(getChats({ id: device?.device_key }))
    if (result.type === 'chat-list2/fulfilled') {
      dispatch(setRecentChats(result.payload))

      return
    }
    dispatch(setRecentChats([]))
  }

  useEffect(() => {
    if (device) {
      handleGetChats()
    }
  }, [device])

  async function userIds() {
    const token = await AsyncStorage.getItem(loginSessionName)
    const newToken = JSON.parse(token as string)
    let tokenValue = newToken.token
  }

  async function addUser(): Promise<void> {

  }

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  }

  function GetNextPage() {

    const nextEndIndex = (activePage) * itemsCountPerPage;
    setActivePage(activePage + 1);

    // if (!loader) {
    //   getAllChat(activePage + 1, itemsCountPerPage);
    // }
  }

  const redirectToSingleChat = useCallback((lastNotificationResponse: any) => {
    const chat_id = lastNotificationResponse?.notification?.request?.content?.data?.chatId
    const currentRecentChats = recentChats.find((item: any) => item.chat_id === chat_id)
    dispatch(setJid(chat_id))
    navigation.navigate("SingleChat", { userData: currentRecentChats, device: device })
  }, [recentChats, device])

  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.notification?.request?.content?.data?.chatId &&
      lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER &&
      recentChats
    ) {
      // THIS RESPONSE WILL BE REDIRECT TO SINGLE CHAT
      // MUNGKIN AKAN SET CHANGE OTHER DEVICE KALAU NOTIFIKASI DARI DEVICE YANG BUKAN SAAT INI DIPILIH
      redirectToSingleChat(lastNotificationResponse)
    }
  }, [lastNotificationResponse]);

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>

      {/* MODAL NEW CHAT */}
      {modalVisible ? (
        <View style={styles.centeredView}>
          <Modal style={{ borderWidth: 0 }}
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={[styles.modalView, { backgroundColor: isDark ? 'rgba(78,90,120,1)' : 'white' }]}>
                {userError ? (
                  <Text>{userError}</Text>
                ) : (null)}

                <View style={styles.modalHeader}>
                  <View><Text style={{ color: isDark ? 'white' : 'rgba(75,9,150,1)' }}>New Chat</Text></View>
                  <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}><Text style={styles.modalIcon}><FontAwesome name="times-circle-o" size={20} color={'#18bd33'} /></Text></TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <Text style={[styles.inputLabel, { color: isDark ? 'white' : 'rgba(75,9,150,1)' }]}>
                    Enter Whatsapp Number
                  </Text>
                  <View style={styles.inputBox}>
                    <TextInput
                      style={styles.input}
                      keyboardType='numeric'
                      onChangeText={(text) => setUserNumber(text)}
                      underlineColorAndroid="transparent"
                    />
                  </View>
                </View>
                <View style={styles.modalFooter}>
                  <TouchableOpacity style={styles.modalCancel} onPress={() => {
                    setModalVisible(!modalVisible)
                  }}><Text style={{ color: 'white' }}>Cancel</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.modalChat} onPress={() => addUser()}><Text style={{ color: 'white' }}>Chat</Text></TouchableOpacity>
                </View>

                {/* <Button title="submit" onPress={()=>addUser()}/>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Go Back</Text>
            </Pressable> */}
              </View>
            </View>



          </Modal>

        </View>
      ) : (null)}

      <StatusBar />
      <View style={styles.head}>
        {isShowSearch ? (
          <View style={styles.searchBox}>
            <Ionicons name="search" size={24} color="#01E05B" />
            <TextInput
              style={styles.searchInput}
              selectTextOnFocus={isShowSearch}
              placeholder={i18n.t("Chats.SearchChats")}
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
            <TouchableOpacity onPress={() => setModalVisible(true)}
              style={styles.goBackBtn}
            // onPress={() => navigation.goBack()}
            >
              <Ionicons name="create-outline" size={24} color="#01E05B" />
            </TouchableOpacity>

            <Text style={{ color: colors.text }}>
              {chatCount} {i18n.t("Chats.NewMessageText")}
            </Text>

            <TouchableOpacity
              style={styles.goBackBtn}
              onPress={() => setIsShowSearch(!isShowSearch)}
            >
              <Ionicons name="search" size={24} color="#01E05B" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            GetNextPage()
          }
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.errorBox}>
          <View>
            <Text style={{ color: colors.text }}>
              {error !== "" ? error : null}
            </Text>
          </View>
          {recentChats &&
            recentChats.map((v: any, i: any) => {
              return (
                <ChatItem
                  key={i}
                  data={v}
                  onPress={() => {
                    dispatch(setJid(v.chat_id))
                    navigation.navigate("SingleChat", { userData: v, device: device })
                    console.log('userdata', v)
                    console.log('device', device)
                  }
                  }
                />
              );
            })}
        </View>
        {loader ? (
          <View>
            <ActivityIndicator size="large" color="#01E05B" />
          </View>
        ) : (
          null
        )}
      </ScrollView>

      <View style={styles.tab}>
        <TouchableOpacity onPress={() => navigation.navigate("Contacts")}>
          <Ionicons name="people-outline" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("AllChat")}>
          <Feather name="message-square" size={24} color="#01E05B" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Feather name="settings" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  modalLabel: {
    color: 'rgba(75,9,150,1)',
  },
  modalIcon: {

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
  errorBox: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  tab: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 25,
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

});