import { TouchableOpacity, View, Text, AppState } from "react-native"
import { useEffect } from "react";
import BackgroundService from 'react-native-background-actions';
import { AppStateProvider, useAppStateContext } from "../../context/AppStateContext";
import usePermission from "../../hook/usePermision";
import { useMessageContext } from "../../context/MessageContext";
import SmsAndroid from 'react-native-get-sms-android';
import LocalNotification from "../../LocalNotification";
import { fetchSMSMessages } from "../../hook/useSMS";
import { detectSpam } from "../../utils/detectSpam";

const MyService = () => {
    const state = useAppStateContext()
    const message = useMessageContext()


    const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));
    const veryIntensiveTask = async (taskDataArguments) => {
        // Example of an infinite loop task
        const { delay } = taskDataArguments;
        await new Promise(async (resolve) => {
            for (let i = 0; BackgroundService.isRunning(); i++) {
                try {
                    const messages = await fetchSMSMessages({ read: 0, maxCount: 1 });
                    messages.forEach((message) => {
                        const isSpam = detectSpam(message.body)
                        if(isSpam){
                            LocalNotification
                        }
                    });
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
        taskDesc: message || 'ExampleTask description',
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
        await BackgroundService.updateNotification({ taskDesc: message || 'ExampleTask description' }); // Only Android, iOS will ignore this call
    }

    const stopBackgroundService = async () => {
        await BackgroundService.stop();
    }
    useEffect(() => {
        if (state === 'background') {
            startBackgroundService()
        }
        if (state === 'active') {
            stopBackgroundService()
        }
    }, [state])
    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity style={{
                width: '80%',
                height: 50,
                marginTop: 100,
                borderRadius: 20,
                backgroundColor: 'green',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center'
            }}
            >
                <Text style={{ color: '#ffff' }}>Start Background Service</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
                width: '80%',
                height: 50,
                marginTop: 20,
                borderRadius: 20,
                backgroundColor: 'red',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center'
            }}
            >
                <Text style={{ color: '#ffff' }}>End Foreground Service</Text>
            </TouchableOpacity>
        </View>
    )


}


export default MyService