import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'

type Props = {
    closeModal: ()=>void
}

export default function Header({
    closeModal
}: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.containerNavigation}>
                <Text style={styles.headerText}>Upload File</Text>
                <TouchableOpacity onPress={closeModal}>
                    <AntDesign name="close" size={24} color="#54656F" />
                </TouchableOpacity>
            </View>

            {/* UPLOAD REDIRECT */}
            <View style={styles.containerUpload}>
                <Text style={styles.chooseText}>Choose Your File</Text>
                <TouchableOpacity>
                    <Text style={styles.uploadBtn}>
                        Upload
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    containerNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#54656F'
    },
    icon: {
        color: '#54656F'
    },
    containerUpload: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chooseText:{
        color: '#54656F'
    },
    uploadBtn:{
        fontSize: 14,
        color: 'white',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 6,
        backgroundColor: '#01E05B'
    }
})