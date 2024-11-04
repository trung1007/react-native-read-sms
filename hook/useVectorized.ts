import {useMemo, useState} from 'react';

interface useVectorizedResult {
  vectorizedDocument: [];
}

const useVectorized = (document: string | null): useVectorizedResult => {
  const dictionary = require('../assets/dictionary/document_vectors.json');
  const vectorizedDocument = useMemo(() => {
    if (typeof document !== 'string') return [];

    const wordPerSentence = document.toLowerCase().trim().split(' ');

    // Vectorize each word based on the dictionary
    const documentArray = wordPerSentence.map(word =>
      word in dictionary ? dictionary[word] : Array(100).fill(0)
    );

    // Compute the mean vector
    // @ts-ignore
    const documentArrayMean = documentArray[0].map((_, colIndex) => {
      const sum = documentArray.reduce((acc, row) => acc + row[colIndex], 0);
      return sum / documentArray.length;
    });

    return documentArrayMean;
  }, [document, dictionary]); // Recalculate only if document changes

  return { vectorizedDocument };
};

export default useVectorized;