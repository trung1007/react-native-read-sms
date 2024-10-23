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
  const [KNN_JSON_MODEL_Data, set_KNN_JSON_MODEL_Data] = useState<typeof KNN>([])
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
    try {
      console.log("Checking if file trainDataArray exists...");
      const fileExists = await RNFS.exists(path);
      if (!fileExists) {
        console.log("File does not exist at path:", path);
        return false; // Indicates that the file read failed
      }

      console.log("File trainDataArray exists and start reading file...");
      const response = await RNFS.readFile(path);
      const convertResponse = JSON.parse(response);
      // console.log("File read successfully:" + convertResponse);
      return convertResponse
      // setTrainDataSetArray(convertResponse);
      // console.log(trainDataSetArray);

      // return true; // Indicates that the file read was successful
    } catch (error) {
      console.error('Error reading file:', error);
      return false; // Indicates an error occurred during the file read
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
    const path = RNFS.DocumentDirectoryPath + '/trainLabelArray.json';
    try {
      console.log("Checking if file trainLabelArray exists...");
      const fileExists = await RNFS.exists(path);
      if (!fileExists) {
        console.log("File does not exist at path:", path);
        return false; // Indicates that the file read failed
      }
      console.log("File trainLabelArray exists and start reading file...");
      const response = await RNFS.readFile(path);
      const convertResponse = JSON.parse(response);
      console.log("File read successfully");
      setTrainDataLabelArray(convertResponse);
      return convertResponse; // Indicates that the file read was successful
    } catch (error) {
      console.log('Error when reading file:', error);
      return false; // Indicates an error occurred during the file read
    }
  }

  //Save KNN model
  const saveKNN_JSON = async (knn_model: any) => {
    const path = RNFS.DocumentDirectoryPath + '/KnnModel.json';
    // console.log(knn_model);
    try {
      const KNN_JSON = JSON.stringify(knn_model, null, 2);
      // Attempt to write the JSON string to the file
      await RNFS.writeFile(path, KNN_JSON);
      console.log("Save model success");
    } catch (error) {
      console.log('Error when saving model:', error);
    }
  };

  //Read KNN model
  const readKNN_JSON = async () => {
    const path = RNFS.DocumentDirectoryPath + '/KnnModel.json'
    console.log({ path });
    try {
      console.log("Checking if file KnnModel exists...");
      const fileExists = await RNFS.exists(path);
      if (!fileExists) {
        console.log("File does not exist at path:", path);
        return;
      }
      // Đọc nội dung của tệp JSON
      const KNN_JSON = await RNFS.readFile(path);
      const parse_KNN_MODEL = JSON.parse(KNN_JSON); // Chuyển chuỗi JSON thành đối tượng
      const KNN_model = KNN.load(parse_KNN_MODEL)
      set_KNN_JSON_MODEL_Data(KNN_model)
      console.log('Đọc tệp thành công và mô hình KNN đã được khôi phục');
    } catch (error) {
      console.log('Lỗi khi đọc tệp:', error);
    }
  };

  async function trainKnnModel(trainData: any) {
    // convertWordToVec(trainData)
    // const dataRead = await readTrainData();
    // const labelRead = await readTrainLabel();
    // // console.log(dataRead);
    // // Check if both files were read successfully before proceeding
    // if (!dataRead || !labelRead) {
    //   console.log('Failed to read training data or labels. Aborting model creation.');
    //   return;
    // }

    var train_dataset = [
      flattenArray([[0, 0, 0], [0, 1, 0]]),
      flattenArray([[0, 1, 1], [1, 1, 0]]),
      flattenArray([[1, 1, 0], [1, 0, 1]]),
      flattenArray([[2, 2, 2], [1, 2, 0]]),
      flattenArray([[1, 2, 2], [1, 2, 1]]),
      flattenArray([[2, 1, 2], [2, 2, 2]])
    ];

    var train_labels = [0, 0, 0, 1, 1, 1];

    try {
      // console.log(trainDataSetArray);
      const KNN_model = new KNN(train_dataset, train_labels, { k: 2 });
      await saveKNN_JSON(KNN_model);
      await readKNN_JSON()
    } catch (error) {
      console.log('Error creating KNN model:', error);
    }
  }

  useEffect(() => {
    // convertWordToVec(trainData)
    // readTrainData()
    // readSaveData()
    // const processAsyncData = async () => {
    //   // Perform your asynchronous actions here
    //   await readTrainData();
    //   await readTrainLabel();
    // };
    // // Call the async function
    // processAsyncData();

    // console.log(trainDataSetArray);

    const getModel = async (trainData: any) => {
      await trainKnnModel(trainData); // Wait for the training to complete
      console.log("Training completed.");
    };

    // Create an async function inside useEffect to use `await`
    const fetchModel = async () => {
      await getModel(trainData);
    };


    fetchModel(); // Call the async function

  }, [])
  useEffect(() => {
    if (KNN_JSON_MODEL_Data.length !== 0) {
      console.log("KNN_JSON_MODEL_Data has been set with the model:", KNN_JSON_MODEL_Data);
      // Perform any further logic that depends on the model being set here
      var test_dataset = [
        flattenArray([[0.9, 0.9, 0.9], [1, 1, 1]]),
        flattenArray([[1.1, 1.1, 1.1], [1.3, 1.3, 1.3]]),
        flattenArray([[1.1, 1.1, 1.2], [1.3, 1.3, 1.2]]),
        flattenArray([[1.2, 1.2, 1.2], [1.4, 1.4, 1.4]])
      ];
      var ans = KNN_JSON_MODEL_Data.predict(test_dataset)
      console.log(ans);
      
    }
  }, [KNN_JSON_MODEL_Data])

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