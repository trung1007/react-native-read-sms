import {View, Text, StyleSheet} from 'react-native';

const MessageBox = ({message, spam}) => (
  <View
    style={{
      padding: 10,
      margin: 5,
      backgroundColor: spam ? '#ffcccc' : '#ccffcc',
    }}>
    <Text>{message}</Text>
    <Text>{spam ? 'Spam' : 'Not Spam'}</Text>
  </View>
);
export default MessageBox;
