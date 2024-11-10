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
import Layout from './src/screens/_layout';

const App = () => {
  return (
    <AppStateProvider>
      <MessageProvider>
        <SafeAreaView style={styles.container}>
          <Layout />
          {/* <MyService /> */}
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