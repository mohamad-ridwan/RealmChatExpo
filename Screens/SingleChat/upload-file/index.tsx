import { Modal, StyleSheet, View } from 'react-native'
import React, { Dispatch, SetStateAction } from 'react'
import Header from './Header'
import FileContent from './file-content'
import { useTheme } from '@react-navigation/native'

type Props = {
    modalVisible: boolean
    setModalVisible: Dispatch<SetStateAction<boolean>>
    setAttachment: Dispatch<SetStateAction<any>>
    attachment: any
}

export default function UploadFile({
    modalVisible,
    setModalVisible,
    setAttachment,
    attachment
}: Props) {
    const { colors } = useTheme();

    function handleClose(): void {
        setModalVisible(!modalVisible);
        setAttachment(null)
    }

    return (
        <Modal
            animationType="slide"
            // transparent={true}
            visible={modalVisible}
            onRequestClose={handleClose}
        >
            <View
                style={{
                    ...styles.container,
                    backgroundColor: colors.background
                }}
            >
                <Header closeModal={handleClose} />
                <FileContent
                    setAttachment={setAttachment}
                    attachment={attachment}
                    setModalVisible={setModalVisible}
                />
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        // padding: 20
    }
});