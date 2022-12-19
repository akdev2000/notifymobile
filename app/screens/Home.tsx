import {View, Text} from 'react-native';
import React, { useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getAsyncDataByKey } from '../utils/helpers';

export default function Home(props: any) {
  useEffect(() => {
  (async () => {
    const sessionIds  = await getAsyncDataByKey("session_ids");
    console.log("sessionIds : " , sessionIds)
    if(sessionIds) {
      let sessionIdArray : string[]= JSON.parse(sessionIds); 
      if(sessionIdArray.length > 0){
        props.navigation.navigate("Dashboard")
      }
    }
    
  })()
  }, [])
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
