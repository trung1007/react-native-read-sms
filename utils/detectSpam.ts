import {SpamLabel} from '../common/type';
import useVectorized from '../hook/useVectorized';
export const detectSpam = (message: string): SpamLabel => {
  let isSpam = false;
  const KNN = require('ml-knn');
  const KNN_saved = require('../assets/model/savedKnnModel.json');
  const KNN_used = KNN.load(KNN_saved);
  const {vectorizedDocument} = useVectorized(message);
  const prediction = KNN_used.predict(vectorizedDocument);
  if (prediction) {
    isSpam = true;
  } else {
    isSpam = false;
  }
  console.log(isSpam);
  
  return {spam: isSpam};
};
