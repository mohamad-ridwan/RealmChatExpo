import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function BottomSection() {
  return (
    <View style={styles.container}>
      <Text>BottomSection</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  }
})