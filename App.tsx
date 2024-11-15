import React, { createContext, ReactNode, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  AppState,
  AppStateStatus,
  View,
  Text,
  Button
} from 'react-native';
import MyService from './src/service/Service';
import { AppStateProvider } from './context/AppStateContext';
import { MessageProvider } from './context/MessageContext';
import TestState from './src/testState';
import Layout from './src/screens/_layout';
import { NavigationContainer, useNavigation } from '@react-navigation/native';




const App = () => {
  return (
    <AppStateProvider>
      <MessageProvider>
        <NavigationContainer>
          <SafeAreaView style={styles.container}>
            <Layout />
          </SafeAreaView >
        </NavigationContainer>
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