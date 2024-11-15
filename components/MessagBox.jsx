import {View, Text, StyleSheet} from 'react-native';

const MessageBox = ({message, spam, number}) => {
  return (
    <View
      style={{
        padding: 10,
        margin: 5,
        backgroundColor: spam.spam ? '#ffcccc' : '#ccffcc',
      }}>
      <Text>SĐT: {number}</Text>
      <Text>Tin nhắn: {message}</Text>
      {/* <Text>{spam.spam ? 'Spam' : 'Not Spam'}</Text> */}
    </View>
  );
};

export default MessageBox;
