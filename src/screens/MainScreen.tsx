import { View, Text, StyleSheet, Modal, Pressable, TouchableOpacity, Alert } from "react-native"
import MessageScreen from "./MessageScreen"
import { useState } from "react";
import VoiceScreen from "./VoiceScreen";


const MainScreen = () => {

    const [modalMessageVisible, setModalMessageVisible] = useState(false)
    const [modalVoiceVisible, setModalVoiceVisible] = useState(false);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <TouchableOpacity style={[styles.box]} onPress={() => { setModalMessageVisible(true) }}>
                    <Text style={[styles.text]}>Lịch sử tin nhắn</Text>
                </TouchableOpacity>
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
                            <Text style={styles.textStyle}>Xong</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <View style={styles.content}>
                <TouchableOpacity style={[styles.box]} onPress={() => { setModalVoiceVisible(true) }}>
                    <Text style={[styles.text]}>Mở cuộc ghi âm</Text>
                </TouchableOpacity>
            </View>
            <Modal
                animationType="slide"
                visible={modalVoiceVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVoiceVisible(!modalVoiceVisible);
                }}>
                <VoiceScreen onClose={() => { setModalVoiceVisible(false) }} />
            </Modal>
            <View style={styles.content}>
                <TouchableOpacity style={[styles.box]} >
                    <Text style={[styles.text]}>Cho phép ứng dụng phát hiện tin nhắn lừa đảo</Text>
                </TouchableOpacity>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    content: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    box: {
        backgroundColor: 'green',
        padding: 12,
        borderRadius: 12,
        width: 'auto',
        height: 48,
        alignItems: 'center',
        justifyContent: 'center'
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