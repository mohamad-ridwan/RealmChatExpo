import { View } from 'react-native'
import React, { Dispatch, SetStateAction, useState } from 'react'
import BottomSection from './BottomSection'
import TopSection from './top-section'
import BodySection from './body-section'

type Props = {
  setAttachment: Dispatch<SetStateAction<any>>
  attachment: any
  setModalVisible: Dispatch<SetStateAction<boolean>>
}

export default function FileContent({
  setAttachment,
  attachment,
  setModalVisible
}: Props) {
  const [currentType, setCurrentType] = useState<any>('image')
  const [page, setPage] = useState<number>(1)

  return (
    <View>
      <TopSection
        currentType={currentType}
        setCurrentType={setCurrentType}
      />
      <BodySection
        currentType={currentType}
        page={page}
        setAttachment={setAttachment}
        attachment={attachment}
      />
      <BottomSection
        page={page}
        setPage={setPage}
        setModalVisible={setModalVisible}
        attachment={attachment}
        setAttachment={setAttachment}
      />
    </View>
  )
}