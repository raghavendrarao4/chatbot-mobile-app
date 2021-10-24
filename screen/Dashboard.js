import React, { useState, useCallback, useEffect } from 'react'
import Background from '../comp/Background'
import Paragraph from '../comp/Paragraph'
import Button from '../comp/Button'
import Logo from '../comp/Logo'
import Header from '../comp/Header'
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import { ProgressViewIOSBase } from 'react-native'
import { update } from '../../chatbot-backend/app/controllers/questionnaire.controller'
import Cookies from 'universal-cookie';

export default function Dashboard({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [questionnaire, setQuestionnaire] = useState([]);
  const [illness, setIllness] = useState("");
  const [context, setContext] = useState(0);
  const cookies = new Cookies();
  useEffect(() => {
    let questionnaireID = cookies.get('questionnaireID');
    fetch(`http://localhost:8080/api/questionnaire/${questionnaireID}`)
    .then(res => res.json())
    .then(res => {
      let previousMessages = [];
      res?.questions.forEach(singleQuestion => {
        //This is question Part
        let singleMessage = {
          _id: previousMessages.length + 1,
          text: singleQuestion.question,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Doctor',
          },
        };
        if(singleQuestion.question != "")
          previousMessages.push(singleMessage);

        //This is answer Part
        singleMessage = {
          _id: previousMessages.length + 1,
          text: singleQuestion.answer,
          createdAt: new Date(),
          user: {
            _id: 1
          },
        };
        if(singleQuestion.answer != "")
          previousMessages.push(singleMessage);
      });
      return previousMessages.reverse();
    })
    .then((oldMessages) => {
      updateMessages(oldMessages)
    })
    .catch(error => {
      let requestBody = {
        "disease": "",
        "description": "",
        "questions": []
      };

      fetch('http://localhost:8080/api/questionnaire', 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
      .then(res => res.json())
      .then(res => {
        let questionnaireID = res.id;
        let userData = cookies.get('userData');
        let userID = cookies.get('userID');

        let requestBody = userData;
        cookies.set('userData', JSON.stringify(userData), {path: '/'});
        requestBody.questionnaireID = questionnaireID;
        fetch(`http://localhost:8080/api/user/${userID}`, 
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          })
          .then(res => {
            cookies.set('questionnaireID', questionnaireID, { path: '/' });
          })
      });
      updateMessages([]);
    });
  }, []);

  const updateMessages = (oldMessages) => {
    fetch('http://localhost:8080/api/template')
      .then(res => res.json())
      .then(res => {
        setQuestionnaire(res);
        let diseases = [];
        res.forEach(singleQuestionnaire => {
          let singleDisease = {};
          singleDisease.title = singleQuestionnaire.disease + " - " + singleQuestionnaire.description;
          singleDisease.value = singleQuestionnaire.disease;
          diseases.push(singleDisease);
        });
        return diseases;
      }).then((diseases) => {
        let new_message = {
          _id: oldMessages.length + 1,
          text: 'What disease do you feel?',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Doctor',
          },
          quickReplies: {
            type: 'radio', // or 'checkbox',
            values: diseases,
          },
        };
        setMessages(GiftedChat.append(oldMessages, [new_message]));
      });
  }

  useEffect(() => {
    getNextMessage();
  }, [illness, context]);

  useEffect(() => {
    let questionList = [];
    for(let i = (messages.length - 1); i >= 0; i--) {
      let currentSingleMessage = messages[i];
      let nextSingleMessage = messages[i-1];
      let singleQuestion = {};
      if(currentSingleMessage.text != "") {
        if(currentSingleMessage.user._id == 2) {
          singleQuestion.question = currentSingleMessage.text;
          singleQuestion.answer = "";
          if(nextSingleMessage != undefined && nextSingleMessage.user._id == 1) {
            singleQuestion.answer = nextSingleMessage.text;
            i -= 1;
          }
        } else {
          singleQuestion.question = "";
          singleQuestion.answer = currentSingleMessage.text;
        }
        questionList.push(singleQuestion);
      }
    }
    let requestBody = { 'questions': questionList };
    let questionnaireID = cookies.get('questionnaireID');
    fetch(`http://localhost:8080/api/questionnaire/${questionnaireID}`, 
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
  }, [messages]);

  const getNextMessage = () => {
    let question = "";
    questionnaire.forEach((singleDisease) => {
      if(singleDisease.disease == illness) {
        if(singleDisease.questions[context] != undefined) {
          question = singleDisease.questions[context];
        } else {
          question = "Anything else you want to share?";
        }
      }
    });
    let new_message = {
      _id: messages.length + 1,
      text: question,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'Doctor',
      },
    };

    const wordsArr = ["how", "long", "when"]
    if (!new RegExp(wordsArr.join("|")).test(question.toLowerCase())) {
      new_message.quickReplies = {
        type: 'radio', // or 'checkbox',
        values: [
          {
            title: '✔ Yes',
            value: 'yes',
          },
          {
            title: '❌ No',
            value: 'no',
          }
        ],
      };  
    }

    setMessages(previousMessages => GiftedChat.append(previousMessages, [new_message]));
  }

  const onQuickReplySend = useCallback((message_arr = []) => {
    message_arr.forEach(singleMessage => {
      let msg = {
        _id: messages.length + 1,
        text: singleMessage.value,
        createdAt: new Date(),
        user: {
          _id: 1
        }
      }
      setMessages(previousMessages => GiftedChat.append(previousMessages, [msg]));
      if(["malaria", "sinusitis", "appendicitis"].includes(singleMessage.value)) {
        setIllness(singleMessage.value);
      } else {
        setContext(previousContext => previousContext + 1);
      }
    });
  })
  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    setContext(previousContext => previousContext + 1);
  }, [])

  return (
    <>
      <Button
        mode="outlined"
        onPress={() => {
          cookies.set('userData', '', {path: '/'});
          cookies.set('userID', '', {path: '/'});
          cookies.set('questionnaireID', '', {path: '/'});
            navigation.reset({
              index: 0,
              routes: [{ name: 'StartScreen' }],
            })
          }
        }
      >
        End Chat
      </Button>
      <GiftedChat
      messages={messages}
      showUserAvatar={false}
      showAvatarForEveryMessage={false}
      renderAvatar={null}
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
