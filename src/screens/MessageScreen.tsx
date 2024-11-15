import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Modal, Alert, Pressable } from "react-native"
import { fetchSMSMessages } from "../../hook/useSMS"
import { detectSpam } from "../../utils/detectSpam";
import { Message } from '../../common/type';
import MessageBox from '../../components/MessagBox';
import VoiceScreen from './VoiceScreen';
import { useMessageContext } from '../../context/MessageContext';
import Loading from '../../components/Loading';

const MessageScreen = () => {
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const sms = useMessageContext()
    const handleCheckSms = async () => {
        setLoading(true); // Start loading
        try {
            const allMessage = await fetchSMSMessages({ read: undefined, maxCount: undefined });
            if (allMessage.length > 0) {
                await Promise.all(
                    allMessage.map(async (message: any) => {
                        console.log(message);

                        try {
                            const prediction = await detectSpam(message.body);
                            if (prediction.spam) {
                                console.log(message.body);
                            }
                            setMessages(prevMessages => [
                                ...prevMessages,
                                { message: message.body, spam: prediction, number: message.address }
                            ]);
                        } catch (error) {
                            console.log(error);
                        }
                    })
                );
            }
        } catch (error) {
            console.error("Error fetching SMS messages:", error);
        } finally {
            setLoading(false); // Stop loading when done
        }
        // messages.map((item:any)=>{
        //     console.log(item.spam);
        // })

    }
    useEffect(() => {
        handleCheckSms()
    },[])

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {loading ? (
                   <View >
                     <ActivityIndicator size="large" color="#192A29" />
                   </View>
                ) : null}
            </View>
            {messages.length > 0 ? (<View style={styles.historySms}>
                <Text style={styles.title}>Lịch sử tin nhắn của bạn</Text>
                <View style={{ width: '100%', height: '95%' }} >
                    <ScrollView>
                        {messages.map((item, index) => (
                            <MessageBox key={index} message={item.message} spam={item.spam} number={item.number} />
                        ))}
                    </ScrollView>
                </View>
            </View>) : null
            }
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop:12
    },
    content: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: '#192A29',
        fontSize: 24,
        fontWeight:'600'
    },
    historySms: {
        width:'100%',
        flex: 1
    },
})
export default MessageScreen