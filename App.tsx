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

const App = () => {
   const [receiveSmsPermission, setReceiveSmsPermission] = useState('');

  const requestSmsPermission = async () => {
    try {
      const permission = await PermissionsAndroid
                .request(PermissionsAndroid.PERMISSIONS.RECEIVE_SMS);
      setReceiveSmsPermission(permission);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    requestSmsPermission();
  }, []);

  useEffect(() => {
    if (receiveSmsPermission === PermissionsAndroid.RESULTS.GRANTED) {
      let subscriber = DeviceEventEmitter.addListener(
        'onSMSReceived',
        message => {
          const {messageBody, senderPhoneNumber } = JSON.parse(message);
           Alert.alert(
          'SMS received',
          `Message Body: ${messageBody} & sender number: ${senderPhoneNumber}`,
     );
        },
      );

      return () => {
        subscriber.remove();
      };
    }
  }, [receiveSmsPermission]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.titleText}>
          Listen to incoming SMS from React Native App 
          using React Native Bridge
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:{

  },
  titleText:{
    
  }
})
export default App;