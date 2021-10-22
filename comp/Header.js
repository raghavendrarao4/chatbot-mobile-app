import React from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { theme } from '../theme'


const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    color: theme.colors.primary,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
})

export default function Header(props) {
  return <Text style={styles.header} {...props} />
}

