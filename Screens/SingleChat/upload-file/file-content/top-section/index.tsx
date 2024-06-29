import { View, StyleSheet, ScrollView } from 'react-native'
import React, { Dispatch, SetStateAction } from 'react'
import FileTypeSelection from './FileTypeSelection'

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
            iconAsset: require('@/assets/icons/file/image.png'),
            type: 'image'
        },
        {
            name: 'Video',
            iconAsset: require('@/assets/icons/file/video.png'),
            type: 'video'
        },
        {
            name: 'Document',
            iconAsset: require('@/assets/icons/file/document.png'),
            type: 'document'
        },
        {
            name: 'Audio',
            iconAsset: require('@/assets/icons/file/audio.png'),
            type: 'audio'
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
                                image={item.iconAsset}
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