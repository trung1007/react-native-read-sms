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
  const test = require('./assets/data/test.json')
  const trainData = require('./assets/data/trainData.json')
  const testData = require('./assets/data/testData.json')



  function convertWordToVec(trainData: any) {
    const trainDataText: string[] = []
    const trainDataLabel: any[] = []
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
      var process = (i * 100) / trainDataText.length
      console.log(process.toFixed(2) + '%');
      let wordPerSentence = trainDataText[i].toLowerCase().trim().split(" ");
      let arrayPerSentence: any[] = []
      for (let j = 0; j < wordPerSentence.length; j++) {
        if (wordPerSentence[j] in dictionaryW2V) {
          arrayPerSentence.push(dictionaryW2V[wordPerSentence[j]])
        }
        else {
          arrayPerSentence.push(20000)
        }
      }
      trainDataArray.push(flattenArray(arrayPerSentence))
    }
    console.log(trainDataArray);

    // const maxLength = Math.max(...trainDataArray.map(arr => arr.length))
    // const paddedTrainDataArray = trainDataArray.map(arr => {
    //   const paddedArray = [...arr]
    //   while (paddedArray.length < maxLength) {
    //     paddedArray.push(0)
    //   }
    //   return paddedArray
    // })
    // console.log(paddedTrainDataArray);

    //@ts-ignore
    // setTrainDataLabelArray(trainDataLabel)
    //@ts-ignore
    // setTrainDataSetArray(trainDataArray)

    saveTrainLabel(trainDataLabel)
    saveTrainData(trainDataArray)
    // saveTrainDataTest(paddedTrainDataArray)
    // saveTrainLabelTest(trainDataLabel)
  }

  function flattenArray(arr: any) {
    return arr.flat(Infinity); // Flatten to 1D array
  }

  // //Save train Sentence data
  // async function saveTrainDataTest(trainData: any) {
  //   const path = RNFS.DocumentDirectoryPath + '/trainDataArrayTest.json'
  //   console.log("Saved path" + path);

  //   const trainDataJson = JSON.stringify(trainData)
  //   try {
  //     await RNFS.writeFile(path, trainDataJson)
  //     console.log("Saved Data file success");
  //   } catch (error) {
  //     console.log("Error when saved file: " + error);
  //   }
  // }

  // //Read Train Sentence Data
  // async function readTrainDataTest() {
  //   const path = RNFS.DocumentDirectoryPath + '/trainDataArrayTest.json';
  //   try {
  //     // console.log("Checking if file trainDataArray exists...");
  //     const fileExists = await RNFS.exists(path);
  //     if (!fileExists) {
  //       // console.log("File does not exist at path:", path);
  //       return false; // Indicates that the file read failed
  //     }

  //     // console.log("File trainDataArray exists and start reading file...");
  //     const response = await RNFS.readFile(path);
  //     const convertResponse = JSON.parse(response);
  //     // console.log("File read successfully:" + convertResponse);
  //     return convertResponse
  //     // setTrainDataSetArray(convertResponse);
  //     // console.log(trainDataSetArray);

  //     // return true; // Indicates that the file read was successful
  //   } catch (error) {
  //     console.error('Error reading file:', error);
  //     return false; // Indicates an error occurred during the file read
  //   }
  // }

  // // Save train label data
  // async function saveTrainLabelTest(trainDataLabel: any) {
  //   const path = RNFS.DocumentDirectoryPath + '/trainLabelArrayTest.json'
  //   const trainLabelJson = JSON.stringify(trainDataLabel)
  //   try {
  //     await RNFS.writeFile(path, trainLabelJson)
  //     // console.log("Saved Label file success");

  //   } catch (error) {
  //     console.log("Error when saved file: " + error);
  //   }
  // }

  // //Read Train Label Data
  // async function readTrainLabelTest() {
  //   const path = RNFS.DocumentDirectoryPath + '/trainLabelArrayTest.json';
  //   try {
  //     console.log("Checking if file trainLabelArray exists...");
  //     const fileExists = await RNFS.exists(path);
  //     if (!fileExists) {
  //       console.log("File does not exist at path:", path);
  //       return false; // Indicates that the file read failed
  //     }
  //     console.log("File trainLabelArray exists and start reading file...");
  //     const response = await RNFS.readFile(path);
  //     const convertResponse = JSON.parse(response);
  //     console.log("File read successfully");
  //     setTrainDataLabelArray(convertResponse);
  //     return convertResponse; // Indicates that the file read was successful
  //   } catch (error) {
  //     console.log('Error when reading file:', error);
  //     return false; // Indicates an error occurred during the file read
  //   }
  // }

  // //Save KNN model
  // const saveKNN_JSONTest = async (knn_model: any) => {
  //   const path = RNFS.DocumentDirectoryPath + '/KnnModelTest.json';
  //   // console.log(knn_model);
  //   try {
  //     const KNN_JSON = JSON.stringify(knn_model, null, 2);
  //     // Attempt to write the JSON string to the file
  //     await RNFS.writeFile(path, KNN_JSON);
  //     console.log("Save model success");
  //   } catch (error) {
  //     console.log('Error when saving model:', error);
  //   }
  // };

  // //Read KNN model
  // const readKNN_JSONTest = async () => {
  //   const path = RNFS.DocumentDirectoryPath + '/KnnModelTest.json'
  //   console.log({ path });
  //   try {
  //     // console.log("Checking if file KnnModel exists...");
  //     const fileExists = await RNFS.exists(path);
  //     if (!fileExists) {
  //       // console.log("File does not exist at path:", path);
  //       return;
  //     }
  //     // Đọc nội dung của tệp JSON
  //     const KNN_JSON = await RNFS.readFile(path);
  //     const parse_KNN_MODEL = JSON.parse(KNN_JSON); // Chuyển chuỗi JSON thành đối tượng
  //     const KNN_model = KNN.load(parse_KNN_MODEL)
  //     set_KNN_JSON_MODEL_Data(KNN_model)
  //     // console.log('Đọc tệp thành công và mô hình KNN đã được khôi phục');
  //   } catch (error) {
  //     console.log('Lỗi khi đọc tệp:', error);
  //   }
  // };


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
      console.log("File read successfully:" + convertResponse);
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
      console.log(KNN_model);

      set_KNN_JSON_MODEL_Data(KNN_model)
      console.log('Đọc tệp thành công và mô hình KNN đã được khôi phục');
    } catch (error) {
      console.log('Lỗi khi đọc tệp:', error);
    }
  };

  function convertTestToDetect(message: string) {
    let word = message.toLowerCase().trim().split(' ')
    let arrayW2V = []
    for (let i = 0; i < word.length; i++) {
      if (word[i] in dictionaryW2V) {
        arrayW2V.push(dictionaryW2V[word[i]])
      }
      else {
        arrayW2V.push([20000])
      }
    }
    arrayW2V = flattenArray(arrayW2V)

    return arrayW2V
  }

  async function trainKnnModel(trainData: any) {
    convertWordToVec(trainData)
    const dataRead = await readTrainData();
    const labelRead = await readTrainLabel();
    // Check if both files were read successfully before proceeding
    if (!dataRead || !labelRead) {
      console.log('Failed to read training data or labels. Aborting model creation.');
      return;
    }
    // console.log(dataRead);
    console.log(labelRead);
    try {
      // console.log(trainDataSetArray);
      const KNN_model = new KNN(dataRead, labelRead, { k: 1 });
      await saveKNN_JSON(KNN_model);
      await readKNN_JSON()
    } catch (error) {
      console.log('Error creating KNN model:', error);
    }
  }
  useEffect(() => {
    const getModel = async () => {
      await readKNN_JSON()
    }
    if (KNN_JSON_MODEL_Data.length === 0) {
      getModel()
    }
    else{
      let testMessage= "Hãy tham gia cùng vô số cá nhân đã đạt được thành công với chương trình của chúng tôi. Hãy hành động ngay bây giờ và bắt đầu sống cuộc sống mà bạn luôn mong muốn."
      var test_dataset = convertTestToDetect(testMessage)
      console.log("predict message: " +  testMessage);
      var ans = KNN_JSON_MODEL_Data.predict(test_dataset)
      console.log(ans);
    }
  }, [KNN_JSON_MODEL_Data])

  // function handleDetectMessage(message:string){
  //   let messageTodetect = convertTestToDetect(message)
  //   console.log("message received array: ");

  //   console.log(messageTodetect);

  //   var ans = '1'

  //   setSpam(ans)
  //   return ans
  // }

  // const [receiveSmsPermission, setReceiveSmsPermission] = useState('');
  // const [message, setMessage] = useState('')
  // const [spam, setSpam] = useState('')

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
  //         setMessage(messageBody)

  //         // Alert.alert(
  //         //   'SMS received',
  //         //   `Message Body: ${messageBody} & sender number: ${senderPhoneNumber}`,
  //         // );
  //       },
  //     );

  //     return () => {
  //       subscriber.remove();
  //     };
  //   }
  // }

  // useEffect(() => {
  //   handleSmsPermissionAndSubcription()
  //   // handleDetectMessage(message)
  // }, [receiveSmsPermission]);



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.titleText}>
          Listen to incoming SMS from React Native App
          using React Native Bridge
        </Text>
        {/* <Text>
          SMS received: {message}
        </Text>
        <Text>
          Spam message: {spam}
        </Text> */}
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