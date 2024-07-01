import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Slider from '@react-native-community/slider'

type Props = {
    position: number
    duration: number
    onValueChange: (e: any) => void
    timeStr: string
    defaultTimeStr: string
}

export default function TrackVideo({
    position,
    duration,
    onValueChange,
    timeStr,
    defaultTimeStr
}: Props) {
    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 20
        }}>
            <View style={styles.containerSlider}>
                <Text style={styles.timeStr}>
                    {position > 0 ? timeStr : defaultTimeStr}
                </Text>
                {/* {!isPlaying ?
                    <TouchableOpacity onPress={playPausVideo} style={styles.icon}>
                        <FontAwesome6 name="play" size={24} color="white" />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={playPausVideo} style={styles.icon}>
                        <MaterialIcons name="pause" size={24} color="white" />
                    </TouchableOpacity>
                } */}

                <Slider
                    style={styles.slider}
                    value={position}
                    minimumValue={0}
                    maximumValue={duration}
                    minimumTrackTintColor="white"
                    maximumTrackTintColor="white"
                    onValueChange={onValueChange}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    timeStr: {
        fontSize: 9,
        // marginBottom: -13,
        // marginBottom: 20,
        color: '#fff'
    },
    containerSlider: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 20
    },
    slider: {
        width: 200,
        height: 'auto',
    },
    icon: {
        height: 25,
        width: 25
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 'auto',
    },
})