import React, { useEffect, useState } from 'react';
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
  Button,
  Linking,
  TouchableOpacity,
  AppState,
} from 'react-native';
import RNFS from 'react-native-fs';
import usePermission from './hook/usePermision';
import useVectorized from './hook/useVectorized';
import VoiceRecord from './src/voiceRecord';
import LocalNotification from './LocalNotification';
// import BackgroundTask from './src/backgroundTask';
// import BackgroundService from 'react-native-background-actions';



const App = () => {


  const { receiveSmsPermission, receivedSmsMessage, receivedSmsPhoneNumber, notifcationPermission } =
    usePermission();



  // useEffect(() => {
  //   startBackgroundTask();

  //   // Lắng nghe sự thay đổi trạng thái của app
  //   const appStateListener = AppState.addEventListener('change', nextAppState => {
  //     if (nextAppState === 'background') {
  //       console.log('App moved to background');
  //       // Có thể bắt đầu lại task nếu cần khi app chuyển sang nền
  //       startBackgroundTask();
  //     }
  //   });

  //   // Cleanup khi component unmount
  //   return () => {
  //     appStateListener.remove();
  //     BackgroundService.stop(); // Dừng background service khi không cần thiết
  //   };
  // }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Text>Permission Status: {receiveSmsPermission}</Text>
      <Text>Sender Phone Number: {receivedSmsPhoneNumber}</Text>
      <Text>Received SMS: {receivedSmsMessage}</Text>
      <View>
        <VoiceRecord />
      </View>
      <Text> Push Notification!! </Text>
      <Button title={'Click Here'} onPress={()=>{
        LocalNotification('123123')
      }} />
      
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