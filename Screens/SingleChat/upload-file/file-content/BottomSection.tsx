import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { Dispatch, SetStateAction, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { FontAwesome } from '@expo/vector-icons'

type Props = {
  page: number
  setPage: Dispatch<SetStateAction<number>>
  setModalVisible: Dispatch<SetStateAction<boolean>>
  attachment: any
  setAttachment: Dispatch<SetStateAction<any>>
}

export default function BottomSection({
  page,
  setPage,
  setModalVisible,
  attachment,
  setAttachment
}: Props) {
  const { pagination: currentPagination } = useSelector((state: RootState) => state.fileSlice)
  const pagination = currentPagination as any

  const isDisabledPrevButton = useMemo(() => {
    return page === 1
  }, [pagination, page])

  const isDisabledNextButton = useMemo(() => {
    if (pagination) {
      if (pagination.last_page) {
        return !(page < pagination.last_page)
      }
      return true
    }
    return true
  }, [pagination, page])

  function handlePrevPage(): void {
    setPage(page - 1)
  }

  function handleNextPage(): void {
    setPage(page + 1)
  }

  function handleClose():void{
    setAttachment(null)
    setModalVisible(false)
  }

  return (
    <View style={styles.container}>
      {/* Move Button */}
      <View style={styles.containerMoveBtn}>
        <TouchableOpacity disabled={isDisabledPrevButton} onPress={handlePrevPage}>
          <FontAwesome name="angle-left" size={18} style={{
            ...styles.moveBtn,
            opacity: isDisabledPrevButton ? 0.5 : 1
          }} />
        </TouchableOpacity>
        <TouchableOpacity disabled={isDisabledNextButton} onPress={handleNextPage}>
          <FontAwesome name="angle-right" size={18} style={{
            ...styles.moveBtn,
            opacity: isDisabledNextButton ? 0.5 : 1
          }} />
        </TouchableOpacity>
      </View>
      {/* Action Button */}
      <View style={styles.containerBtnRight}>
        <TouchableOpacity>
          <Text style={styles.cancelBtn} onPress={handleClose}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled={!attachment} onPress={()=>setModalVisible(false)}>
          <Text style={{
            ...styles.selectBtn,
            opacity: !attachment ? 0.7 : 1
          }}>Select</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  containerMoveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  moveBtn: {
    color: 'white',
    paddingHorizontal: 35,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#01E05B'
  },
  containerBtnRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  cancelBtn: {
    fontSize: 14,
    color: '#01E05B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  selectBtn: {
    fontSize: 14,
    color: 'white',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#01E05B'
  }
})