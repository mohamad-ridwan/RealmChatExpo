import { View, Modal, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import uuid from 'react-native-uuid';
import Swiper from 'react-native-swiper'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setActiveIdxFullScreenViewer, setCurrentPlayVideo, setImagesViewerData, setIsFullScreenViewer } from '@/store/chat/chatSlice';
import Header from './Header';
import { downloadMedia } from '@/store/chat/chatAction';
import ImageViewerType from './viewer-type/ImageViewerType';
import VideoViewerType from './viewer-type/video-viewer';

export type PlayT = 'no-play' | 'stop' | 'play' | 'pause'

export default function FullScreenViewer() {
    const [images, setImages] = useState<any>([])
    // CAPTION
    const [onCaption, setOnCaption] = useState<boolean>(true)
    // VIDEO
    const [isPlayVideo, setIsPlayVideo] = useState<PlayT>('no-play')
    const [positionVideo, setPositionVideo] = useState<number>(0)
    const [durationVideo, setDurationVideo] = useState<number>(0)

    const {
        isFullScreenViewer,
        activeIdxFullScreenViewer,
        imagesViewerData,
        singleUserChat: currentSingleUserChat
    } = useSelector((state: RootState) => state.chatSlice)

    const singleUserChat = currentSingleUserChat as any

    const dispatch = useDispatch() as any

    function randomId(): string {
        return uuid.v4() as string
    }

    async function generateFiles(mediaKey: any, deviceId: any): Promise<any> {
        const result = await dispatch(downloadMedia({ id: mediaKey, deviceId: deviceId }))
        if (result.type === 'team-inbox/media/fulfilled') {
            return result.payload
        }
        return ''
    }

    function getType(mimetype: any, data: any): any {
        if (mimetype === 'image/jpeg' || data?.message['imageMessage']) {
            return 'image'
        } else if (mimetype === 'video/mp4' || data?.message['videoMessage']) {
            return 'video'
        }
    }

    async function handleGetTypeMedia(isUrl: any, data: any, mimetype: any): Promise<any> {
        if (mimetype === 'image/jpeg') {
            const result = await generateFiles(data.key.mediaKey, data.key.deviceId)
            return {
                url: `data:image/jpeg;base64,${result}`,
                id: data.key?.id,
                type: getType(mimetype, data),
                videoId: null
            }
        } else if (mimetype === 'video/mp4') {
            const result = await generateFiles(data.key.mediaKey, data.key.deviceId)
            return {
                url: `data:video/mp4;base64,${result}`,
                id: data.key?.id,
                type: getType(mimetype, data),
                videoId: randomId()
            }
        }
    }

    async function createMedia(isUrl: any, data: any, mimetype: any): Promise<any> {
        if (isUrl) {
            return {
                url: isUrl,
                id: data.key?.id,
                type: getType(mimetype, data),
                videoId: getType(mimetype, data) === 'video' ? randomId() : null
            }
        } else {
            return handleGetTypeMedia(isUrl, data, mimetype)
        }
    }

    async function createImages(): Promise<any> {
        if (singleUserChat?.messages?.length > 0) {
            const getMedia = singleUserChat.messages.filter((item: any) => {
                return item.message['imageMessage'] || item.message['videoMessage']
            })
            if (getMedia?.length > 0) {
                let newMedia: any[] = []
                for (let i = 0; i < getMedia.length; i++) {
                    const isUrl = getMedia[i].message['imageMessage']?.url || getMedia[i].message['videoMessage']?.url
                    const data = getMedia[i]
                    const result = await createMedia(
                        isUrl,
                        data,
                        data.message['imageMessage']?.mimetype || data.message['videoMessage']?.mimetype
                    )
                    newMedia.push(result)
                }
                return newMedia.reverse()
            }
            return []
        }
        return []
    }

    useEffect(() => {
        createImages().then(res => {
            setImages(res)
            dispatch(setImagesViewerData(res))
        })
    }, [singleUserChat])

    function handleClose(): void {
        dispatch(setIsFullScreenViewer(undefined))
        setOnCaption(true)
        setIsPlayVideo('no-play')
        setPositionVideo(0)
        setDurationVideo(0)
        dispatch(setCurrentPlayVideo(null))
    }

    if (images.length === 0 || imagesViewerData.length === 0) {
        return (
            <></>
        )
    }

    function handleOnCaption(): void {
        setOnCaption(!onCaption)
    }

    return (
        <Modal
            animationType="slide"
            visible={isFullScreenViewer}
            onRequestClose={handleClose}
        >
            <View style={{
                height: '100%',
                width: '100%',
                backgroundColor: '#000',
            }}>
                <Header />
                <Swiper
                    style={{
                        height: '100%',
                        // position: 'relative'
                    }}
                    loop={false}
                    dot={<></>}
                    activeDot={<></>}
                    showsPagination={false}
                    index={activeIdxFullScreenViewer}
                    onIndexChanged={(e) => {
                        dispatch(setActiveIdxFullScreenViewer({ index: e }))
                        setOnCaption(true)
                        setIsPlayVideo('stop')
                        setPositionVideo(0)
                        setDurationVideo(0)
                        dispatch(setCurrentPlayVideo(null))
                    }}
                >
                    {images.map((item: any, i: number) => {
                        return (
                            <View key={i} style={styles.imageViewer}>
                                {(item.type === 'image') &&
                                    <ImageViewerType
                                        onCaption={onCaption}
                                        images={item}
                                        onPress={handleOnCaption}
                                    />
                                }
                                {item.type === 'video' &&
                                    <VideoViewerType
                                        videoId={item.videoId}
                                        url={item.url}
                                        isPlayVideo={isPlayVideo}
                                        setIsPlayVideo={setIsPlayVideo}
                                        setPositionVideo={setPositionVideo}
                                        setDurationVideo={setDurationVideo}
                                        durationVideo={durationVideo}
                                        positionVideo={positionVideo}
                                        onCaption={onCaption}
                                        handleOnCaption={handleOnCaption}
                                    />
                                }
                            </View>
                        )
                    })}
                </Swiper>
                {/* <Caption /> */}
                {/* <View
                style={styles.container}
            >
                <Header />
                <View style={styles.imageViewer}>
                    <ImageViewer
                        imageUrls={images.map((item:any)=>({
                            url: item.url
                        }))}
                        renderIndicator={() => <></>}
                        index={activeIdxFullScreenViewer}
                        onChange={(e) => {
                            dispatch(setActiveIdxFullScreenViewer({ index: e }))
                        }}
                    />
                </View>
                <Caption />
            </View> */}
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
        height: '100%',
        width: '100%',
        backgroundColor: '#000'
        // alignItems: 'flex-start'
    },
    wrapper: {
        backgroundColor: '#000',
    },
})