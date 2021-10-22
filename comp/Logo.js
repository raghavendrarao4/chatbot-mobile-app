import React from 'react'
import { Image, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  image: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
})
export default function Logo() {
  return <Image source={require('../assets/logo.png')} style={styles.image} />
}
