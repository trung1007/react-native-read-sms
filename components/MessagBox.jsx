import {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MessageDetail from './MessageDetail';

const {width, height} = Dimensions.get('window');

const MessageBox = ({message, spam, number}) => {
  const [detailVisible, setDetailVisible] = useState(false);

  return (
    <TouchableOpacity
      style={{
        display: 'flex',
        flexDirection: 'row',
        minHeight: 80,
      }}
      onPress={() => {
        setDetailVisible(true);
      }}>
      <View style={styles.ava}>
        <FontAwesome name="user-circle" style={{color: 'gray', fontSize: 32}} />
      </View>
      <View
        style={[
          styles.detail,
          {backgroundColor: spam.spam ? '#e12a2a' : '#469A49'},
        ]}>
        <Text style={styles.number}>
          +84 {number.length > 11 ? `${number.slice(0, 11)}...` : number}
        </Text>
        <Text style={styles.message}>
          {message.length > 45 ? `${message.slice(0, 45)}...` : message}
        </Text>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={detailVisible}
        onRequestClose={() => {
          setDetailVisible(false);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setDetailVisible(false);
              }}>
              <Text style={styles.closeText}>Đóng</Text>
            </TouchableOpacity>
            <MessageDetail message={message} spam={spam} number={number} />
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
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
    borderRadius: 12,
  },
  number: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E2E6D9',
  },
  message: {
    fontSize: 14,
    color: '#E2E6D9',
    overflow: 'hidden',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    height: height * 0.4,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position:'absolute',
    right:12,
    top:12
  },
  closeText: {
    color: '#007BFF',
    fontSize: 16,
  },
});

export default MessageBox;
