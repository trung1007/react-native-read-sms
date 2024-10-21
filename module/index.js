import { useEffect, useState } from 'react';

const KNN =  require('ml-knn')
const [KNN_JSON_MODEL_Data, set_KNN_JSON_MOEL_Data] = useState<typeof KNN>([])
const [trainDataSetArray, setTrainDataSetArray] = useState([])
const [trainDataLabelArray, setTrainDataLabelArray] = useState([])
