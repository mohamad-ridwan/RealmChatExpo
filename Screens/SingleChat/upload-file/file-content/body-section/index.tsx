import { View, StyleSheet, ScrollView, Text } from 'react-native'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Card from './Card'
import { useDispatch, useSelector } from 'react-redux'
import { getFiles } from '@/store/file/fileAction'
import { RootState } from '@/store'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { loginSessionName } from '@/utils/storage'
import { Entypo, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'

type Props = {
    currentType: string
    page: number
    setAttachment: Dispatch<SetStateAction<any>>
    attachment: any
}

export default function BodySection({
    currentType,
    page,
    setAttachment,
    attachment
}: Props) {
    const [loading, setLoading] = useState<boolean>(true)
    const { files: currentFiles } = useSelector((state: RootState) => state.fileSlice)
    const files = currentFiles as any

    const dispatch = useDispatch() as any

    async function loadFiles(): Promise<void> {
        setLoading(true)
        const session = await AsyncStorage.getItem(loginSessionName)
        const token = await JSON.parse(session as string)
        const data = {
            headers: {
                'Authorization': `Bearer ${token.token}`
            },
            params: {
                type: currentType,
                page: page
            }
        }
        await dispatch(getFiles(data))
        setLoading(false)
    }

    useEffect(() => {
        loadFiles()
    }, [currentType, page])

    return (
        <View style={style.container}>
            <ScrollView>
                {!loading ?
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        gap: 18,
                        padding: 10
                    }}>
                        {
                            files &&
                            files.length > 0 &&
                            files.map((item: any, i: number) => {
                                const setImage = () => {
                                    if (item?.file_type === "image") {
                                        return require('@/assets/icons/file/image.png')
                                    } else if (item?.file_type === "video") {
                                        return require('@/assets/icons/file/video.png')
                                    } else if (item?.file_type === 'document') {
                                        return require('@/assets/icons/file/document.png')
                                    } else if (item?.file_type === 'audio') {
                                        return require('@/assets/icons/file/audio.png')
                                    }
                                }
                                const image = setImage()

                                const setIcon = () => {
                                    if (item?.file_type === "image") {
                                        return <Entypo name="image-inverted" size={18} color="#FFC107" />
                                    } else if (item?.file_type === "video") {
                                        return <MaterialIcons name="smart-display" size={18} color="#00BCD4" />
                                    } else if (item?.file_type === 'document') {
                                        return <MaterialCommunityIcons name="file-document" size={18} color="#8D6E63" />
                                    } else if (item?.file_type === 'audio') {
                                        return <MaterialIcons name="audio-file" size={18} color="#4AC367" />
                                    }
                                }
                                const icon = setIcon()

                                return (
                                    <Card
                                        key={i}
                                        uri={item?.file_type === "image" ? `https://new-client.realm.chat/cloud_storage/${item.file_url}` : undefined}
                                        image={image}
                                        fileName={item.file_name}
                                        icon={icon}
                                        onPress={() => setAttachment(item)}
                                        isActive={item.id === attachment?.id}
                                    />
                                )
                            })}
                    </View>
                    : <View>
                        <Text>Loading...</Text>
                    </View>
                }
            </ScrollView>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        padding: 20,
        width: '100%',
        height: '79%'
    }
})