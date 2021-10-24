import React, { useState, useCallback, useEffect } from 'react'
import Background from '../comp/Background'
import Paragraph from '../comp/Paragraph'
import Button from '../comp/Button'
import Logo from '../comp/Logo'
import Header from '../comp/Header'
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import { ProgressViewIOSBase } from 'react-native'

export default function Dashboard({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [context, setContext] = useState(0);
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'What illness do you feel?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
        quickReplies: {
          type: 'radio', // or 'checkbox',
          values: [
            {
              title: 'Malaria - From parasite like mosquitoes',
              value: 'malaria',
            },
            {
              title: 'Sinusitis - Condition with severe headache',
              value: 'sinusitis',
            },
            {
              title: 'Appendicitis - Condition with severe stomach pain',
              value: 'appendicitis',
            }
          ],
        },
      },
    ])
  }, [])

  const getNextMessage = (message) => {
    if(context == 0) {
      if(message == 'malaria') {
        setMessages(previousMessages => GiftedChat.append(previousMessages, [{
          _id: 2,
        text: 'Do you have fever?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
        quickReplies: {
          type: 'radio', // or 'checkbox',
          values: [
            {
              title: 'Yes',
              value: 'yes',
            },
            {
              title: 'No',
              value: 'no',
            },
          ],
        },
        }]))
      }
    }
  }

  const onQuickReplySend = useCallback((messages = []) => {
    console.log(messages);
    messages.forEach(singleMessage => {
      let msg = {
        _id: singleMessage.messageId,
        text: singleMessage.value,
        createdAt: new Date(),
        user: {
          _id:1
        }
      }
      setMessages(previousMessages => GiftedChat.append(previousMessages, [msg]));
      getNextMessage(singleMessage.value);
    });
  })
  const onSend = useCallback((messages = []) => {
    // setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    // getNextMessage(messages[0].text);
  }, [])

  return (
    <>
      <Button
        mode="outlined"
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'StartScreen' }],
          })
        }
      >
        End Chat
      </Button>
      <GiftedChat
      messages={messages}
      showUserAvatar={false}
      showAvatarForEveryMessage={false}
      renderAvatar={() => null}
      onSend={messages => onSend(messages)}
      onQuickReply={messages => onQuickReplySend(messages)}
      user={{
        _id: 1,
      }}
      renderBubble={props => {
        return (
          <Bubble
            {...props}
  
            textStyle={{
              right: {
                color: '#FFFFFF',
              },
              left: {
                color: '#24204F',
              },
            }}
            wrapperStyle={{
              left: {
                backgroundColor: '#FFFFFF',
              },
              right: {
                backgroundColor: "#3A13C3",
              },
            }}
          />
        );
      }}
    />
    </>
  )
}
