import {View, Text} from 'react-native';
import React, { useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Home(props: any) {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Connet Now !!</Text>
      <Icon.Button
        name="qr-code-scanner"
        color={'black'}
        iconStyle={{fontSize: 90}}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          console.log("Pressed")
          props.navigation.navigate('Scan');
        }}
        backgroundColor="#ffffff"></Icon.Button>
    </View>
  );
}
