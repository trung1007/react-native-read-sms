import PushNotification from 'react-native-push-notification'

const LocalNotification = (spamMessage, type) => {
    let title = ''
    if(type === 'phone'){
        title = 'Cảnh báo cuộc gọi lừa đảo'
    }
    if(type === 'sms'){
        title = 'Cảnh báo tin nhắn lừa đảo'
    }
    const key = Date.now().toString(); // Key must be unique everytime
    PushNotification.createChannel(
        {
            channelId: key, // (required)
            channelName: "Local messasge", // (required)
            channelDescription: "Notification for Local message", // (optional) default: undefined.
            importance: 4,
            vibrate: true,
        },
        (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
    PushNotification.localNotification({
        channelId: key, //this must be same with channelid in createchannel
        title: title,
        message: (spamMessage ?? 'Local message' + key),
        priority: "max",
        smallIcon: 'ic_warning',
        largeIcon: 'ic_warning'
    })
};

export default LocalNotification