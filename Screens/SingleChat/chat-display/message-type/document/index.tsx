import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import * as FileSystem from 'expo-file-system';

type Props = {
    v?: any
    generate?: any
}

export default function Document({
    v,
    generate
}: Props) {

    const downloadFile = async () => {
        const uri = 'https://repository.dinamika.ac.id/id/eprint/2994/1/14510160009-2018-Complete.pdf';
        const fileUri = FileSystem.documentDirectory + 'file.pdf';

        try {
            const { uri: localUri, status } = await FileSystem.downloadAsync(uri, fileUri);
            console.log('status', status)
            console.log('Downloaded to', localUri);
            alert('File downloaded successfully!');
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Failed to download file.');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.containerTouch} onPress={downloadFile}>
                <View style={styles.documentInfo}>
                    <FontAwesome name="file" size={22} color="#21C2C1" />

                    <View>
                        <Text style={styles.title}>{v?.message?.documentMessage?.title ?? 'document'}</Text>
                        <Text style={styles.desc}>document - 0.00kb</Text>
                    </View>
                </View>
                <MaterialCommunityIcons name="download-circle-outline" size={24} color="#6B7C85" />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderRadius: 4,
        backgroundColor: '#E5E8ED',
        gap: 4,
        marginBottom: 2
    },
    containerTouch:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    documentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    title: {
        fontSize: 12,
        color: '#111B21'
    },
    desc: {
        fontSize: 10,
        color: '#6B7C85',
        marginTop: 2
    }
})