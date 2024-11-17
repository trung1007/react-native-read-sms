import {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const {width, height} = Dimensions.get('window');

const Header = () => {
  const [infVisible, setInfVisible] = useState(false);

  return (
    <View>
      <Text style={styles.title}>Factual Spam</Text>
      <Text>Xin chào,</Text>
      <Text>
        Chào mừng bạn đến với ứng dụng phát hiện tin nhắn và cuộc gọi lừa đảo
      </Text>
      <View style={{position: 'absolute', top: 8, right: 12}}>
        <TouchableOpacity
          onPress={() => {
            setInfVisible(true);
          }}>
          <AntDesign
            name="infocirlceo"
            style={{fontSize: 32, color: '#29A527'}}
          />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={infVisible}
        onRequestClose={() => {
          setInfVisible(false);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text
              style={{
                fontSize: 24,
                color: '#29A527',
                fontWeight: '500',
                textAlign: 'center',
              }}>
              Factual Spam
            </Text>
            <Text style={styles.script}>
              Ứng dụng <Text style={{color: '#29A527'}}>Factual Spam</Text> là 1
              ứng dụng demo để trình bày về giải pháp phát hiện tin nhắn và cuộc
              gọi lừa đảo{' '}
            </Text>
            <Text style={{textAlign: 'left', fontSize: 16, color: '#000000'}}>
              Dưới đây là 1 vài tính năng của ứng dụng:
            </Text>
            <View style={{display: 'flex', flexDirection: 'column', gap: 20}}>
              <View style={styles.feature}>
                <View style={{width: 32}}>
                  <MaterialIcons
                    name="sms"
                    style={{fontSize: 32, color: 'green'}}
                  />
                </View>
                <View style={{flex: 1}}>
                  <Text style={{color:'#000000'}}>
                    Kiểm tra và phát hiện lừa đảo trong lịch sử tin nhắn của bạn
                  </Text>
                </View>
              </View>
              <View style={styles.feature}>
                <View style={{width: 32}}>
                  <FontAwesome
                    name="phone"
                    style={{fontSize: 32, color: 'green'}}
                  />
                </View>
                <View style={{flex: 1}}>
                  <Text style={{color:'#000000'}}>Minh họa phát hiện 1 cuộc gọi lừa đảo</Text>
                </View>
              </View>
              <View style={styles.feature}>
                <View style={{width: 32}}>
                  <MaterialCommunityIcons
                    name="motion-play"
                    style={{fontSize: 32, color: 'green'}}
                  />
                </View>
                <View style={{flex: 1}}>
                  <Text style={{color:'#000000'}}>
                    Cho phép ứng dụng phát hiện tin nhắn lừa đảo trong nền
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setInfVisible(false);
              }}>
              <Text style={styles.closeText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  closeText: {
    color: '#007BFF',
    fontSize: 16,
  },
  title: {
    fontSize: 48,
    color: '#29A527',
    fontWeight: '500',
    textAlign: 'center',
  },
  script: {
    textAlign: 'justify',
    fontSize: 16,
    color: '#000000',
  },
  feature: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});

export default Header;
