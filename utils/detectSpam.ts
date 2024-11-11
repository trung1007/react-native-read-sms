import {SpamLabel} from '../common/type';
import useVectorized from '../hook/useVectorized';
// @ts-ignore
import KNN from 'ml-knn';
import KNN_saved from '../assets/model/savedKnnModel.json';
const KNN_used = KNN.load(KNN_saved);
export const detectSpam = async (message: string): Promise<SpamLabel> => {
  let isSpam = false;
  try {
    const {vectorizedDocument} = useVectorized(message);
    // console.log(vectorizedDocument);
    
    // Wrap the prediction in a Promise to handle it asynchronously
    const prediction = await new Promise<boolean>(resolve => {
      const result = KNN_used.predict(vectorizedDocument);
      isSpam = result
      
      resolve(result === 1 || (Array.isArray(result) && result[0] === 1));
    });
    isSpam = prediction
    
  } catch (error) {
    console.error('Error in detecting spam:', error);
    isSpam = false; // Default to not spam if an error occurs
  }
  // console.log(isSpam);
  return {spam: isSpam};
};
