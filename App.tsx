import React, { useRef } from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet } from 'react-native';
import NotificationPopup from 'react-native-push-notification-popup';

const App = () => {
  const popupRef = useRef(null);

  const showNotification = () => {
    if (popupRef.current) {
      // @ts-ignore
      popupRef.current.show({
        appTitle: 'My App',
        timeText: 'Now',
        title: 'New Message',
        body: 'You have a new notification!',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Button title="Show Notification" onPress={showNotification} />
        <NotificationPopup
          ref={popupRef}
          renderPopupContent={({ appIconSource, appTitle, timeText, title, body }) => (
            <View style={styles.popupContainer}>
              <Text style={styles.popupTitle}>{title}</Text>
              <Text style={styles.popupBody}>{body}</Text>
            </View>
          )}
          shouldChildHandleResponderStart={true}
          shouldChildHandleResponderMove={true}
          isSkipStatusBarPadding={true}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  popupContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  popupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  popupBody: {
    fontSize: 14,
  },
});

export default App;
