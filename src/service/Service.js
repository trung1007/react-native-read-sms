import { TouchableOpacity, View, Text, AppState } from "react-native"
import { useEffect } from "react";
import BackgroundService from 'react-native-background-actions';
import { AppStateProvider, useAppStateContext } from "../../context/AppStateContext";



const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));
const veryIntensiveTask = async (taskDataArguments) => {
    // Example of an infinite loop task
    const { delay } = taskDataArguments;
    await new Promise(async (resolve) => {
        for (let i = 0; BackgroundService.isRunning(); i++) {
            console.log(i);

            await BackgroundService.updateNotification({
                taskDesc: 'My counter is running' + i
            });
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
        delay: 5000,
    },
};

const startBackgroundService = async () => {
    await BackgroundService.start(veryIntensiveTask, options);
    await BackgroundService.updateNotification({ taskDesc: 'My counter is running' }); // Only Android, iOS will ignore this call
}

const stopBackgroundService = async () => {
    await BackgroundService.stop();
}

const MyService = () => {
    const state = useAppStateContext()
    useEffect(() => {
        console.log(state);
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