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
    const [dots, setDots] = useState("");
    // const sms = useMessageContext()
    const handleCheckSms = async () => {
        setLoading(true); // Start loading
        // Khởi tạo hiệu ứng cho dots
        let  counter = 0
        let interval: ReturnType<typeof setInterval> | null = null;
        interval = setInterval(() => {
            setDots((prev) => (prev.length < 3 ? prev + "." : ""));
            console.log(dots);
            
            counter++
            if(counter>5){
                clearInterval(interval!)
            }
        }, 1000);
      
        try {
            const allMessage = await fetchSMSMessages({ read: undefined, maxCount: undefined });
            if (allMessage.length > 0) {
                await Promise.all(
                    allMessage.map(async (message: any) => {
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
            if (interval) clearInterval(interval);
            setDots(""); // Reset dots
            setLoading(false); // Stop loading when done
        }
    }
    useEffect(() => {
        handleCheckSms()
        // setInterval(()=>{
        //     setDots((prev) => (prev.length < 3 ? prev + "." : ""));
        // },1000)
        

    }, [])


    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {loading ? (
                    <View >
                        <ActivityIndicator size="large" color="#192A29" />
                        <Text style={{
                            marginTop: 20,
                            fontSize: 16,
                            color: "#192A29",
                            fontWeight: "bold",
                        }}>Đang kiểm tra lịch sử tin nhắn của bạn{dots}</Text>
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
        marginTop: 12
    },
    content: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: '#192A29',
        fontSize: 24,
        fontWeight: '600'
    },
    historySms: {
        width: '100%',
        flex: 1
    },
})
export default MessageScreen