import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'

type Props = {
    v?: any
    generate?: any
}

export default function Document({
    v,
    generate
}: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.documentInfo}>
                <FontAwesome name="file" size={22} color="#21C2C1" />

                <View>
                    <Text style={styles.title}>{v?.message?.documentMessage?.title ?? 'document'}</Text>
                    <Text style={styles.desc}>document - 0.00kb</Text>
                </View>
            </View>
            <MaterialCommunityIcons name="download-circle-outline" size={24} color="#6B7C85" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderRadius: 4,
        backgroundColor: '#E5E8ED',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 4
    },
    documentInfo:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    title:{
        fontSize: 12,
        color: '#111B21'
    },
    desc: {
        fontSize: 10,
        color: '#6B7C85',
        marginTop: 2
    }
})