import BackgroundService from 'react-native-background-actions';
import { fetchSMSMessages } from "../../hook/useSMS";
import { useMemo } from 'react';
import { detectSpam } from '../../utils/detectSpam';




const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));
let latestMessage = null;
export const updateLatestMessage = (message) => {
    latestMessage = message; 
    console.log('Updated latest message:', latestMessage);
    if(latestMessage !== undefined){
        return latestMessage
    }
};
const veryIntensiveTask = async (taskDataArguments) => {
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
                    updateLatestMessage(messages[0].body);
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

export const startBackgroundService = async () => {
    await BackgroundService.start(veryIntensiveTask, options);
    await BackgroundService.updateNotification({ taskDesc: 'ExampleTask description' }); // Only Android, iOS will ignore this call
}
export const stopBackgroundService = async () => {
    await BackgroundService.stop();
}


