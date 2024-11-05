import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  NativeModules,
  PermissionsAndroid,
  Alert,
  DeviceEventEmitter,
  StyleSheet,
} from 'react-native';
import RNFS from 'react-native-fs';
import useSmsPermission from './hook/useSmsPermision';
import useVectorized from './hook/useVectorized';

const App = () => {
  const {receiveSmsPermission, receivedSmsMessage, receivedSmsPhoneNumber} =
    useSmsPermission();

  const {vectorizedDocument} = useVectorized(receivedSmsMessage);

  const KNN = require('ml-knn');
  const KnnModelSaved = require('./assets/model/savedKnnModel.json');
  const knn_model = KNN.load(KnnModelSaved);

  useEffect(() => {
    if (vectorizedDocument.length > 0) {
      const prediction = knn_model.predict(vectorizedDocument);
      console.log(prediction);
    }
  }, [vectorizedDocument]);

  return (
    <SafeAreaView style={styles.container}>
      <Text>Permission Status: {receiveSmsPermission}</Text>
      <Text>Sender Phone Number: {receivedSmsPhoneNumber}</Text>
      <Text>Received SMS: {receivedSmsMessage}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {},
  titleText: {},
  textMessage: {
    width: 'auto',
    minWidth: 300,
    backgroundColor: 'red',
  },
});
export default App;