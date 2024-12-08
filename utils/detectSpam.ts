import {SpamLabel} from '../common/type';
import useVectorized from '../hook/useVectorized';
// @ts-ignore
import KNN from 'ml-knn';
import KNN_saved from '../assets/model/savedKnnModelK5.json';
const KNN_used = KNN.load(KNN_saved);
export const detectSpam = async (message: string): Promise<SpamLabel> => {
  let isSpam = false;
  try {
    // Vectorize the input message
    const {vectorizedDocument} = useVectorized(message);

    if (!vectorizedDocument) {
      throw new Error('Vectorized document is undefined or invalid');
    }
    // Predict spam using KNN model
    const result = KNN_used.predict(vectorizedDocument)

    // Determine if it's spam
    if (result === 1 || (Array.isArray(result) && result[0] === 1)) {
      isSpam = true;
    }
  } catch (error) {
    console.error('Error in detecting spam:', error);
    isSpam = false; // Default to not spam if an error occurs
  }
  // console.log(isSpam);
  return {spam: isSpam};
};
