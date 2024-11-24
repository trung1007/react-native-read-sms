import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Modal, Dimensions } from 'react-native';
import io, { Socket } from 'socket.io-client';
// @ts-ignore
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// @ts-ignore
import Ionicons from "react-native-vector-icons/Ionicons";
import FakeBtnGroup from '../../components/FakeBtn';

// Replace with your Flask server URL
const SOCKET_SERVER_URL = 'http://10.0.2.2:5000';

const { width, height } = Dimensions.get('window');


type VoiceSocketModal = {
    onClose: () => void; // Hàm được truyền vào để đóng modal
};


const VoiceSocketScreen: React.FC<VoiceSocketModal> = ({ onClose }) => {
    const [data, setData] = useState<any>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const socketRef = useRef<Socket | null>(null); // Use ref to persist socket instance

    const connectToServer = () => {
        if (socketRef.current) {
            console.log('Already connected to server');
            return;
        }

        const socket = io(SOCKET_SERVER_URL);

        socket.on('connect', () => {
            console.log('Connected to the server');
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from the server');
            setIsConnected(false);
        });

        socket.on('update_text', (message) => {
            console.log('Received update:', message);
            setData(message);
        });

        socketRef.current = socket; // Save socket instance
    };

    const disconnectFromServer = () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            console.log('Disconnected from server');
            setData(null); // Clear old data when disconnected
        } else {
            console.log('No active connection to disconnect');
        }
    };

    useEffect(() => {
        // Clean up socket connection on unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, []);

    const handleStopRecording = () => {
        // setMessageVisible(true)
        setIsConnected(false)
        // onClose()
        if (!isConnected) {
            onClose()
        }
    };
    const handleStopVoice = () => {
        if (!isConnected) {
            onClose()
        }
        else {
            disconnectFromServer()
        }
    }

    return (
        <View style={styles.container}>
            {/* <View style={styles.modalView}>
               
            </View> */}
            <View style={styles.user}>
                <View style={[styles.userInf]}>
                    <Text style={[styles.userName, { fontSize: 32 }]}>người gọi không xác định</Text>
                    <Text style={[styles.userNum, { fontSize: 28 }]}>+84 775313999</Text>
                </View>
                {/* {isRecording ? (<Image style={styles.userImg} source={require('../../assets/img/user_img.png')} />) : null} */}
            </View>
            {!isConnected ? (<View>
                <Text style={styles.title}>Real-time Server Data</Text>
                <Text style={styles.text}>
                    Status: {isConnected ? 'Connected' : 'Disconnected'}
                </Text>
                {data ? (
                    <View>
                        <Text style={styles.text}>Received Text: {data.received_text}</Text>
                        <Text style={styles.text}>
                            Timestamp: {new Date(data.timestamp * 1000).toLocaleString()}
                        </Text>
                    </View>
                ) : (
                    <Text style={styles.text}>Waiting for data...</Text>
                )}
            </View>) : null}


            {isConnected ? (
                <View>
                    <FakeBtnGroup />
                </View>
            ) : null}
            {/* {result.length >> 0 ? (<Modal
                animationType="fade"
                transparent={true}
                visible={messageVisible}
                onRequestClose={() => {
                    setMessageVisible(false)
                }}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => {
                                setMessageVisible(false)
                            }}>
                            <Text style={styles.closeText}>Đóng</Text>
                        </TouchableOpacity>
                        <MessageDetail message={result} spam={spam} number={'775 313 999'} type={'phone'} />
                    </View>
                </View>
            </Modal>) : null} */}

            <View style={styles.phoneControl}>
                <View style={styles.phoneBtn}>
                    <TouchableOpacity
                        onPress={handleStopVoice}
                        style={[styles.button, styles.reject]}
                    >
                        <MaterialCommunityIcons name="phone-hangup" style={{ color: '#ffffff', fontSize: 40 }} />
                    </TouchableOpacity>
                    <Text style={styles.textStyle}>Từ chối</Text>
                </View>
                {/* <View style={styles.phoneBtn}>
                    <TouchableOpacity
                        onPress={connectToServer}
                        style={[styles.button, styles.accept]}
                    >
                        <Ionicons name="call" style={{ color: '#ffffff', fontSize: 40 }} />
                    </TouchableOpacity>
                    <Text style={styles.textStyle}>Chấp Nhận</Text>
                </View> */}
                {!isConnected ? (<View style={styles.phoneBtn}>
                    <TouchableOpacity
                        onPress={isConnected ? handleStopVoice : connectToServer}
                        style={[styles.button, styles.accept]}
                    >
                        <Ionicons name="call" style={{ color: '#ffffff', fontSize: 40 }} />
                    </TouchableOpacity>
                    <Text style={styles.textStyle}>Chấp Nhận</Text>
                </View>) : null}
            </View>
        </View>
    );
};

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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#ffffff'
    },
    text: {
        fontSize: 18,
        marginVertical: 5,
        color: '#ffffff'
    },
    user: {
        display: 'flex',
        flexDirection: "row",
        alignItems: 'center',
        gap: 40
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

export default VoiceSocketScreen;
