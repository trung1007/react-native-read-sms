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
  Platform,
} from 'react-native';
import RNFS from 'react-native-fs';
import useSmsPermission from './hook/useSmsPermision';
import useVectorized from './hook/useVectorized';

const App = () => {
  const {receiveSmsPermission, receivedSmsMessage, receivedSmsPhoneNumber} =
    useSmsPermission();

    async function checkNotificationPermission(){
      
      if (Platform.OS !== 'android') {
        console.warn('This permission check is only applicable for Android.');
        return true;
      }
      if(Platform.OS === 'android'){
        try {
          const notfiGranted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          )
          const notiRequest = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          )
          console.log(notfiGranted);
          console.log(notiRequest);
          
          if(!notfiGranted){
            const notiRequest = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            )
            return notiRequest===PermissionsAndroid.RESULTS.GRANTED
          }
          console.log(notfiGranted);
          
        } catch (error) {
          console.log(error);
          
        }
      }
    }

    useEffect(()=>{
      checkNotificationPermission()
    },[])
  

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