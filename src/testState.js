import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useAppStateContext } from '../context/AppStateContext';

const TestState = () => {
  const state = useAppStateContext(); // Get the app state from the context

  useEffect(() => {
    console.log(state); // Log the state whenever it changes
  }, [state]); // Only re-run this effect when `state` changes

  return (
    <View>
      <Text>Current App State: {state}</Text>
    </View>
  );
};

export default TestState;