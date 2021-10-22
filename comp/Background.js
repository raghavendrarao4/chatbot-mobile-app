import React from 'react'
import { ImageBackground, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { theme } from '../theme'


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    width: '100%',
    maxWidth: 340,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  background: {
    backgroundColor: theme.colors.surface,
    flex: 1,
    width: '100%',
  },
})


export default function Background({ children }) {
  return (
    <ImageBackground
      source={require('../assets/background_dot.png')}
      resizeMode="repeat"
      style={styles.background}
    >
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        {children}
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}
