import {View, Text, StyleSheet} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const MessageBox = ({message, spam, number}) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}>
      <View style={styles.ava}>
        <FontAwesome name="user-circle"  style={{color:'gray', fontSize:32}} />
      </View>
      <View
        style={[
          styles.detail,
          {backgroundColor: spam.spam ? '#ffcccc' : '#ccffcc'},
        ]}>
        <Text style={styles.number}>+84 {number}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>

      {/* <Text>{spam.spam ? 'Spam' : 'Not Spam'}</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  ava: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detail: {
    flex: 1,
    borderWidth: 1,
    padding: 12,
    borderColor: 'white',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius:12
  },
  number: {
    fontSize: 16,
    fontWeight: '600',
  },
  message: {
    fontSize: 12,
  },
});

export default MessageBox;
