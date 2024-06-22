import { Button, StyleSheet, View } from 'react-native'
import React, { useCallback, useRef } from 'react'
import { ResizeMode, Video } from 'expo-av'

type Props = {
  v?: any
  generate?: any
}

export default function VideoMessage({
  v,
  generate
}: Props) {
  const [status, setStatus] = React.useState<any>({});
  const video = useRef<any>(null)

  const handlePlayBtn = useCallback(() => {
    if (status.isPlaying && status) {
      return video.current.pauseAsync()
    } else if (status.playableDurationMillis === status.positionMillis) {
      return video.current.replayAsync()
    } else {
      return video.current.playAsync()
    }
  }, [video, status])

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        source={{
          uri: generate ?? v.message.videoMessage.url,
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
      <View style={styles.buttons}>
        <Button
          title={status.isPlaying ? 'Pause' : 'Play'}
          color="green"
          onPress={() => handlePlayBtn()}
        />
        {/* <MaterialIcons name="download-for-offline" size={24} color="green" /> */}
      </View>
    </View>
  )
}

var styles = StyleSheet.create({
  container: {
    height: 'auto',
  },
  buttons: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center'
  },
  video: {
    height: 200,
    width: 'auto'
  }
});