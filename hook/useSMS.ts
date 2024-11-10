// @ts-ignore
import SmsAndroid from 'react-native-get-sms-android';
import {PermissionsAndroid, Platform} from 'react-native';
import { SMSMessage } from '../common/type';

const requestSMSPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: 'SMS Permission',
          message:
            'This app needs access to your SMS messages to read and process them.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.error('Failed to request SMS permission:', error);
      return false;
    }
  }
  return true; // Permissions aren't required for non-Android platforms
};



export const fetchSMSMessages = async (filterOptions = {}): Promise<SMSMessage[]> => {
  const hasPermission = await requestSMSPermission();

  if (!hasPermission) {
    console.warn('SMS permission denied');
    return [];
  }

  // Default filter options
  const defaultOptions = {
    box: 'inbox', // "inbox" for received messages, "sent" for sent messages
    read: 0, // 0 for unread, 1 for read, leave undefined to get both
    address: '', // Filter by sender's phone number (optional)
    maxCount: 10, // Limit the number of messages returned
  };

  // Merge default options with any custom filter options passed in
  const options = {...defaultOptions, ...filterOptions};

  return new Promise((resolve, reject) => {
    SmsAndroid.list(
      JSON.stringify(options),
      (fail: any) => {
        // console.error('Failed to fetch SMS:', fail);
        reject(fail);
      },
      (count: any, smsList: any) => {
        const messages = JSON.parse(smsList);
        // console.log(`Fetched ${count} SMS messages`, messages);
        resolve(messages);
      },
    );
  });
};

