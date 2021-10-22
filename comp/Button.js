import React from 'react'
import { StyleSheet } from 'react-native'
import { Button as PaperButton } from 'react-native-paper'
import { theme } from '../theme'


const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 26,
  },
  button: {
    width: '100%',
    marginVertical: 10,
    paddingVertical: 2,
  },
})


export default function Button({ mode, style, ...props }) {
  return (
    <PaperButton
      style={[
        styles.button,
        mode === 'outlined' && { backgroundColor: theme.colors.surface },
        style,
      ]}
      labelStyle={styles.text}
      mode={mode}
      {...props}
    />
  )
}
