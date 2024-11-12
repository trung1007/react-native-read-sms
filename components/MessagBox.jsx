import { useEffect } from 'react';
import {View, Text, StyleSheet} from 'react-native';

const MessageBox = ({message, spam}) => {
  return (
    <View
      style={{
        padding: 10,
        margin: 5,
        backgroundColor: spam.spam ? '#ffcccc' : '#ccffcc',
      }}>
      <Text>{message}</Text>
      <Text>{spam.spam ? 'Spam' : 'Not Spam'}</Text>
    </View>
  );
};

export default MessageBox;
