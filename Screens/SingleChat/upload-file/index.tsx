import { Modal, StyleSheet, View } from 'react-native'
import React, { Dispatch, SetStateAction } from 'react'
import Header from './Header'
import FileContent from './file-content'

type Props = {
    modalVisible: boolean
    setModalVisible: Dispatch<SetStateAction<boolean>>
}

export default function UploadFile({
    modalVisible,
    setModalVisible
}: Props) {
    return (
        <Modal
            animationType="slide"
            // transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <View
                style={styles.container}
            >
                <Header closeModal={() => setModalVisible(!modalVisible)} />
                <FileContent/>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        // padding: 20
    }
});