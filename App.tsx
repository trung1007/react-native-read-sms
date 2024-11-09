import React, { createContext, ReactNode, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  AppState,
  AppStateStatus
} from 'react-native';
import MyService from './src/service/Service';
import { AppStateProvider } from './context/AppStateContext';
import TestState from './src/testState';




const App = () => {
  return (
    <AppStateProvider>
    {/* // <appStateContext.Provider value={inApp ? 'active' : 'background'}> */}
        <SafeAreaView style={styles.container}>
          <MyService />
          {/* <TestState/> */}
        </SafeAreaView >
    {/* // </appStateContext.Provider> */}

    </AppStateProvider>


  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

});
export default App;