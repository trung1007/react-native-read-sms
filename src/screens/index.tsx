import { Text, View } from "react-native"
import { useAppStateContext } from "../../context/AppStateContext"
import { useEffect, useMemo, useState } from "react"
import MyService from "../service/Service"
// import { startBackgroundService, stopBackgroundService, updateLatestMessage } from "../service/BackgroundService"
import { detectSpam } from "../../utils/detectSpam"
import BackgroundService from 'react-native-background-actions';
import { fetchSMSMessages } from "../../hook/useSMS";
import LocalNotification from "../../LocalNotification"
import { useMessageContext } from "../../context/MessageContext"
// import usePermission from "../../hook/usePermision"
import MessageScreen from "./MessageScreen"
import VoiceScreen from "./VoiceScreen"
import MainScreen from "./MainScreen"
import Header from "../../components/Header"
import usePermission from "../../hook/usePermision"
import Colors from '../../common/var'


const Layout = () => {

    const [lastMessage, setLastMessage] = useState('');
    const [message, setMessage] = useState('')
    const { receiveSmsPermission, receivedSmsMessage, receivedSmsPhoneNumber, notifcationPermission } = usePermission()
    const [allowDetect, setAllowDetect] = useState(false)
    // @ts-ignore
    const sleep = (time: any) => new Promise((resolve) => setTimeout(() => resolve(), time));

    const handleAllow = () => {
        setAllowDetect(!allowDetect)
    }

    const checkMessage=(message:string)=>{
        console.log("Tin nhắn để ktra:" + message);
        
    }


    const veryIntensiveTask = async (taskDataArguments: any) => {
        // Example of an infinite loop task
        const { delay } = taskDataArguments;
        await new Promise(async (resolve) => {
            for (let i = 0; BackgroundService.isRunning(); i++) {
                try {
                    const messages = await fetchSMSMessages({ read: 0, maxCount: 1 });

                    if (messages && messages[0]) {
                        const newMessage = messages[0].body;
        
                        // Kiểm tra nếu tin nhắn mới khác với tin nhắn trước đó
                        if (lastMessage !== newMessage) {
                            // console.log("New message detected: " + newMessage);
        
                            // // Cập nhật tin nhắn mới
                            // setLastMessage(newMessage);
        
                            // // Gọi hàm checkMessage với tin nhắn mới
                            // checkMessage(newMessage);
                            setLastMessage((prevLastMessage) => {
                                if (prevLastMessage !== newMessage) {
                                    console.log("New message detected: " + newMessage);
                        
                                    // Gọi hàm checkMessage với tin nhắn mới
                                    detectMessage(newMessage, appState)
                                    
                                    console.log('Tin nhắn cũ:', prevLastMessage);
                                    console.log('Tin nhắn mới:', newMessage);
                                }
                        
                                // Trả về newMessage để cập nhật lastMessage
                                return newMessage;
                            });
                            
                        }
                    }
                    // // if (messages && messages[0]) {
                    // //     setMessage(messages[0].body)
                    // // }
                    // // console.log(message);
                    // console.log('new: ' + messages[0].body);

                    // if (message !== messages[0].body) {
                    //     setMessage(messages[0].body)
                    //     console.log('old: '+message);
                    // }

                    // const isSpam = await detectSpam(message)
                    // console.log(isSpam);
                } catch (error) {
                    console.error('Error fetching SMS:', error);
                }
                await sleep(delay);
            }
        });
    };
    const options = {
        taskName: 'Background',
        taskTitle: 'Factual Spam',
        taskDesc: 'Ứng dụng Factual Spam đang chạy ngầm',
        taskIcon: {
            name: 'ic_launcher',
            type: 'mipmap',
        },
        color: '#ff00ff',
        linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
        parameters: {
            delay: 1000,
        },
    };

    const startBackgroundService = async () => {
        await BackgroundService.start(veryIntensiveTask, options);
        // await BackgroundService.updateNotification({ taskDesc: 'ExampleTask description' }); // Only Android, iOS will ignore this call
    }
    const stopBackgroundService = async () => {
        await BackgroundService.stop();
    }
    const appState = useAppStateContext()
    const detectMessage = async (message: string, appState: string) => {
        console.log(message);
        try {
            const prediction = await detectSpam(message)
            console.log('prediction in ' + appState + ": " + prediction.spam);
            if (prediction.spam) {
                LocalNotification(message, 'sms')
            }
        } catch (error) {
            console.log(error);
        }
    }
    // useEffect(() => {
    //     if(!allowDetect &&  appState === 'background' ){
    //         console.log("ứng dụng chưa thể detect trong nền");
    //     }
    //     if (allowDetect &&  appState === 'background'  ) {
    //         console.log("có thể detect trong nền");
    //         startBackgroundService()
    //         if (message.length > 0) {
    //             detectMessage(message, appState)
    //         }
    //     }
    //     if (appState === 'active') {
    //         stopBackgroundService()
    //         if (receivedSmsMessage !== null) {
    //             console.log(receivedSmsMessage);
    //             if (typeof receivedSmsMessage === 'string') {
    //                 detectMessage(receivedSmsMessage, appState)
    //             }
    //         }
    //     }
    // }, [receivedSmsMessage,appState])

    useEffect(() => {
        if (!allowDetect && appState === 'background') {
            console.log("Ứng dụng chưa thể detect trong nền");
        }
        if (allowDetect && appState === 'background') {
            console.log("Có thể detect trong nền");
            startBackgroundService();
            if (message.length > 0) {
                // console.log(message ? message : 'Chưa có tin nhắn tới');
                // detectMessage(message, appState);
            }
        }
        if (appState === 'active') {
            stopBackgroundService();
        }
    }, [appState, allowDetect]);


    useEffect(() => {
        if (appState === 'active' && receivedSmsMessage !== null) {
            stopBackgroundService()
            if (receivedSmsMessage !== null) {
                console.log(receivedSmsMessage);
                if (typeof receivedSmsMessage === 'string') {
                    detectMessage(receivedSmsMessage, appState)
                }
            }
        }
    }, [receivedSmsMessage])

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <Header />
            <MainScreen handleAllow={handleAllow} allowDetect={allowDetect} />
        </View>
    )
}

export default Layout