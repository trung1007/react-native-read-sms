import {View, Text, StyleSheet, Image} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const MessageDetail = ({message, spam, number}) => {
  return (
    <View style={styles.container}>
      <View style={styles.ava}>
        <FontAwesome name="user-circle" style={{color: 'gray', fontSize: 48}} />
      </View>
      <View>
        <Text style={styles.number}>
          +84 {number.length > 11 ? `${number.slice(0, 11)}...` : number}
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
              Đoạn tin nhắn "{message}"{' '}
              <Text style={styles.warning}>có dấu hiệu lừa đảo</Text>
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
              Đoạn tin nhắn "{message}"{' '}
              <Text style={styles.safe}>không có dấu hiệu lừa đảo</Text>
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
