
import React from 'react';
import { View } from 'react-native';
import { Divider,Text } from '@ui-kitten/components';
export default function Header({text}){
    return (
        <View style={{ padding: 20, backgroundColor:"#e32f45"}}><Text style={{ textAlign: 'center', fontWeight: "700", fontSize: 30,color:"white" }}>{text}</Text></View>
    )
}