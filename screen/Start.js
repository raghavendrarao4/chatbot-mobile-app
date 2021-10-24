import React, { useState, useEffect } from 'react'
import Background from '../comp/Background'
import Logo from '../comp/Logo'
import Header from '../comp/Header'
import Button from '../comp/Button'
import Paragraph from '../comp/Paragraph'
import Cookies from 'universal-cookie';

export default function StartScreen({ navigation }) {
  const cookies = new Cookies();
  useEffect(() => {
    let userID = cookies.get('userID');
    fetch(`http://localhost:8080/api/user/${userID}`)
    .then(res => res.json())
    .then(res => {
      cookies.set('questionnaireId', res.questionnaireId, { path: '/' });
      cookies.set('userData', JSON.stringify(res), {path: '/'});
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });
    })
    .catch(error => { console.log('Something bad happened') })
  }, []);
  return (
    <Background>
      <Logo />
      <Header>Login to MedChat</Header>
      <Paragraph>
      MedChat is always with you
      </Paragraph>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('LoginScreen')}
      >
        Login
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        Sign Up
      </Button>
    </Background>
  )
}
