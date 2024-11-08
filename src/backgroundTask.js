// BackgroundTask.js
import React, { useEffect, useState } from 'react';
import { AppState, Text, View } from 'react-native';

const BackgroundTask = ({ onStartTask, onStopTask }) => {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState === 'active' && nextAppState.match(/inactive|background/)) {
        // App has moved to background; start the background task
        if (onStartTask) onStartTask();
      } else if (nextAppState === 'active') {
        // App has come back to the foreground; stop the background task if needed
        if (onStopTask) onStopTask();
      }
      setAppState(nextAppState);
    };

    const appStateListener = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      // Clean up listener
      appStateListener.remove();
    };
  }, [appState, onStartTask, onStopTask]);

  return (
    <View style={{ padding: 10 }}>
      <Text>Background Task Component - Current App State: {appState}</Text>
    </View>
  );
};

export default BackgroundTask;
