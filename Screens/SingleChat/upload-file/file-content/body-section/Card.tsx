import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'

type Props = {
    uri?: any
    image: any
    fileName: string
    icon: any
}

export default function Card({
    uri,
    image,
    fileName,
    icon
}: Props) {
    return (
        <TouchableOpacity style={style.container}>
            {uri ?
                <Image
                    source={{ uri }}
                    style={style.image}
                />
                :
                <Image
                    source={image}
                    style={style.image}
                />
            }

            <View style={style.containerInfo}>
                <Image
                    source={icon}
                    style={style.icon}
                />
                <Text style={style.fileName} numberOfLines={2}>{fileName}</Text>
            </View>
        </TouchableOpacity>
    )
}

const style = StyleSheet.create({
    container: {
        borderRadius: 8,
        overflow: 'hidden',
        width: '47%',
        elevation: 2,
        backgroundColor: 'white'
        // flex: 1
    },
    image: {
        height: 150,
        width: '100%',
        objectFit: 'contain'
    },
    containerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 10,
        gap: 6
    },
    icon: {
        height: 30,
        width: 30,
        objectFit: 'cover'
    },
    fileName: {
        color: '#54656F',
        fontSize: 12,
        width: 100
    }
})