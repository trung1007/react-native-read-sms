import React from "react";
import type { PropsWithChildren } from "react";

//@ts-ignore                            
import Icon from 'react-native-vector-icons/FontAwesome'


type IconProps = PropsWithChildren<{
    name:string
}>

const Icons = ({name}: IconProps) =>{
   switch (name) {
    case 'circle':
        return <Icon name='circle-thin' size = {38} />
        break;
   
    default:
        break;
   }
}

export default Icons