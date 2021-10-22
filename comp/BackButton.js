import React from 'react'
import { TouchableOpacity, Image, StyleSheet } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 12 + getStatusBarHeight(),
    left: 5,
  },
  image: {
    width: 25,
    height: 25,
  },
})

export default function BackButton({ goBack }) {
  return (
    <TouchableOpacity onPress={goBack} style={styles.container}>
      <Image
        source={require('../assets/arrow_back.png')}
        style={styles.image}
      />
    </TouchableOpacity>
  )
}
