import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useMemo } from 'react'
import { AntDesign } from '@expo/vector-icons'
import { useDispatch, useSelector } from 'react-redux'
import { setIsFullScreenViewer } from '@/store/chat/chatSlice'
import { RootState } from '@/store'
import moment from 'moment'

export default function Header() {
    const {
        imagesViewerData: currentImages,
        singleUserChat: currentSingleUserChat,
        activeIdxFullScreenViewer
    } = useSelector((state: RootState) => state.chatSlice)
    const singleUserChat = currentSingleUserChat as any

    const dispatch = useDispatch() as any

    function handleCloseViewer():void{
        dispatch(setIsFullScreenViewer(undefined))
    }

    const currentUserName = useMemo(()=>{
        const currentImg = currentImages.find((item, i)=>i === activeIdxFullScreenViewer) as any
        const currentMessage = singleUserChat.messages.find((item: any)=>item.key.id === currentImg.id)
        if(currentMessage?.key?.fromMe){
            return 'You'
        }
        return currentMessage?.key?.remoteJid
    }, [currentImages, currentSingleUserChat, activeIdxFullScreenViewer])

    const times = useMemo(()=>{
        const currentImg = currentImages.find((item, i)=>i === activeIdxFullScreenViewer) as any
        const currentMessage = singleUserChat.messages.find((item: any)=>item.key.id === currentImg.id)
        return currentMessage?.messageTimestamp
    }, [currentImages, currentSingleUserChat, activeIdxFullScreenViewer])

    return (
        <View style={styles.headerContainer}>
            <View style={styles.leftContent}>
                <TouchableOpacity onPress={handleCloseViewer}>
                    <AntDesign name="arrowleft" size={24} color="white" />
                </TouchableOpacity>
                <View>
                    <Text style={styles.userName}>{currentUserName}</Text>
                    <Text style={styles.times}>
                        {moment(times).format(
                        "YYYY-MM-DD hh:mm:ss"
                    )}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1e1e1e',
        padding: 10,
        borderBottomColor: "#3e3e42",
        borderBottomWidth: 1
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    userName:{
        fontSize: 16,
        color: 'white'
    },
    times:{
        fontSize: 12,
        color: 'white'
    }
})