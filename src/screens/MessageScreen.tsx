import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native"
import { fetchSMSMessages } from "../../hook/useSMS"
import { detectSpam } from "../../utils/detectSpam";
import { Message } from '../../common/type';
import MessageBox from '../../components/MessagBox';

const MessageScreen = () => {
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]); 
    const handleCheckSms = async () => {
        setLoading(true); // Start loading
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
                                { message: message.body, spam: prediction }
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

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <TouchableOpacity
                    style={[styles.box]}
                    onPress={handleCheckSms}
                    disabled={loading} // Disable button when loading
                >
                    {loading ? (
                        <ActivityIndicator size='large' color="#ffffff" />
                    ) : (<Text style={[styles.text]}>
                        Kiểm tra lịch sử tin nhắn của bạn
                    </Text>)}

                </TouchableOpacity>
            </View>
            <View style={styles.historySms}>
                <Text>Lịch sử tin nhắn của bạn</Text>
                <View style={{ width: 380, borderWidth: 1, height: '95%' }} >
                    {messages.map((item, index) => (
                        <MessageBox key={index} message={item.message} spam={item.spam} />
                    ))}
                </View>
            </View>
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

})
export default MessageScreen