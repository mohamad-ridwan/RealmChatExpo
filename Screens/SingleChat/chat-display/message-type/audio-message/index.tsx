import { Audio } from 'expo-av';
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPlaySound } from '@/store/chat/chatSlice';
import { RootState } from '@/store';

type Props = {
    urlAudio: string
    v: any
}

export default function AudioMessage({
    urlAudio,
    v
}: Props) {
    const [sound, setSound] = useState<any>();
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState<any>(null);
    const [position, setPosition] = useState<any>(null);
    const [timeStr, setTimeStr] = useState<string>('')
    const [defaultTimeStr, setDefaultTimeStr] = useState('00:00')

    const { currentPlaySound } = useSelector((state: RootState) => state.chatSlice)
    const dispatch = useDispatch() as any

    function convertMilliseconds(ms: number) {
        let totalSeconds = Math.floor(ms / 1000);
        let minutes: any = Math.floor(totalSeconds / 60);
        let seconds: any = totalSeconds % 60;

        minutes = String(minutes).padStart(2, '0');
        seconds = String(seconds).padStart(2, '0');

        return `${minutes}:${seconds}`;
    }

    const loadAudio = async () => {
        const { sound } = await Audio.Sound.createAsync(
            { uri: urlAudio }
        );
        setSound(sound);
        const statusAsync: any = await sound.getStatusAsync()
        setDefaultTimeStr(convertMilliseconds(statusAsync?.durationMillis))
        sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    };

    const onPlaybackStatusUpdate = (status: any) => {
        if (status.isLoaded) {
            setDuration(status.durationMillis);
            setPosition(status.positionMillis);
            setIsPlaying(status.isPlaying);
        }
    };

    const playPauseAudio = async () => {
        if (sound) {
            if (isPlaying) {
                // setIsPlaying(false)
                await sound.pauseAsync();
            } else {
                setIsPlaying(true)
                dispatch(setCurrentPlaySound({ mediaKey: v.key.mediaKey }))
                await sound.playAsync();
            }
        }
    };

    const pauseAudio = async () => {
        if (sound) {
            setIsPlaying(false)
            await sound.pauseAsync();
        }
    }

    const stopAudio = async () => {
        if (sound) {
            await sound.stopAsync();
        }
    };

    const seekAudio = async (value: any) => {
        if (sound) {
            const seekPosition = value;
            await sound.setPositionAsync(seekPosition);
            setPosition(seekPosition);
            if (isPlaying) {
                setIsPlaying(true)
            }
        }
    };

    useEffect(() => {
        loadAudio()
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, []);

    const updatePosition = async () => {
        if (sound) {
            const status = await sound.getStatusAsync();
            setPosition(status.positionMillis);
        }
    };

    useEffect(() => {
        let interval: any = null;
        if (isPlaying) {
            interval = setInterval(updatePosition, 0);
        } else if (!isPlaying && interval) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    useEffect(() => {
        const timeStr = convertMilliseconds(position);
        setTimeStr(timeStr)
    }, [position])

    useEffect(() => {
        if (position !== null && position === duration) {
            setIsPlaying(false)
            setPosition(0)
            stopAudio()
        }
    }, [position, duration])

    // HANDLE MULTIPLE PLAY SOUND
    useEffect(() => {
        if (
            v?.key?.mediaKey &&
            currentPlaySound?.mediaKey &&
            currentPlaySound.mediaKey !== v.key.mediaKey
        ) {
            pauseAudio()

            return () => dispatch(setCurrentPlaySound({ mediaKey: '' }))
        }
    }, [v, currentPlaySound, sound])

    return (
        <View>
            <View style={styles.containerSlider}>
                {!isPlaying ?
                    <TouchableOpacity onPress={playPauseAudio} style={styles.icon}>
                        <FontAwesome6 name="play" size={24} color="#21C2C1" />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={playPauseAudio} style={styles.icon}>
                        <MaterialIcons name="pause" size={24} color="#21C2C1" />
                    </TouchableOpacity>
                }

                <Slider
                    style={styles.slider}
                    value={position}
                    minimumValue={0}
                    maximumValue={duration}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#000000"
                    onValueChange={seekAudio}
                />
            </View>
            <Text style={styles.timeStr}>
                {position > 0 ? timeStr : defaultTimeStr}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    timeStr: {
        marginLeft: 35,
        fontSize: 9,
        marginBottom: -13
    },
    containerSlider: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
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