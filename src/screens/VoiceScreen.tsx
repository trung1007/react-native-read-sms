import { Text, View, StyleSheet, Pressable, Image, TouchableOpacity, PermissionsAndroid, ToastAndroid, Platform, Modal, Dimensions, ActivityIndicator } from "react-native"
import VoiceRecord from "../voiceRecord"
// @ts-ignore
import Ionicons from "react-native-vector-icons/Ionicons";
// @ts-ignore
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Voice from '@react-native-voice/voice';
import { useEffect, useState } from "react";
import requestPermission from "../../utils/requestPermision";
import { detectSpam } from "../../utils/detectSpam";
// @ts-ignore
import AntDesign from "react-native-vector-icons/AntDesign";
import FakeBtnGroup from "../../components/FakeBtn";
import LocalNotification from "../../LocalNotification";
import MessageDetail from "../../components/MessageDetail";
import { ratioW, ratioH } from "../../utils/convertUI";
import Colors from '../../common/var'
import { StartWord } from "../../common/type";



const { width, height } = Dimensions.get('window');


type ModalContentProps = {
    onClose: () => void; // Hàm được truyền vào để đóng modal
};

const VoiceScreen: React.FC<ModalContentProps> = ({ onClose }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [result, setResult] = useState("");
    const [messageVisible, setMessageVisible] = useState(false)
    const [spam, setSpam] = useState<{ spam?: boolean }>({ spam: false })
    const [endCall, setEndCall] = useState(false)
    const [loadingDetectAll, setLoadingDetectAll] = useState(false)
    const [stopCall, setStopCall] = useState(false)
    let prePrediction = false
    let hasWarning = false
    let preResult = ''
    let lastDetectTime = 0;
    let tmp = ''

    // Start recording
    const startRecording = async () => {
        const permissionGranted = await requestPermission();
        if (permissionGranted) {
            setIsRecording(true);
            // Voice.start('en-US'); // Start the voice recognition English
            Voice.start('vi-VN'); // Start the voice recognition Vietnamese
            // const voiceListener = handleVoice()
            // return voiceListener
        }
    };

    // Stop recording
    // const handleStopRecording = async () => {
    //     console.log(result);
    //     // if (result !== '') {
    //     //     setStopCall(true)
    //     //     detectSpam(result)
    //     //         .then((prediction) => {
    //     //             console.log(prediction);
    //     //             setSpam(prediction); // Cập nhật trạng thái với kết quả dự đoán
    //     //         })
    //     //         .catch((error) => {
    //     //             console.log(error); // Log lỗi nếu có
    //     //         });
    //     // }
    //     if (isRecording) {
    //         setIsRecording(false)
    //     }
    //     hasWarning = false
    //     if (endCall) {
    //         Voice.stop();
    //     }
    //     if (result === '') {
    //         console.log("chưa nói gì đã dừng");
    //         Voice.stop();
    //         Voice.destroy().then(Voice.removeAllListeners);
    //     }
    //     // Stop the voice recognition
    //     if (!isRecording) {
    //         onClose()
    //     }
    // };

    const handleStopRecording = async () => {
        if (result === '') {
            console.log("chưa nói gì đã dừng");
            // Voice.stop();
            // Voice.destroy().then(Voice.removeAllListeners);
        }
        else {
            setLoadingDetectAll(true)
            console.log(result);

            detectSpam(result)
                .then((prediction) => {
                    setSpam(prediction); // Cập nhật trạng thái với kết quả dự đoán
                    setResult(result)
                    setLoadingDetectAll(false)
                    setMessageVisible(true)
                    setIsRecording(false)
                })
                .catch((error) => {
                    console.log(error); // Log lỗi nếu có
                });
        }
        setIsRecording(false)
        Voice.stop();
        Voice.destroy().then(Voice.removeAllListeners);
        if (!isRecording) {
            onClose()
        }
    }

    const handleVoice = () => {
        setMessageVisible(false)
        // Setup Voice event listeners
        Voice.onSpeechStart = () => {
            console.log("Speech recognition started")
            setEndCall(false)
            setResult('')
        };
        Voice.onSpeechEnd = () => {
            console.log("Speech recognition ended")
            setEndCall(true)
            setIsRecording(false)
        };
        // if (!stopCall) {
        //   
        // }

        // Voice.onSpeechResults = async (e) => {
        //     console.log("Final speech results:", e.value);
        //     const finalResult = e.value ? e.value[0] : '';
        //     // setResult(finalResult); // Update state with final recognized text
        //     setEndCall(true)
        // };

        Voice.onSpeechPartialResults = async (e) => {
            console.log("Partial speech results:", e.value);
            const currentResult = e.value ? e.value[0] : '';
            setResult(currentResult)
            // tmp = currentResult
            let filteredResult = currentResult;
            StartWord.forEach(word => {
                const regex = new RegExp(`\\b${word}\\b`, 'gi'); // Tạo regex tìm kiếm cả từ (case-insensitive)
                filteredResult = filteredResult.replace(regex, '').trim(); // Thay thế bằng chuỗi rỗng
            });
            console.log('Filter result: ' + filteredResult);

            const now = Date.now(); // Lấy timestamp hiện tại

            if (filteredResult !== preResult && filteredResult.split(/\s+/).length > 3 && !hasWarning) {
                preResult = filteredResult;
                if (now - lastDetectTime >= 4000) { // Kiểm tra xem đã qua 3 giây chưa
                    lastDetectTime = now; // Cập nhật thời gian detectSpam được gọi
                    detectSpam(filteredResult)
                        .then((prediction) => {
                            console.log(prediction.spam);
                            if (prediction.spam) {
                                console.log("Tôi chỉ cảnh báo 1 lần");
                                LocalNotification(currentResult, 'phone');
                                hasWarning = true;
                            }
                        })
                        .catch((error) => {
                            console.log("Error in detectSpam:", error);
                        });
                } else {
                    console.log("Skipping detectSpam, waiting for 4 seconds cooldown.");
                }
            } else {
                preResult = filteredResult;
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
            <View style={styles.user}>
                <View style={[styles.userInf, !isRecording && styles.userRecord]}>
                    <Text style={[styles.userName, isRecording ? { fontSize: 18 } : { fontSize: 28 }]}>người gọi không xác định</Text>
                    <Text style={[styles.userNum, isRecording ? { fontSize: 18 } : { fontSize: 28 }]}>0775 313 999</Text>
                </View>
                {isRecording ? (<Image style={styles.userImg} source={require('../../assets/img/user_img.png')} />) : null}
            </View>
            {isRecording ? (
                <View>
                    <FakeBtnGroup />
                </View>
            ) : null}
            {loadingDetectAll && !messageVisible ? (<View>
                <ActivityIndicator size="large" color="white" />
                <Text style={{
                    marginTop: 20,
                    fontSize: 16,
                    color: "#192A29",
                    fontWeight: "bold",
                }}>Đang kiểm tra lịch sử tin nhắn của bạn</Text>
            </View>) : null}
            <Modal
                animationType="fade"
                transparent={true}
                visible={messageVisible}
                onRequestClose={() => {
                    setMessageVisible(false)
                }}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <MessageDetail message={result} spam={spam} number={'775 313 999'} type={'phone'} />
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => {
                                setMessageVisible(false)
                            }}>
                            <Text style={styles.closeText}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={styles.phoneControl}>
                <View style={styles.phoneBtn}>
                    <TouchableOpacity
                        onPress={handleStopRecording}
                        style={[styles.button, styles.reject]}
                    >
                        <MaterialCommunityIcons name="phone-hangup" style={{ color: '#ffffff', fontSize: 40 }} />
                    </TouchableOpacity>
                    <Text style={styles.textStyle}>Từ chối</Text>
                </View>
                {!isRecording ? (<View style={styles.phoneBtn}>
                    <TouchableOpacity
                        onPress={startRecording}
                        style={[styles.button, styles.accept]}
                    >
                        <Ionicons name="call" style={{ color: '#ffffff', fontSize: 40 }} />
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
        gap: 20
    },
    userInf: {
        gap: 12,
    },
    userRecord: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    userName: {
        textTransform: 'capitalize',
        color: '#ffffff'
    },
    userNum: {
        color: '#ffffff',
    },
    userImg: {
        width: 100,
        height: 100,
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

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: width * 0.9,
        height: height * 0.5,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        position: 'absolute',
        right: 12,
        top: 12
    },
    closeText: {
        color: '#007BFF',
        fontSize: 16,
    },
})

export default VoiceScreen