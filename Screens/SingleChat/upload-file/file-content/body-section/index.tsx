import { View, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Card from './Card'
import { useDispatch, useSelector } from 'react-redux'
import { getFiles } from '@/store/file/fileAction'
import { RootState } from '@/store'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { loginSessionName } from '@/utils/storage'

type Props = {
    currentType: string
    page:number
}

export default function BodySection({
    currentType,
    page
}: Props) {
    const [loading, setLoading] = useState<boolean>(true)
    const { files: currentFiles } = useSelector((state: RootState) => state.fileSlice)
    const files = currentFiles as any

    const dispatch = useDispatch() as any

    async function loadFiles(): Promise<void> {
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
        dispatch(getFiles(data))
    }

    useEffect(() => {
        loadFiles()
    }, [currentType, page])

    return (
        <View style={style.container}>
            <ScrollView>
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
                            const setIcon = () => {
                                if (item?.file_type === "image") {
                                    return require('@/assets/icons/file/image.png')
                                }else if (item?.file_type === "video") {
                                    return require('@/assets/icons/file/video.png')
                                }else if(item?.file_type === 'document'){
                                    return require('@/assets/icons/file/document.png')
                                }else if(item?.file_type === 'audio'){
                                    return require('@/assets/icons/file/audio.png')
                                }
                            }
                            const icon = setIcon()

                            return (
                                <Card
                                    key={i}
                                    uri={item?.file_type === "image" ? `https://new-client.realm.chat/cloud_storage/${item.file_url}` : undefined}
                                    image={icon}
                                    fileName={item.file_name}
                                    icon={icon}
                                />
                            )
                        })}
                </View>
            </ScrollView>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        padding: 20,
        width: '100%',
        height: '75%'
    }
})