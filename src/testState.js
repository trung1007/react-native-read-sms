import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useAppStateContext } from '../context/AppStateContext';
import { useMessageContext } from '../context/MessageContext';

const TestState = () => {
  const state = useAppStateContext(); // Get the app state from the context
  const message = useMessageContext()

  useEffect(() => {
    console.log(state);
    console.log(message);

  }, [state, message]); 

  return (
    <View>
      <Text>Current App State: {state}</Text>
      <Text>
        {message}
      </Text>
    </View>
  );
};

export default TestState;