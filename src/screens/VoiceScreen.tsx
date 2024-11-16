import { Text, View, StyleSheet, Pressable, Image, TouchableOpacity, PermissionsAndroid, ToastAndroid, Platform } from "react-native"
import VoiceRecord from "../voiceRecord"
// @ts-ignore
import Ionicons from "react-native-vector-icons/Ionicons";
// @ts-ignore
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Voice from '@react-native-voice/voice';
import { useEffect, useState } from "react";
import requestPermission from "../../utils/requestPermision";
import { detectSpam } from "../../utils/detectSpam";
import LocalNotification from "../../LocalNotification";


type ModalContentProps = {
    onClose: () => void; // Hàm được truyền vào để đóng modal
};

const VoiceScreen: React.FC<ModalContentProps> = ({ onClose }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [result, setResult] = useState("");

    // Start recording
    const startRecording = async () => {
        const permissionGranted = await requestPermission();
        if (permissionGranted) {
            setIsRecording(true);
            Voice.start('vi-VN'); // Start the voice recognition
        }
    };

    // Stop recording
    const handleStopRecording = () => {
        setIsRecording(false);
        Voice.stop(); // Stop the voice recognition
        // onClose()
        if (!isRecording) {
            onClose()
        }
    };

    const handleVoice = () => {
        // Setup Voice event listeners
        Voice.onSpeechStart = () => console.log("Speech recognition started");
        Voice.onSpeechEnd = () => console.log("Speech recognition ended");
        Voice.onSpeechResults = (e) => {
            console.log("Final speech results:", e.value);
            setResult(e.value ? e.value[0] : ''); // Update state with final recognized text
        };
        Voice.onSpeechPartialResults = async (e) => {
            console.log("Partial speech results:", e.value);
            setResult((e.value ? e.value[0] : '') + '...'); // Update state with partial recognized text
            try {
                const prediction = await detectSpam(e.value ? e.value[0] : '')
                if (prediction.spam) {
                    setIsRecording(false);
                    Voice.stop();
                    LocalNotification(e.value ? e.value[0] : '')
                }
            } catch (error) {

            }
        };
        Voice.onSpeechError = (e) => {
            console.log("Speech error:", e);
        };

        // Cleanup on unmount
        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }

    // Setup event listeners for speech recognition events
    useEffect(() => {
        const voiceListener = handleVoice()
        return voiceListener
    }, []);


    return (
        <View style={styles.container}>
            {/* <View style={styles.modalView}>
               
            </View> */}
            <View style={styles.user}>
                <View style={[styles.userInf, !isRecording && styles.userRecord]}>
                    <Text style={styles.userName}>người gọi không xác định</Text>
                    <Text style={styles.userNum}>+84 775313999</Text>
                </View>
                {isRecording ? (<Image style={styles.userImg} source={require('../../assets/img/user_img.png')} />) : null}
            </View>
            <Text style={{ color: 'white', fontWeight: '500' }}>
                {result || 'Hãy nói gì đó'}
            </Text>
            {/* <Text style={{ color: 'white', fontWeight: '500' }}>
                {isRecording ? 'Dừng ghi âm' : 'Bắt đầu ghi âm'}
            </Text> */}
            <View style={styles.phoneControl}>
                <View style={styles.phoneBtn}>
                    <TouchableOpacity
                        onPress={handleStopRecording}
                        style={[styles.button, styles.reject]}
                    >
                        <MaterialCommunityIcons name="phone-hangup" style={{ color: '#ffffff', fontSize: 32 }} />
                    </TouchableOpacity>
                    <Text style={styles.textStyle}>Từ chối</Text>
                </View>
                {!isRecording ? (<View style={styles.phoneBtn}>
                    <TouchableOpacity
                        onPress={isRecording ? handleStopRecording : startRecording}
                        style={[styles.button, styles.accept]}
                    >
                        <Ionicons name="call" style={{ color: '#ffffff', fontSize: 32 }} />
                    </TouchableOpacity>
                    <Text style={styles.textStyle}>Chấp Nhận</Text>
                </View>) : null}

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: 'center',
        backgroundColor: '#192A29',
        paddingTop: 80,
        paddingBottom: 80,
        paddingLeft: 12,
        paddingRight: 12
    },
    user: {
        display: 'flex',
        flexDirection: "row",
        alignItems: 'center',
        gap: 40
    },
    userInf: {
        gap: 12
    },
    userRecord: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    userName: {
        fontSize: 20,
        textTransform: 'capitalize',
        color: '#ffffff'
    },
    userNum: {
        color: '#ffffff',
        fontSize: 16,
    },
    userImg: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 1,
        borderColor: '#ffffff'
    },
    button: {
        backgroundColor: '#469A49',
        width: 80,
        height: 80,
        borderRadius: 40,
        padding: 10,
        // elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    accept: {
        backgroundColor: '#469A49',
    },
    reject: {
        backgroundColor: '#e12a2a'
    },
    phoneControl: {
        display: 'flex',
        flexDirection: 'row',
        gap: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    phoneBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 16
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
})

export default VoiceScreen