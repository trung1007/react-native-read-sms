import {Dimensions} from 'react-native'

export const device_width = Dimensions.get('window').width
export const device_height = Dimensions.get('window').height

export const ratioW = (elementWidth) => {
  return (elementWidth * device_width) / 412;
}
export const ratioH = (elementWidth) => {
  return (elementWidth * device_height) / 915;
}

