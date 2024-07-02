import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTheme } from '@react-navigation/native'

type Props = {
  name: string
  icon: any
  isActive: boolean
  onPress:()=>void
}

export default function FileTypeSelection({
  name,
  icon,
  isActive,
  onPress
}: Props) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{
        ...styles.container,
        borderBottomColor: isActive ? '#21C2C1' : 'transparent',
      }}>
        <View style={styles.content}>
          {icon}
          <Text style={{
            ...styles.text,
            color: colors.text
          }}>{name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 4,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 5
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    // color: '#54656F'
  },
  icon:{
    objectFit: 'cover'
  }
})