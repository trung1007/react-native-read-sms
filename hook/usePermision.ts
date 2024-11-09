import { useEffect, useState } from 'react';
import { PermissionsAndroid, Alert, DeviceEventEmitter, Platform } from 'react-native';

interface UsePermissionResult {
  receiveSmsPermission: string;
  receivedSmsMessage: string | null;
  receivedSmsPhoneNumber: number | string | null
  notifcationPermission:boolean
}

const usePermission = ():UsePermissionResult => {
  const [receiveSmsPermission, setReceiveSmsPermission] = useState<string>('');
  const [receivedSmsMessage, setReceivedSmsMessage] = useState<string | null>(null);
  const [receivedSmsPhoneNumber, setReceivedSmsPhoneNumber] = useState<number|string|null>(null)
  const [notifcationPermission, setNotificationPermission] = useState<boolean>(false)
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
            const { messageBody, senderPhoneNumber } = JSON.parse(message);
            setReceivedSmsMessage(messageBody);
            setReceivedSmsPhoneNumber(senderPhoneNumber)
          },
        );

        // Clean up the subscription when the component unmounts
        return () => subscriber.remove();
      }
    } catch (err) {
      console.log('Error requesting SMS permission:', err);
    }
  };

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
        if(!notfiGranted){
          const notiRequest = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          )
          setNotificationPermission(true)
          return notiRequest===PermissionsAndroid.RESULTS.GRANTED
        }
        setNotificationPermission(true)
      } catch (error) {
        console.log(error);
        setNotificationPermission(false)
      }
    }
  }


  // Use effect to handle permission request and subscription
  useEffect(() => {
    handleSmsPermissionAndSubscription();
    checkNotificationPermission()
  }, []);

  return { receiveSmsPermission, receivedSmsMessage, receivedSmsPhoneNumber, notifcationPermission};
};

export default usePermission;