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
      <View
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}>
        <Text style={styles.title}>Factual Spam</Text>
        <Text
          style={{
            fontSize: 16,
            color: '#3D550C',
            letterSpacing: 2,
            lineHeight: 32,
          }}>
          Chào mừng bạn đến với ứng dụng phát hiện tin nhắn và cuộc gọi lừa đảo
        </Text>
      </View>
      {/* <Text>Xin chào,</Text> */}
      {/* <Text >
        Chào mừng bạn đến với ứng dụng phát hiện tin nhắn và cuộc gọi lừa đảo
      </Text> */}
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
            <Text style={{textAlign: 'left', fontSize: 16, color: '#000000', marginTop:16}}>
              Dưới đây là 1 vài tính năng của ứng dụng:
            </Text>
            <View style={styles.features}>
              <View style={styles.feature}>
                <View style={styles.btn}>
                  <MaterialIcons
                    name="sms"
                    style={{fontSize: 28, color: '#D2FBA4'}}
                  />
                </View>
                <View style={{flex: 1}}>
                  <Text style={{color: '#000000'}}>
                    Kiểm tra và phát hiện lừa đảo trong lịch sử tin nhắn của bạn
                  </Text>
                </View>
              </View>
              <View style={styles.feature}>
                <View style={styles.btn}>
                  <FontAwesome
                    name="phone"
                    style={{fontSize: 28, color: '#F1C0B9'}}
                  />
                </View>
                <View style={{flex: 1}}>
                  <Text style={{color: '#000000'}}>
                    Minh họa phát hiện 1 cuộc gọi lừa đảo
                  </Text>
                </View>
              </View>
              <View style={styles.feature}>
                <View style={styles.btn}>
                  <MaterialCommunityIcons
                    name="motion-play"
                    style={{fontSize: 28, color: '#D2FBA4'}}
                  />
                </View>
                <View style={{flex: 1}}>
                  <Text style={{color: '#000000'}}>
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
    height: height * 0.45,
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
    letterSpacing: 2,
    color: '#59981A',
    fontWeight: '500',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginTop: 200,
    borderBottomWidth: 1,
    borderBottomColor: '#3D550C',
  },
  script: {
    textAlign: 'justify',
    fontSize: 16,
    color: '#000000',
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    marginTop: 16,
  },
  feature: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  btn: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#59981A',
    borderRadius: 26,
  },
});

export default Header;
