import { ActivityIndicator, Alert, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import * as FileSystem from 'expo-file-system';
import { ResizeMode, Video } from 'expo-av'
import uuid from 'react-native-uuid';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setCurrentPlayVideo, setIsFullScreenViewer } from '@/store/chat/chatSlice';
import { FontAwesome5 } from '@expo/vector-icons';

type Props = {
  v?: any
  generate?: any
  fontColor?: string
}

export default function VideoMessage({
  v,
  generate,
  fontColor
}: Props) {
  const [status, setStatus] = React.useState<any>({});
  const [videoId, setVideoId] = useState<string>('')
  const [isPreloading, setIsPreloading] = useState<boolean>(true)
  // downloaded file
  const [downloadProgress, setDownloadProgress] = useState(0);

  const { currentPlayVideo, imagesViewerData } = useSelector((state: RootState) => state.chatSlice)
  const dispatch = useDispatch() as any
  const video = useRef<any>(null)

  function handleClickVideo(): void {
    if (!isPreloading) {
      const findIdx = imagesViewerData.findIndex((item: any) => item?.id === v?.key?.id)
      dispatch(setIsFullScreenViewer({ index: findIdx < 0 ? 0 : findIdx }))
    }
  }

  const handlePlayBtn = useCallback(() => {
    if (status.isPlaying && status) {
      return video.current.pauseAsync()
    } else if (status.playableDurationMillis === status.positionMillis) {
      return video.current.replayAsync()
    } else {
      dispatch(setCurrentPlayVideo(videoId))
      return video.current.playAsync()
    }
  }, [video, status])

  function randomId(): string {
    return uuid.v4() as string
  }

  useEffect(() => {
    setVideoId(randomId())

    return () => dispatch(setCurrentPlayVideo(''))
  }, [])

  useEffect(() => {
    if (
      currentPlayVideo !== '' &&
      currentPlayVideo !== videoId &&
      status?.isPlaying
    ) {
      video.current.pauseAsync()
    }
  }, [currentPlayVideo, videoId, status, video])

  async function handleDownloadVideo(): Promise<void> {
    const uri = `https://new-api.realm.chat/team-inbox/media/${v.key.mediaKey}/${v.key.deviceId}`;
    const fileUri = FileSystem.documentDirectory + 'video.mp4';

    const downloadResumable = FileSystem.createDownloadResumable(
      uri,
      fileUri,
      {},
      downloadProgressCallback
    );

    try {
      const uri = await downloadResumable.downloadAsync();
      // setFileUri(uri);
      Alert.alert('Download completed')
      setDownloadProgress(0)
    } catch (e) {
      console.error(e);
    }
  }

  const downloadProgressCallback = (downloadProgress: any) => {
    const progress =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite;
    setDownloadProgress(progress);
  };

  useEffect(()=>{
    if(generate?.length > 0 || v.message.videoMessage.url){
      setTimeout(() => {
        setIsPreloading(false)
      }, 0);
    }
  }, [v, generate])

  return (
    <View style={styles.container}>
      {isPreloading ?
        <View style={styles.containerPlaceholder}>
          <ActivityIndicator
            animating
            color={"gray"}
            size="large"
          />
        </View>
        :
        <View style={styles.containerVideo}>
          <Video
            ref={video}
            style={styles.video}
            source={{
              uri: generate ?? v.message.videoMessage.url,
            }}
            resizeMode={ResizeMode.CONTAIN}
            onPlaybackStatusUpdate={status => setStatus(() => status)}
            volume={1.0}
            rate={1.0}
            // onLoadStart={() => setIsPreloading(true)}
            // onReadyForDisplay={() => setIsPreloading(false)}
          />
          {/* Play button */}
          <TouchableNativeFeedback
            onPress={handleClickVideo}
          >
            <View style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              zIndex: 1,
              borderRadius: 3
            }}>
              {isPreloading ?
                <ActivityIndicator
                  animating
                  color={"gray"}
                  size="large"
                  style={{ flex: 1, zIndex: 1 }}
                />
                :
                <TouchableOpacity>
                  <View style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    height: 50,
                    width: 50,
                    borderRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FontAwesome5 name="play" size={20} color="white" />
                  </View>
                </TouchableOpacity>
              }
            </View>
          </TouchableNativeFeedback>
        </View>
      }

      {/* <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}>
        <View style={styles.buttons}>
          <Button
            title={status.isPlaying ? 'Pause' : 'Play'}
            color="green"
            onPress={() => handlePlayBtn()}
          />
        </View>

        <View style={{
          width: '48%'
        }}>
          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            {Math.floor(downloadProgress * 100) > 0 ?
              <CircularProgress
                value={Math.floor(downloadProgress * 100)}
                maxValue={100}
                radius={15}
                progressValueColor={'green'}
                activeStrokeColor='green'
              />
              :
              <View style={{ width: '100%' }}>
                <Button
                  title="Download"
                  color="green"
                  onPress={handleDownloadVideo}
                />
              </View>
            }
          </View>
        </View>
      </View> */}
      {v?.message?.videoMessage?.caption &&
        <Text style={{ paddingTop: 5, paddingHorizontal: 5, fontSize: 13, color: fontColor }}>
          {v.message.videoMessage?.caption}
        </Text>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 'auto',
  },
  buttons: {
    width: '48%'
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center'
  },
  containerVideo: {
    position: 'relative',
  },
  video: {
    height: 200,
    width: 'auto'
  },
  containerPlaceholder: {
    height: 200,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  }
});