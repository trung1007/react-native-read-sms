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
  const [isModelLoaded, setIsModelLoaded] = useState(false);



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
    // convertWordToVec(trainData)
    const dataRead = await readTrainData();
    const labelRead = await readTrainLabel();
    // Check if both files were read successfully before proceeding
    if (!dataRead || !labelRead) {
      console.log('Failed to read training data or labels. Aborting model creation.');
      return;
    }

    try {
      // console.log(trainDataSetArray);
      const KNN_model = new KNN(dataRead, labelRead, { k: 2 });
      await saveKNN_JSON(KNN_model);
      await readKNN_JSON()
    } catch (error) {
      console.log('Error creating KNN model:', error);
    }
  }

  const [receiveSmsPermission, setReceiveSmsPermission] = useState('');
  const [message, setMessage] = useState('')
  const [spam, setSpam] = useState('')


  // useEffect(() => {
  //   // trainKnnModel(trainData)
  //   const getModel = async () => {
  //     await readKNN_JSON();
  //     setIsModelLoaded(true); // Set model loaded state after reading the model
  //   };

  //   if (KNN_JSON_MODEL_Data.length === 0) {
  //     getModel();
  //   }
  // }, [KNN_JSON_MODEL_Data]);

  // useEffect(() => {
  //   const getModel = async () => {
  //     await readKNN_JSON()
  //   }
  //   if (KNN_JSON_MODEL_Data.length === 0) {
  //     getModel()
  //   }
  //   else {
  //     var test_mess = "quay video để làm căn cứ xét duyệt khoản vay"
  //     console.log(message)
  //     var test_dataset = convertTestToDetect(test_mess)
  //     var test_dataset1 = convertTestToDetect(message)

  //     console.log("predict message expect: " + test_mess);
  //     console.log("predict message actual: " + message);

  //     var ans_expect = KNN_JSON_MODEL_Data.predict(test_dataset)
  //     var ans_actual = KNN_JSON_MODEL_Data.predict(test_dataset1)

  //     console.log("result expect: " + ans_expect);
  //     console.log("result actual: " + ans_actual);

  //     setSpam(ans_actual)
  //   }
  // }, [KNN_JSON_MODEL_Data])

  const handleSmsPermissionAndSubcription = async () => {
    try {
      const permission = await PermissionsAndroid
        .request(PermissionsAndroid.PERMISSIONS.RECEIVE_SMS);
      setReceiveSmsPermission(permission);
    } catch (err) {
      console.log(err);
    }
    if (receiveSmsPermission === PermissionsAndroid.RESULTS.GRANTED) {
      let subscriber = DeviceEventEmitter.addListener(
        'onSMSReceived',
        message => {
          const { messageBody, senderPhoneNumber } = JSON.parse(message);
          setMessage(messageBody)
          // console.log(messageBody);
          // Alert.alert(
          //   'SMS received',
          //   `Message Body: ${messageBody} & sender number: ${senderPhoneNumber}`,
          // );
          if (isModelLoaded) {
            predictMessage(messageBody);
          }
        },
      );

      return () => {
        subscriber.remove();
      };
    }
  }

  const testModel = () => {
    // let result_expect = []
    // let result_actual = []
    // for (let i = 0; i < testData.length; i++) {
    //   var testDataTest = convertTestToDetect(testData[i].text)
    //   var ans = KNN_JSON_MODEL_Data.predict(testDataTest)
    //   result_actual.push(ans)

    // }
    // console.log(result_actual);

    const result_test_expect = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    const result_test_actual = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0]

    let spam_num_expect = 0
    let spam_num_actual = 0;
    let ham_num_expect = 0;
    let ham_num_actual = 0;
    let true_positive = 0;
    let false_positive = 0;
    let false_negative = 0;
    let true_negative = 0;
    for (let i = 0; i < result_test_expect.length; i++) {
      if (result_test_expect[i] === 1) {
        spam_num_expect++;
      }
      if (result_test_actual[i] === 1) {
        spam_num_actual++
      }
      if (result_test_expect[i] === 0) {
        ham_num_expect++;
      }
      if (result_test_actual[i] === 0) {
        ham_num_actual++
      }
    }
    for (let i = 0; i < result_test_expect.length; i++) {
      if (result_test_expect[i] === 1 && result_test_actual[i] === 1) {
        true_positive++;
      }
      if (result_test_expect[i] === 1 && result_test_actual[i] === 0) {
        false_positive++
      }
      if (result_test_expect[i] === 0 && result_test_actual[i] === 1) {
        false_negative++;
      }
      if (result_test_expect[i] === 0 && result_test_actual[i] === 0) {
        true_negative++;
      }
    }

    console.log("Number of spam expect: " + spam_num_expect);
    console.log("Number of spam actual: " + spam_num_actual);
    console.log("Number of ham expect: " + ham_num_expect);
    console.log("Number of am expect: " + ham_num_actual);
    var precision = ((true_positive) / (true_positive + true_negative))
    var recall = ((true_positive) / (true_positive + false_negative))

    console.log("Accuracy of model: " + ((true_positive + true_negative) / result_test_expect.length).toFixed(2) + "%");
    console.log("Precision of model: " + precision.toFixed(2) + "%");
    console.log("Recall of model: " + recall.toFixed(2) + "%");
    console.log("F1-score of model: " + (2 * ((precision * recall) / (precision + recall))).toFixed(2) + "%");
  }

  const predictMessage = (message: any) => {
    const test_dataset = convertTestToDetect(message);

    console.log("Predict message: " + message);
    const ans_actual = KNN_JSON_MODEL_Data.predict(test_dataset);
    console.log("Result actual: " + ans_actual);
    setSpam(ans_actual);
  };

  useEffect(() => {
    testModel()
    handleSmsPermissionAndSubcription()
    // handleDetectMessage(message)
  }, [receiveSmsPermission, isModelLoaded]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.titleText}>
          Listen to incoming SMS from React Native App
          using React Native Bridge
        </Text>
        <Text style={styles.textMessage}>
          SMS received: {message}
        </Text>
        <Text>
          Spam message: {spam}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {

  },
  titleText: {

  },
  textMessage: {
    width: 'auto',
    minWidth: 300,
    backgroundColor: 'red'
  }
})
export default App;