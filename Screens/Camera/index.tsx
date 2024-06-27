import { View, Text, StyleSheet, Dimensions, Button, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { CameraView, useCameraPermissions, Camera } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

const WINDOW_HEIGHT = Dimensions.get("window").height;
const WINDOW_WIDTH = Dimensions.get("window").width;

export default function CameraScreen() {
    const [hasPermission, setHasPermission] = useState(null);
    const [facing, setFacing] = useState<any>('back');
    const [type, setType] = useState('');
    const [isCameraUiOn, setIsCameraUiOn] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    const [flashMode, setFlashMode] = useState(false);
    const [capturePhoto, setCapturePhoto] = useState(null);
    const [galleryPic, setGalleryPic] = useState(null);
    const [showeffect, setshoweffect] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    let cameraRef

    async function snap():Promise<void>{

    }

    async function openGallery():Promise<void>{

    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar
                // barStyle="light-content"
                hidden={false}
                backgroundColor="white"
                translucent={true}
            />

            <View style={{ flex: 1 }}>
                {isPreview ? (
                    <Image
                        source={{
                            uri:
                                capturePhoto ||
                                "https://www.cornwallbusinessawards.co.uk/wp-content/uploads/2017/11/dummy450x450.jpg",
                        }}
                        style={styles.previewImage}
                    />
                ) : (
                    <View style={{ flex: 1 }}>
                        <CameraView style={styles.camera} facing={facing}>

                        </CameraView>
                        {/* <Camera
                            style={{ flex: 1 }}
                            type={type}
                            ref={(ref) => (cameraRef = ref)}
                            flashMode={
                                flashMode
                                    ? Camera.Constants.FlashMode.on
                                    : Camera.Constants.FlashMode.off
                            }
                        ></Camera> */}
                        <View style={styles._bottom_tab_2}>
                            <TouchableOpacity onPress={() => openGallery()}>
                                <FontAwesome name="photo" size={24} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setIsCapturing(true);
                                    snap();
                                }}
                            >
                                <MaterialCommunityIcons name="camera" size={40} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setType(facing);
                                }}
                            >
                                <MaterialIcons
                                    name="flip-camera-android"
                                    size={30}
                                    color="black"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
    },
    _bottom_tab_2: {
        // position: "absolute",
        // bottom: 40,
        flexDirection: "row",
        width: "80%",
        margin: 20,
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "space-between",
        marginBottom: 50,
    },
    _video_recorder: {
        height: 94,
        width: 94,
    },
    previewImage: {
        width: WINDOW_WIDTH,
        height: WINDOW_WIDTH,
        alignSelf: "center",
    },
});