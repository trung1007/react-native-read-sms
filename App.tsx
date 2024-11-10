import React, { createContext, ReactNode, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  AppState,
  AppStateStatus
} from 'react-native';
import MyService from './src/service/Service';
import { AppStateProvider } from './context/AppStateContext';
import { MessageProvider } from './context/MessageContext';
import TestState from './src/testState';
// @ts-ignore
import { fetchSMSMessages } from './hook/useSMS';



const App = () => {
  // const [message, setMessage] = useState('')
  // const getMessages = async () => {
  //   try {
  //     const messages = await fetchSMSMessages({ read: 0, maxCount: 1 });
  //     messages.forEach((message) => {
  //       setMessage(message.body)
  //   });
  //   } catch (error) {
  //     console.error('Error fetching SMS:', error);
  //   }
  // };


  // useEffect(() => {
  //   getMessages()
  //   console.log(message);
  // }, [message])
  return (
    <AppStateProvider>
      <MessageProvider>
        <SafeAreaView style={styles.container}>
          <MyService />
          {/* <TestState/> */}
        </SafeAreaView >
      </MessageProvider>
    </AppStateProvider>


  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

});
export default App;