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
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import MessageScreen from "./MessageScreen"
import VoiceScreen from "./VoiceScreen"
import MainScreen from "./MainScreen"
import Header from "../../components/Header"
import usePermission from "../../hook/usePermision"

const Tab = createBottomTabNavigator();

const Layout = () => {

    const [message, setMessage] = useState('')
    const { receiveSmsPermission, receivedSmsMessage, receivedSmsPhoneNumber, notifcationPermission } = usePermission()
    const [allowDetect, setAllowDetect] = useState(false)
    // @ts-ignore
    const sleep = (time: any) => new Promise((resolve) => setTimeout(() => resolve(), time));

    const handleAllow = ()=>{
        setAllowDetect(!allowDetect)
    }


    const veryIntensiveTask = async (taskDataArguments: any) => {
        // Example of an infinite loop task
        const { delay } = taskDataArguments;
        await new Promise(async (resolve) => {
            for (let i = 0; BackgroundService.isRunning(); i++) {
                try {
                    const messages = await fetchSMSMessages({ read: 0, maxCount: 1 });
                    // if (messages && messages[0]) {
                    //     setMessage(messages[0].body)
                    // }
                    // console.log(message);
                    if (message !== messages[0].body) {
                        setMessage(messages[0].body)
                    }
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
        taskName: 'Example',
        taskTitle: 'App',
        taskDesc: 'App is running in background',
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
                LocalNotification(message)
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if(!allowDetect && appState === 'background'){
            console.log("ứng dụng chưa thể detect trong nền");
            
        }
        
        if (allowDetect &&  appState === 'background') {
            console.log("có thể detect trong nền");
            startBackgroundService()
            if (message.length > 0) {
                detectMessage(message, appState)
            }
        }
        // if (appState === 'active') {
        //     stopBackgroundService()
        //     if (receivedSmsMessage !== null) {
        //         console.log(receivedSmsMessage);
        //         if (typeof receivedSmsMessage === 'string') {
        //             detectMessage(receivedSmsMessage, appState)
        //         }
        //     }
        // }
    }, [appState, message])
    return (
        <View style={{ flex: 1, backgroundColor: '#ECF87F' }}>
            <Header />
            <MainScreen handleAllow={handleAllow} allowDetect={allowDetect} />
        </View>
    )
}

export default Layout