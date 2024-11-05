import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet } from 'react-native';
import NotificationPopup from 'react-native-push-notification-popup';
import useSmsPermission from './hook/useSmsPermision';
import useVectorized from './hook/useVectorized';

const App = () => {

  const { receiveSmsPermission, receivedSmsMessage, receivedSmsPhoneNumber } =
    useSmsPermission();
    const {vectorizedDocument} = useVectorized(receivedSmsMessage);

  const KNN = require('ml-knn');
  const KnnModelSaved = require('./assets/model/savedKnnModel.json');
  const knn_model = KNN.load(KnnModelSaved);

  const handleDetectMessage=(message:any)=>{
    if(message?.length>0){
      const prediction = knn_model.predict(message)
      if(prediction){
        showNotification()
      }
    }
  }


  const popupRef = useRef(null);
  const [notification, setNotification] = useState(false)

  const showNotification = () => {
    if (popupRef.current) {
      // @ts-ignore
      popupRef.current.show({
        appTitle: 'My App',
        timeText: 'Now',
        title: 'Warning',
        body: 'This message is spam',
      });
    }
  };

  useEffect(()=>{
    handleDetectMessage(vectorizedDocument)
  },[vectorizedDocument])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text>Permission Status: {receiveSmsPermission}</Text>
        <Text>Sender Phone Number: {receivedSmsPhoneNumber}</Text>
        <Text>Received SMS: {receivedSmsMessage}</Text>
        <NotificationPopup
          ref={popupRef}
          renderPopupContent={({ appIconSource, appTitle, timeText, title, body }) => (
            <View style={styles.popupContainer}>
              <Text style={styles.popupTitle}>{title}</Text>
              <Text style={styles.popupBody}>{body}</Text>
            </View>
          )}
          shouldChildHandleResponderStart={true}
          shouldChildHandleResponderMove={true}
          isSkipStatusBarPadding={true}
        />

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    padding: 16,
  },
  popupContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  popupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  popupBody: {
    fontSize: 14,
  },
});

export default App;
