import { View, Text, StyleSheet, Modal, Pressable, TouchableOpacity, Alert } from "react-native"
import MessageScreen from "./MessageScreen"
import { useState } from "react";
import Colors from '../../common/var'
import VoiceScreen from "./VoiceScreen";
// @ts-ignore
import AntDesign from "react-native-vector-icons/AntDesign";
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// @ts-ignore
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// @ts-ignore
const MainScreen = ({ handleAllow, allowDetect }) => {

    const [modalMessageVisible, setModalMessageVisible] = useState(false)
    const [modalVoiceVisible, setModalVoiceVisible] = useState(false);
    const [alerAllow, setAlerAllow] = useState(false)

    const showAlert = () => {
        Alert.alert(
            "Thông báo", // Tiêu đề thông báo
            allowDetect ? "Ứng dụng sẽ không hoạt động trong nền" : "Cho phép ứng dụng hoạt động trong nền", // Nội dung thông báo
            [
                {
                    text: "Hủy",
                    style: "cancel", // Tùy chọn nút hủy
                },
                {
                    text: "Đồng ý",
                    onPress: () => {
                        setAlerAllow(!alerAllow)
                        handleAllow()
                    },
                }
            ],
            { cancelable: true } // Cho phép đóng thông báo bằng cách nhấn ngoài
        );
    };

    const handleAlert = () => {
        console.log("allow in main" + allowDetect);

        showAlert()
    }

    return (
        <View style={styles.container}>
            <View style={styles.feature}>
                <View style={styles.content}>
                    <TouchableOpacity style={[styles.box]} onPress={() => { setModalMessageVisible(true) }}>
                        <MaterialIcons
                            name="sms"
                            style={{ fontSize: 32, color: Colors.btnFeat }}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    <TouchableOpacity style={[styles.box]} onPress={() => { setModalVoiceVisible(true) }}>
                        <FontAwesome
                            name="phone"
                            style={{ fontSize: 32, color: Colors.btnFeat}}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    <TouchableOpacity style={allowDetect ? styles.unactiveBox : styles.box} onPress={handleAlert} >
                        <MaterialCommunityIcons
                            name="motion-play"
                            style={{ fontSize: 32, color: Colors.btnFeat }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <Modal
                animationType="slide"
                visible={modalMessageVisible}
                onRequestClose={() => {
                    setModalMessageVisible(!modalMessageVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <MessageScreen />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => setModalMessageVisible(false)}>
                            <AntDesign name='down' style={{ fontSize: 16, color: '#ffffff' }} />
                            {/* <Text style={styles.textStyle}>Xong</Text> */}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                visible={modalVoiceVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVoiceVisible(!modalVoiceVisible);
                }}>
                <VoiceScreen onClose={() => { setModalVoiceVisible(false) }} />
            </Modal>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 60
    },

    feature: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'

    },
    content: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    box: {
        // backgroundColor: '#59981A',
        backgroundColor:Colors.btnBg,
        width: 80,
        height: 80,
        borderRadius: 40,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unactiveBox: {
        backgroundColor: '#FC2E20',
        width: 80,
        height: 80,
        borderRadius: 40,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 16
    },
    centeredView: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        flex: 1,
        // padding: 35,
        // alignItems: 'center',
        margin: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        backgroundColor: '#192A29',
        borderRadius: 20,
        padding: 10,
        position: 'absolute',
        right: 12,
        elevation: 2,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },

})

export default MainScreen