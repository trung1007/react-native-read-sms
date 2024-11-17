import {View, Text, StyleSheet} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
const FakeBtnGroup = () => {
  return (
    <View style={styles.fakeBtn}>
      <View style={styles.btnRow}>
        <View style={styles.phoneBtn}>
          <View style={styles.btn}>
            <FontAwesome name="microphone-slash" style={{fontSize: 40, color: '#ffffff'}} />
          </View>
          <Text style={styles.btnText}>tắt tiếng</Text>
        </View>
        <View style={styles.phoneBtn}>
          <View style={styles.btn}>
            <Ionicons name="keypad" style={{fontSize: 40, color: '#ffffff'}} />
          </View>
          <Text style={styles.btnText}>bàn phím</Text>
        </View>
        <View style={styles.phoneBtn}>
          <View style={styles.btn}>
            <FontAwesome name="volume-up" style={{fontSize: 40, color: '#ffffff'}} />
          </View>
          <Text style={styles.btnText}>loa ngoài</Text>
        </View>
      </View>
      <View style={styles.btnRow}>
        <View style={styles.phoneBtn}>
          <View style={styles.btn}>
            <AntDesign name="plus" style={{fontSize: 40, color: '#ffffff'}} />
          </View>
          <Text style={styles.btnText}>thêm cuộc gọi</Text>
        </View>
        <View style={styles.phoneBtn}>
          <View style={styles.btn}>
            <MaterialIcons name="video-call" style={{fontSize: 40, color: '#ffffff'}} />
          </View>
          <Text style={styles.btnText}>FaceTime</Text>
        </View>
        <View style={styles.phoneBtn}>
          <View style={styles.btn}>
            <FontAwesome name="user-circle-o" style={{fontSize: 40, color: '#ffffff'}} />
          </View>
          <Text style={styles.btnText}>danh bạ</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fakeBtn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  btnRow: {
    display: 'flex',
    flexDirection: 'row',
   justifyContent:'space-around',
   gap:20
  },
  btnText: {
    fontSize: 16,
    color: '#ffffff',
  },
  btn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent:'center',
    gap: 12,
    minWidth:100
},
});

export default FakeBtnGroup
