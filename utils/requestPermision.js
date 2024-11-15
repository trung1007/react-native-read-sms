import { Platform, PermissionsAndroid, ToastAndroid } from 'react-native';

const requestPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'We need access to your microphone to recognize your speech',
        }
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        ToastAndroid.show('Microphone permission denied', ToastAndroid.SHORT);
        return false;
      }
    } catch (err) {
      console.error('Failed to request microphone permission:', err);
      return false;
    }
  }
  return true;
};

export default requestPermission;
