import {useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const MessageDetail = ({message, spam, number, type}) => {
  const messageType =
    type === 'message' ? 'Nội dung tin nhắn' : 'Nội dung cuộc gọi';

  const filteredNumber = number.length > 11 ? `${number.slice(3, 12)}` : number;
  const showNumber = filteredNumber.match(/.{1,3}/g).join(' ');

  const formattedNumber = (number === '775 313 999') ? '0775 313 999' : `+84 ${showNumber}`;

  return (
    <View style={styles.container}>
      <View style={styles.ava}>
        <FontAwesome name="user-circle" style={{color: 'gray', fontSize: 48}} />
      </View>
      <View>
        <Text style={styles.number}>
          {formattedNumber}
        </Text>
      </View>

      <View>
        {spam.spam ? (
          <View style={styles.notfi}>
            <Text style={[styles.title, styles.warning]}>Cảnh báo</Text>
            <Image
              style={{width: 72, height: 60, marginBottom: 12}}
              source={require('../assets/img/warning_logo.png')}
            />
            <Text style={styles.message}>
              {messageType} "
              {message.length > 110 ? message.substring(0, 110) + '...' : message}"
              <Text style={styles.warning}> có dấu hiệu lừa đảo </Text>
            </Text>
          </View>
        ) : (
          <View style={styles.notfi}>
            <Text style={[styles.title, styles.safe]}>An toàn</Text>
            <Image
              style={{width: 72, height: 60, marginBottom: 12}}
              source={require('../assets/img/safe_logo.png')}
            />
            <Text style={styles.message}>
              {messageType} "
              {message.length > 110 ? message.substring(0, 110) + '...' : message} "
              <Text style={styles.safe}> không có dấu hiệu lừa đảo </Text>
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  ava: {
    marginBottom: 8,
  },
  number: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  notfi: {
    alignItems: 'center',
  },
  title: {
    textTransform: 'uppercase',
    fontSize: 24,
    marginBottom: 4,
  },
  warning: {
    color: '#e12a2a',
    fontWeight: '600',
  },
  safe: {
    color: '#469A49',
    fontWeight: '600',
  },
  message: {
    fontSize: 14,
    color: 'black',
  },
});

export default MessageDetail;
