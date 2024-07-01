import { View, TouchableOpacity, StyleSheet } from 'react-native'
import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import { ResizeMode, Video } from 'expo-av'
import { FontAwesome5, Fontisto } from '@expo/vector-icons'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentPlayVideo } from '@/store/chat/chatSlice'
import { RootState } from '@/store'
import Caption from '../../Caption'
import TrackVideo from './TrackVideo'
import { PlayT } from '../..'

type Props = {
    url: string
    videoId: string
    positionVideo: number
    durationVideo: number
    setPositionVideo: Dispatch<SetStateAction<number>>
    setDurationVideo: Dispatch<SetStateAction<number>>
    isPlayVideo: PlayT
    setIsPlayVideo: Dispatch<SetStateAction<PlayT>>
}

export default function VideoViewerType({
    url,
    videoId,
    setIsPlayVideo,
    isPlayVideo,
    positionVideo,
    durationVideo,
    setPositionVideo,
    setDurationVideo
}: Props) {
    const [status, setStatus] = useState<any>({});
    const video = useRef<any>(null)
    const [timeStr, setTimeStr] = useState<string>('')
    const [defaultTimeStr, setDefaultTimeStr] = useState('00:00')

    const { currentPlayVideo } = useSelector((state: RootState) => state.chatSlice)
    const dispatch = useDispatch() as any

    function convertMilliseconds(ms: number) {
        let totalSeconds = Math.floor(ms / 1000);
        let minutes: any = Math.floor(totalSeconds / 60);
        let seconds: any = totalSeconds % 60;

        minutes = String(minutes).padStart(2, '0');
        seconds = String(seconds).padStart(2, '0');

        return `${minutes}:${seconds}`;
    }

    const handlePlayBtn = useCallback(() => {
        if (status.isPlaying && status) {
            setIsPlayVideo('pause')
            return video.current.pauseAsync()
        } else if (status.playableDurationMillis === status.positionMillis) {
            setIsPlayVideo('play')
            dispatch(setCurrentPlayVideo(videoId))
            return video.current.replayAsync()
        } else {
            setIsPlayVideo('play')
            dispatch(setCurrentPlayVideo(videoId))
            return video.current.playAsync()
        }
    }, [video, status])

    useEffect(() => {
        if (isPlayVideo === 'stop' && video && status?.isPlaying) {
            video?.current?.stopAsync()
        }
    }, [isPlayVideo, video, status])

    useEffect(() => {
        if(currentPlayVideo === videoId){
            setPositionVideo(status?.positionMillis ?? 0)
            setDurationVideo(status?.durationMillis ?? 0)
            setDefaultTimeStr(convertMilliseconds(status?.durationMillis ?? 0))
            setTimeStr(convertMilliseconds(status?.positionMillis ?? 0))
            if (status?.positionMillis > 0 && status?.positionMillis === status?.durationMillis) {
                setIsPlayVideo('no-play')
            } else if (status?.isPlaying) {
                setIsPlayVideo('play')
            } else {
                setIsPlayVideo('pause')
            }
            // if(isPlayVideo === 'play' && status?.positionMillis){
            //     setPositionVideo(status.positionMillis)
            //     setDurationVideo(status.durationMillis)
    
            // }
        }
    }, [status, isPlayVideo, currentPlayVideo])

    function playPausVideo(): void {
        handlePlayBtn()
    }

    function onValueChangeVideo(e: any): void {
        const value = Math.floor(e)
        if(video){
            video.current.setPositionAsync(value)
            if(isPlayVideo === 'play'){
                setIsPlayVideo('play')
            }
        }
    }

    return (
        <>
            <View style={styles.containerVideo}>
                <Video
                    ref={video}
                    style={styles.video}
                    source={{
                        uri: url
                    }}
                    // useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                    volume={1.0}
                    rate={1.0}
                />
                {/* Play button */}
                <TouchableOpacity style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    zIndex: 1,
                }}
                    onPress={handlePlayBtn}
                >
                    <TouchableOpacity onPress={handlePlayBtn}>
                        <View style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            height: 60,
                            width: 60,
                            borderRadius: 60,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            {status.isPlaying ?
                                <Fontisto name="pause" size={23} color="white" /> :
                                <FontAwesome5 name="play" size={23} color="white" />
                            }
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>
            <Caption>
                <TrackVideo
                    position={positionVideo}
                    duration={durationVideo}
                    timeStr={timeStr}
                    defaultTimeStr={defaultTimeStr}
                    onValueChange={onValueChangeVideo}
                />
            </Caption>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
    },
    containerVideo: {
        position: 'relative',
    },
    video: {
        maxHeight: 720,
        minHeight: 620,
        width: 'auto'
    }
});