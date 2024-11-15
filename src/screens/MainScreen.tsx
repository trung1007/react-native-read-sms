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
                    Alert.alert('Modal has been closed.');
                    setModalMessageVisible(!modalMessageVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <MessageScreen />
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalMessageVisible(!modalMessageVisible)}>
                            <Text style={styles.textStyle}>Hide Modal</Text>
                        </Pressable>
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
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <VoiceScreen />
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVoiceVisible(!modalVoiceVisible)}>
                            <Text style={styles.textStyle}>Hide Modal</Text>
                        </Pressable>
                    </View>
                </View>
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
    historySms: {
        alignItems: 'center',
        marginTop: 20,
        flex: 1
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
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
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
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