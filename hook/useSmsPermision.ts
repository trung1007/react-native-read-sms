import { useEffect, useState } from 'react';
import { PermissionsAndroid, Alert, DeviceEventEmitter } from 'react-native';

interface UsePermissionResult {
  receiveSmsPermission: string;
  receivedSmsMessage: string | null;
  receivedSmsPhoneNumber: number | string | null
}

const useSmsPermission = ():UsePermissionResult => {
  const [receiveSmsPermission, setReceiveSmsPermission] = useState<string>('');
  const [receivedSmsMessage, setReceivedSmsMessage] = useState<string | null>(null);
  const [receivedSmsPhoneNumber, setReceivedSmsPhoneNumber] = useState<number|string|null>(null)
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

  // Use effect to handle permission request and subscription
  useEffect(() => {
    handleSmsPermissionAndSubscription();
  }, []);

  return { receiveSmsPermission, receivedSmsMessage, receivedSmsPhoneNumber};
};

export default useSmsPermission;