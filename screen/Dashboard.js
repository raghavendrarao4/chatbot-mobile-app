import React from 'react'
import Background from '../comp/Background'
import Paragraph from '../comp/Paragraph'
import Button from '../comp/Button'
import Logo from '../comp/Logo'
import Header from '../comp/Header'

export default function Dashboard({ navigation }) {
  return (
    <Background>
      <Logo />
      <Header>welcome</Header>
      <Paragraph>
        Its pleasure to meet You again
      </Paragraph>
      <Button
        mode="outlined"
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'StartScreen' }],
          })
        }
      >
        Logout
      </Button>
    </Background>
  )
}
