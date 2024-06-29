import { View, StyleSheet, ScrollView } from 'react-native'
import React, { Dispatch, SetStateAction } from 'react'
import FileTypeSelection from './FileTypeSelection'
import { Entypo, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'

type Props = {
    currentType: string
    setCurrentType: Dispatch<SetStateAction<string>>
}

export default function TopSection({
    currentType,
    setCurrentType
}: Props) {
    const data = [
        {
            name: 'Image',
            icon: <Entypo name="image-inverted" size={22} color="#FFC107" />,
            type: 'image',
        },
        {
            name: 'Video',
            icon: <MaterialIcons name="smart-display" size={22} color="#00BCD4" />,
            type: 'video',
        },
        {
            name: 'Document',
            icon: <MaterialCommunityIcons name="file-document" size={22} color="#8D6E63" />,
            type: 'document',
        },
        {
            name: 'Audio',
            icon: <MaterialIcons name="audio-file" size={22} color="#4AC367" />,
            type: 'audio',
        },
    ]

    return (
        <View style={styles.container}>
            <ScrollView horizontal>
                <View style={styles.scrollContainer}>
                    {data.map((item, i) => {
                        return (
                            <FileTypeSelection
                                key={i}
                                name={item.name}
                                icon={item.icon}
                                isActive={item.type === currentType}
                                onPress={() => setCurrentType(item.type)}
                            />
                        )
                    })}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        paddingLeft: 20
    },
    scrollContainer: {
        flexDirection: 'row'
    }
})