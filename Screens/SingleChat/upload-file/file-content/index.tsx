import { View } from 'react-native'
import React, { useState } from 'react'
import BottomSection from './BottomSection'
import TopSection from './top-section'
import BodySection from './body-section'

export default function FileContent() {
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
      />
      <BottomSection />
    </View>
  )
}