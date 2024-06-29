import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'

type Props = {
  name: string
  image: any
  isActive: boolean
  onPress:()=>void
}

export default function FileTypeSelection({
  name,
  image,
  isActive,
  onPress
}: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{
        ...styles.container,
        borderBottomColor: isActive ? '#21C2C1' : 'transparent',
      }}>
        <View style={styles.content}>
          <Image
            source={image}
            style={styles.icon}
          />
          <Text style={styles.text}>{name}</Text>
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
    color: '#54656F'
  },
  icon:{
    height: 30,
    width: 30,
    objectFit: 'cover'
  }
})