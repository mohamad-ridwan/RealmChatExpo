import { View, Modal, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import ImageViewer from 'react-native-image-zoom-viewer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setActiveIdxFullScreenViewer, setImagesViewerData, setIsFullScreenViewer } from '@/store/chat/chatSlice';
import Header from './Header';
import Caption from './Caption';

export default function FullScreenViewer() {
    const [images, setImages] = useState<any>([])
    const {
        isFullScreenViewer,
        activeIdxFullScreenViewer,
        singleUserChat: currentSingleUserChat
    } = useSelector((state: RootState) => state.chatSlice)

    const singleUserChat = currentSingleUserChat as any

    const dispatch = useDispatch() as any

    function createImages(): any {
        if (singleUserChat?.messages?.length > 0) {
            const getMedia = singleUserChat.messages.filter((item: any) => {
                return item.message['imageMessage']?.url
            })
            if (getMedia?.length > 0) {
                return getMedia.map((item: any) => ({
                    url: item.message['imageMessage']?.url,
                    id: item?.key?.id
                }))
            }
            return []
        }
        return []
    }

    useEffect(() => {
        if (singleUserChat?.messages?.length > 0) {
            setImages(createImages())
            dispatch(setImagesViewerData(createImages()))
        }
    }, [singleUserChat])

    function handleClose(): void {
        dispatch(setIsFullScreenViewer(undefined))
    }

    return (
        <Modal
            animationType="fade"
            visible={isFullScreenViewer}
            onRequestClose={handleClose}
        >
            <View
                style={styles.container}
            >
                {/* Header */}
                <Header/>
                {/* Image */}
                <View style={styles.imageViewer}>
                    <ImageViewer
                        imageUrls={images}
                        renderIndicator={() => <></>}
                        index={activeIdxFullScreenViewer}
                        onChange={(e)=>{
                            dispatch(setActiveIdxFullScreenViewer({index: e}))
                        }}
                    />
                </View>
                {/* Caption */}
                <Caption/>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: '#000',
    },
    imageViewer: {
        height: '80%',
        width: '100%'
    },
})