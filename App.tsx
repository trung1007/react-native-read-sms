import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  NativeModules,
  PermissionsAndroid,
  Alert,
  DeviceEventEmitter,
  StyleSheet,
} from 'react-native';
import RNFS from 'react-native-fs'

const App = () => {

  const KNN = require('ml-knn')
  const [KNN_JSON_MODEL_Data, set_KNN_JSON_MOEL_Data] = useState<typeof KNN>([])
  const [trainDataSetArray, setTrainDataSetArray] = useState([])
  const [trainDataLabelArray, setTrainDataLabelArray] = useState([])

  const dictionaryW2V = require('./assets/data/dataset_new_vector_wav2vec.json')
  const trainData = require('./assets/data/trainData.json')
  const testData = require('./assets/data/testData.json')

  function convertWordToVec(trainData:any){
    const trainDataText:string[] =[]
    const trainDataLabel:number[] = []
    trainData.map((item:any)=>{
      trainDataText.push(item.text)
      if(item.spam){
        trainDataLabel.push(1)
      }else{
        trainDataLabel.push(0)
      }
    })
    console.log(trainDataLabel.length);
    saveTrainLabel(trainDataLabel)
  }

  async function saveTrainLabel(trainDataLabel:any){
    const path = RNFS.DocumentDirectoryPath + 'trainLabelArray.json'
    console.log({path})
    const trainLabelJson = JSON.stringify(trainDataLabel, null, 2)
    try {
      await RNFS.writeFile(path, trainLabelJson, "utf8")
      console.log("Saved file success");
      
    } catch (error) {
        console.log("Error when saved file: " + error);
        
    }
  }

  useEffect(()=>{
    convertWordToVec(trainData)
    
  })

  // const [receiveSmsPermission, setReceiveSmsPermission] = useState('');

  // const handleSmsPermissionAndSubcription = async () => {
  //   try {
  //     const permission = await PermissionsAndroid
  //       .request(PermissionsAndroid.PERMISSIONS.RECEIVE_SMS);
  //     setReceiveSmsPermission(permission);
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   if (receiveSmsPermission === PermissionsAndroid.RESULTS.GRANTED) {
  //     let subscriber = DeviceEventEmitter.addListener(
  //       'onSMSReceived',
  //       message => {
  //         const { messageBody, senderPhoneNumber } = JSON.parse(message);
  //         Alert.alert(
  //           'SMS received',
  //           `Message Body: ${messageBody} & sender number: ${senderPhoneNumber}`,
  //         );
  //       },
  //     );

  //     return () => {
  //       subscriber.remove();
  //     };
  //   }
  // }

  // useEffect(() => {
  //   handleSmsPermissionAndSubcription()
  // }, [receiveSmsPermission]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.titleText}>
          Listen to incoming SMS from React Native App
          using React Native Bridge
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {

  },
  titleText: {

  }
})
export default App;