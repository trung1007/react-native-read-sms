import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, PermissionsAndroid, ToastAndroid, Platform } from "react-native";
import Voice from 'react-native-voice';

const VoiceRecord = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [result, setResult] = useState("");
    
    // Function to request permissions (needed on Android)
    const requestPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, 
          {
            title: "Microphone Permission",
            message: "We need access to your microphone to recognize your speech"
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          ToastAndroid.show("Microphone permission denied", ToastAndroid.SHORT);
          return false;
        }
      }
      return true;
    };
  
    // Start recording
    const startRecording = async () => {
      const permissionGranted = await requestPermission();
      if (permissionGranted) {
        setIsRecording(true);
        Voice.start('vi-VN'); // Start the voice recognition
      }
    };
  
    // Stop recording
    const stopRecording = () => {
      setIsRecording(false);
      Voice.stop(); // Stop the voice recognition
    };
  
    // Setup event listeners for speech recognition events
    useEffect(() => {
      // Setup Voice event listeners
      Voice.onSpeechStart = () => console.log("Speech recognition started");
      Voice.onSpeechEnd = () => console.log("Speech recognition ended");
      Voice.onSpeechResults = (e) => {
        console.log("Speech results:", e);
        setResult(e.value ? e.value[0] : ''); // Update state with recognized text
      };
      Voice.onSpeechError = (e) => {
        console.log("Speech error:", e);
        setResult('Error: ' + e.error);
      };
  
      // Cleanup on unmount
      return () => {
        Voice.destroy().then(Voice.removeAllListeners);
      };
    }, []);
  
    return (
      <View style={{ alignItems: 'center', margin: 20 }}>
        <Text style={{ fontSize: 20, color: 'green', fontWeight: '500' }}>
          Voice Record
        </Text>
        <Text style={{ marginTop: 20, fontSize: 16 }}>
          {result || 'Waiting for speech...'}
        </Text>
  
        <TouchableOpacity
          onPress={isRecording ? stopRecording : startRecording}
          style={{
            backgroundColor: isRecording ? 'red' : 'blue',
            padding: 10,
            marginTop: 20,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: 'white', fontWeight: '500' }}>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  export default VoiceRecord;