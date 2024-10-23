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



  function convertWordToVec(trainData: any) {
    const trainDataText: string[] = []
    const trainDataLabel: number[] = []
    trainData.map((item: any) => {
      trainDataText.push(item.text)
      if (item.spam) {
        trainDataLabel.push(1)
      } else {
        trainDataLabel.push(0)
      }
    })

    const trainDataArray = []
    for (let i = 0; i < trainDataText.length; i++) {
      var trainProcess = (i + 1) * 100 / trainDataText.length
      // console.log(trainProcess.toFixed(2) + "%");
      let wordPerSentence = trainDataText[i].toLowerCase().trim().split(" ");
      let arrayPerSentence: any[] = []
      for (let j = 0; j < wordPerSentence.length; j++) {
        if (wordPerSentence[j] in dictionaryW2V) {
          arrayPerSentence.push(dictionaryW2V[wordPerSentence[j]])
        }
        else {
          arrayPerSentence.push(20000000000000)
        }
        flattenArray(arrayPerSentence)
      }
      trainDataArray.push(arrayPerSentence)
    }
    saveTrainLabel(trainDataLabel)
    saveTrainData(trainDataArray)
  }

  function flattenArray(arr: any) {
    return arr.flat(Infinity); // Flatten to 1D array
  }

  //Save train Sentence data
  async function saveTrainData(trainData: any) {
    const path = RNFS.DocumentDirectoryPath + '/trainDataArray.json'
    console.log("Saved path" + path);

    const trainDataJson = JSON.stringify(trainData)
    try {
      await RNFS.writeFile(path, trainDataJson)
      console.log("Saved Data file success");
    } catch (error) {
      console.log("Error when saved file: " + error);
    }
  }

  //Read Train Sentence Data
  async function readTrainData() {
    const path = RNFS.DocumentDirectoryPath + '/trainDataArray.json';
    console.log("Read path: " + path);
    try {
      console.log("Checking if file exists...");
      const fileExists = await RNFS.exists(path);
      if (!fileExists) {
        console.log("File does not exist at path:", path);
        return;
      }
      console.log("Reading file...");
      const response = await RNFS.readFile(path);
      const convertResponse = JSON.parse(response);
      // console.log("File read successfully:", convertResponse);
      setTrainDataSetArray(convertResponse)
      console.log(trainDataSetArray);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  }

  // Save train label data
  async function saveTrainLabel(trainDataLabel: any) {
    const path = RNFS.DocumentDirectoryPath + '/trainLabelArray.json'
    const trainLabelJson = JSON.stringify(trainDataLabel)
    try {
      await RNFS.writeFile(path, trainLabelJson)
      console.log("Saved Label file success");

    } catch (error) {
      console.log("Error when saved file: " + error);

    }
  }

  //Read Train Label Data
  async function readTrainLabel() {
    const path = RNFS.DocumentDirectoryPath + '/trainLabelArray.json'
    try {
      const response = await RNFS.readFile(path)
      const convertResponse = JSON.parse(response)
      setTrainDataLabelArray(convertResponse)
    } catch (error) {
      console.log("Error when read file: " + error);
    }
  }



  async function trainKnnModel(trainData: any) {
    convertWordToVec(trainData)
    readTrainData()
    readTrainLabel()
  }

  async function testSaveData(params: any) {
    const path = RNFS.DocumentDirectoryPath + '/test.json'
    const test_data = JSON.stringify(params)
    console.log(test_data);

    try {
      await RNFS.writeFile(path, test_data)
      console.log("Save test data success");
    } catch (error) {
      console.log("Error when saved file: " + error);
    }
  }
  async function readSaveData() {
    const path = RNFS.DocumentDirectoryPath + '/test.json';
    try {
      console.log("Checking if file exists...");
      const fileExists = await RNFS.exists(path);
      if (!fileExists) {
        console.log("File does not exist at path:", path);
        return;
      }
      console.log("Reading file...");
      const response = await RNFS.readFile(path);
      console.log("File read successfully:", response);
    } catch (error) {
      console.log("Error when reading file: " + error);
    }
  }

  useEffect(() => {
    // convertWordToVec(trainData)
    readTrainData()
    // readSaveData()
    // const processAsyncData = async () => {
    //   // Perform your asynchronous actions here
    //   await readTrainData();
    //   await readTrainLabel();
    // };
    // // Call the async function
    // processAsyncData();

    // console.log(trainDataSetArray);


  }, [])

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