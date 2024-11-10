import { Text, View } from "react-native"
import { useAppStateContext } from "../../context/AppStateContext"
import { useEffect, useMemo, useState } from "react"
import MyService from "../service/Service"
// import { startBackgroundService, stopBackgroundService, updateLatestMessage } from "../service/BackgroundService"
import { detectSpam } from "../../utils/detectSpam"
import BackgroundService from 'react-native-background-actions';
import { fetchSMSMessages } from "../../hook/useSMS";
import LocalNotification from "../../LocalNotification"


const Layout = () => {

    const [message, setMessage] = useState('')
    // @ts-ignore
    const sleep = (time: any) => new Promise((resolve) => setTimeout(() => resolve(), time));
    // let latestMessage: string = '';
    // const updateLatestMessage = (message: string) => {
    //     latestMessage = message;
    //     console.log('Updated latest message:', latestMessage);
    //     if (latestMessage !== undefined) {
    //         return latestMessage
    //     }
    // };
    const veryIntensiveTask = async (taskDataArguments: any) => {
        // Example of an infinite loop task
        const { delay } = taskDataArguments;
        await new Promise(async (resolve) => {
            for (let i = 0; BackgroundService.isRunning(); i++) {
                try {
                    const messages = await fetchSMSMessages({ read: 0, maxCount: 1 });
                    // messages.forEach((message) => {
                    //     console.log('Message body:', message.body);
                    // });
                    if (messages && messages[0]) {
                        setMessage(messages[0].body)
                    }

                } catch (error) {
                    console.error('Error fetching SMS:', error);
                }
                await sleep(delay);
            }
        });
    };
    const options = {
        taskName: 'Example',
        taskTitle: 'ExampleTask title',
        taskDesc: 'ExampleTask description',
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
        await BackgroundService.updateNotification({ taskDesc: 'ExampleTask description' }); // Only Android, iOS will ignore this call
    }
    const stopBackgroundService = async () => {
        await BackgroundService.stop();
    }
    const appState = useAppStateContext()
    useEffect(() => {
        if (appState === 'background') {
            startBackgroundService()
            if (detectSpam(message)) {
                LocalNotification(message)
            }
        }
        if (appState === 'active') {
            stopBackgroundService()
        }


    }, [appState, message])
    // const isSpam = useMemo(()=>{detectSpam(latestMessage)},[latestMessage])

    return (
        <View>
            <Text>{appState}</Text>
            <Text></Text>
        </View>
    )
}

export default Layout