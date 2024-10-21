import {useEffect, useState} from 'react';
import {PermissionsAndroid, Alert, DeviceEventEmitter} from 'react-native';

const usePermission = () => {
  const [receiveSmsPermission, setReceiveSmsPermission] = useState('');

  const handleSmsPermissionAndSubscription = async () => {
    try {
      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      );
      setReceiveSmsPermission(permission);

      // Set up the SMS listener if permission is granted
      if (permission === PermissionsAndroid.RESULTS.GRANTED) {
        const subscriber = DeviceEventEmitter.addListener(
          'onSMSReceived',
          message => {
            const {messageBody, senderPhoneNumber} = JSON.parse(message);
            Alert.alert(
              'SMS received',
              `Message Body: ${messageBody} & sender number: ${senderPhoneNumber}`,
            );
          },
        );

        // Clean up the subscription when the component unmounts
        return () => subscriber.remove();
      }
    } catch (err) {
      console.log('Error requesting SMS permission:', err);
    }
  };

  // Use effect to handle permission request and subscription
  useEffect(()=>{
    handleSmsPermissionAndSubscription();
  },[])


  return receiveSmsPermission;
};

export default usePermission;
